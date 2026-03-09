import { cache } from "react";

import { calculateHabitPoints } from "@/lib/domain";
import { getViewerContext } from "@/lib/league";
import { createClient } from "@/lib/supabase/server";

type CategoryRow = {
  id: string;
  user_week_plan_id: string;
  name: string;
  color: string;
  sort_order: number;
};

type HabitRow = {
  id: string;
  category_id: string;
  user_id: string;
  name: string;
  metric_type: "count" | "duration_minutes" | "binary" | "steps" | "sleep_hours";
  target_value: number;
  point_value: number;
  sort_order: number;
};

type LogRow = {
  id: string;
  plan_habit_id: string;
  user_id: string;
  log_date: string;
  progress_value: number;
};

function getTodayLabel() {
  return new Date().toISOString().slice(0, 10);
}

export const getLeagueDashboardData = cache(async () => {
  const viewer = await getViewerContext();
  const activeLeague = viewer.memberships[0];

  if (!viewer.user || !activeLeague || viewer.isDevBypass) {
    return {
      ...viewer,
      activeLeague,
      weekId: null,
      today: getTodayLabel(),
      summaryCards: [],
      habits: [],
      categories: [],
      leaderboard: [],
      insightCards: [],
    };
  }

  const supabase = await createClient();
  const { data: weekId, error: weekError } = await supabase.rpc("ensure_current_league_week", {
    target_league_id: activeLeague.leagueId,
  });

  if (weekError || !weekId) {
    return {
      ...viewer,
      activeLeague,
      weekId: null,
      today: getTodayLabel(),
      summaryCards: [],
      habits: [],
      categories: [],
      leaderboard: [],
      insightCards: [],
    };
  }

  const today = getTodayLabel();

  const [{ data: plans }, { data: members }, { data: week }] = await Promise.all([
    supabase
      .from("user_week_plans")
      .select("id, user_id, point_budget, points_allocated")
      .eq("league_week_id", weekId),
    supabase.from("league_members").select("user_id, role").eq("league_id", activeLeague.leagueId),
    supabase.from("league_weeks").select("start_date, end_date").eq("id", weekId).single(),
  ]);

  const userIds = (members ?? []).map((member) => member.user_id);
  const planIds = (plans ?? []).map((plan) => plan.id);

  const categoryIdsForPlans = planIds.length
    ? (
        await supabase
          .from("plan_categories")
          .select("id, user_week_plan_id, name, color, sort_order")
          .in("user_week_plan_id", planIds)
          .order("sort_order", { ascending: true })
      ).data ?? []
    : [];

  const categoryIds = categoryIdsForPlans.map((category) => category.id);

  const [{ data: profiles }, { data: habits }, { data: logs }, { data: scores }] = await Promise.all([
    userIds.length
      ? supabase.from("profiles").select("id, display_name").in("id", userIds)
      : Promise.resolve({ data: [] }),
    categoryIds.length
      ? supabase
          .from("plan_habits")
          .select("id, category_id, user_id, name, metric_type, target_value, point_value, sort_order")
          .in("category_id", categoryIds)
          .order("sort_order", { ascending: true })
      : Promise.resolve({ data: [] }),
    planIds.length && week?.start_date && week?.end_date
      ? supabase
          .from("habit_logs")
          .select("id, plan_habit_id, user_id, log_date, progress_value")
          .gte("log_date", week.start_date)
          .lte("log_date", week.end_date)
      : Promise.resolve({ data: [] }),
    supabase
      .from("weekly_scores")
      .select("user_id, total_points, rank")
      .eq("league_week_id", weekId)
      .order("rank", { ascending: true }),
  ]);

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile.display_name]));
  const categoriesByPlan = new Map<string, CategoryRow[]>();

  categoryIdsForPlans.forEach((category) => {
    const existing = categoriesByPlan.get(category.user_week_plan_id) ?? [];
    existing.push(category);
    categoriesByPlan.set(category.user_week_plan_id, existing);
  });

  const habitsByCategory = new Map<string, HabitRow[]>();
  (habits ?? []).forEach((habit) => {
    const existing = habitsByCategory.get(habit.category_id) ?? [];
    existing.push(habit);
    habitsByCategory.set(habit.category_id, existing);
  });

  const logsByHabit = new Map<string, LogRow[]>();
  (logs ?? []).forEach((log) => {
    const existing = logsByHabit.get(log.plan_habit_id) ?? [];
    existing.push(log);
    logsByHabit.set(log.plan_habit_id, existing);
  });

  const totalsByUser = new Map((scores ?? []).map((score) => [score.user_id, score.total_points]));
  const rankByUser = new Map((scores ?? []).map((score) => [score.user_id, score.rank]));
  const viewerPlan = (plans ?? []).find((plan) => plan.user_id === viewer.user.id);
  const viewerCategories = viewerPlan ? categoriesByPlan.get(viewerPlan.id) ?? [] : [];

  const leaderboard = (members ?? [])
    .map((member) => {
      const points = totalsByUser.get(member.user_id) ?? 0;
      const plan = (plans ?? []).find((item) => item.user_id === member.user_id);
      const memberCategories = plan ? categoriesByPlan.get(plan.id) ?? [] : [];
      const habitCount = memberCategories.reduce(
        (sum, category) => sum + (habitsByCategory.get(category.id) ?? []).length,
        0,
      );

      return {
        userId: member.user_id,
        name: profileMap.get(member.user_id) ?? "League player",
        points,
        habitCount,
        rank: rankByUser.get(member.user_id) ?? null,
      };
    })
    .sort((a, b) => {
      if (a.rank !== null && b.rank !== null) {
        return a.rank - b.rank;
      }

      return b.points - a.points || a.name.localeCompare(b.name);
    })
    .map((member, index) => ({
      ...member,
      rank: member.rank ?? index + 1,
      note:
        member.habitCount > 0
          ? `${member.habitCount} habits in play this week`
          : "No habits planned yet",
    }));

  const viewerRank = leaderboard.find((member) => member.userId === viewer.user.id)?.rank ?? null;
  const viewerHabits = viewerCategories.flatMap((category) => {
    const categoryHabits = habitsByCategory.get(category.id) ?? [];

    return categoryHabits.map((habit) => {
      const habitLogs = logsByHabit.get(habit.id) ?? [];
      const weeklyProgress = habitLogs.reduce((sum, log) => sum + Number(log.progress_value), 0);
      const todayLog = habitLogs.find((log) => log.log_date === today);
      const earnedPoints = calculateHabitPoints(
        Number(habit.target_value),
        weeklyProgress,
        habit.point_value,
      );

      return {
        id: habit.id,
        categoryId: category.id,
        categoryName: category.name,
        color: category.color,
        name: habit.name,
        metricType: habit.metric_type,
        targetValue: Number(habit.target_value),
        pointValue: habit.point_value,
        weeklyProgress,
        todayValue: todayLog ? Number(todayLog.progress_value) : 0,
        progressPercent: Math.min((weeklyProgress / Number(habit.target_value)) * 100, 100),
        earnedPoints,
      };
    });
  });

  const viewerTotal = totalsByUser.get(viewer.user.id) ?? 0;
  const nextPlayer = leaderboard.find(
    (member) => member.points > viewerTotal && member.userId !== viewer.user.id,
  );
  const trailingPlayer = leaderboard.find(
    (member) => member.points < viewerTotal && member.userId !== viewer.user.id,
  );

  const categorySummaries = viewerCategories.map((category) => {
    const categoryHabits = habitsByCategory.get(category.id) ?? [];
    return {
      id: category.id,
      name: category.name,
      color: category.color,
      habitCount: categoryHabits.length,
      points: categoryHabits.reduce((sum, habit) => sum + habit.point_value, 0),
    };
  });

  return {
    ...viewer,
    activeLeague,
    weekId,
    week,
    today,
    viewerTotal,
    viewerRank,
    summaryCards: [
      {
        label: "Current rank",
        value: viewerRank ? `#${viewerRank}` : "-",
        note: nextPlayer
          ? `${nextPlayer.points - viewerTotal} points behind ${nextPlayer.name}`
          : "You are currently leading",
      },
      {
        label: "Weekly total",
        value: `${viewerTotal}`,
        note: `Out of ${activeLeague.weeklyPointBudget} possible points`,
      },
      {
        label: "League members",
        value: `${leaderboard.length}`,
        note: `${leaderboard.filter((member) => member.points > 0).length} members have scored so far`,
      },
    ],
    habits: viewerHabits,
    categories: categorySummaries,
    leaderboard,
    insightCards: [
      {
        label: "Biggest swing",
        text: viewerHabits.length
          ? `${viewerHabits
              .slice()
              .sort((a, b) => b.pointValue - a.pointValue)[0].name} is worth up to ${viewerHabits
              .slice()
              .sort((a, b) => b.pointValue - a.pointValue)[0].pointValue} points.`
          : "Add habits to start generating point swings.",
      },
      {
        label: "Safe win",
        text: viewerHabits.find((habit) => habit.progressPercent >= 70 && habit.progressPercent < 100)
          ? `${viewerHabits.find((habit) => habit.progressPercent >= 70 && habit.progressPercent < 100)?.name} is close to full credit.`
          : "No habits are close to completion yet.",
      },
      {
        label: "League pressure",
        text: trailingPlayer
          ? `${trailingPlayer.name} is ${viewerTotal - trailingPlayer.points} points behind you.`
          : "You have no one behind you yet. Invite a friend to increase the pressure.",
      },
    ],
  };
});

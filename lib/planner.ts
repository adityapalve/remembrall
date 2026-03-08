import { cache } from "react";

import { appBoard, setupDraft } from "@/lib/mock-data";
import { getViewerContext } from "@/lib/league";
import { createClient } from "@/lib/supabase/server";

export const categoryPalette = ["#ffd8bf", "#c8ece5", "#f8e5b8", "#f4c6d7", "#d8d4ff"];

export const getPlannerState = cache(async () => {
  const viewer = await getViewerContext();
  const activeLeague = viewer.memberships[0];

  if (!viewer.user || !activeLeague || viewer.isDevBypass) {
    return {
      ...viewer,
      activeLeague,
      planId: null,
      totalPoints: appBoard.pointsUsed,
      categories: setupDraft.map((category, index) => ({
        id: `demo-category-${index}`,
        name: category.name,
        color: category.accent,
        habits: category.habits.map((habit, habitIndex) => ({
          id: `demo-habit-${index}-${habitIndex}`,
          name: habit.name,
          metricType: "count",
          targetValue: Number.parseInt(habit.target, 10) || 1,
          pointValue: habit.points,
        })),
      })),
    };
  }

  const supabase = await createClient();
  const { data: planId, error: planError } = await supabase.rpc("ensure_user_week_plan", {
    target_league_id: activeLeague.leagueId,
  });

  if (planError || !planId) {
    return {
      ...viewer,
      activeLeague,
      planId: null,
      totalPoints: 0,
      categories: [] as Array<{
        id: string;
        name: string;
        color: string;
        habits: Array<{
          id: string;
          name: string;
          metricType: string;
          targetValue: number;
          pointValue: number;
        }>;
      }>,
    };
  }

  const { data: categories } = await supabase
    .from("plan_categories")
    .select("id, name, color, sort_order")
    .eq("user_week_plan_id", planId)
    .order("sort_order", { ascending: true });

  const categoryIds = (categories ?? []).map((category) => category.id);

  const { data: habits } = categoryIds.length
    ? await supabase
        .from("plan_habits")
        .select("id, name, metric_type, target_value, point_value, sort_order, category_id")
        .in("category_id", categoryIds)
        .order("sort_order", { ascending: true })
    : { data: [] };

  const { data: plan } = await supabase
    .from("user_week_plans")
    .select("points_allocated")
    .eq("id", planId)
    .single();

  return {
    ...viewer,
    activeLeague,
    planId,
    totalPoints: plan?.points_allocated ?? 0,
    categories:
      categories?.map((category) => ({
        id: category.id,
        name: category.name,
        color: category.color,
        habits: (habits ?? [])
          .filter((habit) => habit.category_id === category.id)
          .map((habit) => ({
          id: habit.id,
          name: habit.name,
          metricType: habit.metric_type,
          targetValue: Number(habit.target_value),
          pointValue: habit.point_value,
          })),
      })) ?? [],
  };
});

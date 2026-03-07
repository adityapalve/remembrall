export type GoalMetric = "count" | "duration" | "binary";

export type UserProfile = {
  id: string;
  displayName: string;
  avatarUrl?: string;
  timezone: string;
};

export type League = {
  id: string;
  name: string;
  ownerId: string;
  inviteCode: string;
  weeklyPointBudget: number;
};

export type LeagueMember = {
  id: string;
  leagueId: string;
  userId: string;
  role: "owner" | "member";
};

export type HabitCategory = {
  id: string;
  leagueId: string;
  userId: string;
  weekStart: string;
  name: string;
  accent: string;
};

export type HabitDefinition = {
  id: string;
  categoryId: string;
  userId: string;
  weekStart: string;
  name: string;
  metric: GoalMetric;
  target: number;
  points: number;
};

export type HabitLog = {
  id: string;
  habitId: string;
  userId: string;
  date: string;
  value: number;
};

export type WeeklyScore = {
  leagueId: string;
  userId: string;
  weekStart: string;
  totalPoints: number;
};

export function calculateHabitPoints(target: number, progress: number, points: number) {
  if (target <= 0 || points <= 0) {
    return 0;
  }

  const ratio = Math.min(progress / target, 1);
  return Math.round(ratio * points);
}

export function calculateWeeklyScore(
  habits: HabitDefinition[],
  logsByHabitId: Record<string, number>,
) {
  return habits.reduce((total, habit) => {
    const progress = logsByHabitId[habit.id] ?? 0;
    return total + calculateHabitPoints(habit.target, progress, habit.points);
  }, 0);
}

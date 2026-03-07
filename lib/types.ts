export type LandingMetric = {
  label: string;
  value: string;
  description: string;
};

export type OnboardingStep = {
  title: string;
  description: string;
};

export type HighlightCard = {
  label: string;
  value: string;
};

export type PlayerSnapshot = {
  name: string;
  summary: string;
  points: string;
};

export type DashboardSnapshot = {
  weekLabel: string;
  myRank: number;
  points: number;
  topPlayers: PlayerSnapshot[];
  highlightCards: HighlightCard[];
};

export type SummaryCard = {
  label: string;
  value: string;
  note: string;
};

export type HabitCard = {
  category: string;
  name: string;
  progressLabel: string;
  progressPercent: number;
  points: number;
  badgeColor: string;
};

export type CategoryCard = {
  name: string;
  habitCount: number;
  points: number;
  tint: string;
};

export type LeaderboardMember = {
  rank: number;
  name: string;
  note: string;
  points: string;
};

export type AppBoard = {
  leagueName: string;
  headline: string;
  summaryCards: SummaryCard[];
  habits: HabitCard[];
  categories: CategoryCard[];
  leaderboard: LeaderboardMember[];
  pointsBudget: number;
  pointsUsed: number;
  completedToday: string;
};

export type AuthOption = {
  label: string;
  description: string;
};

export type LeagueInvitePreview = {
  leagueName: string;
  memberCount: number;
  weeklyReset: string;
  inviteCode: string;
};

export type SetupHabitDraft = {
  name: string;
  target: string;
  points: number;
};

export type SetupCategoryDraft = {
  name: string;
  accent: string;
  habits: SetupHabitDraft[];
};

import type {
  AppBoard,
  AuthOption,
  DashboardSnapshot,
  LandingMetric,
  LeagueInvitePreview,
  OnboardingStep,
  SetupCategoryDraft,
} from "@/lib/types";

export const landingMetrics: LandingMetric[] = [
  {
    label: "Daily engagement",
    value: "2-tap logging",
    description: "The app is designed around fast mobile check-ins instead of spreadsheet-style setup.",
  },
  {
    label: "Scoring fairness",
    value: "100 weekly pts",
    description: "Every player spends the same weekly budget so the leaderboard stays competitive.",
  },
  {
    label: "League pressure",
    value: "Private groups",
    description: "Invite-only circles make the leaderboard feel personal enough to drive consistency.",
  },
];

export const onboardingSteps: OnboardingStep[] = [
  {
    title: "Create or join a league",
    description: "Start with a private friend group, share an invite code, and keep access limited to league members.",
  },
  {
    title: "Build your week",
    description: "Pick categories, add habits, and spend a fixed point budget across the goals that matter most this week.",
  },
  {
    title: "Log progress and climb",
    description: "Daily check-ins feed a weekly leaderboard so momentum, accountability, and bragging rights are visible.",
  },
];

export const dashboardSnapshot: DashboardSnapshot = {
  weekLabel: "Week 14",
  myRank: 2,
  points: 68,
  topPlayers: [
    { name: "Maya", summary: "Meditation, reading, gym", points: "74" },
    { name: "You", summary: "Deep work, cardio, language", points: "68" },
    { name: "Noah", summary: "Journaling, sleep, stretches", points: "63" },
  ],
  highlightCards: [
    { label: "Behind first", value: "6 pts" },
    { label: "Habits logged", value: "11/15" },
  ],
};

export const appBoard: AppBoard = {
  leagueName: "Sunday Reset League",
  headline: "Good pace. You are one strong day away from first place.",
  summaryCards: [
    { label: "Current rank", value: "#2", note: "6 points behind Maya" },
    { label: "Weekly total", value: "68", note: "Out of 100 possible points" },
    { label: "League members", value: "7", note: "5 members logged progress today" },
  ],
  habits: [
    {
      category: "Fitness",
      name: "4 cardio sessions",
      progressLabel: "3 of 4 complete this week",
      progressPercent: 75,
      points: 18,
      badgeColor: "#f16f42",
    },
    {
      category: "Focus",
      name: "10 deep work blocks",
      progressLabel: "7 of 10 complete this week",
      progressPercent: 70,
      points: 24,
      badgeColor: "#1f7a6b",
    },
    {
      category: "Learning",
      name: "Spanish practice 5x",
      progressLabel: "4 of 5 complete this week",
      progressPercent: 80,
      points: 14,
      badgeColor: "#f3b63f",
    },
  ],
  categories: [
    { name: "Fitness", habitCount: 2, points: 34, tint: "#ffd8bf" },
    { name: "Focus", habitCount: 3, points: 38, tint: "#c8ece5" },
    { name: "Learning", habitCount: 2, points: 28, tint: "#f8e5b8" },
  ],
  leaderboard: [
    { rank: 1, name: "Maya", note: "Crushed her morning routine streak", points: "74" },
    { rank: 2, name: "You", note: "Still have 32 points available this week", points: "68" },
    { rank: 3, name: "Noah", note: "Big recovery after a slow Monday", points: "63" },
    { rank: 4, name: "Jules", note: "Strong fitness week, needs setup polish", points: "56" },
  ],
  pointsBudget: 100,
  pointsUsed: 100,
  completedToday: "3 of 5",
};

export const authOptions: AuthOption[] = [
  {
    label: "Continue with email",
    description: "Magic-link auth keeps onboarding lightweight for friend groups.",
  },
  {
    label: "Continue with Apple",
    description: "Best native-feeling option for iPhone users once auth is wired up.",
  },
  {
    label: "Join with invite code",
    description: "Fastest path for a friend who was already invited into a league.",
  },
];

export const invitePreview: LeagueInvitePreview = {
  leagueName: "Sunday Reset League",
  memberCount: 7,
  weeklyReset: "Mondays at 12:00 AM local time",
  inviteCode: "RESET-24",
};

export const setupDraft: SetupCategoryDraft[] = [
  {
    name: "Fitness",
    accent: "#ffd8bf",
    habits: [
      { name: "Cardio sessions", target: "4 per week", points: 18 },
      { name: "Mobility flow", target: "5 per week", points: 16 },
    ],
  },
  {
    name: "Focus",
    accent: "#c8ece5",
    habits: [
      { name: "Deep work blocks", target: "10 per week", points: 24 },
      { name: "Inbox zero", target: "3 per week", points: 14 },
    ],
  },
  {
    name: "Learning",
    accent: "#f8e5b8",
    habits: [{ name: "Spanish practice", target: "5 per week", points: 28 }],
  },
];

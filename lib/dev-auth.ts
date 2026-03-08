const DEV_AUTH_BYPASS = process.env.DEV_AUTH_BYPASS === "true";

export function isDevAuthBypassEnabled() {
  return process.env.NODE_ENV === "development" && DEV_AUTH_BYPASS;
}

export function getDevBypassViewer() {
  return {
    user: {
      id: "dev-bypass-user",
      email: "demo@habitleague.local",
      user_metadata: {
        display_name: "Demo Player",
      },
    },
    memberships: [
      {
        leagueId: "dev-bypass-league",
        leagueName: "Demo Habit League",
        inviteCode: "DEMO-24",
        weeklyPointBudget: 100,
        role: "owner" as const,
      },
    ],
    isDevBypass: true,
  };
}

import { cache } from "react";

import { getDevBypassViewer, isDevAuthBypassEnabled } from "@/lib/dev-auth";
import { createClient } from "@/lib/supabase/server";

type LeagueMembership = {
  leagueId: string;
  leagueName: string;
  inviteCode: string;
  weeklyPointBudget: number;
  role: "owner" | "member";
};

export const getViewerContext = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (isDevAuthBypassEnabled()) {
      return getDevBypassViewer();
    }

    return { user: null, memberships: [] as LeagueMembership[], isDevBypass: false };
  }

  const { data: memberships, error } = await supabase
    .from("league_members")
    .select(
      `role, league_id, leagues:league_id (
        id,
        name,
        invite_code,
        weekly_point_budget
      )`,
    )
    .eq("user_id", user.id);

  if (error || !memberships) {
    return { user, memberships: [] as LeagueMembership[], isDevBypass: false };
  }

  const normalized = memberships.flatMap((membership) => {
    const league = Array.isArray(membership.leagues)
      ? membership.leagues[0]
      : membership.leagues;

    if (!league) {
      return [];
    }

    return [
      {
        leagueId: league.id,
        leagueName: league.name,
        inviteCode: league.invite_code,
        weeklyPointBudget: league.weekly_point_budget,
        role: membership.role,
      } satisfies LeagueMembership,
    ];
  });

  return { user, memberships: normalized, isDevBypass: false };
});

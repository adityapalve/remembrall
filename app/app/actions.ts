"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createInviteCode, slugifyInviteCode } from "@/lib/utils";

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createLeague(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/join?error=Please sign in first.");
  }

  const name = readText(formData, "name");
  const budgetValue = Number(readText(formData, "weeklyPointBudget") || 100);
  const customCode = slugifyInviteCode(readText(formData, "inviteCode"));
  const inviteCode = customCode || createInviteCode(name);

  if (!name) {
    redirect("/app?error=Give your league a name first.");
  }

  if (!Number.isFinite(budgetValue) || budgetValue <= 0 || budgetValue > 500) {
    redirect("/app?error=Choose a weekly point budget between 1 and 500.");
  }

  const { data: league, error: leagueError } = await supabase
    .from("leagues")
    .insert({
      name,
      owner_id: user.id,
      invite_code: inviteCode,
      weekly_point_budget: budgetValue,
    })
    .select("id, invite_code")
    .single();

  if (leagueError || !league) {
    redirect(`/app?error=${encodeURIComponent(leagueError?.message ?? "Could not create league.")}`);
  }

  const { error: memberError } = await supabase.from("league_members").insert({
    league_id: league.id,
    user_id: user.id,
    role: "owner",
  });

  if (memberError) {
    redirect(`/app?error=${encodeURIComponent(memberError.message)}`);
  }

  const { error: inviteError } = await supabase.from("league_invites").insert({
    league_id: league.id,
    code: league.invite_code,
    created_by: user.id,
  });

  if (inviteError) {
    redirect(`/app?error=${encodeURIComponent(inviteError.message)}`);
  }

  revalidatePath("/app");
  redirect(`/app?success=${encodeURIComponent("League created. Invite your friends with the new code.")}`);
}

export async function joinLeague(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/join?error=Please sign in first.");
  }

  const inviteCode = slugifyInviteCode(readText(formData, "inviteCode"));

  if (!inviteCode) {
    redirect("/app?error=Enter an invite code to join a league.");
  }

  const { data, error } = await supabase.rpc("redeem_league_invite", {
    invite_code_input: inviteCode,
  });

  if (error) {
    redirect(`/app?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app");
  redirect(
    `/app?success=${encodeURIComponent(
      `Joined league with invite code ${inviteCode}.`,
    )}&league=${encodeURIComponent(String(data ?? ""))}`,
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { categoryPalette } from "@/lib/planner";
import { createClient } from "@/lib/supabase/server";
import { createInviteCode, slugifyInviteCode } from "@/lib/utils";

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function requireViewer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/join?error=Please sign in first.");
  }

  return { supabase, user };
}

async function ensurePlanId(supabase: Awaited<ReturnType<typeof createClient>>, leagueId: string) {
  const { data: planId, error } = await supabase.rpc("ensure_user_week_plan", {
    target_league_id: leagueId,
  });

  if (error || !planId) {
    redirect(`/app/setup?error=${encodeURIComponent(error?.message ?? "Could not prepare your weekly plan.")}`);
  }

  return planId;
}

async function getWeekIdForPlan(
  supabase: Awaited<ReturnType<typeof createClient>>,
  planId: string,
) {
  const { data } = await supabase
    .from("user_week_plans")
    .select("league_week_id")
    .eq("id", planId)
    .single();

  return data?.league_week_id ?? null;
}

async function refreshWeeklyScores(
  supabase: Awaited<ReturnType<typeof createClient>>,
  weekId: string | null,
) {
  if (!weekId) {
    return;
  }

  await supabase.rpc("recompute_weekly_scores", {
    target_league_week_id: weekId,
  });
}

async function recalculatePlanAllocation(
  supabase: Awaited<ReturnType<typeof createClient>>,
  planId: string,
) {
  const { data: categories } = await supabase
    .from("plan_categories")
    .select("id")
    .eq("user_week_plan_id", planId);

  const categoryIds = (categories ?? []).map((category) => category.id);

  if (categoryIds.length === 0) {
    await supabase.from("user_week_plans").update({ points_allocated: 0 }).eq("id", planId);
    return;
  }

  const { data: habits } = await supabase
    .from("plan_habits")
    .select("point_value")
    .in("category_id", categoryIds);

  const total = (habits ?? []).reduce((sum, habit) => sum + habit.point_value, 0);

  await supabase.from("user_week_plans").update({ points_allocated: total }).eq("id", planId);
}

export async function createLeague(formData: FormData) {
  const { supabase, user } = await requireViewer();

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
  const { supabase } = await requireViewer();

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

export async function addCategory(formData: FormData) {
  const { supabase } = await requireViewer();
  const leagueId = readText(formData, "leagueId");
  const name = readText(formData, "name");

  if (!leagueId || !name) {
    redirect("/app/setup?error=Add a category name first.");
  }

  const planId = await ensurePlanId(supabase, leagueId);
  const { data: existing } = await supabase
    .from("plan_categories")
    .select("id")
    .eq("user_week_plan_id", planId);

  const color = categoryPalette[(existing?.length ?? 0) % categoryPalette.length];

  const { error } = await supabase.from("plan_categories").insert({
    user_week_plan_id: planId,
    name,
    color,
    sort_order: existing?.length ?? 0,
  });

  if (error) {
    redirect(`/app/setup?error=${encodeURIComponent(error.message)}`);
  }

  const weekId = await getWeekIdForPlan(supabase, planId);
  await refreshWeeklyScores(supabase, weekId);
  revalidatePath("/app/setup");
  revalidatePath("/app");
  revalidatePath("/app/league");
  redirect("/app/setup?success=Category%20added.");
}

export async function updateCategory(formData: FormData) {
  const { supabase } = await requireViewer();
  const categoryId = readText(formData, "categoryId");
  const name = readText(formData, "name");

  if (!categoryId || !name) {
    redirect("/app/setup?error=Category name cannot be empty.");
  }

  const { error } = await supabase.from("plan_categories").update({ name }).eq("id", categoryId);

  if (error) {
    redirect(`/app/setup?error=${encodeURIComponent(error.message)}`);
  }

  const { data: category } = await supabase
    .from("plan_categories")
    .select("user_week_plan_id")
    .eq("id", categoryId)
    .single();
  const weekId = category ? await getWeekIdForPlan(supabase, category.user_week_plan_id) : null;
  await refreshWeeklyScores(supabase, weekId);
  revalidatePath("/app/setup");
  revalidatePath("/app");
  revalidatePath("/app/league");
  redirect("/app/setup?success=Category%20updated.");
}

export async function deleteCategory(formData: FormData) {
  const { supabase } = await requireViewer();
  const categoryId = readText(formData, "categoryId");
  const planId = readText(formData, "planId");

  if (!categoryId || !planId) {
    redirect("/app/setup?error=Could%20not%20delete%20category.");
  }

  const { error } = await supabase.from("plan_categories").delete().eq("id", categoryId);

  if (error) {
    redirect(`/app/setup?error=${encodeURIComponent(error.message)}`);
  }

  await recalculatePlanAllocation(supabase, planId);
  const weekId = await getWeekIdForPlan(supabase, planId);
  await refreshWeeklyScores(supabase, weekId);
  revalidatePath("/app/setup");
  revalidatePath("/app");
  revalidatePath("/app/league");
  redirect("/app/setup?success=Category%20removed.");
}

export async function addHabit(formData: FormData) {
  const { supabase, user } = await requireViewer();
  const categoryId = readText(formData, "categoryId");
  const planId = readText(formData, "planId");
  const name = readText(formData, "name");
  const metricType = readText(formData, "metricType") || "count";
  const targetValue = Number(readText(formData, "targetValue") || 1);
  const pointValue = Number(readText(formData, "pointValue") || 1);

  if (!categoryId || !planId || !name) {
    redirect("/app/setup?error=Habit name is required.");
  }

  const { data: existing } = await supabase
    .from("plan_habits")
    .select("id")
    .eq("category_id", categoryId);

  const { error } = await supabase.from("plan_habits").insert({
    category_id: categoryId,
    user_id: user.id,
    name,
    metric_type: metricType as "count" | "duration_minutes" | "binary" | "steps" | "sleep_hours",
    target_value: targetValue,
    point_value: pointValue,
    sort_order: existing?.length ?? 0,
  });

  if (error) {
    redirect(`/app/setup?error=${encodeURIComponent(error.message)}`);
  }

  await recalculatePlanAllocation(supabase, planId);
  const weekId = await getWeekIdForPlan(supabase, planId);
  await refreshWeeklyScores(supabase, weekId);
  revalidatePath("/app/setup");
  revalidatePath("/app");
  revalidatePath("/app/league");
  redirect("/app/setup?success=Habit%20added.");
}

export async function updateHabit(formData: FormData) {
  const { supabase } = await requireViewer();
  const habitId = readText(formData, "habitId");
  const name = readText(formData, "name");
  const metricType = readText(formData, "metricType") || "count";
  const targetValue = Number(readText(formData, "targetValue") || 1);
  const pointValue = Number(readText(formData, "pointValue") || 1);
  const planId = readText(formData, "planId");

  if (!habitId || !name || !planId) {
    redirect("/app/setup?error=Could%20not%20update%20habit.");
  }

  const { error } = await supabase
    .from("plan_habits")
    .update({
      name,
      metric_type: metricType as "count" | "duration_minutes" | "binary" | "steps" | "sleep_hours",
      target_value: targetValue,
      point_value: pointValue,
    })
    .eq("id", habitId);

  if (error) {
    redirect(`/app/setup?error=${encodeURIComponent(error.message)}`);
  }

  await recalculatePlanAllocation(supabase, planId);
  const weekId = await getWeekIdForPlan(supabase, planId);
  await refreshWeeklyScores(supabase, weekId);
  revalidatePath("/app/setup");
  revalidatePath("/app");
  revalidatePath("/app/league");
  redirect("/app/setup?success=Habit%20updated.");
}

export async function deleteHabit(formData: FormData) {
  const { supabase } = await requireViewer();
  const habitId = readText(formData, "habitId");
  const planId = readText(formData, "planId");

  if (!habitId || !planId) {
    redirect("/app/setup?error=Could%20not%20delete%20habit.");
  }

  const { error } = await supabase.from("plan_habits").delete().eq("id", habitId);

  if (error) {
    redirect(`/app/setup?error=${encodeURIComponent(error.message)}`);
  }

  await recalculatePlanAllocation(supabase, planId);
  const weekId = await getWeekIdForPlan(supabase, planId);
  await refreshWeeklyScores(supabase, weekId);
  revalidatePath("/app/setup");
  revalidatePath("/app");
  revalidatePath("/app/league");
  redirect("/app/setup?success=Habit%20removed.");
}

export async function saveHabitProgress(formData: FormData) {
  const { supabase, user } = await requireViewer();
  const habitId = readText(formData, "habitId");
  const value = Number(readText(formData, "progressValue") || 0);
  const redirectTo = readText(formData, "redirectTo") || "/app";
  const today = new Date().toISOString().slice(0, 10);

  if (!habitId || !Number.isFinite(value) || value < 0) {
    redirect(`${redirectTo}?error=Enter%20a%20valid%20progress%20value.`);
  }

  const { error } = await supabase.from("habit_logs").upsert(
    {
      plan_habit_id: habitId,
      user_id: user.id,
      log_date: today,
      progress_value: value,
    },
    { onConflict: "plan_habit_id,log_date" },
  );

  if (error) {
    redirect(`${redirectTo}?error=${encodeURIComponent(error.message)}`);
  }

  const { data: habit } = await supabase
    .from("plan_habits")
    .select("category_id")
    .eq("id", habitId)
    .single();
  const { data: category } = habit
    ? await supabase
        .from("plan_categories")
        .select("user_week_plan_id")
        .eq("id", habit.category_id)
        .single()
    : { data: null };
  const weekId = category ? await getWeekIdForPlan(supabase, category.user_week_plan_id) : null;
  await refreshWeeklyScores(supabase, weekId);

  revalidatePath("/app");
  revalidatePath("/app/league");
  revalidatePath("/app/setup");
  redirect(`${redirectTo}?success=Progress%20saved.`);
}

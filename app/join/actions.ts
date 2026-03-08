"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function normalizeInviteCode(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email");
  const inviteCode = normalizeInviteCode(formData.get("inviteCode"));

  if (typeof email !== "string" || !email.trim()) {
    redirect(`/join?error=${encodeURIComponent("Enter your email to get a magic link.")}`);
  }

  const supabase = await createClient();
  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: {
      emailRedirectTo: `${origin}/auth/callback${
        inviteCode ? `?invite=${encodeURIComponent(inviteCode)}` : ""
      }`,
    },
  });

  if (error) {
    redirect(`/join?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `/join?sent=1${inviteCode ? `&invite=${encodeURIComponent(inviteCode)}` : ""}&email=${encodeURIComponent(
      email.trim(),
    )}`,
  );
}

export async function signUpWithPassword(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const inviteCode = normalizeInviteCode(formData.get("inviteCode"));

  if (typeof email !== "string" || !email.trim()) {
    redirect(`/join?error=${encodeURIComponent("Enter your email to create an account.")}`);
  }

  if (typeof password !== "string" || password.length < 8) {
    redirect(`/join?error=${encodeURIComponent("Use a password with at least 8 characters.")}`);
  }

  const supabase = await createClient();
  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback${
        inviteCode ? `?invite=${encodeURIComponent(inviteCode)}` : ""
      }`,
    },
  });

  if (error) {
    redirect(`/join?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `/join?sent=1&mode=signup${inviteCode ? `&invite=${encodeURIComponent(inviteCode)}` : ""}&email=${encodeURIComponent(
      email.trim(),
    )}`,
  );
}

export async function signInWithPassword(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email.trim()) {
    redirect(`/join?error=${encodeURIComponent("Enter your email to sign in.")}`);
  }

  if (typeof password !== "string" || !password) {
    redirect(`/join?error=${encodeURIComponent("Enter your password to sign in.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    redirect(`/join?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/app?success=Signed%20in%20successfully.");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

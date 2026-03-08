import Link from "next/link";
import { redirect } from "next/navigation";

import {
  signInWithEmail,
  signInWithPassword,
  signUpWithPassword,
} from "@/app/join/actions";
import { isDevAuthBypassEnabled } from "@/lib/dev-auth";
import { authOptions, invitePreview } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";

type JoinPageProps = {
  searchParams: Promise<{
    error?: string;
    sent?: string;
    email?: string;
    invite?: string;
    mode?: string;
  }>;
};

export default async function JoinPage({ searchParams }: JoinPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/app");
  }

  const inviteCode = params.invite ?? invitePreview.inviteCode;
  const devBypassEnabled = isDevAuthBypassEnabled();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid flex-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="glass rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Onboarding</p>
          <h1 className="display-font mt-2 text-4xl tracking-[-0.05em] sm:text-5xl">
            Join your league in under a minute.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-muted sm:text-base">
            Use email and password for normal sign-in, or fall back to a magic link
            when you want a passwordless jump into the app.
          </p>

          {params.error ? (
            <div className="mt-6 rounded-[1.5rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {params.error}
            </div>
          ) : null}

          {params.sent ? (
            <div className="mt-6 rounded-[1.5rem] border border-teal/20 bg-teal/10 px-4 py-3 text-sm text-teal">
              {params.mode === "signup"
                ? `Account created for ${params.email}. Check your inbox if email confirmation is enabled, then sign in with your password.`
                : `Magic link sent to ${params.email}. Open the email on this device to sign in.`}
            </div>
          ) : null}

          {devBypassEnabled ? (
            <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Dev auth bypass is enabled locally. You can open `/app` without logging in to keep building UI.
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <form action={signInWithPassword} className="rounded-[1.75rem] border border-line bg-white/60 p-4">
              <p className="text-sm font-semibold text-foreground">Sign in</p>
              <div className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  Email address
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    defaultValue={params.email ?? ""}
                    className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-foreground/30"
                  />
                </label>
                <label className="block text-sm font-medium text-foreground">
                  Password
                  <input
                    type="password"
                    name="password"
                    placeholder="At least 8 characters"
                    className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-foreground/30"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="mt-4 w-full rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-accent"
              >
                Sign in with password
              </button>
            </form>

            <form action={signUpWithPassword} className="rounded-[1.75rem] border border-line bg-white/60 p-4">
              <p className="text-sm font-semibold text-foreground">Create account</p>
              <div className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  Email address
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    defaultValue={params.email ?? ""}
                    className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-foreground/30"
                  />
                </label>
                <label className="block text-sm font-medium text-foreground">
                  Password
                  <input
                    type="password"
                    name="password"
                    placeholder="At least 8 characters"
                    className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-foreground/30"
                  />
                </label>
                <label className="block text-sm font-medium text-foreground">
                  Invite code
                  <input
                    type="text"
                    name="inviteCode"
                    defaultValue={inviteCode}
                    className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 uppercase outline-none transition focus:border-foreground/30"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="mt-4 w-full rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold transition hover:bg-white/80"
              >
                Create account
              </button>
            </form>
          </div>

          <form action={signInWithEmail} className="mt-4 rounded-[1.75rem] border border-line bg-white/60 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground">
                  Magic link email
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    defaultValue={params.email ?? ""}
                    className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-foreground/30"
                  />
                </label>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground">
                  Invite code
                  <input
                    type="text"
                    name="inviteCode"
                    defaultValue={inviteCode}
                    className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 uppercase outline-none transition focus:border-foreground/30"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-deep"
              >
                Send magic link
              </button>
            </div>
            <p className="mt-2 text-sm text-muted">
              Keep this as a backup option for phone testing or passwordless sign-in.
            </p>
          </form>

          <div className="mt-6 space-y-3">
            {authOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                disabled
                className="w-full rounded-[1.5rem] border border-line bg-white/60 px-5 py-4 text-left opacity-80 transition hover:border-foreground/20 hover:bg-white/85"
              >
                <p className="font-semibold">{option.label}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{option.description}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-line bg-white/55 px-5 py-3 text-sm font-semibold transition hover:bg-white/80"
            >
              Back to overview
            </Link>
            <span className="rounded-full border border-line bg-white/40 px-5 py-3 text-sm font-semibold text-muted">
              Sign in to open the planner
            </span>
          </div>
        </section>

        <section className="glass rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Invite preview</p>
          <div className="mt-4 rounded-[1.75rem] bg-[#14231c] p-5 text-white">
            <p className="text-sm text-white/65">League</p>
            <h2 className="display-font mt-2 text-3xl tracking-[-0.04em]">
              {invitePreview.leagueName}
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.25rem] bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/60">Members</p>
                <p className="mt-2 text-2xl font-semibold">{invitePreview.memberCount}</p>
              </div>
              <div className="rounded-[1.25rem] bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/60">Weekly reset</p>
                <p className="mt-2 text-sm font-medium text-white/80">{invitePreview.weeklyReset}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-dashed border-line bg-white/55 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">Invite code</p>
            <p className="display-font mt-2 text-3xl tracking-[0.08em]">{inviteCode}</p>
            <label className="mt-5 block text-sm font-medium text-foreground">
              Enter invite code
              <input
                readOnly
                value={inviteCode}
                className="mt-2 w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-base outline-none"
              />
            </label>
            <button
              type="button"
              className="mt-4 w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-deep"
            >
              League join wiring comes next
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

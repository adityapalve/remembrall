import Link from "next/link";

import { authOptions, invitePreview } from "@/lib/mock-data";

export default function JoinPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid flex-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="glass rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Onboarding</p>
          <h1 className="display-font mt-2 text-4xl tracking-[-0.05em] sm:text-5xl">
            Join your league in under a minute.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-muted sm:text-base">
            This is the auth entry point for the PWA. Next up we will wire these
            actions to Supabase auth and invite validation.
          </p>

          <div className="mt-8 space-y-3">
            {authOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                className="w-full rounded-[1.5rem] border border-line bg-white/60 px-5 py-4 text-left transition hover:border-foreground/20 hover:bg-white/85"
              >
                <p className="font-semibold">{option.label}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{option.description}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/app"
              className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-accent"
            >
              Skip into mock app
            </Link>
            <Link
              href="/app/setup"
              className="rounded-full border border-line bg-white/55 px-5 py-3 text-sm font-semibold transition hover:bg-white/80"
            >
              View weekly setup
            </Link>
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
            <p className="display-font mt-2 text-3xl tracking-[0.08em]">{invitePreview.inviteCode}</p>
            <label className="mt-5 block text-sm font-medium text-foreground">
              Enter invite code
              <input
                readOnly
                value={invitePreview.inviteCode}
                className="mt-2 w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-base outline-none"
              />
            </label>
            <button
              type="button"
              className="mt-4 w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-deep"
            >
              Validate invite in next step
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

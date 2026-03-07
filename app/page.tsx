import Link from "next/link";

import { dashboardSnapshot, landingMetrics, onboardingSteps } from "@/lib/mock-data";

const badges = ["Installable PWA", "Private leagues", "Weekly point budgets"];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-16 pt-6 text-foreground sm:px-8 lg:px-12">
      <section className="glass overflow-hidden rounded-[2rem] border border-line/80 px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-line bg-white/55 px-3 py-1"
                >
                  {badge}
                </span>
              ))}
            </div>
            <p className="display-font max-w-xl text-5xl leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              Build a habit league your friends actually want to open every day.
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
              Habit League turns weekly goals into a shared competition. Everyone
              picks their own categories, spends a fixed point budget, and races
              up a live leaderboard together.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:translate-y-[-1px] hover:bg-accent"
              >
                Open the MVP app
              </Link>
              <a
                href="#plan"
                className="inline-flex items-center justify-center rounded-full border border-line bg-white/50 px-6 py-3 text-sm font-semibold transition hover:border-foreground/25 hover:bg-white/70"
              >
                View build plan
              </a>
            </div>
          </div>

          <div className="glass w-full max-w-md rounded-[2rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,245,228,0.78))] p-4">
            <div className="rounded-[1.5rem] bg-[#14231c] p-4 text-white shadow-2xl">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-white/60">
                <span>League pulse</span>
                <span>{dashboardSnapshot.weekLabel}</span>
              </div>
              <div className="mt-4 rounded-[1.25rem] bg-white/8 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/70">Your standing</p>
                    <p className="mt-1 text-3xl font-semibold">#{dashboardSnapshot.myRank}</p>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                    {dashboardSnapshot.points} pts
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {dashboardSnapshot.topPlayers.map((player) => (
                    <div
                      key={player.name}
                      className="flex items-center justify-between rounded-2xl bg-white/6 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{player.name}</p>
                        <p className="text-xs text-white/60">{player.summary}</p>
                      </div>
                      <p className="text-sm font-semibold">{player.points}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {dashboardSnapshot.highlightCards.map((card) => (
                  <div key={card.label} className="rounded-[1.25rem] bg-white/8 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/55">{card.label}</p>
                    <p className="mt-2 text-xl font-semibold">{card.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {landingMetrics.map((metric) => (
          <article key={metric.label} className="glass rounded-[1.75rem] px-5 py-6">
            <p className="text-sm uppercase tracking-[0.22em] text-muted">{metric.label}</p>
            <p className="display-font mt-3 text-4xl tracking-[-0.04em]">{metric.value}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{metric.description}</p>
          </article>
        ))}
      </section>

      <section id="plan" className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="glass rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-muted">How the product works</p>
              <h2 className="display-font mt-2 text-3xl tracking-[-0.04em] sm:text-4xl">
                Weekly planning becomes the game board.
              </h2>
            </div>
            <span className="rounded-full bg-accent-soft px-4 py-2 text-sm font-semibold text-accent-deep">
              MVP focus
            </span>
          </div>
          <div className="mt-8 space-y-4">
            {onboardingSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[1.5rem] border border-line bg-white/55 p-4 sm:p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="display-font flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="glass rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">MVP build stack</p>
          <div className="mt-5 space-y-4">
            {[
              ["Frontend", "Next.js PWA with App Router and mobile-first routes."],
              ["Backend", "Supabase auth, Postgres, row-level security, and invites."],
              ["Scoring", "Fixed weekly point budgets to keep league comparisons fair."],
              ["Retention", "Fast daily check-ins, leaderboard pressure, install prompts."],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.5rem] border border-line bg-white/55 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted">{label}</p>
                <p className="mt-2 text-sm leading-6 text-foreground">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-[#1f7a6b] p-5 text-white">
            <p className="text-sm uppercase tracking-[0.24em] text-white/70">Install flow</p>
            <p className="mt-2 text-xl font-semibold">Open in Safari and add to Home Screen.</p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              The app is built to feel native enough for quick daily check-ins while
              keeping distribution as simple as sharing a link.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}

import Link from "next/link";

import { appBoard } from "@/lib/mock-data";

export default function AppPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="glass rounded-[2rem] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted">{appBoard.leagueName}</p>
                <h1 className="display-font mt-2 text-4xl tracking-[-0.05em] sm:text-5xl">
                  {appBoard.headline}
                </h1>
              </div>
              <Link
                href="/"
                className="rounded-full border border-line bg-white/50 px-4 py-2 text-sm font-semibold transition hover:bg-white/80"
              >
                Back to overview
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {appBoard.summaryCards.map((card) => (
                <div key={card.label} className="rounded-[1.5rem] border border-line bg-white/55 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">{card.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{card.value}</p>
                  <p className="mt-1 text-sm text-muted">{card.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-[2rem] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted">Today</p>
                <h2 className="display-font mt-2 text-3xl tracking-[-0.04em]">Quick check-ins</h2>
              </div>
              <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent-deep">
                {appBoard.completedToday} complete
              </span>
            </div>
            <div className="mt-6 space-y-3">
              {appBoard.habits.map((habit) => (
                <article
                  key={habit.name}
                  className="rounded-[1.5rem] border border-line bg-white/65 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted">{habit.category}</p>
                      <h3 className="mt-1 text-lg font-semibold">{habit.name}</h3>
                      <p className="mt-1 text-sm text-muted">{habit.progressLabel}</p>
                    </div>
                    <div className="rounded-full px-3 py-1 text-sm font-semibold text-white" style={{ backgroundColor: habit.badgeColor }}>
                      {habit.points} pts
                    </div>
                  </div>
                  <div className="mt-4 h-3 rounded-full bg-[#e8ddcf]">
                    <div
                      className="h-3 rounded-full"
                      style={{ width: `${habit.progressPercent}%`, backgroundColor: habit.badgeColor }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="glass rounded-[2rem] p-5 sm:p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Weekly setup</p>
            <h2 className="display-font mt-2 text-3xl tracking-[-0.04em]">Point budget</h2>
            <div className="mt-5 rounded-[1.5rem] bg-[#14231c] p-5 text-white">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-white/65">Spent</p>
                  <p className="mt-1 text-4xl font-semibold">{appBoard.pointsUsed}/{appBoard.pointsBudget}</p>
                </div>
                <p className="text-sm text-white/65">Balanced scoring keeps leagues fair.</p>
              </div>
              <div className="mt-4 h-3 rounded-full bg-white/10">
                <div className="h-3 rounded-full bg-gold" style={{ width: `${(appBoard.pointsUsed / appBoard.pointsBudget) * 100}%` }} />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {appBoard.categories.map((category) => (
                <div key={category.name} className="rounded-[1.5rem] border border-line bg-white/55 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold">{category.name}</p>
                      <p className="text-sm text-muted">{category.habitCount} habits this week</p>
                    </div>
                    <div className="rounded-full px-3 py-1 text-sm font-semibold" style={{ backgroundColor: category.tint, color: "#14231c" }}>
                      {category.points} pts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-[2rem] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted">League leaderboard</p>
                <h2 className="display-font mt-2 text-3xl tracking-[-0.04em]">This week</h2>
              </div>
              <span className="text-sm font-semibold text-muted">Updates live soon</span>
            </div>
            <div className="mt-5 space-y-3">
              {appBoard.leaderboard.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between rounded-[1.5rem] border border-line bg-white/60 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="display-font flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                      {member.rank}
                    </div>
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-muted">{member.note}</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">{member.points}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

import Link from "next/link";

import { createLeague, joinLeague, saveHabitProgress } from "@/app/app/actions";
import { getLeagueDashboardData } from "@/lib/league-data";

type AppPageProps = {
  searchParams: Promise<{
    invite?: string;
    error?: string;
    success?: string;
  }>;
};

export default async function AppPage({ searchParams }: AppPageProps) {
  const params = await searchParams;
  const dashboard = await getLeagueDashboardData();
  const playerName =
    dashboard.user?.user_metadata.display_name ?? dashboard.user?.email?.split("@")[0] ?? "You";
  const activeLeague = dashboard.activeLeague;

  return (
    <main className="min-h-screen pb-16">
      {params.error ? (
        <div className="mb-6 rounded-[1.5rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {params.error}
        </div>
      ) : null}
      {params.success ? (
        <div className="mb-6 rounded-[1.5rem] border border-teal/20 bg-teal/10 px-4 py-3 text-sm text-teal">
          {params.success}
        </div>
      ) : null}
      {dashboard.isDevBypass ? (
        <div className="mb-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You are viewing the app with a local dev-bypass user. Dashboard and leaderboard data stay mocked until you sign in for real.
        </div>
      ) : null}
      {params.invite ? (
        <div className="mb-6 rounded-[1.5rem] border border-teal/20 bg-teal/10 px-4 py-3 text-sm text-teal">
          Signed in successfully. You can redeem invite code <span className="font-semibold">{params.invite}</span> below.
        </div>
      ) : null}
      {!activeLeague ? (
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="glass rounded-[2rem] p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">League onboarding</p>
            <h1 className="display-font mt-2 text-4xl tracking-[-0.05em] sm:text-5xl">
              Start a league or jump into one your friends already created.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
              Once you are inside a league, the weekly setup flow becomes yours: choose categories,
              assign goals, spend your point budget, and start climbing the board.
            </p>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <form action={createLeague} className="rounded-[1.75rem] border border-line bg-white/60 p-5">
                <p className="text-sm font-semibold text-foreground">Create a new league</p>
                <div className="mt-4 space-y-3">
                  <label className="block text-sm font-medium">
                    League name
                    <input
                      type="text"
                      name="name"
                      placeholder="Sunday Reset Club"
                      className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-foreground/30"
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Weekly point budget
                    <input
                      type="number"
                      name="weeklyPointBudget"
                      min="1"
                      max="500"
                      defaultValue="100"
                      className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-foreground/30"
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Invite code (optional)
                    <input
                      type="text"
                      name="inviteCode"
                      placeholder="RESET24"
                      className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 uppercase outline-none transition focus:border-foreground/30"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="mt-5 w-full rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-accent"
                >
                  Create league
                </button>
              </form>

              <form action={joinLeague} className="rounded-[1.75rem] border border-line bg-white/60 p-5">
                <p className="text-sm font-semibold text-foreground">Join with invite code</p>
                <div className="mt-4 space-y-3">
                  <label className="block text-sm font-medium">
                    Invite code
                    <input
                      type="text"
                      name="inviteCode"
                      defaultValue={params.invite ?? ""}
                      placeholder="RESET-24"
                      className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 uppercase outline-none transition focus:border-foreground/30"
                    />
                  </label>
                  <div className="rounded-[1.5rem] bg-[#14231c] p-4 text-white">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/60">What happens next</p>
                    <p className="mt-2 text-sm leading-6 text-white/80">
                      You join the league, get the shared point budget, and then build your own weekly categories and goals.
                    </p>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-5 w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-deep"
                >
                  Join league
                </button>
              </form>
            </div>
          </article>

          <article className="glass rounded-[2rem] p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">What unlocks next</p>
            <div className="mt-5 space-y-4">
              {[
                ["Weekly categories", "Each user builds a custom week without forcing the same habits on everyone."],
                ["Goal planning", "Targets and point allocations define what progress is worth in the league."],
                ["Daily check-offs", "A quick mobile-first flow lets people log done, partial, or missed progress."],
                ["Leaderboard pressure", "League rank updates based on earned points, not arbitrary self-scoring."],
              ].map(([label, copy]) => (
                <div key={label} className="rounded-[1.5rem] border border-line bg-white/55 p-4">
                  <p className="font-semibold">{label}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{copy}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}
      {activeLeague ? (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <div className="glass rounded-[2rem] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-muted">{activeLeague.leagueName}</p>
                  <h1 className="display-font mt-2 text-4xl tracking-[-0.05em] sm:text-5xl">
                    {playerName}, keep people logging.
                  </h1>
                </div>
                <Link
                  href="/app/league"
                  className="rounded-full border border-line bg-white/50 px-4 py-2 text-sm font-semibold transition hover:bg-white/80"
                >
                  Open full leaderboard
                </Link>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {dashboard.summaryCards.map((card) => (
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
                  {dashboard.habits.filter((habit) => habit.todayValue > 0).length} logged today
                </span>
              </div>
              <div className="mt-6 space-y-3">
                {dashboard.habits.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-line bg-white/60 p-4 text-sm text-muted">
                    No habits yet. Build your weekly plan first.
                  </div>
                ) : null}
                {dashboard.habits.map((habit) => (
                  <article key={habit.id} className="rounded-[1.5rem] border border-line bg-white/65 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted">{habit.categoryName}</p>
                        <h3 className="mt-1 text-lg font-semibold">{habit.name}</h3>
                        <p className="mt-1 text-sm text-muted">
                          {habit.weeklyProgress} / {habit.targetValue} this week
                        </p>
                      </div>
                      <div className="rounded-full px-3 py-1 text-sm font-semibold text-foreground" style={{ backgroundColor: habit.color }}>
                        {habit.earnedPoints} pts
                      </div>
                    </div>
                    <div className="mt-4 h-3 rounded-full bg-[#e8ddcf]">
                      <div
                        className="h-3 rounded-full"
                        style={{ width: `${habit.progressPercent}%`, backgroundColor: habit.color }}
                      />
                    </div>
                    <form action={saveHabitProgress} className="mt-4 flex flex-wrap items-end gap-2">
                      <input type="hidden" name="habitId" value={habit.id} />
                      <input type="hidden" name="redirectTo" value="/app" />
                      <label className="min-w-[120px] flex-1 text-sm font-medium text-foreground">
                        Today
                        <input
                          type="number"
                          min="0"
                          step="1"
                          name="progressValue"
                          defaultValue={habit.todayValue}
                          className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-foreground/30"
                        />
                      </label>
                      <button
                        type="submit"
                        className="rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background transition hover:bg-accent"
                      >
                        Save today
                      </button>
                    </form>
                  </article>
                ))}
              </div>
            </div>

            <div className="glass rounded-[2rem] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-muted">This week</p>
                  <h2 className="display-font mt-2 text-3xl tracking-[-0.04em]">What still moves the board</h2>
                </div>
                <Link
                  href="/app/setup"
                  className="rounded-full border border-line bg-white/50 px-4 py-2 text-sm font-semibold transition hover:bg-white/80"
                >
                  Edit plan
                </Link>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {dashboard.insightCards.map((card) => (
                  <div key={card.label} className="rounded-[1.5rem] border border-line bg-white/60 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted">{card.label}</p>
                    <p className="mt-2 text-sm leading-6 text-foreground">{card.text}</p>
                  </div>
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
                    <p className="mt-1 text-4xl font-semibold">
                      {dashboard.categories.reduce((sum, category) => sum + category.points, 0)}/{activeLeague.weeklyPointBudget}
                    </p>
                  </div>
                  <p className="text-sm text-white/65">Balanced scoring keeps leagues fair.</p>
                </div>
                <div className="mt-4 h-3 rounded-full bg-white/10">
                  <div
                    className="h-3 rounded-full bg-gold"
                    style={{
                      width: `${Math.min(
                        (dashboard.categories.reduce((sum, category) => sum + category.points, 0) /
                          activeLeague.weeklyPointBudget) *
                          100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {dashboard.categories.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-line bg-white/55 p-4 text-sm text-muted">
                    No categories yet. Add them in weekly setup.
                  </div>
                ) : null}
                {dashboard.categories.map((category) => (
                  <div key={category.id} className="rounded-[1.5rem] border border-line bg-white/55 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold">{category.name}</p>
                        <p className="text-sm text-muted">{category.habitCount} habits this week</p>
                      </div>
                      <div className="rounded-full px-3 py-1 text-sm font-semibold text-foreground" style={{ backgroundColor: category.color }}>
                        {category.points} pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/app/setup"
                className="mt-4 inline-flex rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background transition hover:bg-accent"
              >
                Open planner
              </Link>
            </div>

            <div className="glass rounded-[2rem] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-muted">League leaderboard</p>
                  <h2 className="display-font mt-2 text-3xl tracking-[-0.04em]">This week</h2>
                </div>
                <span className="text-sm font-semibold text-muted">Live from member progress</span>
              </div>
              <div className="mt-5 space-y-3">
                {dashboard.leaderboard.slice(0, 4).map((member) => (
                  <div
                    key={member.userId}
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
              <Link
                href="/app/league"
                className="mt-4 inline-flex rounded-full border border-line bg-white/55 px-4 py-3 text-sm font-semibold transition hover:bg-white/80"
              >
                See standings detail
              </Link>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}

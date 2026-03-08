import { setupDraft } from "@/lib/mock-data";

export default function SetupPage() {
  const totalPoints = setupDraft.reduce(
    (sum, category) =>
      sum + category.habits.reduce((categorySum, habit) => categorySum + habit.points, 0),
    0,
  );

  return (
    <main className="min-h-screen pb-16">
      <section className="glass rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Weekly planning</p>
            <h1 className="display-font mt-2 text-4xl tracking-[-0.05em] sm:text-5xl">
              Shape the week before the league starts moving.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              Categories are personal to each user. The league only compares total earned
              points, so everyone can build a week around their own priorities.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-[#14231c] px-5 py-4 text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-white/60">Allocated</p>
            <p className="mt-2 text-3xl font-semibold">{totalPoints}/100 pts</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {[
            ["1. Pick categories", "Fitness, focus, learning, recovery, or anything custom."],
            ["2. Set goals", "Define a weekly target like 4 sessions or 300 minutes."],
            ["3. Assign points", "Spend up to 100 points so the league stays fair."],
          ].map(([label, text]) => (
            <div key={label} className="rounded-[1.5rem] border border-line bg-white/60 p-4">
              <p className="text-sm font-semibold">{label}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {setupDraft.map((category) => (
            <article key={category.name} className="rounded-[1.75rem] border border-line bg-white/60 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: category.accent }}
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                    <p className="text-sm text-muted">Custom category for this week</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-line bg-white/70 px-4 py-2 text-sm font-semibold"
                >
                  Add habit
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                {category.habits.map((habit) => (
                  <div
                    key={habit.name}
                    className="grid gap-3 rounded-[1.5rem] border border-line bg-[#fff8ee] p-4 sm:grid-cols-[1.2fr_0.9fr_0.4fr]"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">{habit.name}</p>
                      <p className="mt-1 text-sm text-muted">Goal metric placeholder for count or yes/no tracking</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted">Target</p>
                      <p className="mt-1 text-sm font-medium">{habit.target}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted">Points</p>
                      <p className="mt-1 text-sm font-medium">{habit.points}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent"
                >
                  Add another habit
                </button>
                <button
                  type="button"
                  className="rounded-full border border-line bg-white/70 px-4 py-2 text-sm font-semibold"
                >
                  Rename category
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[1.75rem] border border-line bg-white/60 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Scoring rule</p>
            <h2 className="display-font mt-2 text-3xl tracking-[-0.04em]">Progress earns points proportionally.</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              If a habit is worth 20 points and the weekly target is 4 workouts, then 3 workouts earns 15 points.
              That keeps the leaderboard competitive without forcing identical habits.
            </p>
          </div>
          <div className="rounded-[1.75rem] bg-[#1f7a6b] p-5 text-white">
            <p className="text-sm uppercase tracking-[0.24em] text-white/65">Next implementation</p>
            <h2 className="display-font mt-2 text-3xl tracking-[-0.04em]">Real save flow</h2>
            <p className="mt-3 text-sm leading-7 text-white/80">
              This screen is now structured around the real product model. Next we will connect it to Supabase so plans can be created, edited, and copied week to week.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

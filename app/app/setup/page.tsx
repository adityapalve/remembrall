import { setupDraft } from "@/lib/mock-data";

export default function SetupPage() {
  const totalPoints = setupDraft.reduce(
    (sum, category) =>
      sum + category.habits.reduce((categorySum, habit) => categorySum + habit.points, 0),
    0,
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="glass rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Weekly planning</p>
            <h1 className="display-font mt-2 text-4xl tracking-[-0.05em] sm:text-5xl">
              Shape the week before the league starts moving.
            </h1>
          </div>
          <div className="rounded-[1.5rem] bg-[#14231c] px-5 py-4 text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-white/60">Allocated</p>
            <p className="mt-2 text-3xl font-semibold">{totalPoints}/100 pts</p>
          </div>
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
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

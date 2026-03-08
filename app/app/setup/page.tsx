import {
  addCategory,
  addHabit,
  deleteCategory,
  deleteHabit,
  updateCategory,
  updateHabit,
} from "@/app/app/actions";
import { getPlannerState } from "@/lib/planner";

type SetupPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

const metricOptions = [
  { value: "count", label: "Count" },
  { value: "duration_minutes", label: "Minutes" },
  { value: "binary", label: "Yes / no" },
  { value: "steps", label: "Steps" },
  { value: "sleep_hours", label: "Sleep hours" },
];

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const params = await searchParams;
  const planner = await getPlannerState();
  const activeLeague = planner.memberships[0];
  const pointBudget = activeLeague?.weeklyPointBudget ?? 100;

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
            <p className="mt-2 text-3xl font-semibold">{planner.totalPoints}/{pointBudget} pts</p>
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

        {!activeLeague ? (
          <div className="mt-8 rounded-[1.75rem] border border-line bg-white/60 p-5 text-sm text-muted">
            Join or create a league first so your weekly plan has a shared point budget to attach to.
          </div>
        ) : null}

        {activeLeague ? (
          <form action={addCategory} className="mt-8 rounded-[1.75rem] border border-line bg-white/60 p-5">
            <input type="hidden" name="leagueId" value={activeLeague.leagueId} />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground">
                  Add a category
                  <input
                    type="text"
                    name="name"
                    placeholder="Recovery, Nutrition, Writing..."
                    className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-foreground/30"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-accent"
              >
                Add category
              </button>
            </div>
          </form>
        ) : null}

        <div className="mt-8 space-y-4">
          {planner.categories.map((category) => (
            <article key={category.id} className="rounded-[1.75rem] border border-line bg-white/60 p-5">
              <div className="flex items-center justify-between gap-4">
                <form action={updateCategory} className="flex flex-1 items-center gap-3">
                  <input type="hidden" name="categoryId" value={category.id} />
                  <span className="h-4 w-4 rounded-full" style={{ backgroundColor: category.color }} />
                  <input
                    type="text"
                    name="name"
                    defaultValue={category.name}
                    className="min-w-0 flex-1 rounded-2xl border border-line bg-white px-4 py-3 text-base font-semibold outline-none transition focus:border-foreground/30"
                  />
                  <button
                    type="submit"
                    className="rounded-full border border-line bg-white/70 px-4 py-2 text-sm font-semibold"
                  >
                    Save
                  </button>
                </form>
                <form action={deleteCategory}>
                  <input type="hidden" name="categoryId" value={category.id} />
                  <input type="hidden" name="planId" value={planner.planId ?? ""} />
                  <button
                    type="submit"
                    className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
                  >
                    Delete
                  </button>
                </form>
              </div>

              <div className="mt-4 grid gap-3">
                {category.habits.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-line bg-[#fff8ee] p-4 text-sm text-muted">
                    No habits in this category yet. Add one below.
                  </div>
                ) : null}
                {category.habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="grid gap-3 rounded-[1.5rem] border border-line bg-[#fff8ee] p-4 sm:grid-cols-[1.2fr_0.9fr_0.4fr]"
                  >
                    <form action={updateHabit} className="contents">
                      <input type="hidden" name="habitId" value={habit.id} />
                      <input type="hidden" name="planId" value={planner.planId ?? ""} />
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted">Habit</p>
                        <input
                          type="text"
                          name="name"
                          defaultValue={habit.name}
                          className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-foreground/30"
                        />
                        <select
                          name="metricType"
                          defaultValue={habit.metricType}
                          className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-foreground/30"
                        >
                          {metricOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted">Target</p>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          name="targetValue"
                          defaultValue={habit.targetValue}
                          className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-foreground/30"
                        />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted">Points</p>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          name="pointValue"
                          defaultValue={habit.pointValue}
                          className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-foreground/30"
                        />
                      </div>
                      <div className="sm:col-span-3 flex flex-wrap gap-2">
                        <button
                          type="submit"
                          className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent"
                        >
                          Save habit
                        </button>
                      </div>
                    </form>
                    <div className="sm:col-span-3 flex flex-wrap gap-2">
                      <form action={deleteHabit}>
                        <input type="hidden" name="habitId" value={habit.id} />
                        <input type="hidden" name="planId" value={planner.planId ?? ""} />
                        <button
                          type="submit"
                          className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
                        >
                          Delete habit
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>

              <form action={addHabit} className="mt-4 grid gap-3 rounded-[1.5rem] border border-line bg-white/80 p-4 sm:grid-cols-[1.2fr_0.7fr_0.5fr_0.5fr_auto] sm:items-end">
                <input type="hidden" name="categoryId" value={category.id} />
                <input type="hidden" name="planId" value={planner.planId ?? ""} />
                <label className="block text-sm font-medium text-foreground">
                  New habit
                  <input
                    type="text"
                    name="name"
                    placeholder="Morning run"
                    className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-foreground/30"
                  />
                </label>
                <label className="block text-sm font-medium text-foreground">
                  Metric
                  <select
                    name="metricType"
                    defaultValue="count"
                    className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-foreground/30"
                  >
                    {metricOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium text-foreground">
                  Target
                  <input
                    type="number"
                    min="1"
                    step="1"
                    name="targetValue"
                    defaultValue="1"
                    className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-foreground/30"
                  />
                </label>
                <label className="block text-sm font-medium text-foreground">
                  Points
                  <input
                    type="number"
                    min="1"
                    step="1"
                    name="pointValue"
                    defaultValue="10"
                    className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-foreground/30"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background transition hover:bg-accent"
                >
                  Add habit
                </button>
              </form>
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
            <h2 className="display-font mt-2 text-3xl tracking-[-0.04em]">Daily check-offs</h2>
            <p className="mt-3 text-sm leading-7 text-white/80">
              Categories and habits now save into Supabase. Next we will turn each habit into a daily logging flow that updates real league scores.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

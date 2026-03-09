import { getLeagueDashboardData } from "@/lib/league-data";

export default async function LeaguePage() {
  const dashboard = await getLeagueDashboardData();
  const activeLeague = dashboard.activeLeague;
  const leader = dashboard.leaderboard[0];
  const closestGap = dashboard.leaderboard.length > 2
    ? Math.abs(dashboard.leaderboard[1].points - dashboard.leaderboard[2].points)
    : null;
  const mostHabits = dashboard.leaderboard
    .slice()
    .sort((a, b) => b.habitCount - a.habitCount)[0];

  return (
    <main className="min-h-screen pb-16">
      <section className="glass rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">League leaderboard</p>
            <h1 className="display-font mt-2 text-4xl tracking-[-0.05em] sm:text-5xl">
              Weekly standings with real member progress behind every point.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              The board now ranks actual league members by earned weekly points based on the habits and logs they have saved.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-[#14231c] px-5 py-4 text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-white/60">League status</p>
            <p className="mt-2 text-2xl font-semibold">{activeLeague?.leagueName ?? "No league yet"}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          <div className="rounded-[1.5rem] border border-line bg-white/60 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">Current leader</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              {leader ? `${leader.name} ${leader.points}` : "No scores yet"}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted">
              {leader ? leader.note : "Add plans and daily logs to populate the board."}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-line bg-white/60 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">Closest battle</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              {closestGap !== null ? `${closestGap} pts` : "Waiting on more players"}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted">
              {closestGap !== null
                ? "Second and third place are nearly overlapping this week."
                : "More members need to log progress before the race tightens up."}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-line bg-white/60 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">Most planned habits</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              {mostHabits ? `${mostHabits.name} ${mostHabits.habitCount}` : "No plans yet"}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted">
              {mostHabits
                ? "Planning volume is visible too, but only earned points determine rank."
                : "Members need to create their weekly setup first."}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-3">
            {dashboard.leaderboard.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-line bg-white/65 px-5 py-4 text-sm text-muted">
                No leaderboard rows yet. Create a league plan and start logging progress.
              </div>
            ) : null}
            {dashboard.leaderboard.map((member) => (
              <article
                key={member.userId}
                className="rounded-[1.75rem] border border-line bg-white/65 px-5 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="display-font flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-lg font-semibold text-background">
                      {member.rank}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{member.name}</h2>
                      <p className="text-sm text-muted">{member.note}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold tracking-[-0.04em]">{member.points}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">weekly pts</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-line bg-white/60 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-muted">How ranking works</p>
              <p className="mt-3 text-sm leading-7 text-muted">
                Everyone gets the same weekly budget. Earned points scale with progress against each goal, which keeps users comparable even when categories differ.
              </p>
            </div>
            <div className="rounded-[1.75rem] bg-[#f16f42] p-5 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-white/70">Coming next</p>
              <p className="mt-2 text-xl font-semibold">Live rank movement and post-week recap</p>
              <p className="mt-2 text-sm leading-7 text-white/85">
                The board is now real. Next we can add momentum deltas, streak context, and end-of-week summaries.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import { appBoard } from "@/lib/mock-data";

const momentum = [
  {
    label: "Fast riser",
    value: "Noah +11",
    note: "Biggest gain since Tuesday after catching up on recovery habits.",
  },
  {
    label: "Closest battle",
    value: "#2 vs #3",
    note: "Only 5 points separate second and third right now.",
  },
  {
    label: "Most completed",
    value: "Maya 13/15",
    note: "Leading by consistency, not just one oversized goal.",
  },
];

export default function LeaguePage() {
  return (
    <main className="min-h-screen pb-16">
      <section className="glass rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">League leaderboard</p>
            <h1 className="display-font mt-2 text-4xl tracking-[-0.05em] sm:text-5xl">
              Weekly standings with enough tension to keep people logging.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              This view is where league momentum will live: rank movement, closing gaps, and who still has big point swings left.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-[#14231c] px-5 py-4 text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-white/60">League status</p>
            <p className="mt-2 text-2xl font-semibold">Midweek sprint</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {momentum.map((item) => (
            <div key={item.label} className="rounded-[1.5rem] border border-line bg-white/60 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{item.value}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{item.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-3">
            {appBoard.leaderboard.map((member) => (
              <article
                key={member.name}
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
                Once leaderboard rows are backed by Supabase, this page becomes the competitive heart of the app.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

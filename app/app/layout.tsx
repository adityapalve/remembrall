import Link from "next/link";
import { redirect } from "next/navigation";

import { getViewerContext } from "@/lib/league";
import { signOut } from "@/app/join/actions";

const navItems = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/setup", label: "Weekly setup" },
  { href: "/app/league", label: "Leaderboard" },
];

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, memberships, isDevBypass } = await getViewerContext();

  if (!user) {
    redirect("/join");
  }

  const label =
    user.user_metadata.display_name ?? user.email?.split("@")[0] ?? "League player";
  const activeLeague = memberships[0];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-6 lg:px-8">
      <header className="glass sticky top-4 z-20 mb-6 rounded-[1.75rem] px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/" className="display-font text-2xl tracking-[-0.05em]">
              Habit League
            </Link>
            <p className="mt-1 text-sm text-muted">Welcome back, {label}.</p>
            <p className="mt-1 text-sm text-muted">
              {activeLeague
                ? `${activeLeague.leagueName} - invite ${activeLeague.inviteCode}`
                : "Create your first private league to unlock weekly planning."}
            </p>
            {isDevBypass ? (
              <p className="mt-1 text-sm text-amber-700">
                Dev bypass mode is active. Real writes still require a real session.
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-line bg-white/55 px-4 py-2 text-sm font-semibold transition hover:bg-white/80"
              >
                {item.label}
              </Link>
            ))}
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

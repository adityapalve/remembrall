export function slugifyInviteCode(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export function createInviteCode(seed: string) {
  const base = slugifyInviteCode(seed).replace(/-/g, "");
  const prefix = (base || "LEAGUE").slice(0, 6);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `${prefix}-${suffix}`;
}

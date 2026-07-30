/**
 * Parse board card dates like `7/28`, `07/28`, `7/28/2026`.
 * Returns days since that date (0 = today). null if unparseable.
 */
export function daysSinceDate(
  raw: string | undefined,
  now = new Date(),
): number | null {
  if (!raw?.trim()) return null;
  const s = raw.trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (!m) return null;
  const month = Number(m[1]);
  const day = Number(m[2]);
  let year = m[3] ? Number(m[3]) : now.getFullYear();
  if (year < 100) year += 2000;

  const d = new Date(year, month - 1, day);
  if (Number.isNaN(d.getTime())) return null;

  // If no year and date is far in the future (>60d), treat as last year
  if (!m[3]) {
    const ahead = (d.getTime() - now.getTime()) / (86400 * 1000);
    if (ahead > 60) d.setFullYear(year - 1);
  }

  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startThat = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.floor(
    (startToday.getTime() - startThat.getTime()) / (86400 * 1000),
  );
  return diff;
}

/** Tailwind classes for date text by age */
export function staleDateClass(days: number | null): string {
  if (days == null) return "text-[var(--faint)]";
  if (days >= 7) return "font-semibold text-[var(--urgent)]";
  if (days >= 3) return "font-semibold text-[var(--action-ink)]";
  return "text-[var(--faint)]";
}

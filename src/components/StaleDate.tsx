import { daysSinceDate, staleDateClass } from "@/lib/date-stale";

/** Semantic date: warn when card has not been updated for 3+ / 7+ days */
export default function StaleDate({ date }: { date?: string }) {
  if (!date) return null;
  const days = daysSinceDate(date);
  const cls = staleDateClass(days);
  const tip =
    days == null
      ? date
      : days <= 0
        ? "今天"
        : days === 1
          ? "1 天前"
          : `${days} 天前`;

  return (
    <time
      className={`shrink-0 text-[11px] tabular-nums ${cls}`}
      dateTime={date}
      title={tip}
    >
      {date}
      {days != null && days >= 3 ? (
        <span className="ml-1 opacity-80">·{days}d</span>
      ) : null}
    </time>
  );
}

"use client";

/** Split people string into distinct touch-friendly pills */
export default function ContactPills({
  people,
  compact = false,
}: {
  people: string;
  compact?: boolean;
}) {
  const parts = people
    .split(/[/|、,;]+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {parts.slice(0, compact ? 3 : 8).map((p) => {
        const initial = p.charAt(0).toUpperCase();
        return (
          <span
            key={p}
            className="inline-flex min-h-[28px] max-w-full items-center gap-1.5 truncate rounded-full border border-[var(--line)] bg-[var(--surface-2)] py-0.5 pl-1 pr-2.5 text-[12px] font-medium leading-none text-[var(--ink)]/85"
            title={p}
          >
            <span
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[10px] font-bold text-[var(--primary)]"
              aria-hidden
            >
              {initial}
            </span>
            <span className="truncate">{p}</span>
          </span>
        );
      })}
      {compact && parts.length > 3 && (
        <span className="inline-flex min-h-[28px] items-center text-[11px] text-[var(--faint)]">
          +{parts.length - 3}
        </span>
      )}
    </div>
  );
}

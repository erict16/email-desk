"use client";

/** Split people string into distinct pills */
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
      {parts.slice(0, compact ? 3 : 8).map((p) => (
        <span
          key={p}
          className="inline-flex max-w-full truncate rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-2 py-0.5 text-[11px] font-medium text-[var(--mute)]"
          title={p}
        >
          {p}
        </span>
      ))}
      {compact && parts.length > 3 && (
        <span className="text-[11px] text-[var(--faint)]">
          +{parts.length - 3}
        </span>
      )}
    </div>
  );
}

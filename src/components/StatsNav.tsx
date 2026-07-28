"use client";

import { scrollToHash } from "@/lib/smooth-scroll";

export type StatTone = "urgent" | "follow" | "orders";

export type StatItem = {
  key: string;
  id: string;
  label: string;
  tone: StatTone;
  value: number;
};

const TONE: Record<StatTone, string> = {
  urgent: "var(--urgent)",
  follow: "var(--follow)",
  orders: "var(--orders)",
};

export default function StatsNav({ stats }: { stats: StatItem[] }) {
  return (
    <section
      className="mb-6 overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)]"
      aria-label="总览"
    >
      <div
        className="grid divide-x divide-[var(--line)]"
        style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
      >
        {stats.map((s) => (
          <a
            key={s.key}
            href={`#${s.id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToHash(`#${s.id}`, 280);
              history.replaceState(null, "", `#${s.id}`);
            }}
            className="flex flex-col items-start gap-1 px-3 py-3.5 transition-colors duration-150 hover:bg-[var(--paper-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-inset sm:px-4"
          >
            <span
              className="text-[1.6rem] font-semibold leading-none tracking-tight tabular-nums sm:text-[1.75rem]"
              style={{ color: TONE[s.tone] }}
            >
              {s.value}
            </span>
            <span className="text-[11px] font-medium text-[var(--muted)]">
              {s.label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

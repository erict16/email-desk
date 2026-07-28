"use client";

import { scrollToHash } from "@/lib/smooth-scroll";

export type StatTone = "urgent" | "follow" | "orders" | "info";

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
  info: "var(--info)",
};

export default function StatsNav({ stats }: { stats: StatItem[] }) {
  return (
    <section
      className="mb-8 overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] shadow-[var(--shadow-whisper)]"
      aria-label="总览"
    >
      <div className="grid grid-cols-4 divide-x divide-[var(--line)]">
        {stats.map((s) => (
          <a
            key={s.key}
            href={`#${s.id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToHash(`#${s.id}`, 280);
              history.replaceState(null, "", `#${s.id}`);
            }}
            className="group flex flex-col items-start gap-1 px-3 py-3.5 transition-colors duration-150 hover:bg-[var(--paper-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-inset sm:px-4 sm:py-4"
          >
            <span
              className="text-[1.65rem] font-semibold leading-none tracking-tight tabular-nums sm:text-[1.85rem]"
              style={{ color: TONE[s.tone] }}
            >
              {s.value}
            </span>
            <span className="text-[10px] font-medium leading-tight text-[var(--muted)] sm:text-[11px]">
              {s.label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

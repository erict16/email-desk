"use client";

import { scrollToHash } from "@/lib/smooth-scroll";

export type StatTone = "urgent" | "follow" | "done" | "info";

export type StatItem = {
  key: string;
  id: string;
  label: string;
  tone: StatTone;
  value: number;
};

const TONE_NUM: Record<StatTone, string> = {
  urgent: "text-[var(--urgent)]",
  follow: "text-[var(--follow)]",
  done: "text-[var(--done)]",
  info: "text-[var(--info)]",
};

const TONE_HOVER: Record<StatTone, string> = {
  urgent:
    "hover:-translate-y-0.5 hover:border-[var(--urgent-border)] hover:bg-[var(--urgent-soft)] hover:shadow-md",
  follow:
    "hover:-translate-y-0.5 hover:border-[var(--follow-border)] hover:bg-[var(--follow-soft)] hover:shadow-md",
  done:
    "hover:-translate-y-0.5 hover:border-[var(--done-border)] hover:bg-[var(--done-soft)] hover:shadow-md",
  info:
    "hover:-translate-y-0.5 hover:border-[var(--info-border)] hover:bg-[var(--info-soft)] hover:shadow-md",
};

export default function StatsNav({ stats }: { stats: StatItem[] }) {
  return (
    <section
      className="mb-7 grid grid-cols-4 gap-2.5 sm:gap-3"
      aria-label="总览"
    >
      {stats.map((s) => (
        <a
          key={s.key}
          href={`#${s.id}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToHash(`#${s.id}`, 280);
            // keep URL in sync without native jump
            history.replaceState(null, "", `#${s.id}`);
          }}
          className={`rounded-xl border border-[var(--line)] bg-[var(--card)] px-2 py-3.5 text-center sm:px-3 transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40 active:scale-[0.98] ${TONE_HOVER[s.tone]}`}
        >
          <div
            className={`text-[1.85rem] font-bold leading-none tracking-tight tabular-nums ${TONE_NUM[s.tone]}`}
          >
            {s.value}
          </div>
          <div className="mt-1.5 text-[10px] font-medium leading-tight text-[var(--muted)] sm:text-[11px]">
            {s.label}
          </div>
        </a>
      ))}
    </section>
  );
}

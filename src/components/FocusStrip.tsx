"use client";

import { scrollToHash } from "@/lib/smooth-scroll";

export type FocusStats = {
  urgent: number;
  today: number;
  later: number;
  orders: number;
};

type Chip = {
  key: string;
  label: string;
  value: number;
  href: string;
  tone: "urgent" | "follow" | "orders" | "later";
};

const TONE: Record<Chip["tone"], string> = {
  urgent: "var(--urgent)",
  follow: "var(--follow)",
  orders: "var(--pipe)",
  later: "var(--mute)",
};

/**
 * Focus strip: meetings dock + jump chips for Today / Pipeline / Later.
 * Replaces the old StatsNav triage grid.
 */
export default function FocusStrip({
  meetings,
  stats,
}: {
  meetings: string[];
  stats: FocusStats;
}) {
  const chips: Chip[] = [
    {
      key: "urgent",
      label: "紧急",
      value: stats.urgent,
      href: "#today",
      tone: "urgent",
    },
    {
      key: "today",
      label: "今日",
      value: stats.today,
      href: "#today",
      tone: "follow",
    },
    {
      key: "pipeline",
      label: "管线",
      value: stats.orders,
      href: "#pipeline",
      tone: "orders",
    },
    {
      key: "later",
      label: "稍后",
      value: stats.later,
      href: "#later",
      tone: "later",
    },
  ];

  return (
    <section
      className="mb-6 overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)]"
      aria-label="焦点"
    >
      {meetings.length > 0 && (
        <div className="border-b border-[var(--line)] px-3.5 py-3 sm:px-4">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">
            会
          </div>
          <ul className="flex flex-col gap-1.5 text-[13px] leading-snug text-[var(--ink)]">
            {meetings.map((m, i) => (
              <li key={i} className="flex gap-2">
                <span
                  className="mt-[0.4em] h-1 w-1 shrink-0 rounded-full bg-[var(--ink)]"
                  aria-hidden
                />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className="grid divide-x divide-[var(--line)]"
        style={{
          gridTemplateColumns: `repeat(${chips.length}, minmax(0, 1fr))`,
        }}
      >
        {chips.map((c) => (
          <a
            key={c.key}
            href={c.href}
            onClick={(e) => {
              e.preventDefault();
              scrollToHash(c.href, 280);
              history.replaceState(null, "", c.href);
            }}
            className="flex flex-col items-start gap-1.5 px-3 py-3.5 transition-colors duration-150 hover:bg-[var(--paper-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-inset sm:px-3.5 sm:py-4"
          >
            <span
              className="text-[1.5rem] font-semibold leading-none tracking-tight tabular-nums sm:text-[1.65rem]"
              style={{ color: TONE[c.tone] }}
            >
              {c.value}
            </span>
            <span className="text-[11px] font-medium leading-none text-[var(--muted)]">
              {c.label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

"use client";

import { scrollToHash } from "@/lib/smooth-scroll";

export type FocusStats = {
  mine: number;
  waiting: number;
  later: number;
  orders: number;
};

type Chip = {
  key: string;
  label: string;
  value: number;
  href: string;
  tone: "mine" | "wait" | "orders" | "later";
};

const TONE: Record<Chip["tone"], { num: string; bar: string }> = {
  mine: { num: "var(--urgent)", bar: "var(--urgent)" },
  wait: { num: "var(--wait-ink)", bar: "var(--line-strong)" },
  orders: { num: "var(--pipe)", bar: "var(--pipe)" },
  later: { num: "var(--mute)", bar: "var(--line)" },
};

/**
 * Focus strip: meetings dock + four jump chips.
 * Open layout on cool desk — not a heavy stats card wall.
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
      key: "mine",
      label: "要我动",
      value: stats.mine,
      href: "#mine",
      tone: "mine",
    },
    {
      key: "wait",
      label: "等待",
      value: stats.waiting,
      href: "#wait",
      tone: "wait",
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
    <section className="mb-8 space-y-3" aria-label="焦点">
      {meetings.length > 0 && (
        <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-3.5 py-3 sm:px-4">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--signal)]"
              aria-hidden
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--faint)]">
              本周会议
            </span>
          </div>
          <ul className="flex flex-col gap-1.5 text-[13px] leading-snug text-[var(--ink)]">
            {meetings.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      <div
        className="grid gap-2"
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
            className="group relative overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-3 py-3 transition-[border-color,box-shadow] duration-150 hover:border-[var(--line-strong)] hover:shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] sm:px-3.5 sm:py-3.5"
          >
            <span
              className="absolute inset-x-0 top-0 h-0.5"
              style={{ background: TONE[c.tone].bar }}
              aria-hidden
            />
            <span
              className="block text-[1.65rem] font-semibold leading-none tracking-tight tabular-nums sm:text-[1.75rem]"
              style={{ color: TONE[c.tone].num }}
            >
              {c.value}
            </span>
            <span className="mt-2 block text-[11px] font-medium leading-none text-[var(--mute)]">
              {c.label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

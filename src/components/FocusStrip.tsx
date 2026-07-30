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
  emphasize?: boolean;
};

/** Compact counter row — Hub-calm, not tall dashboard tiles. */
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
      emphasize: true,
    },
    { key: "wait", label: "等待", value: stats.waiting, href: "#wait" },
    {
      key: "pipeline",
      label: "管线",
      value: stats.orders,
      href: "#pipeline",
    },
    { key: "later", label: "稍后", value: stats.later, href: "#later" },
  ];

  return (
    <section className="mb-8 space-y-4" aria-label="焦点">
      {meetings.length > 0 && (
        <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-4 py-3.5">
          <div className="mb-2 text-[11px] font-medium tracking-wide text-[var(--faint)]">
            本周会议
          </div>
          <ul className="flex flex-col gap-2 text-[13px] leading-relaxed text-[var(--ink)]">
            {meetings.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      <div
        className="grid overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)]"
        style={{
          gridTemplateColumns: `repeat(${chips.length}, minmax(0, 1fr))`,
        }}
      >
        {chips.map((c, i) => (
          <a
            key={c.key}
            href={c.href}
            onClick={(e) => {
              e.preventDefault();
              scrollToHash(c.href, 280);
              history.replaceState(null, "", c.href);
            }}
            className={`flex flex-col gap-1.5 px-3 py-3.5 hover:bg-[var(--paper-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus)] sm:px-4 ${
              i > 0 ? "border-l border-[var(--line)]" : ""
            }`}
          >
            <span
              className={`text-[1.375rem] font-semibold leading-none tabular-nums tracking-tight ${
                c.emphasize ? "text-[var(--urgent)]" : "text-[var(--ink)]"
              }`}
            >
              {c.value}
            </span>
            <span className="text-[11px] font-medium leading-none text-[var(--mute)]">
              {c.label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

import type { Priority } from "@/lib/parse-board";

/** Compact priority chip — minimal footprint */
const MAP: Record<Priority, { label: string; cls: string }> = {
  P0: {
    label: "急",
    cls: "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900",
  },
  P1: {
    label: "跟",
    cls: "bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100",
  },
  P2: {
    label: "技",
    cls: "bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700",
  },
  OK: {
    label: "完",
    cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  FYI: {
    label: "知",
    cls: "text-neutral-400 ring-1 ring-neutral-200 dark:ring-neutral-700",
  },
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  const m = MAP[priority];
  return (
    <span
      title={priority}
      className={`inline-flex h-5 min-w-5 items-center justify-center rounded px-1 text-[10px] font-bold leading-none ${m.cls}`}
    >
      {m.label}
    </span>
  );
}

import type { Priority } from "@/lib/parse-board";

const STYLES: Record<Priority, string> = {
  P0: "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900",
  P1: "bg-neutral-700 text-white dark:bg-neutral-200 dark:text-neutral-900",
  P2: "border border-neutral-300 text-neutral-700 dark:border-neutral-600 dark:text-neutral-200",
  OK: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
  FYI: "border border-dashed border-neutral-300 text-neutral-500 dark:border-neutral-600 dark:text-neutral-400",
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${STYLES[priority]}`}
    >
      {priority}
    </span>
  );
}

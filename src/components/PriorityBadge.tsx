import type { Priority } from "@/lib/parse-board";

const STYLES: Record<Priority, string> = {
  P0: "bg-rose-500 text-white shadow-sm shadow-rose-500/30",
  P1: "bg-amber-500 text-white shadow-sm shadow-amber-500/25",
  P2: "bg-sky-500 text-white shadow-sm shadow-sky-500/25",
  OK: "bg-emerald-500 text-white shadow-sm shadow-emerald-500/25",
  FYI: "bg-slate-400/90 text-white shadow-sm",
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

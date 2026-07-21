import type { Priority } from "@/lib/parse-board";

const STYLES: Record<Priority, string> = {
  P0: "bg-rose-500/90 text-white shadow-rose-500/30",
  P1: "bg-orange-500/90 text-white shadow-orange-500/25",
  P2: "bg-sky-500/90 text-white shadow-sky-500/25",
  OK: "bg-emerald-500/90 text-white shadow-emerald-500/25",
  FYI: "bg-slate-500/80 text-white shadow-slate-500/20",
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide shadow-sm ${STYLES[priority]}`}
    >
      {priority}
    </span>
  );
}

import type { BoardItem } from "@/lib/parse-board";
import PriorityBadge from "@/components/PriorityBadge";

export default function Card({ item }: { item: BoardItem }) {
  return (
    <article className="group rounded-2xl border border-white/40 bg-white/55 p-3.5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/70 hover:shadow-[0_12px_36px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-white/8 dark:hover:bg-white/12">
      <div className="flex items-start gap-2.5">
        <PriorityBadge priority={item.priority} />
        <div className="min-w-0 flex-1">
          <h3 className="text-[0.95rem] font-semibold leading-snug text-slate-900 dark:text-slate-50">
            {item.title}
          </h3>
          {item.meta && (
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {item.meta}
            </p>
          )}
          {item.action && (
            <p className="mt-2 text-[0.86rem] leading-relaxed text-slate-700 dark:text-slate-200">
              <span className="font-semibold text-teal-700 dark:text-teal-300">
                做什么 ·{" "}
              </span>
              {item.action}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

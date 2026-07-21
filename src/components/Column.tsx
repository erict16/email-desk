import type { BoardColumn } from "@/lib/parse-board";
import Card from "@/components/Card";

const COL_ACCENT: Record<string, string> = {
  todo: "from-rose-400/30 to-orange-300/10",
  done: "from-emerald-400/25 to-teal-300/10",
  fyi: "from-slate-400/25 to-sky-300/10",
};

const COL_DOT: Record<string, string> = {
  todo: "bg-rose-500",
  done: "bg-emerald-500",
  fyi: "bg-slate-400",
};

export default function Column({ column }: { column: BoardColumn }) {
  const accent = COL_ACCENT[column.id] || "from-sky-400/20 to-indigo-300/10";
  const dot = COL_DOT[column.id] || "bg-sky-500";

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col rounded-3xl border border-white/50 bg-white/35 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.06]">
      <header
        className={`rounded-t-3xl border-b border-white/40 bg-gradient-to-r ${accent} px-4 py-3.5 dark:border-white/10`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
            <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {column.title}
            </h2>
          </div>
          <span className="rounded-full bg-white/60 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-slate-600 dark:bg-white/10 dark:text-slate-300">
            {column.items.length}
          </span>
        </div>
        {column.id === "todo" && (
          <p className="mt-1 text-[11px] text-slate-600/90 dark:text-slate-400">
            每张卡片底部写清「做什么」
          </p>
        )}
      </header>

      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-3 sm:p-3.5">
        {column.items.length === 0 ? (
          <p className="px-1 py-6 text-center text-sm text-slate-400">暂无</p>
        ) : (
          column.items.map((item, i) => (
            <Card key={`${column.id}-${i}-${item.title}`} item={item} />
          ))
        )}
      </div>
    </section>
  );
}

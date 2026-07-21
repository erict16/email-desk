import type { BoardItem } from "@/lib/parse-board";

/** WorkBuddy-like soft tag colors by simple hash */
const TAG_STYLES = [
  "bg-rose-100 text-rose-800",
  "bg-amber-100 text-amber-900",
  "bg-sky-100 text-sky-800",
  "bg-violet-100 text-violet-800",
  "bg-emerald-100 text-emerald-800",
  "bg-orange-100 text-orange-900",
];

function tagClass(label: string): string {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h + label.charCodeAt(i) * (i + 1)) % 997;
  return TAG_STYLES[h % TAG_STYLES.length];
}

export default function Card({
  item,
  index,
}: {
  item: BoardItem;
  index: number;
}) {
  const isDone = item.priority === "OK";
  const isP0 = item.priority === "P0";

  return (
    <article
      className={`rounded-xl border border-neutral-200/90 bg-white px-4 py-3.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 ${
        isP0 ? "border-l-[3px] border-l-rose-500" : ""
      } ${isDone ? "opacity-70" : ""}`}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-[0.95rem] font-semibold leading-snug text-neutral-900 dark:text-neutral-50">
          <span className="mr-1.5 font-semibold tabular-nums text-neutral-400">
            {index}.
          </span>
          {item.title}
        </h3>
        {item.date && (
          <span className="shrink-0 pt-0.5 text-[11px] tabular-nums text-neutral-400">
            {item.date}
          </span>
        )}
      </div>

      {/* Meta / body */}
      {item.meta && (
        <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          {item.meta}
        </p>
      )}

      {/* Tags — WorkBuddy style pills */}
      {item.tags && item.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <span
              key={t}
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${tagClass(t)}`}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* People */}
      {item.people && (
        <p className="mt-1.5 text-[12px] text-neutral-500 dark:text-neutral-400">
          发件人：{item.people}
        </p>
      )}

      {/* 待办 — soft yellow bar like WorkBuddy */}
      {item.action && (
        <div className="mt-2.5 rounded-lg border border-amber-200/80 bg-amber-50 px-3 py-2.5 text-[13px] leading-relaxed text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
          <span className="font-semibold text-amber-900 dark:text-amber-200">
            待办：
          </span>
          {item.action}
        </div>
      )}
    </article>
  );
}

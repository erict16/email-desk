"use client";

import { motion } from "framer-motion";
import type { BoardItem } from "@/lib/board-types";
import { isWaitingItem } from "@/lib/board-types";
import CopyTitle from "@/components/CopyTitle";
import SegmentProgress from "@/components/SegmentProgress";
import { tagClass } from "@/lib/tag-class";
import { Building2 } from "lucide-react";

export default function OrderCard({
  item,
  index,
  triageHref,
  compact = false,
}: {
  item: BoardItem;
  index: number;
  triageHref?: "#mine" | "#wait" | "#later";
  compact?: boolean;
}) {
  const showWait = isWaitingItem(item);
  const waitLine = item.wait?.trim();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.02, 0.15) }}
      className={`group rounded-xl border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition-all duration-200 hover:border-[var(--primary)]/30 hover:shadow-[var(--shadow-hover)] ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="flex flex-col gap-3">
        <div className="min-w-0">
          <div className="flex items-start gap-1">
            <h3
              className="min-w-0 select-text text-[14px] font-semibold leading-snug tracking-tight text-[var(--ink)]"
              title="可复制标题 → 邮箱搜索"
            >
              {item.title}
            </h3>
            <CopyTitle title={item.title} />
          </div>
          {item.customer && (
            <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[var(--mute)]">
              <Building2 size={12} className="shrink-0 opacity-60" aria-hidden />
              {item.customer}
            </p>
          )}
        </div>

        {item.stage && <SegmentProgress current={item.stage} />}

        {item.action && (
          <p className="rounded-lg bg-[var(--pipe-soft)] px-3 py-2 text-[13px] leading-snug text-[var(--primary-ink)]">
            <span className="font-semibold">卡点 · </span>
            {item.action}
          </p>
        )}

        {(showWait && waitLine) ||
        item.tags?.length ||
        item.people ||
        item.meta ||
        triageHref ? (
          <div className="flex flex-col gap-2">
            {showWait && waitLine && (
              <p className="text-[12px] text-[var(--wait-ink)]">
                <span className="font-medium">等待 · </span>
                {waitLine}
              </p>
            )}
            {item.tags && item.tags.length > 0 && !compact && (
              <div className="flex flex-wrap gap-1.5">
                {item.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className={`inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-medium ${tagClass(t)}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            {item.meta && !compact && (
              <p className="line-clamp-1 text-[12px] text-[var(--mute)]">
                {item.meta}
              </p>
            )}
            {triageHref && (
              <a
                href={triageHref}
                className="text-[12px] font-medium text-[var(--mute)] hover:text-[var(--primary)]"
              >
                {triageHref === "#wait" ? "等对方有跟进" : "有待办"}
              </a>
            )}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

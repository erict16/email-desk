"use client";

import { motion } from "framer-motion";
import type { BoardItem } from "@/lib/board-types";
import { isWaitingItem } from "@/lib/board-types";
import { formatShareBrief } from "@/lib/blocker-classify";
import ContactPills from "@/components/ContactPills";
import SegmentProgress from "@/components/SegmentProgress";
import StaleDate from "@/components/StaleDate";
import { tagClass } from "@/lib/tag-class";
import { useToast, copyText } from "@/components/ToastProvider";
import { Building2, Check, Circle, Share2 } from "lucide-react";

export default function OrderCard({
  item,
  index,
  triageHref,
  compact = false,
  done = false,
  onToggleDone,
}: {
  item: BoardItem;
  index: number;
  triageHref?: "#mine" | "#wait" | "#later";
  compact?: boolean;
  done?: boolean;
  onToggleDone?: () => void;
}) {
  const { toast } = useToast();
  const showWait = isWaitingItem(item);
  const waitLine = item.wait?.trim();

  const onCopyTitle = async () => {
    const ok = await copyText(item.title);
    toast(ok ? "已复制标题 · 可贴到邮箱搜索" : "复制失败");
  };

  const onShareBrief = async () => {
    const brief = formatShareBrief(item, showWait ? "wait" : "order");
    const ok = await copyText(brief);
    toast(ok ? "已复制简报" : "复制失败");
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: done ? 0.45 : 1, y: 0 }}
      transition={{ duration: 0.18, delay: Math.min(index * 0.015, 0.1) }}
      className={`group rounded-xl border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-150 hover:border-[var(--line-strong)] hover:shadow-[var(--shadow-hover)] ${
        compact ? "p-3" : "p-3.5 sm:p-4"
      } ${done ? "opacity-50 grayscale-[30%]" : ""}`}
    >
      <div className="flex flex-col gap-2.5 sm:gap-3">
        <div className="flex items-start gap-2">
          {onToggleDone && (
            <button
              type="button"
              onClick={onToggleDone}
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--faint)] hover:bg-[var(--surface-2)] hover:text-[var(--primary)] sm:h-8 sm:w-8"
              aria-label={done ? "取消勾选" : "本地勾选完成"}
            >
              {done ? (
                <Check size={17} className="text-[var(--primary)]" />
              ) : (
                <Circle size={17} />
              )}
            </button>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
              <button
                type="button"
                onClick={onCopyTitle}
                className="min-w-0 break-words text-left text-[14px] font-semibold leading-snug tracking-tight text-[var(--ink)] hover:text-[var(--primary)] hover:underline"
                title="点击复制标题 → 邮箱搜索"
              >
                {item.title}
              </button>
              <StaleDate date={item.date} />
            </div>
            {item.customer && (
              <p className="mt-1.5 flex items-center gap-1.5 text-[12px] font-medium text-[var(--mute)]">
                <Building2
                  size={12}
                  className="shrink-0 opacity-60"
                  aria-hidden
                />
                {item.customer}
              </p>
            )}
          </div>
        </div>

        {item.stage && <SegmentProgress current={item.stage} />}

        {item.action && (
          <p className="rounded-lg bg-[var(--pipe-soft)] px-3 py-2 text-[13px] leading-snug text-[var(--primary-ink)]">
            <span className="font-semibold">卡点 · </span>
            {item.action}
          </p>
        )}

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
                  className={`inline-flex min-h-[28px] items-center rounded-md px-2.5 py-1 text-[12px] font-medium ${tagClass(t)}`}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          {item.people && !compact && (
            <ContactPills people={item.people} compact />
          )}
          {item.meta && !compact && (
            <p className="line-clamp-1 text-[12px] text-[var(--mute)]">
              {item.meta}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-1">
            {triageHref && (
              <a
                href={triageHref}
                className="inline-flex min-h-[36px] items-center rounded-md px-2 text-[12px] font-medium text-[var(--mute)] hover:bg-[var(--surface-2)] hover:text-[var(--primary)]"
              >
                {triageHref === "#wait" ? "等对方有跟进" : "有待办"}
              </a>
            )}
            <button
              type="button"
              onClick={onShareBrief}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md px-2 text-[12px] font-medium text-[var(--mute)] hover:bg-[var(--surface-2)] hover:text-[var(--primary)]"
            >
              <Share2 size={14} />
              复制简报
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

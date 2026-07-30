"use client";

import { motion } from "framer-motion";
import type { BoardItem } from "@/lib/board-types";
import { isWaitingItem } from "@/lib/board-types";
import { formatShareBrief } from "@/lib/blocker-classify";
import ContactPills from "@/components/ContactPills";
import SegmentProgress from "@/components/SegmentProgress";
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
    toast(ok ? "Copied for email search!" : "复制失败");
  };

  const onShareBrief = async () => {
    const brief = formatShareBrief(
      item,
      showWait ? "wait" : "order",
    );
    const ok = await copyText(brief);
    toast(ok ? "Brief copied for Slack/Teams" : "复制失败");
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: done ? 0.45 : 1, y: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.02, 0.15) }}
      className={`group rounded-xl border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition-all duration-200 hover:border-[var(--primary)]/30 hover:shadow-[var(--shadow-hover)] ${
        compact ? "p-3" : "p-4"
      } ${done ? "opacity-50 grayscale-[30%]" : ""}`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-2">
          {onToggleDone && (
            <button
              type="button"
              onClick={onToggleDone}
              className="mt-0.5 shrink-0 text-[var(--faint)] hover:text-[var(--primary)]"
              aria-label={done ? "取消勾选" : "本地勾选完成"}
            >
              {done ? (
                <Check size={15} className="text-[var(--primary)]" />
              ) : (
                <Circle size={15} />
              )}
            </button>
          )}
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={onCopyTitle}
              className="min-w-0 text-left text-[14px] font-semibold leading-snug tracking-tight text-[var(--ink)] hover:text-[var(--primary)] hover:underline"
              title="点击复制标题 → 邮箱搜索"
            >
              {item.title}
            </button>
            {item.customer && (
              <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[var(--mute)]">
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
                  className={`inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-medium ${tagClass(t)}`}
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
          <div className="flex flex-wrap items-center gap-3">
            {triageHref && (
              <a
                href={triageHref}
                className="text-[12px] font-medium text-[var(--mute)] hover:text-[var(--primary)]"
              >
                {triageHref === "#wait" ? "等对方有跟进" : "有待办"}
              </a>
            )}
            <button
              type="button"
              onClick={onShareBrief}
              className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--mute)] hover:text-[var(--primary)]"
            >
              <Share2 size={12} />
              Share Brief
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

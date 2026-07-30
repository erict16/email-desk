"use client";

import { motion } from "framer-motion";
import type { BoardItem } from "@/lib/board-types";
import { formatShareBrief } from "@/lib/blocker-classify";
import ContactPills from "@/components/ContactPills";
import { tagClass } from "@/lib/tag-class";
import { useToast, copyText } from "@/components/ToastProvider";
import {
  ArrowRight,
  Check,
  Circle,
  Share2,
} from "lucide-react";

export default function ActionCard({
  item,
  index,
  urgent = false,
  tone = "act",
  linkedStage,
  done = false,
  onToggleDone,
}: {
  item: BoardItem;
  index: number;
  urgent?: boolean;
  tone?: "act" | "wait";
  linkedStage?: string;
  done?: boolean;
  onToggleDone?: () => void;
}) {
  const { toast } = useToast();
  const isWait = tone === "wait";
  const spineText = isWait
    ? item.wait?.trim() || item.action
    : item.action;

  const onCopyTitle = async () => {
    const ok = await copyText(item.title);
    toast(ok ? "Copied for email search!" : "复制失败");
  };

  const onShareBrief = async () => {
    const brief = formatShareBrief(item, isWait ? "wait" : "act");
    const ok = await copyText(brief);
    toast(ok ? "Brief copied for Slack/Teams" : "复制失败");
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: done ? 0.45 : 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.2) }}
      className={`group rounded-xl border bg-[var(--surface)] p-4 shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-hover)] hover:border-[var(--primary)]/30 ${
        urgent && !done
          ? "border-l-[3px] border-l-[var(--urgent)] border-[var(--line)]"
          : "border-[var(--line)]"
      } ${done ? "opacity-50 grayscale-[30%]" : ""}`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-2">
          {onToggleDone && (
            <button
              type="button"
              onClick={onToggleDone}
              className="mt-0.5 shrink-0 rounded-md p-0.5 text-[var(--faint)] hover:text-[var(--primary)]"
              aria-label={done ? "取消勾选" : "本地勾选完成"}
              title={done ? "取消勾选" : "本地勾选（仅此设备）"}
            >
              {done ? (
                <Check size={16} className="text-[var(--primary)]" />
              ) : (
                <Circle size={16} />
              )}
            </button>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <button
                type="button"
                onClick={onCopyTitle}
                className="min-w-0 text-left text-[15px] font-semibold leading-snug tracking-tight text-[var(--ink)] underline-offset-2 hover:text-[var(--primary)] hover:underline"
                title="点击复制标题 → 邮箱搜索"
              >
                {item.title}
              </button>
              {item.date && (
                <time className="shrink-0 text-[11px] tabular-nums text-[var(--faint)]">
                  {item.date}
                </time>
              )}
            </div>
          </div>
        </div>

        {spineText && (
          <p
            className={`rounded-lg px-3 py-2.5 text-[13px] leading-snug ${
              isWait
                ? "bg-[var(--wait-soft)] text-[var(--wait-ink)]"
                : "bg-[var(--action-soft)] text-[var(--action-ink)]"
            }`}
          >
            <span className="font-semibold">
              {isWait ? "等待 · " : "待办 · "}
            </span>
            {spineText}
          </p>
        )}

        <div className="flex flex-col gap-2">
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
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
          {item.people && <ContactPills people={item.people} />}
          {item.meta && (
            <p className="line-clamp-2 text-[13px] leading-relaxed text-[var(--mute)]">
              {item.meta}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {linkedStage && (
              <a
                href="#pipeline"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--primary)] hover:underline"
              >
                管线 · {linkedStage}
                <ArrowRight size={12} aria-hidden />
              </a>
            )}
            <button
              type="button"
              onClick={onShareBrief}
              className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--mute)] hover:text-[var(--primary)]"
            >
              <Share2 size={12} aria-hidden />
              Share Brief
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

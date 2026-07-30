"use client";

import { motion } from "framer-motion";
import type { BoardItem } from "@/lib/board-types";
import { formatShareBrief } from "@/lib/blocker-classify";
import ContactPills from "@/components/ContactPills";
import StaleDate from "@/components/StaleDate";
import { tagClass } from "@/lib/tag-class";
import { useToast, copyText } from "@/components/ToastProvider";
import { ArrowRight, Check, Circle, Share2 } from "lucide-react";

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
    toast(ok ? "已复制标题 · 可贴到邮箱搜索" : "复制失败");
  };

  const onShareBrief = async () => {
    const brief = formatShareBrief(item, isWait ? "wait" : "act");
    const ok = await copyText(brief);
    toast(ok ? "已复制简报" : "复制失败");
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: done ? 0.45 : 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.12) }}
      className={`group rounded-xl border bg-[var(--surface)] p-3.5 shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-150 sm:p-4 ${
        urgent && !done
          ? "border-l-[3px] border-l-[var(--urgent)] border-[var(--line)]"
          : "border-[var(--line)]"
      } hover:border-[var(--line-strong)] hover:shadow-[var(--shadow-hover)] ${
        done ? "opacity-50 grayscale-[30%]" : ""
      }`}
    >
      <div className="flex flex-col gap-2.5 sm:gap-3">
        <div className="flex items-start gap-2">
          {onToggleDone && (
            <button
              type="button"
              onClick={onToggleDone}
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--faint)] hover:bg-[var(--surface-2)] hover:text-[var(--primary)] sm:h-8 sm:w-8"
              aria-label={done ? "取消勾选" : "本地勾选完成"}
              title={done ? "取消勾选" : "本地勾选（仅此设备）"}
            >
              {done ? (
                <Check size={18} className="text-[var(--primary)]" />
              ) : (
                <Circle size={18} />
              )}
            </button>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
              <button
                type="button"
                onClick={onCopyTitle}
                className="min-w-0 break-words text-left text-[15px] font-semibold leading-snug tracking-tight text-[var(--ink)] underline-offset-2 hover:text-[var(--primary)] hover:underline"
                title="点击复制标题 → 邮箱搜索"
              >
                {item.title}
              </button>
              <StaleDate date={item.date} />
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

        <div className="flex flex-col gap-2.5">
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className={`inline-flex min-h-[28px] items-center rounded-md px-2.5 py-1 text-[12px] font-medium ${tagClass(t)}`}
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
          <div className="flex flex-wrap items-center gap-1">
            {linkedStage && (
              <a
                href="#pipeline"
                className="inline-flex min-h-[36px] items-center gap-1 rounded-md px-2 text-[12px] font-medium text-[var(--primary)] hover:bg-[var(--primary-soft)]"
              >
                管线 · {linkedStage}
                <ArrowRight size={12} aria-hidden />
              </a>
            )}
            <button
              type="button"
              onClick={onShareBrief}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md px-2 text-[12px] font-medium text-[var(--mute)] hover:bg-[var(--surface-2)] hover:text-[var(--primary)]"
            >
              <Share2 size={14} aria-hidden />
              复制简报
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

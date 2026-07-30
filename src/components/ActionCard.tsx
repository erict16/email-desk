"use client";

import { motion } from "framer-motion";
import type { BoardItem } from "@/lib/board-types";
import CopyTitle from "@/components/CopyTitle";
import { tagClass } from "@/lib/tag-class";
import { ArrowRight, User } from "lucide-react";

export default function ActionCard({
  item,
  index,
  urgent = false,
  tone = "act",
  linkedStage,
}: {
  item: BoardItem;
  index: number;
  urgent?: boolean;
  tone?: "act" | "wait";
  linkedStage?: string;
}) {
  const isWait = tone === "wait";
  const spineText = isWait
    ? item.wait?.trim() || item.action
    : item.action;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.2) }}
      className={`group rounded-xl border bg-[var(--surface)] p-4 shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-hover)] hover:border-[var(--primary)]/30 ${
        urgent
          ? "border-l-[3px] border-l-[var(--urgent)] border-[var(--line)]"
          : "border-[var(--line)]"
      }`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-1.5">
            <h3
              className="min-w-0 select-text text-[15px] font-semibold leading-snug tracking-tight text-[var(--ink)]"
              title="可复制标题 → 邮箱搜索"
            >
              {item.title}
            </h3>
            <CopyTitle title={item.title} />
          </div>
          {item.date && (
            <time className="shrink-0 text-[11px] tabular-nums text-[var(--faint)]">
              {item.date}
            </time>
          )}
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

        {(item.tags?.length || item.people || item.meta || linkedStage) && (
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
            {item.people && (
              <p className="flex items-center gap-1.5 text-[12px] text-[var(--faint)]">
                <User size={12} className="shrink-0 opacity-70" aria-hidden />
                <span className="leading-snug">{item.people}</span>
              </p>
            )}
            {item.meta && (
              <p className="line-clamp-2 text-[13px] leading-relaxed text-[var(--mute)]">
                {item.meta}
              </p>
            )}
            {linkedStage && (
              <a
                href="#pipeline"
                className="inline-flex w-fit items-center gap-1 text-[12px] font-medium text-[var(--primary)] hover:underline"
              >
                管线 · {linkedStage}
                <ArrowRight size={12} aria-hidden />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import { Check, Copy } from "lucide-react";

type Props = { title: string };

export default function CopyTitle({ title }: Props): JSX.Element {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(title);
      setCopied(true);
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setCopied(false);
        timerRef.current = null;
      }, 1500);
    } catch {
      setCopied(false);
    }
  }, [title]);

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label="复制标题用于邮箱搜索"
      title={copied ? "已复制" : "复制标题 → 邮箱搜索"}
      className="inline-flex h-6 shrink-0 items-center gap-1 rounded-md px-1.5 text-[11px] font-medium text-[var(--faint)] opacity-0 transition-all group-hover:opacity-100 hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
    >
      {copied ? (
        <>
          <Check size={12} strokeWidth={2.2} />
          <span className="text-[var(--primary)]">已复制</span>
        </>
      ) : (
        <>
          <Copy size={12} strokeWidth={2} />
          <span className="hidden sm:inline">复制</span>
        </>
      )}
    </button>
  );
}

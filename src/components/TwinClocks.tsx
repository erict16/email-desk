"use client";

import { useEffect, useState } from "react";

/** Short live clocks — Beijing & Singapore are both UTC+8. */
export default function TwinClocks() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) {
    return (
      <span className="text-xs text-[var(--muted)] tabular-nums">--:--</span>
    );
  }

  const cn = fmt(now, "Asia/Shanghai");
  const sg = fmt(now, "Asia/Singapore");

  // Same zone most of the year — still label both as requested
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs tabular-nums text-[var(--muted)]">
      <span>
        <span className="text-[var(--fg)]/70">北京</span> {cn}
      </span>
      <span className="text-[var(--line)]">|</span>
      <span>
        <span className="text-[var(--fg)]/70">新加坡</span> {sg}
      </span>
    </div>
  );
}

function fmt(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: tz,
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

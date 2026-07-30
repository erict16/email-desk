# T3
cd6c9d8 feat(desk): copy title for mailbox search
diff --git a/src/components/CopyTitle.tsx b/src/components/CopyTitle.tsx
new file mode 100644
index 0000000..1f8de6d
--- /dev/null
+++ b/src/components/CopyTitle.tsx
@@ -0,0 +1,69 @@
+"use client";
+
+import { useCallback, useEffect, useRef, useState, type JSX } from "react";
+
+type Props = { title: string };
+
+export default function CopyTitle({ title }: Props): JSX.Element {
+  const [copied, setCopied] = useState(false);
+  const timerRef = useRef<number | null>(null);
+
+  useEffect(() => {
+    return () => {
+      if (timerRef.current != null) window.clearTimeout(timerRef.current);
+    };
+  }, []);
+
+  const onCopy = useCallback(async () => {
+    try {
+      await navigator.clipboard.writeText(title);
+      setCopied(true);
+      if (timerRef.current != null) window.clearTimeout(timerRef.current);
+      timerRef.current = window.setTimeout(() => {
+        setCopied(false);
+        timerRef.current = null;
+      }, 1500);
+    } catch {
+      // Clipboard may be denied; leave idle state so user can retry.
+      setCopied(false);
+    }
+  }, [title]);
+
+  return (
+    <button
+      type="button"
+      onClick={onCopy}
+      aria-label="复制标题用于邮箱搜索"
+      title={copied ? "已复制" : "复制标题 → 邮箱搜索"}
+      className="inline-flex h-6 shrink-0 items-center gap-1 rounded-[var(--radius-sm)] px-1.5 text-[11px] font-medium leading-none text-[var(--faint)] transition-colors duration-150 hover:bg-[var(--paper-2)] hover:text-[var(--ink)] active:bg-[var(--line)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
+    >
+      {copied ? (
+        <span className="text-[var(--pipe)]">已复制</span>
+      ) : (
+        <CopyIcon />
+      )}
+    </button>
+  );
+}
+
+function CopyIcon() {
+  return (
+    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
+      <rect
+        x="9"
+        y="9"
+        width="11"
+        height="11"
+        rx="2"
+        stroke="currentColor"
+        strokeWidth="1.7"
+      />
+      <path
+        d="M5 15V5a2 2 0 012-2h10"
+        stroke="currentColor"
+        strokeWidth="1.7"
+        strokeLinecap="round"
+      />
+    </svg>
+  );
+}

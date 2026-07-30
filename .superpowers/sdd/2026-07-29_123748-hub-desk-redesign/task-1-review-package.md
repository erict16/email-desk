# Review package Task 1
BASE 0c8c995c35dac0057a38c86475f98c6aa2de3abe .. HEAD 9266b2197fd3e6028a429be06d84038670613fb5

9266b21 style(desk): lock warm dispatch tokens and design.md

 design.md           | 106 ++++++++++++++++++++++++++++++++++
 src/app/globals.css | 161 +++++++++++++++++++++++++++++-----------------------
 2 files changed, 195 insertions(+), 72 deletions(-)

diff --git a/design.md b/design.md
new file mode 100644
index 0000000..e3f2881
--- /dev/null
+++ b/design.md
@@ -0,0 +1,106 @@
+# Email Desk — design system
+
+**Product:** Email Desk (personal dispatch board)  
+**Audience:** Eric (overseas sales) — internal; shareable status view for colleagues  
+**Date:** 2026-07-29  
+**Scope:** visual tokens + product signature; static site; `content/board.md` is the daily source  
+
+---
+
+## Audience & job
+
+| | |
+|--|--|
+| **Who** | Eric — mail-driven sales workflow |
+| **Job** | Decide next mail action + see where each order sits in the pipeline |
+| **Open-in-3s** | Urgent count, next actions, meetings, pipeline congestion |
+| **Not** | Public todo marketing page, buyer catalogue, or mail client |
+
+Desk is a **dispatch board**: dense, scannable, action-first. It is intentionally different from Huaming Hub (cool engineering catalogue).
+
+---
+
+## Tokens
+
+Warm paper canvas; one urgent red; action strip in warm gold; pipeline in deep blue. Borders 1px only — no heavy dual shadows.
+
+| Role | Token | Hex | Note |
+|------|-------|-----|------|
+| Page | `--bg` | `#f7f6f3` | Warm paper (vs Hub cool paper) |
+| Surface | `--surface` | `#ffffff` | Cards / strips |
+| Ink | `--ink` | `#1a1a1a` | Primary text |
+| Mute | `--mute` | `#5c5c5c` | Secondary text |
+| Faint | `--faint` | `#8a8a8a` | Meta / tertiary |
+| Line | `--line` | `#e6e4df` | 1px rules |
+| Urgent | `--urgent` | `#c43c2c` | P0 bar / urgent count |
+| Action bg | `--action-bg` | `#f3ead2` | Todo / action spine |
+| Action ink | `--action-ink` | `#5c4a1f` | Action copy on spine |
+| Pipeline | `--pipe` | `#1f4d7a` | Stage / 卡点 |
+| Pipe soft | `--pipe-soft` | `#e8eef4` | Soft stage chips |
+| Follow | `--follow` | `#b86e00` | Today non-P0 stats |
+| Radius | `--radius` | `6px` | Cards |
+| Measure | `--measure` | `42rem` | Single-column scan width |
+
+### Migration aliases (legacy classnames)
+
+Keep components that still reference old names from hard-crashing mid-migration:
+
+| Alias | Maps to |
+|-------|---------|
+| `--paper` | `var(--bg)` |
+| `--card` | `var(--surface)` |
+| `--muted` | `var(--mute)` |
+| `--orders` | `var(--pipe)` |
+| `--orders-soft` | `var(--pipe-soft)` |
+
+---
+
+## Type & chrome
+
+- **Type:** system UI stack (`-apple-system`, `"Segoe UI"`, PingFang / Hiragino / YaHei, sans-serif). Tabular nums where counts matter; stage shorts may use mono.
+- **No** display Google fonts (tool feel, fast load).
+- **Width:** `max-width: var(--measure)` — single column.
+- **Radius:** 6px cards; progress dots round.
+- **Shadow:** none (or whisper at most); prefer **1px border** on `--line`.
+- **Accent ≤ 5%** of UI surface; urgent and action bars carry the signal.
+
+---
+
+## Signature element
+
+**「待办 / 卡点」action bar spine** — every card’s visual backbone is the next-step line (warm `--action-bg` + strong action copy). Focus-strip urgent counts use `--urgent`. The whole board should read as “what do I do next?” not a generic kanban skin.
+
+---
+
+## Product layers (IA reminder)
+
+| Layer | Question | Source |
+|-------|----------|--------|
+| **Today** | What to reply / chase / send now? | todo `priority: P0\|P1` |
+| **Pipeline** | Where is each order (OS→…→ship)? | `orders` + `stage:` |
+| **Later** | Watch optionally | `priority: P2` |
+| **Dock** | Meetings today / this week | frontmatter `meetings:` |
+
+Hard rules: title = mailbox search string; todo = you move; order = project position; `action` is the card’s main sentence.
+
+---
+
+## Non-goals
+
+- No Spark / enterprise mail API; no live mailbox sync  
+- No quote calc, product selection, or send-mail UI in Desk  
+- No 7-column desktop Kanban as primary view (phone / narrow is a main surface)  
+- No FYI / 知会 column regression  
+- No forced `board.md` field renames (optional fields only; old fields keep parsing)  
+- No purple gradients, bento card walls, glassmorphism, heavy shadows  
+- No Hub-style dark bands or marketing hero treatment  
+- No amount / secret attachment content on the public static site  
+
+---
+
+## Success (tokens slice)
+
+- [x] Tokens locked in `design.md` + `:root`  
+- [x] Legacy aliases present (`--paper`, `--card`, `--muted`, `--orders`, …)  
+- [ ] Full IA / card redesign (later tasks)  
+- [ ] `board.md` zero-change build still correct after component work  
diff --git a/src/app/globals.css b/src/app/globals.css
index e1dd81a..252632a 100644
--- a/src/app/globals.css
+++ b/src/app/globals.css
@@ -1,151 +1,168 @@
 @import "tailwindcss";
 
 /*
- * Hallmark · genre: modern-minimal · theme: white-desk · macrostructure: workbench-index
- * nav: N5-pill · footer: Ft2 · pre-emit: P4 H5 E5 S5 R5 V4
- * contrast: pass · tokens: pass · honest: pass
- * IA: 紧急 / 需跟进 / 订单 — 无「知会」栏，减信息过载
+ * Email Desk — warm dispatch tokens
+ * See design.md for audience, signature (action bar spine), and non-goals.
  */
 
 :root {
   --space-3xs: 0.125rem;
   --space-2xs: 0.25rem;
   --space-xs: 0.5rem;
   --space-sm: 0.75rem;
   --space-md: 1rem;
   --space-lg: 1.5rem;
   --space-xl: 2.5rem;
   --space-2xl: 4rem;
 
   --z-base: 1;
   --z-raised: 10;
   --z-sticky: 200;
   --z-sticky-nav: 300;
   --z-toast: 500;
 
-  /* pure white canvas · monochrome neutrals · one cool accent */
-  --paper: #ffffff;
-  --paper-2: #f4f4f5;
-  --card: #ffffff;
-  --ink: #171717;
-  --muted: #737373;
-  --faint: #a3a3a3;
-  --line: #e5e5e5;
-  --line-strong: #d4d4d4;
-
-  --accent: #404040;
-  --accent-soft: #f5f5f5;
-  --accent-ink: #fafafa;
-  --focus: #525252;
-
-  --urgent: #dc2626;
-  --urgent-soft: #fef2f2;
-  --urgent-border: #fecaca;
-  --follow: #d97706;
-  --follow-soft: #fffbeb;
-  --follow-border: #fde68a;
-  --orders: #4f46e5;
-  --orders-soft: #eef2ff;
-  --orders-border: #c7d2fe;
-
-  --bg: var(--paper);
+  /* warm dispatch system */
+  --bg: #f7f6f3;
+  --surface: #ffffff;
+  --ink: #1a1a1a;
+  --mute: #5c5c5c;
+  --faint: #8a8a8a;
+  --line: #e6e4df;
+  --urgent: #c43c2c;
+  --action-bg: #f3ead2;
+  --action-ink: #5c4a1f;
+  --pipe: #1f4d7a;
+  --pipe-soft: #e8eef4;
+  --follow: #b86e00;
+  --radius: 6px;
+  --measure: 42rem;
+
+  /* aliases — old classnames mid-migration */
+  --paper: var(--bg);
+  --card: var(--surface);
+  --muted: var(--mute);
+  --orders: var(--pipe);
+  --orders-soft: var(--pipe-soft);
+
+  /* derived / compatibility for existing components */
+  --paper-2: #efece6;
+  --line-strong: #d4d1c9;
   --fg: var(--ink);
-  --done: var(--orders);
-  --done-soft: var(--orders-soft);
+  --accent: var(--pipe);
+  --accent-soft: var(--pipe-soft);
+  --accent-ink: #fafafa;
+  --focus: var(--pipe);
+
+  --urgent-soft: #f8ebe8;
+  --urgent-border: #e8b4ad;
+  --follow-soft: #f7efdf;
+  --follow-border: #e5c98a;
+  --orders-border: #b7c9db;
+  --done: var(--pipe);
+  --done-soft: var(--pipe-soft);
   --done-border: var(--orders-border);
 
-  --shadow-whisper: 0 1px 2px rgb(0 0 0 / 0.04);
-  --shadow-card: 0 1px 2px rgb(0 0 0 / 0.04), 0 0 0 1px rgb(0 0 0 / 0.03);
-  --radius: 10px;
-  --radius-sm: 6px;
-  /* sticky pill nav: top pad + bar + breathing room below */
+  /* prefer 1px border; whisper only for sticky chrome */
+  --shadow-whisper: 0 1px 0 rgb(0 0 0 / 0.04);
+  --shadow-card: none;
+  --radius-sm: 4px;
   --banner-height: 4rem;
-  --measure: 40rem;
 
   /* layout rhythm — use these, not one-off px */
   --gap-card: 0.625rem; /* between cards in a list */
   --gap-stack: 0.5rem; /* inside a card, related lines */
   --gap-block: 0.75rem; /* inside a card, block break (tags / action) */
   --gap-lane: 1.5rem; /* between order stage lanes */
   --gap-section: 2.25rem; /* between major sections */
   --pad-card-x: 1rem;
   --pad-card-y: 0.875rem;
 }
 
 @theme inline {
-  --font-sans: "Inter", "Segoe UI", "PingFang SC", "Hiragino Sans GB",
-    "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif;
+  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
+    "Hiragino Sans GB", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif;
 }
 
 html {
   overflow-x: clip;
 }
 
 html,
 body {
   min-height: 100%;
 }
 
 body {
   overflow-x: clip;
   color: var(--ink);
   font-family: var(--font-sans);
-  background: var(--paper);
+  background: var(--bg);
   -webkit-font-smoothing: antialiased;
   text-rendering: optimizeLegibility;
+  font-variant-numeric: tabular-nums;
 }
 
 ::selection {
-  background: #e5e5e5;
-  color: var(--ink);
+  background: var(--action-bg);
+  color: var(--action-ink);
 }
 
 :focus-visible {
   outline: 2px solid var(--focus);
   outline-offset: 2px;
 }
 
 @media (prefers-color-scheme: dark) {
   :root {
-    --paper: #0a0a0a;
-    --paper-2: #171717;
-    --card: #141414;
-    --ink: #fafafa;
-    --muted: #a3a3a3;
-    --faint: #737373;
-    --line: #262626;
-    --line-strong: #404040;
-
-    --accent: #d4d4d4;
-    --accent-soft: #262626;
-    --accent-ink: #0a0a0a;
-    --focus: #a3a3a3;
-
-    --urgent: #f87171;
-    --urgent-soft: rgb(220 38 38 / 0.12);
-    --urgent-border: rgb(248 113 113 / 0.35);
-    --follow: #fbbf24;
-    --follow-soft: rgb(217 119 6 / 0.12);
-    --follow-border: rgb(251 191 36 / 0.35);
-    --orders: #818cf8;
-    --orders-soft: rgb(79 70 229 / 0.14);
-    --orders-border: rgb(129 140 248 / 0.4);
-
-    --shadow-whisper: 0 1px 2px rgb(0 0 0 / 0.4);
-    --shadow-card: 0 1px 2px rgb(0 0 0 / 0.35),
-      0 0 0 1px rgb(255 255 255 / 0.04);
+    --bg: #121110;
+    --surface: #1c1b19;
+    --ink: #f3f2ef;
+    --mute: #a3a09a;
+    --faint: #7a7770;
+    --line: #2e2c28;
+    --urgent: #e06a5c;
+    --action-bg: #3a3220;
+    --action-ink: #f0e4c0;
+    --pipe: #7aa3c9;
+    --pipe-soft: #1e2a36;
+    --follow: #d4a04a;
+
+    --paper: var(--bg);
+    --card: var(--surface);
+    --muted: var(--mute);
+    --orders: var(--pipe);
+    --orders-soft: var(--pipe-soft);
+
+    --paper-2: #24221e;
+    --line-strong: #3d3a34;
+    --accent: var(--pipe);
+    --accent-soft: var(--pipe-soft);
+    --accent-ink: #121110;
+    --focus: var(--pipe);
+
+    --urgent-soft: rgb(196 60 44 / 0.16);
+    --urgent-border: rgb(224 106 92 / 0.4);
+    --follow-soft: rgb(184 110 0 / 0.16);
+    --follow-border: rgb(212 160 74 / 0.4);
+    --orders-border: rgb(122 163 201 / 0.4);
+    --done: var(--pipe);
+    --done-soft: var(--pipe-soft);
+    --done-border: var(--orders-border);
+
+    --shadow-whisper: 0 1px 0 rgb(0 0 0 / 0.35);
+    --shadow-card: none;
   }
 
   ::selection {
-    background: #404040;
-    color: var(--ink);
+    background: var(--action-bg);
+    color: var(--action-ink);
   }
 }
 
 @media (prefers-reduced-motion: reduce) {
   *,
   *::before,
   *::after {
     animation-duration: 0.01ms !important;
     animation-iteration-count: 1 !important;
     transition-duration: 0.01ms !important;

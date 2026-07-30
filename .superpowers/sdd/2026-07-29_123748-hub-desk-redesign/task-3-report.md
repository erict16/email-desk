# Task 3 Report: CopyTitle client control

**Status:** DONE  
**Date:** 2026-07-29  
**Commit:** `cd6c9d8` — `feat(desk): copy title for mailbox search`

---

## Summary

Created a client-only control for one-click copy of a card title (mailbox search key):

1. **`CopyTitle`** — `"use client"` button; `navigator.clipboard.writeText(title)`
2. Local **`copied`** state shows **「已复制」** for **1.5s** (no toast library)
3. Accessible: `type="button"`, `aria-label="复制标题用于邮箱搜索"`

No card wiring in this task — component is produced for later desk UI integration.

---

## Files

| Path | Action |
|------|--------|
| `src/components/CopyTitle.tsx` | Created |

---

## Interfaces delivered

### `src/components/CopyTitle.tsx`

```tsx
"use client";
export default function CopyTitle({ title }: { title: string }): JSX.Element;
```

(`JSX` imported as a type from `react` so `tsc` resolves under React 19 / `@types/react` without a global `JSX` namespace.)

### Behavior

| Requirement | Implementation |
|-------------|----------------|
| Clipboard write | `await navigator.clipboard.writeText(title)` |
| Brief success UI | `copied === true` → label **已复制** for 1500ms |
| Button semantics | `type="button"` |
| A11y | `aria-label="复制标题用于邮箱搜索"`; idle `title` tooltip; icon `aria-hidden` |
| No external toast | Local `useState` only |
| Timer hygiene | Clears prior timeout on re-click; clears on unmount |

Idle state: compact copy icon. Success: text **已复制** (pipe token color). Fail (clipboard denied): stays idle for retry.

---

## Verification

```bash
cd ~/Github/email-desk && npx tsc --noEmit
```

**Result:** exit 0 (no errors).

Build not required; `tsc --noEmit` succeeded as brief prefers.

---

## Commit

```
cd6c9d8 feat(desk): copy title for mailbox search
```

Files in commit:

- `src/components/CopyTitle.tsx` (new)

---

## Constraints checklist

- [x] Create `src/components/CopyTitle.tsx` only (no broad UI rewiring)
- [x] `"use client"`
- [x] `navigator.clipboard.writeText(title)`
- [x] Brief **已复制** state ~1.5s
- [x] `type="button"`
- [x] `aria-label="复制标题用于邮箱搜索"`
- [x] No external toast lib
- [x] Typecheck via `npx tsc --noEmit`
- [x] Commit message from brief

---

## Concerns

None blocking.

Optional follow-ups for card tasks (out of scope here):

- Wire `CopyTitle` into Today / Pipeline / Later title rows (`Card` / `OrderCard` or successors) beside the title.
- Consider `aria-live="polite"` if screen-reader feedback for “已复制” is needed beyond the label swap.
- Secure contexts only: Clipboard API needs HTTPS or localhost (fine for GH Pages / local dev).

---

## Ready for next task

Consumers can:

```tsx
import CopyTitle from "@/components/CopyTitle";

// next to a card title
<h3>…{item.title}</h3>
<CopyTitle title={item.title} />
```

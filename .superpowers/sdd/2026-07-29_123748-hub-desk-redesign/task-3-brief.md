### Task 3: CopyTitle client control

**Files:**
- Create: `~/Github/email-desk/src/components/CopyTitle.tsx`

**Interfaces:**
- Produces: client component

```tsx
"use client";
export default function CopyTitle({ title }: { title: string }): JSX.Element;
```

Behavior: button/control next to title; `navigator.clipboard.writeText(title)`; brief “已复制” state 1.5s; `type="button"`; accessible `aria-label="复制标题用于邮箱搜索"`.

- [ ] **Step 1: Implement `CopyTitle.tsx`** with local `copied` state; no external toast lib.

- [ ] **Step 2: Typecheck via build later; for now**

```bash
cd ~/Github/email-desk && npx tsc --noEmit 2>/dev/null || npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CopyTitle.tsx
git commit -m "feat(desk): copy title for mailbox search"
```

---

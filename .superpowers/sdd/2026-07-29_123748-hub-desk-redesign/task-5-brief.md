### Task 5: FocusStrip + Board IA rewrite

**Files:**
- Create: `~/Github/email-desk/src/components/FocusStrip.tsx`
- Modify: `~/Github/email-desk/src/components/Board.tsx`
- Modify: `~/Github/email-desk/src/components/StatsNav.tsx` (delete usage or repurpose)
- Create: `~/Github/email-desk/src/components/WorkflowKit.tsx`
- Modify: `~/Github/email-desk/src/components/SiteFooter.tsx`

**Interfaces:**
- Consumes: `buildDeskView(board)`, `stageDef`, `ORDER_STAGES`
- Board structure:

```tsx
// anchors
// #today   — P0+P1
// #pipeline — orders
// #later   — P2
// #order-stage-{id}

export default function Board({ board }: { board: BoardData }) {
  const view = buildDeskView(board);
  // FocusStrip: meetings + chips urgent/today/orders/later
  // section Today → ActionCards
  // section Pipeline → stage lanes → OrderCards
  // section Later → ActionCards (muted); if later.length > 3, use <details> default open false; if ≤3 default open
  // WorkflowKit at bottom
}
```

**FocusStrip chips:**

| Label | value | href |
|-------|-------|------|
| 紧急 | stats.urgent | `#today` (P0 first in list) |
| 今日 | stats.today | `#today` |
| 管线 | stats.orders | `#pipeline` |
| 稍后 | stats.later | `#later` |

**WorkflowKit content:**
- List 7 stages with `short` + `hint` from `ORDER_STAGES`
- One line writing rule: 标题可搜邮箱 · Todo=你要动 · Order=项目在哪
- Links: `https://erict16.github.io/huaming-hub/` · `https://erict16.github.io/oltc-selector/`

**Footer:** same two external links + privacy/terms.

- [ ] **Step 1: Implement FocusStrip + WorkflowKit.**

- [ ] **Step 2: Rewrite Board.tsx** to use `buildDeskView` and new sections only (remove old TRIAGE 紧急/需跟进/订单 labels; 紧急 is chip not section title — section titles: **今日行动** / **订单管线** / **稍后**).

- [ ] **Step 3: Wire cross-links**

```ts
const key = titleKey(item.title);
const linked = view.linkedKeys.has(key);
// ActionCard linkedStage: if linked, find order with same key → stageDef(order.stage).label
// OrderCard hasTodayLink: linked && today/later has same key
```

- [ ] **Step 4: Build + check:view**

```bash
cd ~/Github/email-desk && npm run check:view && npm run build
```

Expected: both pass.

- [ ] **Step 5: Dev visual check**

```bash
cd ~/Github/email-desk && npm run dev
# open http://localhost:3000 — confirm P0 rail, action bars, stages, meetings
```

- [ ] **Step 6: Commit**

```bash
git add src/components/Board.tsx src/components/FocusStrip.tsx src/components/WorkflowKit.tsx src/components/SiteFooter.tsx src/components/StatsNav.tsx
git commit -m "feat(desk): Today / Pipeline / Later dispatch IA"
```

---

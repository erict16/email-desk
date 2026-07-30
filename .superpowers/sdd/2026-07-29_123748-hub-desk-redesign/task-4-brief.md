### Task 4: ActionCard + OrderCard redesign

**Files:**
- Create: `~/Github/email-desk/src/components/ActionCard.tsx`
- Modify: `~/Github/email-desk/src/components/OrderCard.tsx`
- Modify: `~/Github/email-desk/src/components/Card.tsx` (optional re-export or leave unused)

**Interfaces:**
- Consumes: `BoardItem`, `titleKey`, `CopyTitle`, `ORDER_STAGES` / `stageProgress`
- Produces:

```tsx
// ActionCard — Today / Later
export default function ActionCard(props: {
  item: BoardItem;
  index: number;
  urgent?: boolean;       // P0 left rail
  linkedStage?: string;   // e.g. "技术沟通" if in pipeline
}): JSX.Element;

// OrderCard — Pipeline
export default function OrderCard(props: {
  item: BoardItem;
  index: number;
  hasTodayLink?: boolean; // show 「今日有待办」
}): JSX.Element;
```

**ActionCard layout (spec):**
1. Title row + CopyTitle + date  
2. Action spine: `待办 · {action}` on `--action-bg`  
3. Tags (reuse tag color heuristics from old `Card.tsx` — copy `tagClass` into shared `src/lib/tag-class.ts` or keep local)  
4. `发件人：{people}`  
5. meta truncated ~2 lines  
6. If `linkedStage`: link `<a href="#pipeline">管线 · {linkedStage}</a>`

**OrderCard layout:**
1. Title + CopyTitle + customer  
2. 7 progress dots (`stageProgress`)  
3. `卡点 · {action}` on `--pipe-soft`  
4. tags / people / one-line meta  
5. If `hasTodayLink`: `<a href="#today">今日有待办</a>`

- [ ] **Step 1: Extract `tagClass` to `src/lib/tag-class.ts`** from `Card.tsx` (same regexes).

- [ ] **Step 2: Implement ActionCard + rewrite OrderCard.**

- [ ] **Step 3: Build**

```bash
cd ~/Github/email-desk && npm run build
```

Expected: success (Board may still import old Card until Task 5).

- [ ] **Step 4: Commit**

```bash
git add src/components/ActionCard.tsx src/components/OrderCard.tsx src/lib/tag-class.ts src/components/Card.tsx
git commit -m "feat(desk): action and pipeline cards with cross-link slots"
```

---

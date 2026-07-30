# Task 4 Report: ActionCard + OrderCard redesign

**Status:** DONE  
**Date:** 2026-07-29  
**Commit:** `b9c6d6c` — `feat(desk): action and pipeline cards with cross-link slots`

---

## Summary

Implemented dispatch-style cards for Today/Later and Pipeline:

1. **`tagClass`** extracted to shared `src/lib/tag-class.ts` (superset of Card + OrderCard regexes)
2. **`ActionCard`** — title + CopyTitle + date; warm action spine (`待办 ·`); tags; 发件人; 2-line meta; optional pipeline cross-link; P0 left urgent rail
3. **`OrderCard`** rewritten — title + CopyTitle + customer; 7 stage dots; `卡点 ·` on `--pipe-soft`; tags/people/1-line meta; optional Today cross-link
4. **`Card.tsx`** kept for Board (Task 5); uses shared `tagClass`

Board still imports legacy `Card` for triage — ActionCard is ready to wire.

---

## Files

| Path | Action |
|------|--------|
| `src/lib/tag-class.ts` | Created — shared tag chip heuristics |
| `src/components/ActionCard.tsx` | Created — Today / Later action card |
| `src/components/OrderCard.tsx` | Rewritten — pipeline card + cross-link slot |
| `src/components/Card.tsx` | Modified — import shared `tagClass`; left for Board |

---

## Interfaces delivered

### `src/lib/tag-class.ts`

```ts
export function tagClass(label: string): string;
```

Regex families (same intent as old Card; richer OrderCard patterns merged):

| Pattern family | Style |
|----------------|-------|
| 需尽快 / 优先 / 紧急 / 催你 / 阻塞 / 卡住 | urgent |
| 待你 / 待发 / … / 等你 | follow |
| 待客户 / OS / 图纸 / 等PO / … | follow |
| 待工程 / 待工厂 / 评审 / … | orders (pipe) |
| 已发 / 已确认 / 关闭 / 已签 / … | muted |
| 知会 / 旁听 / 会议 / … | muted |
| 缺 / 售后 / 单证 / CI / PL / CO | orders (pipe) |
| default | muted |

### `src/components/ActionCard.tsx`

```tsx
export default function ActionCard(props: {
  item: BoardItem;
  index: number;
  urgent?: boolean;       // P0 left rail (3px --urgent)
  linkedStage?: string;   // e.g. "技术沟通" → <a href="#pipeline">
}): JSX.Element;
```

**Layout (spec order):**

1. Title row + `<CopyTitle title={item.title} />` + date  
2. Action spine: `待办 · {action}` on `bg-[var(--action-bg)]` / `text-[var(--action-ink)]`  
3. Tags via `tagClass`  
4. `发件人：{people}`  
5. meta `line-clamp-2`  
6. If `linkedStage`: `<a href="#pipeline">管线 · {linkedStage}</a>`  

P0: `border-l-[3px] border-l-[var(--urgent)]` — no “P0” chip.

### `src/components/OrderCard.tsx`

```tsx
export default function OrderCard(props: {
  item: BoardItem;
  index: number;
  hasTodayLink?: boolean; // → <a href="#today">今日有待办</a>
}): JSX.Element;
```

**Layout (spec order):**

1. Title + CopyTitle + customer  
2. 7 progress dots (`stageProgress`) + stage short + `n/total`  
3. `卡点 · {action}` on `bg-[var(--pipe-soft)]`  
4. tags / people / meta `line-clamp-1`  
5. If `hasTodayLink`: `<a href="#today">今日有待办</a>`  

Date removed from pipeline card (not in brief layout). Backward-compatible: `hasTodayLink` defaults `false`; existing Board call sites still type-check.

### `src/components/Card.tsx`

Unchanged public props (`item`, `index`, `hideAction`, `showStripe`). Local `tagClass` removed in favor of `@/lib/tag-class`. Documented as legacy until Task 5.

---

## Verification

```bash
cd ~/Github/email-desk && npm run build
```

**Result:** exit 0 — compile, lint, types, static export OK.

```
Route (app)                                 Size  First Load JS
┌ ○ /                                    2.55 kB         105 kB
├ ○ /_not-found                            998 B         104 kB
├ ○ /privacy                             1.91 kB         108 kB
└ ○ /terms                               1.91 kB         108 kB
```

ActionCard is not yet imported by Board, so homepage still renders legacy Card + previous OrderCard call shape (new OrderCard without cross-links).

---

## Commit

```
b9c6d6c feat(desk): action and pipeline cards with cross-link slots
```

Files in commit:

- `src/components/ActionCard.tsx` (new)
- `src/components/OrderCard.tsx` (rewrite)
- `src/lib/tag-class.ts` (new)
- `src/components/Card.tsx` (shared tagClass)

---

## Constraints checklist

- [x] Extract `tagClass` to `src/lib/tag-class.ts`
- [x] Create `ActionCard` per brief props + layout
- [x] Rewrite `OrderCard` per brief props + layout
- [x] Card left usable for Board (no broken imports)
- [x] `npm run build` passes
- [x] Commit message from brief

---

## Concerns

None blocking.

Notes for Task 5 (Board wiring — out of scope here):

1. **Wire ActionCard** for `#today` (P0 with `urgent`, P1 without) and `#later` (P2, lower contrast optional).
2. **Cross-links:** use `titleKey` to match triage ↔ order titles; pass `linkedStage` (e.g. `stageDef(stage).label`) and `hasTodayLink`.
3. **Anchors:** ensure `#today`, `#pipeline`, `#later` exist on the new Board structure.
4. **Date on orders:** dropped from OrderCard per brief; restore only if ops need it on pipeline cards.
5. **Visual:** ActionCard action spine and OrderCard 卡点 spine replace old left-border action styling — signature per `design.md`.

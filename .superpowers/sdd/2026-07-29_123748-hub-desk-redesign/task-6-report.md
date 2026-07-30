# Task 6 Report: Desk README + ship

**Status:** DONE  
**Date:** 2026-07-29  
**Commit:** `48a6dd8` — `docs(desk): README for dispatch IA`

---

## Summary

Updated `README.md` so author-facing docs match the **Today / 管线 / 稍后** dispatch IA (post Task 5), then built and shipped to `main`.

### README changes

1. **§5 分区与四块统计** — Replaced old「紧急 / 需跟进 / 订单」with:
   - Layers: 今日行动 (P0+P1) · 订单管线 (`stage:`) · 稍后 (P2) · 会 (`meetings:`)
   - Chips: 紧急 / 今日 / 管线 / 稍后 → `#today` / `#today` / `#pipeline` / `#later`
   - Order: 今日 (P0→P1) → 管线 (vertical stages) → 稍后
2. **Title-based cross-link** — Documented `titleKey` (trim + collapse whitespace + lower) auto-link between todo and order; no merge, no new fields
3. **§5b** — Renamed framing to 订单管线; noted vertical lanes (not 7-col Kanban); same stage table + writing rules kept
4. **Template footer** — Display partition line updated to P0+P1→今日, P2→稍后, stage→管线
5. **§9 UI 锁** — Focus strip, action spine, WorkflowKit, warm measure width

**Preserved:** board.md fields, tag/people/action rules, stage aliases, FYI offline, daily update workflow, icon regen notes.

### Build

```text
npm run build  →  OK (Next.js 15.5.20 static export)
Routes: / · /privacy · /terms · _not-found
```

### Git

| Step | Result |
|------|--------|
| `git commit -m "docs(desk): README for dispatch IA"` | `48a6dd8` (after rebase; was `aca86f4` pre-rebase) |
| First `git push` | Rejected — remote had `363b1e5` (`chore: desk 2026-07-29`) |
| `git pull --rebase origin main` | Rebased 6 local desk commits cleanly |
| `git push origin main` | **OK** `363b1e5..48a6dd8` |

Shipped desk batch on `main` (tokens → titleKey/view → copy → cards → Board IA → README):

```
48a6dd8 docs(desk): README for dispatch IA
0729bf5 feat(desk): Today / Pipeline / Later dispatch IA
6cfc439 feat(desk): action and pipeline cards with cross-link slots
87373e4 feat(desk): copy title for mailbox search
3dd7aa3 feat(desk): title key and Today/Pipeline/Later view model
901f1f4 style(desk): lock warm dispatch tokens and design.md
```

### GH Pages

| Run | Conclusion |
|-----|------------|
| `docs(desk): README for dispatch IA` (push) | **success** (`run_id` 30423523188, ~1m) |
| Prior `chore: desk 2026-07-29` | success |

https://github.com/erict16/email-desk/actions/runs/30423523188

---

## Files

| Path | Action |
|------|--------|
| `README.md` | Modified — dispatch IA + title cross-link |

---

## Concerns

- Push required rebase over concurrent `chore: desk` content commit; no conflicts.
- Meeting UI label in §6 still says「需参加的会议」; FocusStrip uses short「会」— writing contract unchanged.
- `.superpowers/` and `docs/` remain untracked (by design for this task).
- None blocking; Pages deploy green.

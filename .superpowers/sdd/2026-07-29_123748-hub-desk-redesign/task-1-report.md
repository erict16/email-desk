# Task 1 Report: Desk design.md + CSS tokens

**Status:** DONE  
**Date:** 2026-07-29  
**Repo:** `/Users/youming/Github/email-desk` (branch `main`)  
**Commit:** `9266b21` — `style(desk): lock warm dispatch tokens and design.md`

---

## What was done

### 1. Created `design.md` (repo root)

Path: `/Users/youming/Github/email-desk/design.md`

Contents locked:

| Section | Content |
|---------|---------|
| **Audience** | Eric (overseas sales); internal dispatch board, shareable status |
| **Job** | Next mail action + order pipeline position; open-in-3s |
| **Tokens table** | Full warm dispatch set with hex + notes |
| **Migration aliases** | `--paper`, `--card`, `--muted`, `--orders`, `--orders-soft` |
| **Type & chrome** | System UI stack, 42rem measure, 6px radius, 1px borders |
| **Signature** | 「待办 / 卡点」**action bar spine** as card backbone; focus-strip urgent in `--urgent` |
| **IA reminder** | Today / Pipeline / Later / Dock layers |
| **Non-goals** | No mail API, no Kanban primary, no FYI column, no Hub dark/marketing, no board.md renames, no heavy chrome |

### 2. Replaced `:root` in `src/app/globals.css`

Path: `/Users/youming/Github/email-desk/src/app/globals.css`

**Removed:** Hallmark header comment block (`genre: modern-minimal · theme: white-desk` etc.)

**New primary tokens (exact brief values):**

```css
--bg: #f7f6f3;
--surface: #ffffff;
--ink: #1a1a1a;
--mute: #5c5c5c;
--faint: #8a8a8a;
--line: #e6e4df;
--urgent: #c43c2c;
--action-bg: #f3ead2;
--action-ink: #5c4a1f;
--pipe: #1f4d7a;
--pipe-soft: #e8eef4;
--follow: #b86e00;
--radius: 6px;
--measure: 42rem;
```

**Aliases (mid-migration safety):**

```css
--paper: var(--bg);
--card: var(--surface);
--muted: var(--mute);
--orders: var(--pipe);
--orders-soft: var(--pipe-soft);
```

**Kept / adapted for existing components (not rewritten this task):**

- Spacing: `--gap-card`, `--gap-stack`, `--gap-block`, `--gap-lane`, `--gap-section`, `--pad-card-*`
- Space scale + z-index scale
- Soft/border companions: `--paper-2`, `--line-strong`, `--urgent-soft/border`, `--follow-soft/border`, `--orders-border`, `--done*`
- Accent/focus mapped toward `--pipe` so stage/order accents read dispatch-blue instead of indigo/gray
- `--shadow-whisper` reduced to hairline; `--shadow-card: none` (prefer 1px border)
- Body `background: var(--bg)`; system font stack; `font-variant-numeric: tabular-nums`
- Selection uses `--action-bg` / `--action-ink`
- Dark-mode block retuned to warm-dispatch inverses so aliases still resolve (not Hub dark redesign)

**Not done (out of scope for Task 1):** Board / Card / OrderCard / StatsNav component rewrites; IA focus strip; action-spine UI.

---

## Verification

```bash
cd ~/Github/email-desk && npm run build
```

| Check | Result |
|-------|--------|
| Compile | ✓ |
| Lint / types | ✓ |
| Static pages (6/6) | ✓ |
| Export | ✓ |
| Exit code | 0 |

Visual note: UI will look half-migrated (new canvas + blue order accent via aliases; cards not yet action-spine redesign). Expected until later tasks.

---

## Files changed

| File | Action |
|------|--------|
| `design.md` | **Created** |
| `src/app/globals.css` | **Modified** (`:root` + body/font/selection/dark) |

---

## Commit

```
9266b21 style(desk): lock warm dispatch tokens and design.md
```

Not pushed (task: commit only).

---

## Concerns

None blocking.

Minor notes for later tasks:

1. Components still hardcode many Tailwind `var(--paper)` / `var(--card)` / `var(--orders)` paths — aliases keep them alive; Task 2+ should migrate to `--bg` / `--surface` / `--pipe` / `--action-*` where intentional.
2. Dark mode is a compatibility retune, not a designed second skin; product thesis is light warm dispatch.
3. `--paper-2` (`#efece6`) is a derived warm wash, not in the brief’s minimal token list — needed so hover/chip backgrounds don’t break.

---

## Ready for

Task 2+ (shell, focus strip, Today/Later cards, pipeline lanes) can consume locked tokens from `design.md` / `:root`.

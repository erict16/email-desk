# Email Desk — design system

**Product:** Email Desk (personal dispatch board)  
**Audience:** Eric (overseas sales) — internal; shareable status view for colleagues  
**Date:** 2026-07-29  
**Scope:** visual tokens + product signature; static site; `content/board.md` is the daily source  

---

## Audience & job

| | |
|--|--|
| **Who** | Eric — mail-driven sales workflow |
| **Job** | Decide next mail action + see where each order sits in the pipeline |
| **Open-in-3s** | Urgent count, next actions, meetings, pipeline congestion |
| **Not** | Public todo marketing page, buyer catalogue, or mail client |

Desk is a **dispatch board**: dense, scannable, action-first. It is intentionally different from Huaming Hub (cool engineering catalogue).

---

## Tokens

Warm paper canvas; one urgent red; action strip in warm gold; pipeline in deep blue. Borders 1px only — no heavy dual shadows.

| Role | Token | Hex | Note |
|------|-------|-----|------|
| Page | `--bg` | `#f7f6f3` | Warm paper (vs Hub cool paper) |
| Surface | `--surface` | `#ffffff` | Cards / strips |
| Ink | `--ink` | `#1a1a1a` | Primary text |
| Mute | `--mute` | `#5c5c5c` | Secondary text |
| Faint | `--faint` | `#8a8a8a` | Meta / tertiary |
| Line | `--line` | `#e6e4df` | 1px rules |
| Urgent | `--urgent` | `#c43c2c` | P0 bar / urgent count |
| Action bg | `--action-bg` | `#f3ead2` | Todo / action spine |
| Action ink | `--action-ink` | `#5c4a1f` | Action copy on spine |
| Pipeline | `--pipe` | `#1f4d7a` | Stage / 卡点 |
| Pipe soft | `--pipe-soft` | `#e8eef4` | Soft stage chips |
| Follow | `--follow` | `#b86e00` | Today non-P0 stats |
| Radius | `--radius` | `6px` | Cards |
| Measure | `--measure` | `42rem` | Single-column scan width |

### Migration aliases (legacy classnames)

Keep components that still reference old names from hard-crashing mid-migration:

| Alias | Maps to |
|-------|---------|
| `--paper` | `var(--bg)` |
| `--card` | `var(--surface)` |
| `--muted` | `var(--mute)` |
| `--orders` | `var(--pipe)` |
| `--orders-soft` | `var(--pipe-soft)` |

---

## Type & chrome

- **Type:** system UI stack (`-apple-system`, `"Segoe UI"`, PingFang / Hiragino / YaHei, sans-serif). Tabular nums where counts matter; stage shorts may use mono.
- **No** display Google fonts (tool feel, fast load).
- **Width:** `max-width: var(--measure)` — single column.
- **Radius:** 6px cards; progress dots round.
- **Shadow:** none (or whisper at most); prefer **1px border** on `--line`.
- **Accent ≤ 5%** of UI surface; urgent and action bars carry the signal.

---

## Signature element

**「待办 / 卡点」action bar spine** — every card’s visual backbone is the next-step line (warm `--action-bg` + strong action copy). Focus-strip urgent counts use `--urgent`. The whole board should read as “what do I do next?” not a generic kanban skin.

---

## Product layers (IA reminder)

| Layer | Question | Source |
|-------|----------|--------|
| **Today** | What to reply / chase / send now? | todo `priority: P0\|P1` |
| **Pipeline** | Where is each order (OS→…→ship)? | `orders` + `stage:` |
| **Later** | Watch optionally | `priority: P2` |
| **Dock** | Meetings today / this week | frontmatter `meetings:` |

Hard rules: title = mailbox search string; todo = you move; order = project position; `action` is the card’s main sentence.

---

## Non-goals

- No Spark / enterprise mail API; no live mailbox sync  
- No quote calc, product selection, or send-mail UI in Desk  
- No 7-column desktop Kanban as primary view (phone / narrow is a main surface)  
- No FYI / 知会 column regression  
- No forced `board.md` field renames (optional fields only; old fields keep parsing)  
- No purple gradients, bento card walls, glassmorphism, heavy shadows  
- No Hub-style dark bands or marketing hero treatment  
- No amount / secret attachment content on the public static site  

---

## Success (tokens slice)

- [x] Tokens locked in `design.md` + `:root`  
- [x] Legacy aliases present (`--paper`, `--card`, `--muted`, `--orders`, …)  
- [ ] Full IA / card redesign (later tasks)  
- [ ] `board.md` zero-change build still correct after component work  

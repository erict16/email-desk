# Email Desk — design system

**Product:** Email Desk (personal dispatch board)  
**Audience:** Eric (overseas sales) — internal; shareable status view  
**Date:** 2026-07-30  
**Scope:** cool instrument desk · geometric mark · ball-in-court IA  

---

## Audience & job

| | |
|--|--|
| **Who** | Eric — mail-driven sales workflow |
| **Job** | Decide next mail action + see where each order sits |
| **Open-in-3s** | 要我动 count, next spines, meetings, pipeline |
| **Not** | Public marketing page, buyer catalogue, or mail client |

---

## Aesthetic direction

**Ink neutral** — near-monochrome zinc desk. Almost no color.  
Only loud hue: **red** for 要我动 / P0. Mark is black tile + red notch.

Rejected: warm cream paper, teal hospital green, navy candy pipeline, floating pills.

**Signature:** black tray-stack mark; red only on urgency counts and P0 rail.

---

## Tokens

| Role | Token | Hex | Note |
|------|-------|-----|------|
| Page | `--bg` | `#fafafa` | Zinc-50 |
| Surface | `--surface` | `#ffffff` | Cards / header |
| Ink | `--ink` | `#18181b` | Zinc-900 |
| Mute | `--mute` | `#52525b` | Secondary |
| Faint | `--faint` | `#a1a1aa` | Meta |
| Line | `--line` | `#e4e4e7` | Hairlines |
| Urgent | `--urgent` | `#dc2626` | **Only** loud color |
| Action bg | `--action-bg` | `#f4f4f5` | 待办 — gray, not green |
| Action ink | `--action-ink` | `#18181b` | Black text |
| Wait bg | `--wait-bg` | `#fafafa` | 等待 |
| Wait ink | `--wait-ink` | `#71717a` | Quiet |
| Pipeline | `--pipe` | `#3f3f46` | Charcoal, not navy |
| Pipe soft | `--pipe-soft` | `#f4f4f5` | Soft stage |
| Mark | `--mark-bg` | `#18181b` | Black tile |
| Mark dot | `--mark-dot` | `#dc2626` | Red signal |
| Radius | `--radius` | `8px` | Cards |
| Measure | `--measure` | `44rem` | Narrower scan |

### Migration aliases

`--paper` → bg · `--card` → surface · `--muted` → mute · `--orders` → pipe

---

## Logo / mark

Geometric **tray stack** (three lines + red signal dot) on black tile.

- Header: SVG `DeskMark` (currentColor-friendly CSS vars)
- Favicon / PWA: `python scripts/icons/build-mark.py` (or `.venv-icons`)
- Bump `ASSET_V` in `src/lib/brand.ts` after icon ship

---

## Chrome

| Element | Treatment |
|---------|-----------|
| **Header** | Sticky white bar, black mark, black PDF button |
| **Footer** | Quiet links, no color noise |
| **Focus strip** | One grid, ink numbers; only 要我动 count in red |
| **Cards** | No shadow; gray spines; P0 red left rail only |

---

## Product layers (IA)

| Layer | Question | Source |
|-------|----------|--------|
| **要我动** | Act now? | P0/P1 and not waiting |
| **等对方** | Ball elsewhere? | `ball: them` or `wait:` |
| **订单管线** | Stage? | `stage:` |
| **稍后** | Optional | P2 not waiting |
| **会** | Meetings | frontmatter |

Red bar: **要我动 ∩ P0 only**.

---

## Non-goals

- No Spark / live mailbox API  
- No warm-paper / floating-pill / girl-photo mark regression  
- No 7-col Kanban primary  
- No FYI on main board  
- No amounts / secret attachments on public site  

---

## Success

- [x] Cool stone + teal signal tokens  
- [x] Geometric mark + cache-bust ASSET_V  
- [x] Header / footer rebuild  
- [x] Ball-in-court IA preserved  

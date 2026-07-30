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

**Cool instrument desk** — cold stone canvas, teal signal, navy pipeline.  
Not warm cream paper, not floating-pill chrome, not purple SaaS.

**Signature:** teal left-edge on「待办 ·」spines + tray-stack mark (three lines + gold notch).

---

## Tokens

| Role | Token | Hex | Note |
|------|-------|-----|------|
| Page | `--bg` | `#e8eaee` | Cool stone |
| Surface | `--surface` | `#ffffff` | Cards / header |
| Ink | `--ink` | `#0b1220` | Primary text |
| Mute | `--mute` | `#5c6570` | Secondary |
| Faint | `--faint` | `#8b939e` | Meta |
| Line | `--line` | `#d5dae2` | 1px rules |
| Signal | `--signal` | `#0f6b5c` | Brand teal / PDF btn / mark |
| Urgent | `--urgent` | `#c81e1e` | P0 rail only |
| Action bg | `--action-bg` | `#dceee9` | 待办 spine |
| Action ink | `--action-ink` | `#0a5c4d` | 待办 text |
| Wait bg | `--wait-bg` | `#eef0f3` | 等待 spine |
| Wait ink | `--wait-ink` | `#5a616c` | 等待 text |
| Pipeline | `--pipe` | `#1a3a6b` | Stage / 卡点 |
| Pipe soft | `--pipe-soft` | `#e6edf6` | Soft stage |
| Follow | `--follow` | `#8a5a12` | Cross-links |
| Radius | `--radius` | `10px` | Cards |
| Measure | `--measure` | `48rem` | Scan width |

### Migration aliases

`--paper` → bg · `--card` → surface · `--muted` → mute · `--orders` → pipe

---

## Logo / mark

Geometric **tray stack** (three horizontal lines + gold signal dot) on teal tile.

- Header: SVG `DeskMark` (currentColor-friendly CSS vars)
- Favicon / PWA: `python scripts/icons/build-mark.py` (or `.venv-icons`)
- Bump `ASSET_V` in `src/lib/brand.ts` after icon ship

---

## Chrome

| Element | Treatment |
|---------|-----------|
| **Header** | Full-width sticky surface, hairline bottom, mark + wordmark + 邮件调度, teal PDF |
| **Footer** | Surface band, mark + short blurb, Tools / Legal columns |
| **Focus strip** | Four separate chips with top tone bar (not one heavy divided card) |
| **Cards** | Soft shadow whisper, spine with left edge accent |

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

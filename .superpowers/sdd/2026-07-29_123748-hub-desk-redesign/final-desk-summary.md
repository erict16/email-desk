# Final desk branch
48a6dd8 docs(desk): README for dispatch IA
0729bf5 feat(desk): Today / Pipeline / Later dispatch IA
6cfc439 feat(desk): action and pipeline cards with cross-link slots
87373e4 feat(desk): copy title for mailbox search
3dd7aa3 feat(desk): title key and Today/Pipeline/Later view model
901f1f4 style(desk): lock warm dispatch tokens and design.md
363b1e5 chore: desk 2026-07-29
 README.md                      |  43 ++++--
 content/board.md               | 285 ++++++++++++++++++----------------------
 design.md                      | 106 +++++++++++++++
 package.json                   |   3 +-
 scripts/check-board-view.mjs   |  66 ++++++++++
 src/app/globals.css            | 161 ++++++++++++-----------
 src/components/ActionCard.tsx  |  97 ++++++++++++++
 src/components/Board.tsx       | 287 +++++++++++++++++++++++++----------------
 src/components/Card.tsx        |  24 +---
 src/components/CopyTitle.tsx   |  69 ++++++++++
 src/components/FocusStrip.tsx  | 124 ++++++++++++++++++
 src/components/OrderCard.tsx   |  95 +++++++-------
 src/components/SiteFooter.tsx  |  19 +++
 src/components/StatsNav.tsx    |  55 ++------
 src/components/WorkflowKit.tsx |  80 ++++++++++++
 src/lib/board-view.ts          |  58 +++++++++
 src/lib/tag-class.ts           |  19 +++
 src/lib/title-key.ts           |   4 +
 18 files changed, 1122 insertions(+), 473 deletions(-)

# Final hub branch
a1fefc0 docs(hub): README after docs-first redesign
3d9ad43 style(hub): mono model column and catalogue polish
a73f58c feat(hub): docs-first home IA without howto block
cfea272 style(hub): IBM Plex cold-paper design system
 README.md                           |   8 +-
 design.md                           |  31 +--
 docs/designs/2026-07-29-redesign.md | 377 ++++++++++++++++++++++++++++++++++++
 src/app/globals.css                 | 301 +++++++++++++++++-----------
 src/app/layout.tsx                  |  20 +-
 src/components/DownloadExplorer.tsx |  90 ++++-----
 src/components/DownloadsPage.tsx    |   2 +-
 src/components/HomePage.tsx         | 115 +++++------
 src/components/ProductsPage.tsx     |  70 ++++---
 src/components/SiteFooter.tsx       |   7 +-
 src/components/SiteHeader.tsx       |   4 +-
 src/lib/i18n.ts                     |  81 +++-----
 12 files changed, 766 insertions(+), 340 deletions(-)

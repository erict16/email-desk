# Email Desk

Eric 的邮件跟进看板（GitHub Pages）。

**线上：** https://erict16.github.io/email-desk/

## 日常怎么更新（只改 Markdown）

编辑：

```text
content/board.md
```

### 结构

```markdown
---
title: 邮件跟进清单
subtitle: Eric Tan · Inbox + Sent
updated: 2026-07-21
badge:
priorities:
  - 本周第一优先
  - 第二
  - 第三
---

## todo | 你要处理

### 卡片标题
- priority: P0   # P0 | P1 | P2 | OK | FYI
- meta: 来自谁 · 时间 · 状态
- action: 你要做什么（会高亮「做什么」）

## done | 已推进

### 已完成事项
- priority: OK

## fyi | FYI

### 旁听事项
- priority: FYI
- action: 谁主跟
```

改完 `git commit` + `push` → Actions 自动部署 Pages。

## 本地开发

```bash
npm install
npm run dev
# http://localhost:3000
```

## 技术

- Next.js static export (`output: "export"`)
- Tailwind CSS v4 + glassmorphism
- `gray-matter` 解析 frontmatter
- 内容与 UI 分离：主体代码不动，只动 `content/board.md`

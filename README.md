# Email Desk

Eric 的邮件跟进看板（公开 GitHub Pages）。

**线上：** https://erict16.github.io/email-desk/  
**仓库：** `C:\Users\TYM\repo\email-desk` · `erict16/email-desk`

---

## 日常怎么更新（只改 Markdown）

只编辑：

```text
content/board.md
```

然后：

```bash
git add content/board.md
git commit -m "chore: desk YYYY-MM-DD"
git push origin main
```

Actions 自动 `next build` → 部署 `out/`。  
**禁止**手改/覆盖根目录 `index.html` 或 `out/` 当日常内容源。

---

## Eric 的内容与文案规则（必读）

### 1. 标题（方便邮箱搜索）

- 格式：`[PO/QS/客户+主题关键词] — 动作摘要`
- 要能**整段复制 → 粘贴进企业邮搜索**命中原信
- 例：
  - `Sanaky BSHV Air bill — 空运文件包 Invoice PL CQ TR Form E`
  - `PO26-025 EEMC — Kimmy 要全套附件+沟通邮件`
  - `HAVEC QS2607196R1 ET-SZ6 — 审批图放行`

### 2. Tag（谁 + 干什么，禁止空标签）

Tag 必须是**人话短句**，一眼知道卡在哪，**禁止**孤零零的状态词。

| ✅ 好 | ❌ 差 |
|------|------|
| 待你发 Invoice/PL/CQ/TR/Form E | 待发单证 |
| 待客户确认外形/3D 图 | 待客户 |
| 待工厂给新提货日 | 等工厂 |
| 待沈工回 QJ6-25 型号 | 等型号 / 等工程 |
| 待放行审批图给 Hoa | 待放图 |
| 需尽快 | ~~今日死线~~（难听，禁用） |

一条卡 1–2 个 tag 即可；颜色按语义自动上色（见 `Card.tsx`）。

### 3. 发件人

- 字段 `people:` 展示为 **`发件人：`**（不要写「相关：」）
- 写名字/公司，如 `Trung (Sanaky)`、`李倩`

### 4. 待办条

- UI 固定文案：**`待办 ·`**（浅黄底）
- 写**你下一步**，短句；不要写成长篇 meta

### 5. 分区与四块统计

| 统计块（可点跳转） | 计数来源 |
|-------------------|----------|
| 紧急处理 | `priority: P0` |
| 需跟进 | `P1` + `P2` |
| 已完成 / 进展 | `OK` |
| 知会 / 内部 | `FYI` |

列表按这四块渲染（锚点 `#block-urgent` 等）。  
数字颜色对标 WorkBuddy：**平滑红 `#e53e3e`** / 橙 / 绿 / 蓝（不要刺眼的 rose 粉红）。

### 6. 会议（替代「本周优先」）

frontmatter 用 `meetings:`，UI 标题 **需参加的会议**：

```yaml
meetings:
  - 周四 7/23 10:30 Teams — HMSG Trading Process（…）
```

### 7. 更新时间

```yaml
updated: "2026-07-22 10:10"   # 务必加引号；可带时分
tz: Asia/Shanghai             # 现在北京；出差新加坡改为 Asia/Singapore
```

页眉显示类似：`Eric Tan · Inbox + Sent · 更新 7月22日 10:10`（短，不甩 GMT）。

### 8. 收信规则（写 board 前）

- **Inbox + 已发送** 对照；Sent 已回的要关掉或降到 done
- CQ / Test Report = Eric；CO = 沈丽玲
- 公开站勿贴未脱敏金额/完整机密附件内容

### 9. 其他 UI 锁

- 宽度约 `max-w-3xl`；Linear/Notion 白灰
- Sticky 头：Girl logo + Email Desk + 分享 + 下载
- P0 仅左侧细红条，**不要** P0 文字 chip
- Favicon：圆角透明角（`public/favicon.png`）

---

## board.md 模板

```markdown
---
title: 邮件跟进清单
subtitle: Eric Tan · Inbox + Sent
updated: "2026-07-22 10:10"
tz: Asia/Shanghai
meetings:
  - 会议一句（时间·主题·谁）
---

## todo | 你要处理

### PO26-025 EEMC — 一句话可搜标题
- priority: P0
- date: 7/22
- meta: 背景一句
- tags: 需尽快, 待你打包附件+往来邮件
- people: 李倩
- action: 下一步

## done | 已推进

### … 
- priority: OK
- tags: 已发 SOA 对账表

## fyi | 知会

### …
- priority: FYI
- tags: 询价非你主谈, 旁听即可
```

`## id | 标题` 的 id 仍可写 `todo/done/fyi`（解析保留）；**展示分区以 P0/P1/P2/OK/FYI 为准**。

---

## 本地开发

```bash
npm install
npm run dev
# http://localhost:3000
```

生产构建：

```bash
npm run build   # → out/ + basePath /email-desk
```

## 技术

- Next.js App Router · `output: "export"` · `basePath: /email-desk`
- Tailwind CSS v4
- `gray-matter` 解析 `content/board.md`
- GitHub Actions → Pages

## 相关 skill

- Hermes：`qq-email`（收发）· `huaming-email-style`（语气）
- UI/文案细则也会写在 `qq-email/references/email-desk-ui.md` 与 greenfield 的 markdown-board 参考里

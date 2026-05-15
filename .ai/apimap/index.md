# APIMap 入口

## 查找順序
1. 先看本文件
2. 再看 `.ai/apimap/domains/*.md`
3. 最後進入 `.ai/apimap/modules/*.md`

## Domain 導覽
- `domains/ui.md` — React 元件、頁面、路由
- `domains/db.md` — Firestore 集合結構、安全規則
- `domains/server.md` — Firebase Functions、Cloud 後端
- `domains/network.md` — Firebase Auth、Google Calendar API
- `domains/client.md` — Vite 建置、Tailwind 設定

## 核心模組
- `modules/auth.md` — 認證與管理員權限
- `modules/booking.md` — 課程預約流程
- `modules/admin.md` — 管理後台功能

## 常見問題 -> 應讀文件
- 報名流程問題：`modules/booking.md`, `domains/ui.md`
- 權限/白名單問題：`modules/auth.md`, `domains/db.md`
- 部署問題：`domains/client.md`, `domains/server.md`
- Calendar 同步問題：`domains/network.md`

## 搜尋關鍵字
- 報名、預約、booking、registration
- 管理員、admin、白名單
- Firestore、rules、安全規則
- Calendar、日曆、同步
- Firebase Functions、通知、SMTP

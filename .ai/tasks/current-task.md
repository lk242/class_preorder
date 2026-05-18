# Current Task

## 目標
- ~~修復 CourseContext 全域 registrations 監聽重複問題~~ ✅
- ~~重建 .ai/ 目錄結構（照 DC1 模組標準）~~ ✅
- ~~Navbar 手機版漢堡選單~~ ✅
- ~~修復報名失敗：Firestore 規則未允許一般使用者更新 currentParticipants~~ ✅
- ~~新增管理員 9m.wowsai@gmail.com~~ ✅

## 涉及模組
- `firestore.rules` — 修正 courses update 規則、新增管理員 email
- `.env` — 新增管理員 email 到 VITE_ADMIN_EMAILS
- `src/components/Navbar.jsx` — 手機版漢堡選單
- `src/contexts/CourseContext.jsx` — 移除全域 registrations 監聯

## 當前結論
- 所有修改已部署上線（hosting + firestore rules）
- 管理員白名單：lukewolf899、forst228、9m.wowsai
- 等待使用者手機端確認報名流程正常

## 待辦
- [ ] 使用者手機端確認報名成功
- [ ] commit push 最新的 firestore.rules 變更
- [ ] 設定 SMTP secrets 後部署 Firebase Functions
- [ ] 在 Google Cloud Console 啟用 Calendar API

## 不要寫進這裡的內容
- 長期穩定規則
- 可跨任務重用的 skill
- 專案架構總結

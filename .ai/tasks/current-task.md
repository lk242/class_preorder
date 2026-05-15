# Current Task

## 目標
- 修復 CourseContext 全域 registrations 監聽重複問題（已完成）
- 重建 .ai/ 目錄結構（照 DC1 模組標準）
- 將專案加入全域 apply-project-ai-standards.js

## 涉及模組
- `src/contexts/CourseContext.jsx` — 移除全域 registrations 監聽，改用 course.currentParticipants
- `.ai/` — 整個目錄結構重建
- `C:/Users/forst899/Scripts/apply-project-ai-standards.js` — 加入 course-app

## 當前結論
- CourseContext 不再全域監聽 registrations 集合
- 報名人數改由 `courses.currentParticipants` 欄位追蹤（addRegistration 時 +1，removeRegistration 時 -1）
- AdminPage 保留自己的 registrations onSnapshot（僅管理後台需要完整名單）

## 待辦
- [ ] 驗證部署後 currentParticipants 計數正確
- [ ] 設定 SMTP secrets 後部署 Firebase Functions
- [ ] 在 Google Cloud Console 啟用 Calendar API

## 不要寫進這裡的內容
- 長期穩定規則
- 可跨任務重用的 skill
- 專案架構總結

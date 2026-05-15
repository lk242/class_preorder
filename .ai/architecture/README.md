# 架構總覽

## 系統邊界
- **前端 SPA**：React 單頁應用，部署於 Firebase Hosting
- **資料庫**：Cloud Firestore（courses, registrations, appSettings）
- **認證**：Firebase Auth（Google 登入），管理員以 email 白名單控制
- **後端邏輯**：Firebase Functions（報名觸發 → 通知信）
- **外部服務**：Google Calendar API（管理員同步）、Google Calendar URL（報名者加日曆）

## 核心流程

### 報名流程
1. 報名者在 `/booking` 選日期 → 選課程 → 填表 → 送出
2. `RegModal` 呼叫 `CourseContext.addRegistration()` → 寫入 Firestore `registrations` + 更新 `courses.currentParticipants`
3. 成功後顯示 `SuccessModal`，提供 Google Calendar URL

### 管理流程
1. 管理員通過 Logo 五連點進入 `/admin/login` → Google 登入
2. `ProtectedRoute` 驗證 `isAdmin`（email 白名單）
3. AdminPage：新增/刪除課程、查看報名名單、同步 Google Calendar、設定通知

## 資料流
- **Courses**：Firestore `courses` → `CourseContext`（onSnapshot 即時同步）→ 所有頁面
- **Registrations**：只在 AdminPage 和 MyBookingsPage 按需查詢
- **Auth**：Firebase Auth → `AuthContext` → Navbar / ProtectedRoute / AdminPage
- **Notifications**：Firestore `appSettings/notifications` → AdminPage 管理 → Functions 讀取

## 重要模組
- `CourseContext`：全域課程狀態，含 CRUD 和報名人數計算
- `AuthContext`：認證狀態、管理員判斷、Google OAuth token
- `AdminPage`：後台所有管理功能集中於此
- `functions/index.js`：報名通知 Cloud Function

## 已知風險
- `currentParticipants` 計數若與實際 registrations 數量不同步，需手動校正
- Google Calendar API 需在 Cloud Console 啟用才能使用管理員同步功能
- SMTP secrets 未設定前，Functions 部署後不會發送通知信

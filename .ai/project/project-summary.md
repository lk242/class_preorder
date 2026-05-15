# 專案摘要

## 專案名稱
- `course-app`（宇宙光語課程預約系統）

## 目標
- 提供宇宙光語工作室的線上課程預約平台，含管理後台與報名者前台。

## 技術棧
- **前端**: React 19 + Vite 8 + Tailwind CSS v4
- **後端**: Firebase (Hosting / Firestore / Auth / Functions)
- **部署**: Firebase Hosting 雙站點 — `9m-wowsai.web.app` + `cosmic-course-booking.web.app`

## 啟動方式
```bash
npm install
npm run dev        # 本機開發（Vite dev server）
npm run build      # 生產建置 → dist/
npx firebase-tools deploy --only hosting           # 部署前端
npx firebase-tools deploy --only firestore:rules   # 部署 Firestore 規則
npx firebase-tools deploy --only functions          # 部署 Cloud Functions
```

## 核心路徑
- 專案根目錄：`C:/Users/forst899/CLI_Test/course-app`
- 主要程式碼目錄：`src/`
- 頁面：`src/pages/`（HomePage, BookingPage, AdminPage, LoginPage, MyBookingsPage）
- 元件：`src/components/`（Navbar, Calendar, CourseCard, RegModal, SuccessModal, ProtectedRoute）
- 上下文：`src/contexts/`（AuthContext, CourseContext）
- Firebase 設定：`src/config/firebase.js`
- Cloud Functions：`functions/index.js`
- Firebase 設定檔：`firebase.json`, `.firebaserc`, `firestore.rules`

## 先讀哪裡
1. `.ai/project/project-summary.md`（本文件）
2. `.ai/tasks/current-task.md`
3. `.ai/architecture/README.md`
4. `.ai/apimap/index.md`
5. 與當前問題最相關的 `.ai/apimap/modules/*.md`

## 目前狀態
- 核心功能已完成並部署
- Firebase Functions 報名通知信已寫好，待設定 SMTP secrets 後部署
- Google Calendar API 需在 Google Cloud Console 啟用

## 備註
- `.env` 含 Firebase API keys，已加入 `.gitignore` 不推上 git
- 管理員白名單同時定義在 `.env`（前端）和 `firestore.rules`（後端），兩處都要更新

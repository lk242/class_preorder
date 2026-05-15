# Project Skills

## Firebase 部署流程
1. `npm run build` — 確認建置成功
2. `npx firebase-tools deploy --only hosting` — 部署前端
3. `npx firebase-tools deploy --only firestore:rules` — 部署安全規則
4. `npx firebase-tools deploy --only functions` — 部署 Cloud Functions（需 SMTP secrets）

## 新增管理員流程
1. 更新 `.env` 的 `VITE_ADMIN_EMAILS`，加入新 email
2. 更新 `firestore.rules` 的 `isAdmin()` 函式
3. 重新 build + 部署 hosting 和 firestore rules

## 新增課程欄位流程
1. 更新 `AdminPage.jsx` 的 `EMPTY_COURSE` 和表單
2. 更新 `CourseCard.jsx` 的顯示
3. 更新 `CourseContext.jsx` 的 `addCourse()`
4. 確認 Firestore 安全規則允許新欄位

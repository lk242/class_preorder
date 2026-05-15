# Firebase 部署注意事項

## 雙站點 Hosting
- `.firebaserc` 中 hosting target `main` 對應 site `9m-wowsai`
- `firebase.json` 中另有直接指定 `site: cosmic-course-booking`
- 部署指令：`npx firebase-tools deploy --only hosting`

## 管理員白名單需雙重更新
- 前端：`.env` 的 `VITE_ADMIN_EMAILS`（逗號分隔）
- 後端：`firestore.rules` 的 `isAdmin()` 函式中的 email 陣列
- 兩處不一致會導致前端允許登入但 Firestore 拒絕寫入

## Firestore 規則部署
- 新建的 Firestore 資料庫預設 deny-all
- 規則更新後可能有傳播延遲（數分鐘），尤其是新建資料庫
- 部署指令：`npx firebase-tools deploy --only firestore:rules`

## Firebase Auth 網域
- 新增 Hosting 站點後，需在 Firebase Console → Authentication → Settings 加入 authorized domain
- 否則 Google 登入會報 `auth/unauthorized-domain`

## .env 安全
- `.env` 已加入 `.gitignore`，不推上 git
- `.env.example` 提供空值範本給其他開發者

# Google Calendar 整合架構

## 管理員同步（OAuth API）
- 使用 Google Calendar API v3
- 需要 OAuth access token（Calendar scope: `https://www.googleapis.com/auth/calendar.events`）
- 程式碼：`src/utils/calendar.js` → `syncAllCoursesToCalendar()`
- 前提：需在 Google Cloud Console 啟用 Calendar API（project 129538291927）
- 未經 Google 驗證的 app 會顯示警告畫面，管理員需點「進階 → 前往」

## 報名者加日曆（URL 方式）
- 不需要 OAuth，使用公開的 Google Calendar URL scheme
- 程式碼：`src/utils/calendar.js` → `buildCalendarUrl()`
- 在 SuccessModal 和 MyBookingsPage 中使用
- URL 格式：`https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...`

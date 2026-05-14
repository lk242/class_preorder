# Change Log

## 2026-05-14

- Added `.ai/current.md` to track the active workflow for this repo.
- Added `.ai/skill.md` to track repo changes requested for future work sessions.
- Updated `src/contexts/AuthContext.jsx` so Google sign-in creates a fresh `GoogleAuthProvider` per login and does not retain scopes across attempts.
- Updated `src/pages/LoginPage.jsx` to translate common Firebase Auth error codes into actionable Chinese messages for deployment troubleshooting.
- Updated `src/config/firebase.js` to remove the unused shared `googleProvider` export after moving provider creation into the login flow.
- Installed repo-local npm dependencies with `npm.cmd install` for verification.
- Added `postcss.config.js` in the repo root to stop Vite from inheriting the parent workspace's old Tailwind/PostCSS config.
- Verification result: `npm.cmd run build` now succeeds for this repo.
- Deployed the current `dist` build to Firebase Hosting with `npx firebase-tools deploy --only hosting`.
- Deployment targets released successfully:
  - `https://9m-wowsai.web.app`
  - `https://cosmic-course-booking.web.app`
- Added `.env` with Firebase Web SDK config for project `cosmic-course-booking`.
- Set `VITE_ADMIN_EMAILS=lukewolf899@gmail.com,forst228@gmail.com`.
- Rebuilt and redeployed the app after populating the Firebase environment variables.
- Updated Firebase Authentication `authorizedDomains` via API to add `9m-wowsai.web.app`.
- Reworked `src/components/RegModal.jsx` to make registration submission asynchronous, add pending/error states, and replace corrupted validation copy with readable Chinese.
- Updated `src/components/CourseCard.jsx`, `src/components/Calendar.jsx`, `src/pages/BookingPage.jsx`, `src/components/Navbar.jsx`, `src/components/SuccessModal.jsx`, `src/pages/HomePage.jsx`, and `src/pages/MyBookingsPage.jsx` for more stable mobile layouts and readable UI text.
- Verification result: `npm.cmd run build` succeeds after the booking and responsive UI fixes.
- Deployed the latest fixes to:
  - `https://9m-wowsai.web.app`
  - `https://cosmic-course-booking.web.app`
- Reworked `src/pages/AdminPage.jsx` for narrow-screen admin usability and replaced corrupted admin labels with readable Chinese copy.
- Redeployed the admin mobile layout fix to both Firebase Hosting sites.
- Updated `src/components/RegModal.jsx` to trigger registration with an explicit button click instead of relying on form submit inside the modal.
- Updated `firestore.rules` so registration delete/update permissions include both admin emails.
- Deployed both `hosting` and `firestore:rules` together to align the live frontend with live Firestore permissions.
- Reworked `src/contexts/CourseContext.jsx` to stop globally subscribing to all registrations and to maintain per-course participant counts on the course document.
- Updated `src/App.jsx` to lazy-load page routes, reducing initial mobile payload.
- Reworked `src/pages/AdminPage.jsx` to manage registration-list listening locally and added admin email notification toggle/settings UI backed by Firestore.
- Updated `firebase.json` to include a `functions` codebase and `firestore.rules` to allow admin access to `appSettings`.
- Added Firebase Functions backend files under `functions/` for registration-created email notifications via SMTP secrets.
- Installed `functions` dependencies locally and validated the function file syntax with `node -c index.js`.
- Deployed the frontend and Firestore rules for the mobile performance improvements and notification toggle UI.

# Current Workflow

## 2026-05-14

- Repo set to `C:\Users\LK\開發\class_web\class_preorder` as the primary development target.
- Established `.ai` as the place for ongoing workflow and change records.
- Investigating deployed admin login failure after Google sign-in on the live web app.
- Completed in this workflow:
  - inspected Firebase auth configuration flow
  - improved runtime error diagnostics for Google login
  - installed repo-local npm dependencies for verification
- Findings:
  - the deployed login failure is most likely a Firebase Auth configuration issue on the deployment domain, especially `auth/unauthorized-domain` or disabled Google provider
  - the local production build failure was caused by parent-workspace PostCSS/Tailwind configuration leaking into this repo
- Next likely task:
  - verify the exact Firebase error on the deployed site after redeploy
  - redeploy after the login diagnostics update and verify the runtime auth error

## 2026-05-14 Tailwind Build Fix

- Investigated the failing production build in this repo.
- Confirmed `src/index.css` only contains `@import "tailwindcss";` and is valid for Tailwind v4.
- Found the actual issue: Vite/PostCSS was reading ancestor configuration from `C:\Users\LK\開發\class_web\postcss.config.js`, which is for an older Tailwind setup.
- Added a repo-local `postcss.config.js` to isolate this project from the parent workspace config.
- Verified `npm.cmd run build` now succeeds.

## 2026-05-14 Deployment Attempt

- Verified Firebase project mapping from `.firebaserc`:
  - default project: `cosmic-course-booking`
  - hosting target `main` mapped to site `9m-wowsai`
- Attempted deploy with `npx firebase-tools deploy --only hosting`.
- Initial deployment was blocked by missing Firebase CLI authentication on this machine.
- After Firebase login was completed, deployment succeeded to both configured hosting sites.
- Live URLs:
  - `https://9m-wowsai.web.app`
  - `https://cosmic-course-booking.web.app`

## 2026-05-14 Firebase Env Setup

- Retrieved Firebase Web App configuration directly from the authenticated Firebase project.
- Added repo-local `.env` with the active Firebase Web config.
- Added admin emails:
  - `lukewolf899@gmail.com`
  - `forst228@gmail.com`
- Rebuilt the app with populated `VITE_FIREBASE_*` variables.
- Redeployed the updated build to both Firebase Hosting sites.

## 2026-05-14 Auth Domain Fix

- Investigated the runtime Firebase login error returned from the deployed admin login page.
- Read the Firebase Authentication project config through the Google Identity Toolkit Admin API.
- Confirmed `authorizedDomains` was missing `9m-wowsai.web.app`.
- Updated Firebase Authentication `authorizedDomains` to include:
  - `localhost`
  - `cosmic-course-booking.firebaseapp.com`
  - `cosmic-course-booking.web.app`
  - `9m-wowsai.web.app`

## 2026-05-14 Booking And Mobile Fix

- Investigated the user-reported booking issue where pressing the registration button appeared to do nothing.
- Root cause found in the submission flow:
  - registration submit was not awaiting Firestore write completion
  - there was no visible pending state or explicit failure feedback
  - form validation and several UI messages were corrupted by bad text encoding, which made failures look like a dead button
- Updated the booking flow to:
  - await registration writes
  - show a submitting state
  - show explicit submission failure messages
  - show clearer validation errors
- Updated the main booking-facing UI for smaller screens:
  - navbar
  - home page
  - booking page
  - calendar
  - course cards
  - registration modal
  - success modal
  - my bookings page
- Verification:
  - `npm.cmd run build` succeeds after these changes
- Deployment:
  - deployed the booking-flow and mobile-layout fixes to both Firebase Hosting sites
- Next likely step:
  - verify admin page layout on narrow mobile screens

## 2026-05-14 Admin Mobile Fix

- Investigated a follow-up mobile layout issue on `/admin`.
- Confirmed the admin page still used desktop-first layout and contained multiple corrupted labels.
- Rebuilt `src/pages/AdminPage.jsx` with:
  - stacked mobile header/actions
  - mobile-safe form grids
  - readable Chinese labels
  - safer async create flow for new courses
  - horizontally scrollable registrations table on small screens
- Verification:
  - `npm.cmd run build` succeeds after the admin page update
- Deployment:
  - deployed the responsive admin page fix to both Firebase Hosting sites

## 2026-05-14 Registration Submission Follow-up

- Investigated a continued mobile issue where tapping the registration confirmation button still appeared to do nothing.
- Applied two follow-up fixes:
  - changed the registration action from form submit to an explicit button click handler for safer iPhone/Safari behavior inside the modal
  - deployed Firestore security rules together with hosting, instead of deploying hosting alone
- Firestore deployment note:
  - prior work had only deployed hosting updates
  - this run explicitly deployed `firestore.rules`
- Also updated registration delete permissions so both admin emails can remove registrations.

## 2026-05-15 Mobile Performance And Notification Toggle

- Investigated the broader mobile slowdown concern.
- Frontend performance changes implemented:
  - route-level lazy loading for all pages
  - removed the global real-time listener on the entire `registrations` collection from `CourseContext`
  - changed participant counting to use `courses.currentParticipants`
  - moved full registration-list listening into `AdminPage` only
- Result from build output:
  - route chunks are now split into smaller page files instead of one large app bundle
  - main app bundle reduced substantially, with page bundles loaded on demand
- Added notification settings in admin:
  - Firestore document path: `appSettings/notifications`
  - settings include:
    - `adminRegistrationEmailEnabled`
    - `adminNotificationEmails`
- Added Firebase Functions backend code:
  - trigger on new registration creation
  - reads the notification toggle/settings document
  - sends email only when enabled
  - uses SMTP secrets, not hardcoded credentials
- Deployment status:
  - deployed `hosting` and `firestore.rules`
  - functions code is prepared and dependencies installed locally
  - final functions deployment still requires SMTP secret values to be configured

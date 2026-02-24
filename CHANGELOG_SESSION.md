# 📝 Session Changelog

## 🛠️ February 23, 2026

- **Secure Refresh Token Flow**: Implemented a robust multi-session refresh token system with rotation to enhance security and session persistence.
  - *Backend*: Added `RefreshToken` model, rotation logic in `authControllers.ts`, and token renewal endpoints.
  - *Frontend*: Integrated `axios` interceptors for seamless token refreshing and session persistence in NextAuth.
  File: `Backend/src/controllers/authControllers.ts` (`refreshToken`, `logout`), `frontend/lib/api.ts` (`apiClient`), `frontend/lib/auth.ts` (`jwt`, `session`)

- **Version Finalization & Deployment**: Committed and pushed all pending security, membership, and database changes to the repository.
  File: `Backend/src/index.ts`

- **Migration Sync**: Verified and confirmed that the production database schema is fully synchronized with the local Prisma membership model.
  File: `Backend/prisma/schema.prisma` (`RoomMember`, `RefreshToken`)

- **Database Integrity**: Configured cascading deletes for user and room-related data. Hosted rooms and memberships are automatically cleared on user deletion, and chat history is wiped when a room is removed. User chat history is preserved via `SetNull` to maintain conversation continuity after account deletion.
  File: `Backend/prisma/schema.prisma` (`User`, `Room`, `Chat`, `RoomMember`)

- **Repository Maintenance**: Cleaned up the local git state and established 'main' as the primary tracking branch for ongoing development.
  File: `CHANGELOG_SESSION.md`, `SYSTEM_ARCHITECTURE_AUDIT.md`

---

## 🛠️ February 19, 2026

- **Unauthorized Chat Access Fix**: Updated the `getChats` controller to verify room membership via the `RoomMember` relationship, ensuring privacy for room communications.
  File: `Backend/src/controllers/chatController.ts`

- **WebSocket Security Hardening**: Implemented membership validation for `join-room` and `chat` events to prevent unauthorized users from participating in or eavesdropping on rooms.
  File: `Backend/src/websockets/index.ts`

- **Identity Spoofing Prevention**: Re-secured LiveKit token generation to derive participant identity directly from the authenticated JWT (`req.userId`) instead of insecure query parameters.
  File: `Backend/src/controllers/livekitController.ts`

- **Session Security Enhancement**: Reduced LiveKit token TTL from 24 hours to **2 hours** to minimize the exploitation window for intercepted tokens.
  File: `Backend/src/controllers/livekitController.ts`

- **Database Synchronization**: Successfully synchronized the `RoomMember` table in the database and updated the Prisma schema to support membership-based authorization.
  File: `Backend/prisma/schema.prisma`

- **Infrastructure Stability**: Re-bound the backend server to `0.0.0.0` to resolve connectivity issues and ensure reliable access across local and production environments.
  File: `Backend/src/index.ts`

- **Frontend Auth Sync**: Removed redundant `participantName` query parameters when requesting LiveKit tokens, relying on server-side identity extraction.
  File: `frontend/app/call/[slug]/CallClient.tsx`

---

## 🛠️ February 17, 2026 (Session 2)

- **Production Rate Limiting**: Enabled `trust proxy` in the backend to ensure correct IP-based rate limiting when deployed behind load balancers (Render/Vercel).
  File: `Backend/src/index.ts`

- **WebSocket Connection Security**: Implemented `verifyClient` origin validation on the WebSocket server to prevent Cross-Site WebSocket Hijacking (CSWH).
  File: `Backend/src/websockets/index.ts`

- **Authentication Flow Standardization**: Standardized the use of `Authorization: Bearer <token>` headers across the frontend and removed brittle manual cookie interpolation.
  File: `frontend/lib/api.ts`

- **Secure Session Management**: Maintained `httpOnly` cookies in Next.js for secure SSR session retrieval while utilizing explicit headers for client-side API calls.
  File: `frontend/lib/getUser.ts`

- **Next.js Image Optimization**: Configured `remotePatterns` to securely allow user profile pictures from Google (`lh3.googleusercontent.com`).
  File: `frontend/next.config.ts`

- **Shared UI Components**: Created a reusable `UserAvatar` component to standardize user profile display across the application.
  File: `frontend/components/UserAvatar.tsx`

- **Exception Handling Refinement**: Added robust try-catch blocks and detailed error logging to core server-side fetching utilities.
  File: `frontend/lib/getWsToken.ts`


---

## 🛠️ February 17, 2026 (Session 1)

- **Rate Limiting Layer**: Implemented comprehensive protection against brute-force and DoS attacks across all endpoints.
  - *Login Limiter*: 5 requests per 15 minutes.
  - *General Limiter*: 60 requests per 15 minutes for public endpoints.
  - *User Limiter*: 100 requests per 15 minutes for authenticated users.
  File: `Backend/src/middleware/RateLimiter.ts`

- **Prisma Core Upgrade**: Upgraded Prisma CLI to version 7.0.0 to resolve build compatibility issues with the schema configuration.
  File: `Backend/package.json`

- **Production Environment Safety**: Added a strict validation layer to the backend server to ensure all critical environment variables are present on startup.
  File: `Backend/src/index.ts`

- **Developer Experience**: Created a `.env.example` template to standardize environment configuration for local development and deployments.
  File: `Backend/.env.example`

- **Rate Limiter Headers**: Enabled standard headers in the rate limiter middleware to provide clients with transparent quota information.
  File: `Backend/src/middleware/RateLimiter.ts`

- **Audit & Compliance**: Marked the rate limiting security gap as resolved in the system architecture audit.
  File: `SYSTEM_ARCHITECTURE_AUDIT.md`

---

## 🛠️ February 16, 2026 (Session 2)

- **Comprehensive Documentation**: Authored a detailed `README.md` covering project overview, tech stack, architecture, and deployment instructions.
  File: `README.md`

- **Header UI Refinement**: Improved navigation layout and responsiveness in the global Header component.
  File: `frontend/components/Header.tsx`

- **Call Client Polish**: Refined the video call interface for better user experience and visual consistency.
  File: `frontend/app/call/[slug]/CallClient.tsx`

---

## 🛠️ February 16, 2026

- **Secure Google Authentication**: Switched to server-side ID Token verification using `google-auth-library` to prevent impersonation.
  File: `Backend/src/controllers/authControllers.ts` (`GoogleLogin`)

- **Frontend Auth Sync**: Updated NextAuth `jwt` callback to send the Google `id_token` as a credential to the backend.
  File: `frontend/lib/auth.ts` (`jwt`)

- **Database Schema**: Added `provider` field to `User` model and ran Prisma migration.
  File: `Backend/prisma/schema.prisma` (`User`)

- **Backend Stability**: Resolved a production crash by exporting the JWT secret.
  File: `Backend/src/middleware/authMiddleware.ts` (`secret`)

- **WebSocket Auth Fix**: Updated to correctly use exported secret and verify WebSocket sessions.
  File: `Backend/src/middleware/wsAuthMiddleware.ts` (`wsAuthMiddleware`)

- **Routing Optimization**: Removed a redundant trailing slash from the chat API route.
  File: `Backend/src/index.ts`

- **File Rename**: Fixed typo in router file name from `UserRotuer.ts` to `UserRouter.ts`.
  File: `Backend/src/Routes/UserRouter.ts`

- **Audit Updates**: Marked critical Google Login and Identity Desync issues as fixed.
  File: `SYSTEM_ARCHITECTURE_AUDIT.md`

---

## 🛠️ January 29, 2026

- **Unread Message Notifications**: Implemented real-time visual indicators for unread messages in the chat interface.
  File: `frontend/components/Chat.tsx` (approx)

---

## 🛠️ January 24 - 25, 2026

- **NextAuth Integration**: Fully integrated Google Login using NextAuth.
  File: `frontend/lib/auth.ts`

- **Hybrid Auth Layer**: Bridges the gap between NextAuth social sessions and the legacy JWT authentication system.
  File: `frontend/app/api/auth/login-session/route.ts`

- **Automated Profile Sync**: Implemented automatic user creation and profile picture updates upon Google login.
  File: `Backend/src/controllers/authControllers.ts`

- **LiveKit Audio Fixes**: Resolved issues with audio transmission and added audio rendering.
  File: `frontend/app/call/[slug]/CallClient.tsx`

- **Voice Permission Update**: Added explicit `canPublish` and `canSubscribe` flags to tokens.
  File: `Backend/src/controllers/livekitController.ts`

- **Navbar Layout Fix**: Center-aligned global navigation links using absolute positioning.
  File: `frontend/components/Header.tsx`

- **UI Logic Update**: Unhidden Google Login buttons for better accessibility.
  File: `frontend/app/(auth)/signin/page.tsx`

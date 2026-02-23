# Gathera App - System Architecture Audit

This file tracks identified issues, bugs, and areas for improvement in the Gathera-app monorepo.

## 🛠 Backend Issues

### Project Structure & Configuration
- [x] **File Naming Typo**: `Backend/src/Routes/UserRotuer.ts` should be renamed to `UserRouter.ts`.
- [x] **Import Inconsistency**: Some files use `process.env.BACKEND_API_URL` while others use `NEXT_PUBLIC_API_URL` or a mix.
- [x] **Hallucinated Versions**: `package.json` specifies non-existent or pre-release versions (Prisma `^7.0.0`, Zod `^4.1.12`, Node Types `24.10.1`). *(Verified: These are valid latest versions)*
- [x] **Leaked JWT Secret**: The `secret` string is exported from `authMiddleware.ts`, allowing any part of the app to bypass intended encapsulation.
- [x] **Dev Script Inefficiency**: The `dev` script in `Backend` triggers a full build and sync run instead of utilizing a low-latency watch mode (like `tsx watch`).

### Security

#### 🔴 CRITICAL Priority
- [x] **Google Login Verification**: The `GoogleLogin` controller now validates the Google ID token using `google-auth-library` and extracts verified user data.
  - *Impact*: Complete authentication bypass - attackers can impersonate any user
  - *Effort*: Medium (integrate Google OAuth2 library for token verification)
  
- [x] **Rate Limiting Implemented**: Comprehensive rate limiting now protects all endpoints using `express-rate-limit`.
  - *Implementation*: Login (5 req/15min), General (60 req/15min), Authenticated Users (100 req/15min)
  - *Coverage*: All auth, room, chat, and LiveKit endpoints protected
  - *Note*: Currently in-memory; migrate to Redis when scaling horizontally
  - *Impact*: Prevents brute-force, DoS, and credential stuffing attacks
  - *Completed*: 2026-02-17

- [x] **⚠️ Missing `trust proxy` — Rate Limiter Blocks ALL Users**: Added `app.set('trust proxy', 1)` to `index.ts`. Without this, all requests behind a load balancer appear from the same IP, causing the rate limiter to block all users after a single user triggers the limit.
  - *Impact*: **Complete production outage** — all users blocked after a single user triggers the limit
  - *Effort*: Trivial (one line: `app.set('trust proxy', 1)` before rate limiter middleware)
  - *Completed*: 2026-02-17

- [x] **WebSocket Origin Security**: The WebSocket server now validates the `Origin` header against a whitelist to prevent Cross-Site WebSocket Hijacking (CSWH).
  - *Impact*: Prevents unauthorized sites from initiating WebSocket connections.
  - *Completed*: 2026-02-17
  - *Effort*: Low (add origin validation in WebSocket upgrade handler)

#### 🟠 HIGH Priority
- [x] **Unauthorized Chat Access**: `getChats` controller now verifies room membership via the `RoomMember` relation before returning chat messages. Only participants of a room can access its chat history.
  - *Strategy Used*: Membership — `getChats` query filters through `room.members.some({ userId })` to ensure the requesting user is a room member.
  - *Impact*: Prevents privacy breach — users can no longer read chats from rooms they don't belong to
  - *Completed*: 2026-02-19

- [x] **Identity Spoofing**: Fixed in `livekitController.ts`. Now derives participant identity directly from the authenticated user's JWT (`req.userId`) instead of query parameters.
  - *Impact*: Prevents users from impersonating others in video calls
  - *Completed*: 2026-02-19

- [x] **Secure Refresh Token Flow (Multi-Session)**: Implemented `RefreshToken` table and rotation logic. Sessions now utilize short-lived access tokens and rotated refresh tokens, stored securely and managed via interceptors.
  - *Impact*: Robust session persistence and protection against stolen token reuse
  - *Completed*: 2026-02-23

- [ ] **Privacy Leak (Global Rooms)**: `getAllRoom` endpoint returns every room created in the database to any requester, regardless of ownership or participation.
  - *Impact*: Exposes all room data, including private rooms
  - *Effort*: Low (filter by user participation or ownership)

- [ ] **Account Enumeration**: Precise `404 User Not Found` responses in `SignIn` allow attackers to verify which emails are registered.
  - *Impact*: Attackers can build lists of valid user accounts for targeted attacks
  - *Effort*: Low (use generic "Invalid credentials" message)

#### 🟡 MEDIUM Priority
- [x] **Long Token TTL**: Reduced LiveKit token TTL from 24h to 2h.
  - *Impact*: Limits the window of opportunity for stolen tokens
  - *Completed*: 2026-02-19

- [ ] **Slug Security**: No validation for URL-safe characters in room slugs and no "reserved slug" list.
  - *Impact*: URL injection, route conflicts with reserved paths
  - *Effort*: Low (add regex validation and reserved slug check)

- [ ] **Missing Security Headers**: `next.config.ts` is empty.
  - *Impact*: Vulnerable to XSS, clickjacking, MIME sniffing attacks
  - *Effort*: Low (add Next.js security headers configuration)

### WebSockets (WS) & Signalling
- [ ] **Missing Error Handling**: WS message handlers lack complete try-catch blocks to prevent server instability.
- [x] **Chat Logic Bug**: Implemented membership verification in WebSocket handlers. Users can no longer join rooms or send messages unless they are authorized (Host or Member).
  - *Completed*: 2026-02-19
- [ ] **Signalling Inefficiency**: WebRTC signalling in `signalling.ts` broadcasts to every user globally to check for room membership.
- [ ] **Redundant Code**: The manual WebRTC signalling server (`signalling.ts`) is likely unnecessary due to LiveKit integration.
- [ ] **Zombie Participants**: The WS `on("close")` handler only removes the user from the global array but doesn't notify other participants, causing "ghost" users.
- [ ] **Unlimited Message Size**: No character limit on chat messages.
- [ ] **Unhandled Async Exceptions**: The WebSocket `on("message")` handler is an async function that does not wrap its entire logic in a try-catch.
- [ ] **Missing WS Heartbeat**: No ping/pong implementation. Connections silently die or stay "half-open" without heartbeats, leading to phantom participants.
- [ ] **No Peer-to-Peer Signalling**: The signalling server broadcasts `offer`/`answer` to the whole room instead of a specific target user, which would break multi-user WebRTC calls.
- [ ] **Broken Participant Cleanup**: `ws.on("close")` removes the user from the list but fails to notify other room members that the user has gone offline. Frontend must handle the `user-left` event first before this fix can be shipped.

### API & Controllers
- [ ] **Inconsistent Routing**: `/api/delete-Room` uses PascalCase while others use kebab-case.
- [x] **Redundant Trailing Slash**: Removed the unnecessary trailing slash from `app.use("/api", chatRoute)`.
- [ ] **Incorrect Status Code**: `CreateRoom` returns `411` instead of `409` for naming conflicts.
- [x] **Database Integrity**: Implemented cascade deletes for `Chat` and `RoomMember` records when a `Room` is deleted, and set up comprehensive cascading logic for `User` account deletion.
  - *Completed*: 2026-02-23
- [x] **Auth Hybrid Complexity**: Standardized the hybrid architecture where NextAuth manages social providers and the custom backend manages session persistence via rotated refresh tokens.
  - *Completed*: 2026-02-23

---

## 🎨 Frontend Issues

### Code Quality & Standards
- [ ] **ESLint Errors**: 25 problems detected, including impure `useMemo` calls and excessive `any` types.
- [ ] **HTML Structure Warnings**: Nesting `Link` inside `Button` without using the `asChild` prop in `Hero.tsx` and `Header.tsx`.
- [ ] **Typo in Dependencies**: `package.json` specifies `next: 16.0.10` (should likely be 15.x).
- [ ] **File Extension Consistency**: `useLogout.tsx` uses `.tsx` despite containing no TSX elements.
- [ ] **Weak Zod Validation**: `SignUpZodSchema` lacks `.email()` validation, and slugs allow 1-character strings.
- [ ] **Inconsistent ID Types**: `User` uses UUIDs, but `Chat` uses auto-incrementing Integers.

### Error Handling & Resilience
- [ ] **Insecure Server-Side Fetching**: `getRoomId` and `getWsToken` lack try-catch blocks in server components.
- [ ] **Graceful DB Failures**: Controllers don't wrap all DB calls in try-catch, risking unhandled promise rejections.
- [ ] **Unhandled Room Not Found**: `CallPage` doesn't verify room existence before rendering the client.

### UI/UX & React Patterns
- [ ] **Critical Navigation Bug**: Invitation links point to `/room/[slug]`, which is a 404 (should be `/call/[slug]`).
- [ ] **Broken Links**: `Header.tsx` links to non-existent `/explore` and `/pricing` pages.
- [ ] **Layout Duplication**: The `/me` page manually recreates the navigation bar instead of sharing the global layout.
- [ ] **WebSocket UX**: `useSocket.ts` lacks reconnection logic for dropped connections.
- [ ] **Initial State Masking**: `isConnected` defaults to `true`, causing UI flicker.
- [ ] **React Keys Risk**: Using `Date.now()` for chat message keys can lead to collisions.
- [ ] **Missing Loading/Error States**: No fallback or retry UI for failed token fetches.
- [x] **Brittle Cookie Handling**: Standardized authentication to use `Authorization: Bearer <token>` headers exclusively for API calls, removing manual string interpolation for cookies in requests.
- [ ] **Static Assets**: Aesthetic placeholders (HD Video, etc.) without real implementation.
- [x] **Identity Desync**: Frontend now sends Google ID tokens to the backend which performs a secure upsert, ensuring the UUID-based `userId` is used consistently for sessions.
- [ ] **Brittle Dialog UX**: `NewRoom.tsx` closes the dialog immediately on click (`DialogClose`), even if the API request fails, forcing the user to re-open and re-type.
- [ ] **Hanging API Requests**: `axios` instance in `api.ts` has no `timeout`, meaning client components could hang indefinitely if the backend is unresponsive.

---

## 🚀 Performance & Scalability

### Backend Bottlenecks
- [ ] **Blocking Event Loop**: The WebSocket handler `await`s the database write for every message. During high traffic, DB latency will delay real-time message broadcasting for all users.
  - *Solution*: Use an async message queue (Redis/BullMQ) to decouple broadcasting from persistence.
- [ ] **Redundant Authorization Checks**: Checking the database for room permissions on every single chat message.
  - *Solution*: Authorize **once** during `join-room` and store the permission in the WebSocket connection state (in-memory).
- [ ] **O(N) WebSocket Broadcasting**: Global array iteration for every message creates linear latency spikes. If 300 users are online, every message triggers 300 checks, regardless of room size.
- [ ] **Single-Core Utilization**: In-memory connection state (`connectedUser`) limits the app to a single CPU core. Vertical or horizontal scaling is currently impossible.
- [ ] **DB Connection Exhaustion**: Lack of a connection pooler (e.g., PgBouncer) means the app will quickly hit PostgreSQL's connection limit as user sessions increase.
- [ ] **Synchronous SSR Chain**: `getUser` adds a mandatory backend+DB round-trip to every page render, significantly increasing TTFB and server load.
- [ ] **Missing Database Pagination**: `getAllRoom` and `userRooms` endpoints lack limit/offset controls.
- [ ] **Blocking Chat Writes**: Waiting for DB persistence before broadcasting slows down real-time interaction.
- [ ] **In-Memory Connection State**: Server restarts clear all active room assignments and connection state.

### Deployment & Dev Experience
- [ ] **Duplicate `Backend` / `backend` Folder**: macOS is case-insensitive so both resolve to the same path locally. Production Linux servers are **case-sensitive** — this creates deployment ambiguity and risks building/running the wrong directory.
   - *Impact*: Deployment scripts may target the wrong folder; changes made in one may not appear in the other on Linux.
   - *Effort*: Trivial (delete one, standardize on `backend`)
- [ ] **Missing CORS Protocol Match**: If `FRONTEND_URL` env var is set to `http://...` but the production frontend serves over `https://...`, CORS will reject **all** API requests and WebSocket upgrades, making the app completely non-functional.
   - *Impact*: Complete production breakage — no API calls or WebSocket connections
   - *Effort*: Trivial (ensure `FRONTEND_URL` env var matches exact production origin including `https://`)
- [ ] **Missing Dockerization**: No containerization for environment-agnostic deployments.
- [ ] **Missing CI/CD**: No automated workflows for testing or deployment.
- [x] **Env Variability**: Added `.env.example` for new contributors.
- [ ] **No Monorepo Management**: Absence of tools like Turbo or Nx to manage poly-repo relationships.

### Testing & Reliability
- [ ] **Zero Test Coverage**: No unit, integration, or E2E tests exist.
- [ ] **No Monitoring/Observability**: No error tracking (Sentry) or structured logging (Pino).
- [ ] **API Documentation**: No OpenAPI/Swagger documentation for the REST API.

### Database & Scaling Optimization
- [x] **Optimized Chat Indexes**: Added a compound index `@@index([roomId, createdAt(sort: Desc)])` to the `Chat` model.
  - *Impact*: Drastically improves performance for chat history retrieval, which is the most frequent DB read in the app.
  - *Completed*: 2026-02-18
- [ ] **No OnDelete Cascade**: Deleting a room crashes or is blocked if chats exist.
- [ ] **Strict TS Caching**: Production builds have some strict TS checks disabled.
- [ ] **Redis for WebSockets**: Horizontal scaling is currently impossible without a Pub/Sub layer.

---

## � Phase 2: Scaling Roadmap (10,000+ Users)

To move beyond the current prototype limits, the following structural changes are required to transition to a **Distributed Stateless Architecture**.

### 1. WebSockets & Real-time Layer
- [ ] **Redis Pub/Sub Implementation**: Decouple the WebSocket server logic. Use Redis to broadcast messages across multiple server instances so users on different pods can interact.
- [ ] **Room-Based Lookups ($O(1)$)**: Replace the global `connectedUser` array with a `Map<roomId, Set<User>>` to eliminate linear search latency.
- [ ] **Stateless Servers**: Remove all local in-memory state. Transition to using Redis for tracking active room participants and user session metadata.
- [ ] **WS Heartbeats**: Implement a robust Ping/Pong mechanism to prune dead connections and prevent "ghost" participants.
- [ ] **Redis-Backed Distributed Rate Limiting**: Migrate in-memory rate limits to Redis to enforce global quotas across all server instances.

### 2. Data & Persistence Optimization
- [ ] **Connection Pooling**: Deploy **PgBouncer** or **Prisma Accelerate** to manage the massive spike in database connections.
- [ ] **Async Worker Queues**: Move chat persistence (`prismaClient.chat.create`) and expensive tasks to a background worker (e.g., BullMQ with Redis). Perform broadcasts immediately; save to DB asynchronously.
- [ ] **Cache-Aside Pattern**: Use Redis to cache frequently accessed data like `User` profiles and `Room` metadata to reduce PostgreSQL load by 80%+.
- [ ] **Read Replicas**: Configure the database for vertical scaling and introduce read-only replicas for high-traffic GET endpoints (`/me`, `/rooms`).

### 3. Infrastructure & Video
- [ ] **LiveKit Mesh/Regional Scaling**: Move beyond a single region. Deploy LiveKit nodes closer to users and utilize their native mesh capabilities for low-latency global video.
- [ ] **Remove Legacy Signalling**: Fully sunset the manual `signalling.ts` and rely on LiveKit's optimized, high-concurrency signalling protocol.
- [ ] **Horizontal Pod Autoscaling (HPA)**: Containerize the app and use Kubernetes or a similar orchestrator to scale the number of server instances dynamically based on CPU/Memory load.

### 4. Frontend Resilience
- [ ] **Advanced State Management**: Integrate **TanStack Query (React Query)** for all API interactions to handle caching, de-duplication, and optimistic updates.
- [ ] **Service Workers**: Use service workers to handle offline states and improved asset caching.
- [ ] **CDN Assets**: Offload all static files and common JS chunks to an Edge CDN to reduce server bandwidth usage.

---

## �📅 Tracking History
- **2026-02-15**: Comprehensive system architecture audit performed by Antigravity.
- **2026-02-15**: Added security, performance, and scalability sections.
- **2026-02-15**: Added infrastructure, testing, and monorepo management gaps.
- **2026-02-15**: Added scalability, resilience, and horizontal scaling concerns.
- **2026-02-15**: Defined Phase 2 Scaling Roadmap for 10k+ concurrent users.
- **2026-02-16**: Implemented secure Google ID Token verification on backend. Fixed "trailing slash" routing bug. Added `provider` tracking to User schema.
- **2026-02-17**: Standardized authentication flow to use `Authorization` headers exclusively. Removed redundant and brittle cookie handling in frontend API calls. Verified production safety for different domain setups.
- **2026-02-17**: Implemented comprehensive rate limiting across all endpoints. Upgraded Prisma to 7.0.0. Added environment variable validation. Created .env.example.
- **2026-02-17**: Identified missing `trust proxy` (rate limiter blocks all users), duplicate Backend folder risk, and CORS protocol mismatch risk.
- **2026-02-18**: Optimized chat history retrieval by adding a compound index `[roomId, createdAt]` to the Prisma schema. Refined `getChats` controller to allow viewing all room participants' messages while maintaining indexed performance. Discussed strategies for unauthorized chat access (Membership vs. Signed Tokens).
- **2026-02-19**: Fully resolved unauthorized chat access by implementing room membership checks in both REST and WebSocket layers. Fixed identity spoofing in LiveKit token generation and reduced token TTL to 2h for enhanced security. Added special allowance for room hosts to access their own rooms' chats. Verified database schema synchronization.
- **2026-02-23**: Finalized previous session updates: committed legacy changes to `main`, pushed to GitHub, and verified migration sync with the production Neon database.
- **2026-02-23**: Implemented secure multi-session refresh token flow with rotation. Bridged NextAuth session management with backend token persistence. Updated system audit to reflect the resolution of hybrid auth complexity.
- **2026-02-23**: Hardened database integrity by implementing cascading deletes. Deleting a user now automatically clears hosted rooms and memberships, while preserving chat history via `SetNull` to maintain thread context.

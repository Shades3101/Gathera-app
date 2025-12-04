# bugs.md


## 🔴 CRITICAL

[ ] REWRITE WebRTC logic in CallClient.tsx
  - Current implementation has race conditions
  - React Strict Mode causing double setup
  - Track management is broken

[ ] Socket listeners cleanup (marked for review)
  - Potential memory leaks
  - Verify cleanup function is working
  - Check for duplicate listeners

## 🟡 HIGH PRIORITY

[ ] Fix peer connection lifecycle
  - Don't recreate connection on every render
  - Properly handle cleanup only on unmount
  - Add connection state monitoring

[ ] Implement proper track replacement
  - Use replaceTrack() instead of remove/add
  - Avoid unnecessary renegotiation
  - Handle edge cases when switching devices

[ ] Add error handling for media devices
  - Handle permission denials gracefully
  - Show user-friendly error messages
  - Add retry logic

[ ] Fix TypeScript types
  - Remove 'any' types
  - Add proper interfaces for WS messages
  - Type all WebRTC callbacks

[ ] Handle signaling state properly
  - Queue renegotiations if state is not stable
  - Handle concurrent offer/answer exchanges
  - Add timeout for stuck states

---
Last updated: 2025-12-01

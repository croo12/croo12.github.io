# Handle Wasm loading error in GamePage

**Category:** Error Handling
**Priority:** High
**File:** `src/pages/game/ui/GamePage.tsx:13`

## Problem
Only `isSuccess` is destructured from `useQuery`. `isError` is ignored. If Wasm fails, canvas shows "Loading Wasm..." forever.

## Suggested Fix
Destructure `isError` and `error`, render an error message with a retry button.

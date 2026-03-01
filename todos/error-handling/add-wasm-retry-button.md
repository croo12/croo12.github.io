# Add retry button for Wasm load failure

**Category:** Error Handling
**Priority:** Medium
**File:** `src/pages/game/ui/GamePage.tsx`

## Problem
No user-facing retry mechanism when Wasm fails to load.

## Suggested Fix
Extract `refetch` from `useQuery` and render a "다시 시도" button on error state.

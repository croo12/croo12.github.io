# Add accessible loading indicator for Wasm

**Category:** Accessibility
**Priority:** High
**File:** `src/pages/game/ui/GamePage.tsx`

## Problem
While Wasm loads, canvas shows "Loading Wasm..." via canvas rendering — invisible to screen readers. `isLoading`/`isPending` state from `useQuery` is never checked.

## Suggested Fix
Check `isPending` and render a visible loading spinner with `aria-busy="true"`.

# Add React Error Boundary

**Category:** Error Handling
**Priority:** High
**File:** `src/app/App.tsx`

## Problem
No Error Boundary anywhere. Any render-time throw crashes the whole app with no fallback UI.

## Suggested Fix
Add a top-level Error Boundary in `App.tsx` with a user-friendly fallback page.

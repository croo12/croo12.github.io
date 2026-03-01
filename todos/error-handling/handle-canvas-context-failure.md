# Handle canvas getContext failure with user feedback

**Category:** Error Handling
**Priority:** Low
**File:** `src/pages/game/ui/GamePage.tsx:19-20`

## Problem
`getContext("2d")` failure is handled with `return` but renders nothing. User sees a blank canvas.

## Suggested Fix
Show a user-friendly message when canvas context is unavailable.

# Extract canvas rendering logic to a custom hook

**Category:** Architecture / FSD
**Priority:** High
**File:** `src/pages/game/ui/GamePage.tsx:14-41`

## Problem
The `setInterval` animation loop for canvas rendering lives directly in the page component. This is presentation logic that should be in a feature or entity.

## Suggested Fix
Create a `useCanvasGame` hook in `features/` or `entities/` that encapsulates the canvas rendering loop.

# Make game canvas accessible to screen readers

**Category:** Accessibility
**Priority:** High
**File:** `src/pages/game/ui/GamePage.tsx:63-65`

## Problem
Canvas is inaccessible to screen readers. Only has Korean fallback text.

## Suggested Fix
Add `role="img"` and `aria-label` describing the game. Provide a live region (`aria-live`) for game state updates.

# Make game canvas responsive

**Category:** Responsive Design
**Priority:** High
**File:** `src/pages/game/ui/GamePage.tsx`

## Problem
Canvas is fixed at 800×600px. On mobile or tablet the container overflows the viewport.

## Suggested Fix
Use `max-width: 100%` with `aspect-ratio: 4/3` and scale the canvas via CSS or resize it dynamically.

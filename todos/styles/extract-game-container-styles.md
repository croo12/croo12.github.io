# Extract game container inline styles to CSS

**Category:** Inline Styles
**Priority:** Medium
**File:** `src/pages/game/ui/GamePage.tsx:50-61`

## Problem
`#game-container` div uses 7+ inline style properties.

## Suggested Fix
Move to `.game-container` class in `game-page.css`.

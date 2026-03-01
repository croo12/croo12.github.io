# Extract GamePage layout inline styles to CSS

**Category:** Inline Styles
**Priority:** Medium
**File:** `src/pages/game/ui/GamePage.tsx:46`

## Problem
Outer div uses inline `display: flex, flexDirection: column, alignItems: center`.

## Suggested Fix
Create `game-page.css` with a `.game-page` class.

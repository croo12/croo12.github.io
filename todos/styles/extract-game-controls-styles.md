# Extract game controls inline styles to CSS

**Category:** Inline Styles
**Priority:** Medium
**File:** `src/pages/game/ui/GamePage.tsx:70-77`

## Problem
`.controls` div uses inline padding, background, borderRadius, width, boxSizing, textAlign.

## Suggested Fix
Move to `.game-controls` class in `game-page.css`.

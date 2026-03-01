# Use theme font for canvas text

**Category:** Hardcoded Magic Values
**Priority:** Low
**File:** `src/pages/game/ui/GamePage.tsx:35`

## Problem
Canvas font is hardcoded as `"30px 'Segoe UI', sans-serif"` instead of using the project font (Galmuri11).

## Suggested Fix
Use `typography.fontPrimary` from the token system.

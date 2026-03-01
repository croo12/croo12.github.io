# Unify canvas width/height as constants

**Category:** Hardcoded Magic Values
**Priority:** Medium
**File:** `src/pages/game/ui/GamePage.tsx:50,63`

## Problem
Canvas `width="800" height="600"` attributes duplicate the container style `width: "800px", height: "600px"`. No shared source of truth.

## Suggested Fix
Define `const CANVAS_WIDTH = 800` and `CANVAS_HEIGHT = 600` as constants.

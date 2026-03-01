# Name canvas animation interval constant

**Category:** Hardcoded Magic Values
**Priority:** Low
**File:** `src/pages/game/ui/GamePage.tsx:39`

## Problem
`setInterval(..., 50)` — 50ms (~20fps) is a magic number.

## Suggested Fix
Define `const FRAME_INTERVAL_MS = 50` or `const TARGET_FPS = 20`.

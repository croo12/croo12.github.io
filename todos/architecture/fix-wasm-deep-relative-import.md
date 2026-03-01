# Fix deep relative import crossing FSD boundary

**Category:** Architecture / FSD
**Priority:** High
**File:** `src/pages/game/ui/GamePage.tsx:4`

## Problem
`import initGameCore, { greet } from "../../../../core/build/game_core"` reaches outside `src/` entirely, violating FSD layer boundaries.

## Suggested Fix
Wasm init should be wrapped inside `src/shared/wasm/` and re-exported. The page should import from `@/shared/wasm`.

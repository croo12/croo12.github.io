# Encapsulate Wasm business logic out of page layer

**Category:** Architecture / FSD
**Priority:** High
**File:** `src/pages/game/ui/GamePage.tsx:25`

## Problem
`greet()` call is directly in the page component. Wasm business logic should be encapsulated in an entity or feature, not directly in the page layer.

## Suggested Fix
Create a feature or entity that wraps Wasm calls and exposes a clean API to the page.

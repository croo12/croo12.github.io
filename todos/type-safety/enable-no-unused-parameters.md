# Enable noUnusedParameters in tsconfig

**Category:** Type Safety
**Priority:** Medium
**File:** `tsconfig.json`

## Problem
`noUnusedParameters` is not enabled. Unused function parameters pass typecheck silently.

## Suggested Fix
Add `"noUnusedParameters": true` to `compilerOptions`.

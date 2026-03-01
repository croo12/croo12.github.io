# Enable noUnusedLocals in tsconfig

**Category:** Type Safety
**Priority:** Medium
**File:** `tsconfig.json`

## Problem
`noUnusedLocals` is not enabled. Unused local variables pass typecheck silently.

## Suggested Fix
Add `"noUnusedLocals": true` to `compilerOptions`.

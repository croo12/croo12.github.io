# Enable noFallthroughCasesInSwitch in tsconfig

**Category:** Type Safety
**Priority:** Low
**File:** `tsconfig.json`

## Problem
Switch fallthrough bugs are not caught at compile time.

## Suggested Fix
Add `"noFallthroughCasesInSwitch": true` to `compilerOptions`.

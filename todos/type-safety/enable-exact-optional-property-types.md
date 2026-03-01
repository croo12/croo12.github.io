# Enable exactOptionalPropertyTypes in tsconfig

**Category:** Type Safety
**Priority:** Low
**File:** `tsconfig.json`

## Problem
Without `exactOptionalPropertyTypes`, optional properties accept `undefined` even if not intended.

## Suggested Fix
Add `"exactOptionalPropertyTypes": true` to `compilerOptions`.

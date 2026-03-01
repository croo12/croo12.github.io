# Remove passWithNoTests setting

**Category:** Testing
**Priority:** Medium
**File:** `vite.config.ts`

## Problem
`passWithNoTests: true` means CI always passes even with zero tests. Hides missing coverage.

## Suggested Fix
Remove this setting once initial tests are written.

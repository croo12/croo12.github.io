# Review skipLibCheck setting in tsconfig

**Category:** Type Safety
**Priority:** Low
**File:** `tsconfig.json`

## Problem
`skipLibCheck: true` silently ignores third-party type errors. This can hide real issues from bad `.d.ts` files.

## Suggested Fix
Consider removing or restricting this once the project stabilizes.

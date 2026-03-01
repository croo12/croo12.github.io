# Verify dist/ is not tracked by git

**Category:** Cleanup
**Priority:** High
**File:** `dist/`

## Problem
`dist/` may be tracked despite being in `.gitignore`. Built assets should never be committed.

## Suggested Fix
Run `git ls-files dist/` to check. If tracked, `git rm -r --cached dist/`.

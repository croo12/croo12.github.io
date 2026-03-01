# Verify core/build/ is not tracked by git

**Category:** Cleanup
**Priority:** High
**File:** `core/build/`

## Problem
`core/build/.gitignore` contains `*` but build files may be tracked. These are generated artifacts.

## Suggested Fix
Run `git ls-files core/build/` and untrack if necessary.

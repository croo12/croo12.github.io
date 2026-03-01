# Add format check to CI

**Category:** CI/CD
**Priority:** Medium
**File:** `.github/workflows/ci.yml`

## Problem
CI only runs `yarn lint`, not `yarn format --check`. Formatting violations don't block PRs.

## Suggested Fix
Add `biome format --check .` or use `biome check .` which covers both lint and format.

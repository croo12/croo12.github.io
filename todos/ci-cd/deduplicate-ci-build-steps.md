# Deduplicate CI build steps

**Category:** CI/CD
**Priority:** Low
**File:** `.github/workflows/ci.yml`

## Problem
CI runs `wasm:build` + `tsc` individually, then `yarn build` which repeats both. Wastes ~3 minutes.

## Suggested Fix
Either run individual checks OR `yarn build`, not both.

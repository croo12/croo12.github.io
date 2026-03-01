# Add explicit wasm:build step to deploy workflow

**Category:** CI/CD
**Priority:** Medium
**File:** `.github/workflows/deploy.yml`

## Problem
Deploy relies on `yarn build` to trigger wasm compilation. Fragile if build script changes.

## Suggested Fix
Add explicit `yarn wasm:build` step before `yarn build`, matching `ci.yml`.

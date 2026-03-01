# Pin wasm-pack version in CI

**Category:** CI/CD
**Priority:** Medium
**Files:** `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`

## Problem
`cargo install wasm-pack` installs unpinned latest version. Could break builds.

## Suggested Fix
Use `cargo install wasm-pack --version X.Y.Z` or the `jetli/wasm-pack-action` GitHub Action.

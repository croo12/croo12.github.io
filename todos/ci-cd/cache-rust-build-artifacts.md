# Cache Rust/Cargo build artifacts in CI

**Category:** CI/CD
**Priority:** High
**Files:** `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`

## Problem
`cargo install wasm-pack` re-downloads and compiles on every run. Very slow.

## Suggested Fix
Add `Swatinem/rust-cache@v2` action to both workflows.

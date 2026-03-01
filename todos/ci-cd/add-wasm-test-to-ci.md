# Run wasm:test (cargo test) in CI

**Category:** Testing / CI
**Priority:** High
**File:** `.github/workflows/ci.yml`

## Problem
Rust unit tests (`cargo test`) are never run in CI. The `greet_returns_message` test is only runnable locally.

## Suggested Fix
Add a `yarn wasm:test` step to the CI workflow.

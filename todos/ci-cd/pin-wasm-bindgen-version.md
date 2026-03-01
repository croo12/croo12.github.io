# Pin wasm-bindgen to specific patch version

**Category:** Dependencies
**Priority:** Medium
**File:** `core/Cargo.toml`

## Problem
`wasm-bindgen = "0.2"` is a semver range. Incompatible patch updates could break the build.

## Suggested Fix
Pin to specific version: `wasm-bindgen = "=0.2.XX"`.

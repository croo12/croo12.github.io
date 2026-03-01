# Optimize Wasm release profile with codegen-units

**Category:** Performance
**Priority:** Low
**File:** `core/Cargo.toml`

## Problem
Release profile uses `opt-level = "s"` but not `codegen-units = 1`. Full LTO needs this for max compression.

## Suggested Fix
Add `codegen-units = 1` alongside `lto = true` in `[profile.release]`.

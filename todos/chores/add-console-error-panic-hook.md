# Add console_error_panic_hook for Wasm debugging

**Category:** Dependencies / DX
**Priority:** Medium
**File:** `core/Cargo.toml`

## Problem
Rust panics in Wasm produce cryptic errors. `console_error_panic_hook` makes them human-readable.

## Suggested Fix
Add `console_error_panic_hook` dependency and call `set_once()` in init.

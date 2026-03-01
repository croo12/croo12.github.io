# Constrain createWasmLoader generic type parameter

**Category:** Type Safety
**Priority:** Low
**File:** `src/shared/wasm/create-wasm-loader.ts:3`

## Problem
Type parameter `T` is unconstrained. Any type (including primitives) can be passed.

## Suggested Fix
Constrain `T` to `object` or a specific Wasm init output type: `<T extends object>`.

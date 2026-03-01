# Add unit tests for createWasmLoader

**Category:** Testing
**Priority:** Medium
**File:** `src/shared/wasm/create-wasm-loader.ts`

## Problem
Caching logic (`let cached: Promise<T> | null = null`) and queryOptions config are untested.

## Suggested Fix
Test: caching behavior (multiple calls return same promise), queryOptions shape.

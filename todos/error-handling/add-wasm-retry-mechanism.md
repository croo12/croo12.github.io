# Add retry mechanism for Wasm loading

**Category:** Error Handling
**Priority:** Medium
**File:** `src/shared/wasm/create-wasm-loader.ts`

## Problem
`retry: false` in queryOptions. A transient network failure is permanent for the session.

## Suggested Fix
Enable limited retry (e.g., `retry: 2`) or expose `refetch` to consumers for a manual retry button.

# Tune chunk size warning limit for Wasm

**Category:** Performance
**Priority:** Low
**File:** `vite.config.ts`

## Problem
Default 500KB chunk warning may trigger for the Wasm module.

## Suggested Fix
Set `build.chunkSizeWarningLimit` appropriate for the project.

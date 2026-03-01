# Configure manual chunk splitting in Vite

**Category:** Performance
**Priority:** Medium
**File:** `vite.config.ts`

## Problem
No `rollupOptions.output.manualChunks` configured. React, React Router, TanStack Query end up in one chunk.

## Suggested Fix
Add `manualChunks` to split vendor libraries into separate chunks.

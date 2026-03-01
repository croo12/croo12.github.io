# Configure production source maps

**Category:** Performance / DX
**Priority:** Low
**File:** `vite.config.ts`

## Problem
No `build.sourcemap` configured. Error tracking services cannot symbolicate production errors.

## Suggested Fix
Set `build: { sourcemap: 'hidden' }` for production.

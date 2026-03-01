# Fix vite server.open for WSL environments

**Category:** QoL
**Priority:** Low
**File:** `vite.config.ts`

## Problem
`server.open: true` fails silently in WSL2 (Linux process cannot open Windows browser).

## Suggested Fix
Gate with `process.env.WSL_DISTRO_NAME` or remove and let users open manually.

# Pin Galmuri font CDN version

**Category:** Performance / Stability
**Priority:** High
**File:** `src/app/global.css:1`

## Problem
`@import url("...galmuri@latest...")` — `@latest` is unpinned. A breaking font update affects users immediately.

## Suggested Fix
Pin to a specific version (e.g., `galmuri@15.0.0`) or self-host.

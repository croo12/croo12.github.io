# Add preconnect hint for font CDN

**Category:** Performance
**Priority:** Low
**File:** `index.html`

## Problem
No `<link rel="preconnect">` for `cdn.jsdelivr.net`. Adds DNS+TCP+TLS overhead on first load.

## Suggested Fix
Add `<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>` to `<head>`.

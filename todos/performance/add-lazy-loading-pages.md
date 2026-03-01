# Add lazy loading for page components

**Category:** Performance
**Priority:** High
**File:** `src/app/App.tsx`

## Problem
All pages are eagerly imported. Blog and Game page bundles are fetched on initial load.

## Suggested Fix
Use `React.lazy()` + `<Suspense>` for each page route.

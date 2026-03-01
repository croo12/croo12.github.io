# Add 404 Not Found page

**Category:** QoL / UX
**Priority:** Medium
**File:** `src/app/App.tsx`

## Problem
Unknown routes render nothing (blank page).

## Suggested Fix
Add a catch-all `<Route path="*">` with a 404 page component.

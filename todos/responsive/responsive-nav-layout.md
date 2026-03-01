# Handle nav wrapping on small screens

**Category:** Responsive Design
**Priority:** Medium
**File:** `src/widgets/layout/ui/layout.css`

## Problem
Nav uses `display: flex` with no `flex-wrap` and no mobile layout fallback. Items may overflow.

## Suggested Fix
Add `flex-wrap: wrap` or switch to a hamburger menu on narrow screens.

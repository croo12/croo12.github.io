# Verify NavLink aria-current="page" for active link

**Category:** Accessibility
**Priority:** Medium
**File:** `src/widgets/layout/ui/Layout.tsx`

## Problem
Active state relies only on color and a `▶` pseudo-element. Color-only indicators fail WCAG 1.4.1. React Router's `NavLink` should apply `aria-current="page"` automatically — verify this.

## Suggested Fix
Inspect rendered HTML to confirm `aria-current="page"` is present on active links.

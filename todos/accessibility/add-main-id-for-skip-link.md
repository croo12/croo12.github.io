# Add id to main element for skip-to-content link

**Category:** Accessibility
**Priority:** Medium
**File:** `src/widgets/layout/ui/Layout.tsx`

## Problem
`<main className="main">` has no `id` to support a skip-to-content link.

## Suggested Fix
Add `id="main-content"` and create a skip link at the top of the layout.

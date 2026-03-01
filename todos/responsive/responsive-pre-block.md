# Prevent pre block overflow on narrow screens

**Category:** Responsive Design
**Priority:** Low
**File:** `src/pages/about/ui/AboutPage.tsx`

## Problem
`<pre>` block can overflow on narrow screens even with `overflow: auto`.

## Suggested Fix
Add `max-width: 100%` and `box-sizing: border-box` to pre block styles.

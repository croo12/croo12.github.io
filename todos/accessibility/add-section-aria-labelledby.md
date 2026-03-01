# Add aria-labelledby to AboutPage sections

**Category:** Accessibility
**Priority:** Low
**File:** `src/pages/about/ui/AboutPage.tsx`

## Problem
`<section>` elements have no `aria-labelledby`. Anonymous sections are bad for screen reader navigation.

## Suggested Fix
Add `id` to each heading and `aria-labelledby` to the corresponding section.

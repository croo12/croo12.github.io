# Add aria-live region for typewriter animation

**Category:** Accessibility
**Priority:** Medium
**File:** `src/pages/about/ui/AboutPage.tsx`

## Problem
Progressive text reveal is not announced to screen readers.

## Suggested Fix
Wrap the typewriter content in a `role="log"` or `aria-live="polite"` container.

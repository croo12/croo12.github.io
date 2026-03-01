# Add aria-label to nav element

**Category:** Accessibility
**Priority:** High
**File:** `src/widgets/layout/ui/Layout.tsx`

## Problem
`<nav>` has no `aria-label`. Multiple landmarks require labels for screen reader navigation.

## Suggested Fix
Add `aria-label="메인 네비게이션"` to the nav element.

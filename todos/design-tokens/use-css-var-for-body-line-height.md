# Use CSS variable for body line-height in text.css

**Category:** Hardcoded Magic Values
**Priority:** Low
**File:** `src/shared/ui/text/text.css:13`

## Problem
`line-height: 1.6` is hardcoded instead of using `var(--line-height-base)` from theme.css.

## Suggested Fix
Replace with `line-height: var(--line-height-base)`.

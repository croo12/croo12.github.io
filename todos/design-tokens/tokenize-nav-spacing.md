# Tokenize nav spacing values in layout.css

**Category:** Hardcoded Magic Values
**Priority:** Low
**File:** `src/widgets/layout/ui/layout.css`

## Problem
`gap: 8px`, `padding: 16px 24px`, `border-bottom: 4px solid` use raw pixel values. Not tokenized.

## Suggested Fix
Add spacing tokens to `theme.css` and reference via CSS variables.

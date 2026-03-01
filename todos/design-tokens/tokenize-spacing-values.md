# Tokenize spacing values in text.css

**Category:** Hardcoded Magic Values
**Priority:** Low
**File:** `src/shared/ui/text/text.css:3,8`

## Problem
`margin-bottom: 24px` and `margin-bottom: 12px` are hardcoded without spacing tokens.

## Suggested Fix
Add spacing tokens to `theme.css` (e.g., `--space-sm: 12px`, `--space-md: 24px`) and reference them.

# Extract TypedLine to shared/ui

**Category:** Architecture / FSD
**Priority:** Medium
**File:** `src/pages/about/ui/AboutPage.tsx`

## Problem
`TypedLine` component is defined inside `AboutPage.tsx` but is a reusable text component that combines `useTypewriter` with cursor display.

## Suggested Fix
Move `TypedLine` to `src/shared/ui/text/TypedLine.tsx` and export from the text module.

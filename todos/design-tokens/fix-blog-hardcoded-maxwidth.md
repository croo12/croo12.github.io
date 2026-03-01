# Fix BlogPage hardcoded maxWidth

**Category:** Architecture / Theme
**Priority:** Low
**File:** `src/pages/blog/ui/BlogPage.tsx:8`

## Problem
`maxWidth: "800px"` is hardcoded instead of using `layout.maxWidthNarrow` from the theme tokens.

## Suggested Fix
Import `layout` from `@/shared/theme` and use `layout.maxWidthNarrow`.

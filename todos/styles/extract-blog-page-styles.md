# Extract BlogPage inline styles to CSS

**Category:** Inline Styles
**Priority:** Low
**File:** `src/pages/blog/ui/BlogPage.tsx:7-11`

## Problem
Outer div uses inline `maxWidth`, `margin`, `padding`.

## Suggested Fix
Create `blog-page.css` with a `.blog-page` class, or reuse a shared page layout class.

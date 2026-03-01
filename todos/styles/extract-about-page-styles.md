# Extract AboutPage inline styles to CSS

**Category:** Inline Styles
**Priority:** Medium
**File:** `src/pages/about/ui/AboutPage.tsx:79-83`

## Problem
Outer div uses inline `maxWidth`, `margin`, `padding`. Should be a CSS class.

## Suggested Fix
Create `about-page.css` with a `.about-page` class.

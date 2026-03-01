# Extract AboutPage pre block styles to CSS

**Category:** Inline Styles
**Priority:** Low
**File:** `src/pages/about/ui/AboutPage.tsx:161-168`

## Problem
`<pre>` uses 6 inline style properties (background, padding, borderRadius, color, overflow, lineHeight).

## Suggested Fix
Create a `.code-block` class in `about-page.css` using CSS variables from theme.

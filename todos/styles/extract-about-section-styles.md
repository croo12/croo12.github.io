# Extract AboutPage section margin to CSS

**Category:** Inline Styles
**Priority:** Low
**File:** `src/pages/about/ui/AboutPage.tsx:90,115`

## Problem
`<section>` elements use inline `marginBottom: "32px"`. Should be a CSS class.

## Suggested Fix
Create `.about-section` class with the margin.

# Extract AboutPage list styles to CSS

**Category:** Inline Styles
**Priority:** Low
**File:** `src/pages/about/ui/AboutPage.tsx:126`

## Problem
`<ul>` uses inline `color: colors.textMuted, lineHeight: 2`.

## Suggested Fix
Add a `.tech-list` class in `about-page.css`.

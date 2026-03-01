# Add skip-to-main-content link

**Category:** Accessibility
**Priority:** Medium
**File:** `src/widgets/layout/ui/Layout.tsx`

## Problem
No skip link exists for keyboard-only users. This is a basic accessibility requirement.

## Suggested Fix
Add a visually hidden skip link at the top of the layout: `<a href="#main-content" class="skip-link">본문으로 건너뛰기</a>`.

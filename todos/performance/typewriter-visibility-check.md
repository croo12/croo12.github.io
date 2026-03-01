# Add visibility check to useTypewriter

**Category:** Performance
**Priority:** Low
**File:** `src/shared/ui/text/use-typewriter.ts`

## Problem
rAF loop runs even when the page is in a background tab (though rAF is throttled). Wastes CPU.

## Suggested Fix
Add `document.visibilitychange` listener or use IntersectionObserver to pause when not visible.

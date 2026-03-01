# Add prefers-reduced-motion for cursor animation

**Category:** Accessibility
**Priority:** Medium
**File:** `src/shared/ui/text/text.css`

## Problem
Blinking cursor animation runs regardless of user motion preference.

## Suggested Fix
Add `@media (prefers-reduced-motion: reduce) { .cursor::after { animation: none; } }`.

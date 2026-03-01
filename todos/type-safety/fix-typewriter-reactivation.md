# Fix useTypewriter re-activation behavior

**Category:** Type Safety / Logic
**Priority:** Medium
**File:** `src/shared/ui/text/use-typewriter.ts`

## Problem
The hook never resets `count` to 0 when `isActive` becomes false. Re-activating the same instance won't replay the animation.

## Suggested Fix
Document this as intentional (one-shot) or reset `count` when `isActive` transitions false→true.

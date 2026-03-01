# Add unit tests for useTypewriter hook

**Category:** Testing
**Priority:** High
**File:** `src/shared/ui/text/use-typewriter.ts`

## Problem
Non-trivial logic (frame timing, onComplete callback, count state) is entirely untested.

## Suggested Fix
Test: basic typing progression, isActive flag, onComplete callback timing, speed parameter.

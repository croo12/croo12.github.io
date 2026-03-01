# Tokenize canvas accent color

**Category:** Hardcoded Magic Values
**Priority:** Medium
**File:** `src/pages/game/ui/GamePage.tsx:34`

## Problem
Canvas accent color `rgba(76, 175, 80, ...)` is hardcoded. This is `#4caf50` (the accent color) but not using the token.

## Suggested Fix
Parse `colors.accent` to RGB components or add an `accentRgb` token to `tokens.ts`.

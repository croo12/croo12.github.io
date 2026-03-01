# Self-host Galmuri font instead of CDN

**Category:** Architecture / Assets
**Priority:** Medium
**File:** `src/app/global.css:1`

## Problem
Galmuri font is loaded via CDN (`@import url(...)`). Per FSD spec, assets should live in `shared/assets/`. CDN has no version pinning (`@latest`) and adds external dependency.

## Suggested Fix
Download Galmuri font files to `src/shared/assets/fonts/` and update `@font-face` in `global.css`.

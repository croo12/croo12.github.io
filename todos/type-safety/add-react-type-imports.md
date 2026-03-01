# Add missing React type imports

**Category:** Type Safety
**Priority:** Medium
**Files:** `App.tsx`, `Title.tsx`, `SubTitle.tsx`, `Body.tsx`, `Layout.tsx`

## Problem
These files use `React.FC` but never import React. With `react-jsx` transform, JSX works, but `React.FC` type still needs `import type React from "react"`.

## Suggested Fix
Add `import type React from "react"` to each file.

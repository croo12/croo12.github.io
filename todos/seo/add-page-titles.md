# Add dynamic document titles per page

**Category:** QoL / SEO
**Priority:** Medium
**Files:** `src/pages/*/ui/*.tsx`

## Problem
Document title never changes when navigating between pages.

## Suggested Fix
Use `document.title` or a `useDocumentTitle` hook per page, or `react-helmet-async`.

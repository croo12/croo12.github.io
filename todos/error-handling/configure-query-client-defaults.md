# Configure QueryClient default error handling

**Category:** Error Handling
**Priority:** Medium
**File:** `src/app/main.tsx`

## Problem
`QueryClient` created with no `defaultOptions` for error handling, retry logic, or logging.

## Suggested Fix
Add `defaultOptions` with sensible retry and error handling config.

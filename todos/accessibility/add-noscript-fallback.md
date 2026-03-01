# Add noscript fallback in index.html

**Category:** Error Handling
**Priority:** Low
**File:** `index.html`

## Problem
If JavaScript is disabled, user sees an empty page.

## Suggested Fix
Add `<noscript>이 앱은 JavaScript가 필요합니다.</noscript>` inside `<body>`.

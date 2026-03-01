# Add frontend unit tests

**Category:** Testing
**Priority:** High
**Files:** `src/` (no test files exist)

## Problem
Zero frontend tests. CI runs `yarn test` with `passWithNoTests: true` which silently passes.

## Suggested Fix
Start with tests for shared utilities and hooks. Use Vitest + React Testing Library.

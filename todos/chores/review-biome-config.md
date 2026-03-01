# Review Biome config for project-specific rules

**Category:** QoL
**Priority:** Low
**File:** `biome.json`

## Problem
All linter rules use the `recommended` preset with no custom overrides. The `!!**/dist` pattern uses Biome's negate syntax — verify it works.

## Suggested Fix
Test that `dist/` is properly excluded. Document any intentional rule deviations.

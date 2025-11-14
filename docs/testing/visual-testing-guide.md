# Visual Regression Tests

This directory contains visual regression tests using Playwright screenshots.

## Overview

Visual regression tests capture screenshots of UI components and compare them against baseline images to detect unintended visual changes.

## Running Tests

```bash
# Run all visual tests
npm run test:visual

# Run with Playwright UI
npx playwright test tests/visual --ui

# Update snapshots (after intentional UI changes)
npx playwright test tests/visual --update-snapshots

# Run specific test
npx playwright test tests/visual/admin-dashboard.visual.spec.ts
```

## First Time Setup

When running visual tests for the first time, baseline screenshots will be created:

```bash
# Generate initial baselines
npx playwright test tests/visual --update-snapshots
```

These baseline images are stored in `tests/visual/*-snapshots/` directories and should be committed to version control.

## Writing New Tests

Example test structure:

```typescript
import { test, expect } from '@playwright/test';

test('should match component screenshot', async ({ page }) => {
  await page.goto('http://localhost:9323/your-route');
  
  // Wait for content to load
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of entire page
  await expect(page).toHaveScreenshot('your-page.png');
  
  // Or screenshot specific element
  const element = page.locator('[data-testid="your-element"]');
  await expect(element).toHaveScreenshot('your-element.png');
});
```

## Screenshot Options

### Full Page Screenshots

```typescript
await expect(page).toHaveScreenshot('page.png', {
  fullPage: true,  // Capture entire scrollable page
  animations: 'disabled',  // Disable animations for consistency
});
```

### Element Screenshots

```typescript
const element = page.locator('.my-component');
await expect(element).toHaveScreenshot('component.png', {
  animations: 'disabled',
  mask: [page.locator('.dynamic-content')],  // Hide dynamic content
});
```

### Responsive Testing

```typescript
// Mobile
await page.setViewportSize({ width: 375, height: 667 });
await expect(page).toHaveScreenshot('mobile.png');

// Tablet
await page.setViewportSize({ width: 768, height: 1024 });
await expect(page).toHaveScreenshot('tablet.png');

// Desktop
await page.setViewportSize({ width: 1920, height: 1080 });
await expect(page).toHaveScreenshot('desktop.png');
```

## Best Practices

### 1. Disable Animations

Animations can cause flaky tests:

```typescript
await expect(page).toHaveScreenshot('page.png', {
  animations: 'disabled',
});
```

### 2. Wait for Content

Always wait for dynamic content to load:

```typescript
await page.waitForLoadState('networkidle');
// or
await page.waitForSelector('[data-testid="loaded"]');
```

### 3. Mask Dynamic Content

Hide elements that change frequently (timestamps, random IDs):

```typescript
await expect(page).toHaveScreenshot('page.png', {
  mask: [
    page.locator('.timestamp'),
    page.locator('.random-id'),
  ],
});
```

### 4. Use Descriptive Names

```typescript
// ❌ Bad
await expect(page).toHaveScreenshot('test1.png');

// ✅ Good
await expect(page).toHaveScreenshot('dashboard-overview-logged-in.png');
```

### 5. Group Related Tests

```typescript
test.describe('Dashboard Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Common setup
  });
  
  test('overview section', async ({ page }) => { /* ... */ });
  test('stats cards', async ({ page }) => { /* ... */ });
});
```

## Handling Failures

When a visual test fails:

1. **Review the diff:** Playwright generates comparison images showing differences
2. **Check reports:** `npx playwright show-report`
3. **Decide on action:**
   - If change is unintended → Fix the bug
   - If change is intentional → Update baseline: `--update-snapshots`

## Snapshot Storage

Snapshots are stored in platform-specific directories:

```
tests/visual/
├── admin-dashboard.visual.spec.ts
└── admin-dashboard.visual.spec.ts-snapshots/
    ├── dashboard-overview-chromium-linux.png
    ├── dashboard-overview-firefox-linux.png
    └── dashboard-overview-webkit-darwin.png
```

**Note:** Different operating systems may generate slightly different screenshots. CI/CD should use consistent environments.

## CI/CD Integration

Visual tests run in CI with the following considerations:

- **Consistent Environment:** Use Docker containers for reproducible screenshots
- **Baseline Management:** Commit baseline screenshots to repository
- **Review Process:** Manual review of visual changes before merging

## Troubleshooting

### Tests Fail on Different OS

Visual tests are sensitive to OS-specific rendering. Solutions:

1. Run tests in Docker with consistent environment
2. Use separate baselines per platform
3. Increase pixel tolerance (not recommended)

### Flaky Tests

If tests intermittently fail:

1. Add `await page.waitForTimeout(500)` after navigation
2. Disable animations: `animations: 'disabled'`
3. Mask dynamic content
4. Wait for fonts to load: `await page.waitForLoadState('networkidle')`

### Large Snapshots

To reduce snapshot size:

1. Screenshot specific elements instead of full page
2. Use smaller viewports
3. Compress images (Playwright does this automatically)

## Pixel Difference Tolerance

Adjust tolerance for minor differences:

```typescript
await expect(page).toHaveScreenshot('page.png', {
  maxDiffPixels: 100,  // Allow up to 100 different pixels
  // or
  maxDiffPixelRatio: 0.01,  // Allow 1% difference
});
```

## Configuration

Visual test configuration is in `playwright.config.ts`:

```typescript
export default {
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      threshold: 0.2,  // Pixel difference threshold
    },
  },
  // ... other config
};
```

## Resources

- [Playwright Screenshots Documentation](https://playwright.dev/docs/screenshots)
- [Visual Testing Guide](https://playwright.dev/docs/test-snapshots)
- [Best Practices](https://playwright.dev/docs/best-practices)

## Coverage Goals

- All major pages: Desktop, tablet, mobile views
- All critical user flows: Each step captured
- All component states: Default, hover, active, disabled

---

**Last Updated:** 2025-11-11  
**Maintainer:** Development Team

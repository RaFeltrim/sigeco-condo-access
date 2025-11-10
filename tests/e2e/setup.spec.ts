import { test, expect } from '@playwright/test';

test.describe('E2E Setup', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the page has loaded
    expect(page).toBeTruthy();
  });
});

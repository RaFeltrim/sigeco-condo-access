/**
 * Visual Regression Tests - Admin Dashboard
 * Screenshot comparison tests for UI consistency
 * 
 * Testing Library: Playwright Screenshots
 * Purpose: Detect unintended visual changes
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:9323';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'a';

// Helper function to login
async function login(page: Page) {
  await page.goto(BASE_URL);
  await page.fill('input[name="username"], input[type="text"]', ADMIN_USERNAME);
  await page.fill('input[name="password"], input[type="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin-dashboard');
}

test.describe('Visual Regression - Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should match dashboard overview screenshot', async ({ page }) => {
    // Click on Overview section
    await page.click('button:has-text("Visão Geral")');
    await page.waitForTimeout(1000); // Wait for animations
    
    // Take screenshot and compare
    await expect(page).toHaveScreenshot('dashboard-overview.png', {
      fullPage: false,
      animations: 'disabled',
    });
  });

  test('should match stat cards layout', async ({ page }) => {
    await page.click('button:has-text("Visão Geral")');
    await page.waitForTimeout(500);
    
    // Screenshot specific element
    const statsCards = page.locator('[data-testid="stats-cards-container"]');
    await expect(statsCards).toHaveScreenshot('stat-cards.png');
  });

  test('should match navigation menu', async ({ page }) => {
    // Screenshot navigation area
    const nav = page.locator('nav, aside').first();
    await expect(nav).toHaveScreenshot('navigation-menu.png');
  });

  test('should match week flow chart', async ({ page }) => {
    await page.click('button:has-text("Visão Geral")');
    await page.waitForTimeout(500);
    
    // Find and screenshot the chart
    const chart = page.locator('text=Fluxo de Visitas - Última Semana').locator('..');
    await expect(chart).toHaveScreenshot('week-flow-chart.png');
  });

  test('should match recent activity section', async ({ page }) => {
    await page.click('button:has-text("Visão Geral")');
    await page.waitForTimeout(500);
    
    // Screenshot recent activity
    const activity = page.locator('text=Atividade Recente').locator('..');
    await expect(activity).toHaveScreenshot('recent-activity.png');
  });

  test('should match responsive layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.click('button:has-text("Visão Geral")');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('dashboard-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match responsive layout on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.click('button:has-text("Visão Geral")');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('dashboard-tablet.png', {
      fullPage: false,
      animations: 'disabled',
    });
  });
});

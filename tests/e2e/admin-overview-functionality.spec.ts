/**
 * E2E Tests - Admin Dashboard Overview Functionality
 * Comprehensive tests for the Overview (Visão Geral) section
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

test.describe('Admin Dashboard - Overview Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    await login(page);
    // Ensure we're on the Overview section
    await page.click('button:has-text("Visão Geral")');
  });

  test('Overview - Verify all 4 statistics cards are visible and have correct titles', async ({ page }) => {
    // Verify that all 4 stat cards exist
    const cards = page.locator('[data-testid^="stat-card-"]');
    await expect(cards).toHaveCount(4);
    
    // Verify each card title
    await expect(page.locator('[data-testid="stat-title-0"]')).toContainText('Acessos Hoje');
    await expect(page.locator('[data-testid="stat-title-1"]')).toContainText('Visitantes Ativos');
    await expect(page.locator('[data-testid="stat-title-2"]')).toContainText('Total Semanal');
    await expect(page.locator('[data-testid="stat-title-3"]')).toContainText('Sistema Online');
    
    // Verify each card has a value
    await expect(page.locator('[data-testid="stat-value-0"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-value-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-value-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-value-3"]')).toBeVisible();
  });

  test('Overview - Verify "Novo Morador" button navigates to residents section', async ({ page }) => {
    // Click the "Novo Morador" button in Overview
    await page.click('button:has-text("Novo Morador")');
    
    // Verify we're now in the residents section
    await expect(page.getByRole('heading', { name: 'Gerenciamento de Moradores' })).toBeVisible({ timeout: 5000 });
    
    // Verify the residents section content is loaded
    await expect(page.getByText('Total de Moradores')).toBeVisible();
  });

  test('Overview - Verify "Agendar Visita" button navigates to scheduling section', async ({ page }) => {
    // Click the "Agendar Visita" button in Overview
    await page.click('button:has-text("Agendar Visita")');
    
    // Verify we're now in the scheduling section by checking for the heading
    await expect(page.getByRole('heading', { name: 'Agendamento de Visitas' })).toBeVisible({ timeout: 5000 });
    
    // Verify the scheduling section content is loaded - use more specific selector
    await expect(page.getByRole('heading', { name: 'Agendamentos Hoje' })).toBeVisible();
  });

  test('Overview - Verify week flow chart displays all 7 days', async ({ page }) => {
    // Verify chart title
    await expect(page.getByText('Fluxo de Visitas - Última Semana')).toBeVisible();
    
    // Verify all 7 days are displayed
    const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    for (const dia of dias) {
      await expect(page.getByText(dia).first()).toBeVisible();
    }
  });

  test('Overview - Verify recent activity section displays visitor entries', async ({ page }) => {
    // Verify section title
    await expect(page.getByText('Atividade Recente')).toBeVisible();
    await expect(page.getByText('Últimas entradas registradas')).toBeVisible();
    
    // Verify at least one activity item is visible
    const activityItems = page.locator('.hover\\:bg-muted\\/50');
    await expect(activityItems.first()).toBeVisible();
    
    // Verify activity items have visitor names (from the mock data)
    const hasVisitorData = await page.getByText('João Silva').isVisible() || 
                           await page.getByText('Maria Santos').isVisible() ||
                           await page.getByText('Carlos Lima').isVisible();
    expect(hasVisitorData).toBeTruthy();
  });

  test('Overview - Verify all navigation menu items are accessible', async ({ page }) => {
    // Test each menu item
    const menuItems = [
      'Visão Geral',
      'Gerenciamento de Moradores',
      'Agendamento de Visitas',
      'Relatórios',
      'Controle de Insumos',
      'Backup e Segurança',
      'Suporte Avançado'
    ];
    
    for (const item of menuItems) {
      await page.click(`button:has-text("${item}")`);
      await page.waitForTimeout(500); // Give time for section to load
      
      // Verify the section loaded by checking for any content
      const mainContent = page.locator('main[role="main"]');
      await expect(mainContent).toBeVisible();
    }
  });

  test('Overview - Return to overview from other sections', async ({ page }) => {
    // Navigate to another section
    await page.click('button:has-text("Relatórios")');
    await expect(page.getByText('Relatórios de Acesso')).toBeVisible();
    
    // Return to Overview
    await page.click('button:has-text("Visão Geral")');
    
    // Verify we're back in Overview
    await expect(page.getByText('Dashboard Administrativo')).toBeVisible();
    await expect(page.locator('[data-testid^="stat-card-"]').first()).toBeVisible();
  });

  test('Overview - Verify header displays correctly', async ({ page }) => {
    // Verify user role is displayed
    await expect(page.getByText('Administrador')).toBeVisible();
    await expect(page.getByText('Painel de Controle')).toBeVisible();
    
    // Verify logout button is present
    await expect(page.getByRole('button', { name: /Sair/i })).toBeVisible();
  });

  test('Overview - Verify statistics cards display data changes', async ({ page }) => {
    // Get initial values
    const value0 = await page.locator('[data-testid="stat-value-0"]').textContent();
    const value1 = await page.locator('[data-testid="stat-value-1"]').textContent();
    
    // Verify values are not empty
    expect(value0).toBeTruthy();
    expect(value1).toBeTruthy();
    
    // Verify change indicators are present
    const statsCardsContainer = page.locator('[data-testid="stats-cards-container"]');
    await expect(statsCardsContainer).toBeVisible();
  });
});

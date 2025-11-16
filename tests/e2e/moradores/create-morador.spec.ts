/**
 * E2E Tests: Create Morador Flow
 * 
 * Testing Pyramid Layer: End-to-End Tests
 * Purpose: Test complete user journey for creating a morador
 */

import { test, expect } from '@playwright/test';

test.describe('Create Morador Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/');
    
    // Login as admin with correct credentials
    await page.fill('input[name="username"], input[type="text"]', 'admin');
    await page.fill('input[name="password"], input[type="password"]', 'a');
    await page.click('button[type="submit"]');
    
    // Wait for admin dashboard to load
    await page.waitForURL('**/admin-dashboard', { timeout: 10000 });
    
    // Navigate to moradores section
    await page.click('button:has-text("Gerenciamento de Moradores")');
    await page.waitForTimeout(1000); // Wait for section to render
  });

  test('should create a new morador with valid data', async ({ page }) => {
    // Click "Novo Morador" button
    await page.click('button:has-text("Novo Morador")');
    
    // Wait for form modal to open
    await expect(page.getByRole('heading', { name: 'Cadastrar Novo Morador' })).toBeVisible({ timeout: 5000 });
    
    // Fill in morador details
    await page.fill('input[placeholder*="Nome completo"]', 'João Silva Teste');
    await page.fill('input[placeholder*="Email"]', 'joao.silva.teste@example.com');
    await page.fill('input[placeholder*="99999-9999"]', '11999999999');
    await page.fill('input[placeholder*="CPF"]', '12345678900');
    
    // Select unidade using combobox
    await page.click('button[role="combobox"]');
    await page.click('text=101');
    
    // Submit form
    await page.click('button:has-text("Cadastrar Morador")');
    
    // Wait for success (modal closes)
    await expect(page.getByRole('heading', { name: 'Cadastrar Novo Morador' })).not.toBeVisible({ timeout: 5000 });
  });

  test('should show validation errors for invalid data', async ({ page }) => {
    // Click "Novo Morador" button
    await page.click('button:has-text("Novo Morador")');
    
    // Wait for form modal
    await expect(page.getByRole('heading', { name: 'Cadastrar Novo Morador' })).toBeVisible({ timeout: 5000 });
    
    // Try to submit empty form
    await page.click('button:has-text("Cadastrar Morador")');
    
    // Check for validation error message
    await expect(page.getByText('Campos obrigatórios faltando')).toBeVisible({ timeout: 5000 });
  });

  test('should validate email format', async ({ page }) => {
    await page.click('button:has-text("Novo Morador")');
    await expect(page.getByRole('heading', { name: 'Cadastrar Novo Morador' })).toBeVisible({ timeout: 5000 });
    
    // Fill with invalid email
    await page.fill('input[placeholder*="Nome completo"]', 'João Silva');
    await page.fill('input[placeholder*="Email"]', 'invalid-email');
    
    // Select unidade
    await page.click('button[role="combobox"]');
    await page.click('text=101');
    
    await page.click('button:has-text("Cadastrar Morador")');
    
    // Should show email format error
    await expect(page.getByText('Email inválido')).toBeVisible({ timeout: 5000 });
  });

  test('should validate CPF format', async ({ page }) => {
    await page.click('button:has-text("Novo Morador")');
    await expect(page.getByRole('heading', { name: 'Cadastrar Novo Morador' })).toBeVisible({ timeout: 5000 });
    
    // Fill with invalid CPF
    await page.fill('input[placeholder*="Nome completo"]', 'João Silva');
    await page.fill('input[placeholder*="Email"]', 'joao@example.com');
    await page.fill('input[placeholder*="CPF"]', '11111111111');
    
    // Select unidade
    await page.click('button[role="combobox"]');
    await page.click('text=101');
    
    await page.click('button:has-text("Cadastrar Morador")');
    
    // Should show CPF validation error
    await expect(page.getByText('CPF inválido')).toBeVisible({ timeout: 5000 });
  });

  test('should handle duplicate email error', async ({ page }) => {
    // This test would require backend integration or mocking
    // Skipping for now as it depends on actual data state
    test.skip();
  });

  test('should cancel form and close modal', async ({ page }) => {
    await page.click('button:has-text("Novo Morador")');
    await expect(page.getByRole('heading', { name: 'Cadastrar Novo Morador' })).toBeVisible({ timeout: 5000 });
    
    // Fill some data
    await page.fill('input[placeholder*="Nome completo"]', 'João Silva');
    await page.fill('input[placeholder*="Email"]', 'joao@example.com');
    
    // Click cancel button (X or Cancelar)
    const cancelButton = page.locator('button:has-text("Cancelar"), button[aria-label="Close"]').first();
    await cancelButton.click();
    
    // Modal should close
    await expect(page.getByRole('heading', { name: 'Cadastrar Novo Morador' })).not.toBeVisible({ timeout: 5000 });
  });

  test('should auto-format phone number', async ({ page }) => {
    await page.click('button:has-text("Novo Morador")');
    await expect(page.getByRole('heading', { name: 'Cadastrar Novo Morador' })).toBeVisible({ timeout: 5000 });
    
    const phoneInput = page.locator('input[placeholder*="99999-9999"]');
    
    // Type unformatted phone
    await phoneInput.fill('11999999999');
    
    // Check if it gets formatted
    const value = await phoneInput.inputValue();
    expect(value).toMatch(/\(\d{2}\) \d{5}-\d{4}/);
  });

  test('should auto-format CPF', async ({ page }) => {
    await page.click('button:has-text("Novo Morador")');
    await expect(page.getByRole('heading', { name: 'Cadastrar Novo Morador' })).toBeVisible({ timeout: 5000 });
    
    const cpfInput = page.locator('input[placeholder*="CPF"]');
    
    // Type unformatted CPF
    await cpfInput.fill('12345678900');
    
    // Check if it gets formatted
    const value = await cpfInput.inputValue();
    expect(value).toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
  });
});

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
    
    // Login as admin
    await page.fill('[name="email"]', 'admin@sigeco.com');
    await page.fill('[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('/dashboard');
    
    // Navigate to moradores page
    await page.click('text=Moradores');
    await page.waitForURL('/moradores');
  });

  test('should create a new morador with valid data', async ({ page }) => {
    // Click "Novo Morador" button
    await page.click('button:has-text("Novo Morador")');
    
    // Wait for form modal to open
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Fill in morador details
    await page.fill('[name="nome"]', 'João Silva');
    await page.fill('[name="email"]', 'joao.silva@example.com');
    await page.fill('[name="telefone"]', '(11) 99999-9999');
    await page.fill('[name="cpf"]', '123.456.789-00');
    await page.fill('[name="unidade"]', '101');
    
    // Submit form
    await page.click('button:has-text("Salvar")');
    
    // Wait for success message
    await expect(page.locator('text=Morador criado com sucesso')).toBeVisible();
    
    // Verify morador appears in the list
    await expect(page.locator('text=João Silva')).toBeVisible();
    await expect(page.locator('text=joao.silva@example.com')).toBeVisible();
    await expect(page.locator('text=101')).toBeVisible();
  });

  test('should show validation errors for invalid data', async ({ page }) => {
    // Click "Novo Morador" button
    await page.click('button:has-text("Novo Morador")');
    
    // Wait for form modal
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Try to submit empty form
    await page.click('button:has-text("Salvar")');
    
    // Check for validation errors
    await expect(page.locator('text=Nome é obrigatório')).toBeVisible();
    await expect(page.locator('text=Email é obrigatório')).toBeVisible();
    await expect(page.locator('text=Unidade é obrigatória')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.click('button:has-text("Novo Morador")');
    
    // Fill with invalid email
    await page.fill('[name="nome"]', 'João Silva');
    await page.fill('[name="email"]', 'invalid-email');
    await page.fill('[name="unidade"]', '101');
    
    await page.click('button:has-text("Salvar")');
    
    // Should show email format error
    await expect(page.locator('text=Email inválido')).toBeVisible();
  });

  test('should validate CPF format', async ({ page }) => {
    await page.click('button:has-text("Novo Morador")');
    
    // Fill with invalid CPF
    await page.fill('[name="nome"]', 'João Silva');
    await page.fill('[name="email"]', 'joao@example.com');
    await page.fill('[name="cpf"]', '123');
    await page.fill('[name="unidade"]', '101');
    
    await page.click('button:has-text("Salvar")');
    
    // Should show CPF format error
    await expect(page.locator('text=CPF inválido')).toBeVisible();
  });

  test('should handle duplicate email error', async ({ page }) => {
    // Create first morador
    await page.click('button:has-text("Novo Morador")');
    await page.fill('[name="nome"]', 'João Silva');
    await page.fill('[name="email"]', 'duplicate@example.com');
    await page.fill('[name="unidade"]', '101');
    await page.click('button:has-text("Salvar")');
    await expect(page.locator('text=Morador criado com sucesso')).toBeVisible();
    
    // Try to create another with same email
    await page.click('button:has-text("Novo Morador")');
    await page.fill('[name="nome"]', 'Maria Silva');
    await page.fill('[name="email"]', 'duplicate@example.com');
    await page.fill('[name="unidade"]', '102');
    await page.click('button:has-text("Salvar")');
    
    // Should show duplicate email error
    await expect(page.locator('text=Email já cadastrado')).toBeVisible();
  });

  test('should cancel form and close modal', async ({ page }) => {
    await page.click('button:has-text("Novo Morador")');
    
    // Fill some data
    await page.fill('[name="nome"]', 'João Silva');
    await page.fill('[name="email"]', 'joao@example.com');
    
    // Click cancel button
    await page.click('button:has-text("Cancelar")');
    
    // Modal should close
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    
    // Data should not be saved
    await expect(page.locator('text=João Silva')).not.toBeVisible();
  });

  test('should auto-format phone number', async ({ page }) => {
    await page.click('button:has-text("Novo Morador")');
    
    // Type unformatted phone
    await page.fill('[name="telefone"]', '11999999999');
    
    // Check if it gets formatted
    await expect(page.locator('[name="telefone"]')).toHaveValue('(11) 99999-9999');
  });

  test('should auto-format CPF', async ({ page }) => {
    await page.click('button:has-text("Novo Morador")');
    
    // Type unformatted CPF
    await page.fill('[name="cpf"]', '12345678900');
    
    // Check if it gets formatted
    await expect(page.locator('[name="cpf"]')).toHaveValue('123.456.789-00');
  });
});

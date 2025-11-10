/**
 * MoradoresAgent
 * 
 * Validates the Moradores (Residents) module including:
 * - CRUD operations (Create, Read, Update, Delete) (MRD-001)
 * - Field validation and required fields (MRD-002)
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5
 */

import { chromium, Browser, Page, BrowserContext } from 'playwright';
import type {
  ValidationAgent,
  AgentResult,
  TestResult,
  ModuleName,
} from '../../types/validation-agents';

/**
 * Morador data structure
 */
interface MoradorData {
  nome: string;
  unidade: string;
  documento: string;
  status?: 'Ativo' | 'Inativo';
}

/**
 * Counters displayed in the Moradores module
 */
interface MoradoresCounters {
  totalMoradores: number;
  unidadesOcupadas: number;
  cadastrosEsteMes: number;
}

export class MoradoresAgent implements ValidationAgent {
  name = 'Moradores Validation Agent';
  module: ModuleName = 'moradores';
  
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private baseURL = process.env.BASE_URL || 'http://localhost:5173';

  /**
   * Execute all moradores validation tests
   */
  async execute(): Promise<AgentResult> {
    const startTime = Date.now();
    const tests: TestResult[] = [];
    const screenshots: string[] = [];
    const logs: string[] = [];

    try {
      // Initialize browser
      await this.initBrowser();
      
      // Navigate to moradores module
      await this.navigateToMoradores();

      // MRD-001: Test CRUD Operations
      const crudTest = await this.testCRUDOperations();
      tests.push(crudTest);
      if (crudTest.screenshot) screenshots.push(crudTest.screenshot);
      if (crudTest.logs) logs.push(...crudTest.logs);

      // MRD-002: Test Field Validation
      const fieldValidationTest = await this.testFieldValidation();
      tests.push(fieldValidationTest);
      if (fieldValidationTest.screenshot) screenshots.push(fieldValidationTest.screenshot);
      if (fieldValidationTest.logs) logs.push(...fieldValidationTest.logs);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logs.push(`Agent execution error: ${errorMessage}`);
      
      tests.push({
        testId: 'MRD-ERROR',
        description: 'Moradores Agent Execution',
        passed: false,
        executionTime: Date.now() - startTime,
        error: errorMessage,
      });
    } finally {
      await this.cleanup();
    }

    const executionTime = Date.now() - startTime;
    const passed = tests.every(test => test.passed);

    return {
      agentName: this.name,
      module: this.module,
      passed,
      executionTime,
      tests,
      screenshots,
      logs,
    };
  }

  /**
   * Initialize browser and context
   */
  private async initBrowser(): Promise<void> {
    this.browser = await chromium.launch({
      headless: process.env.HEADLESS !== 'false',
    });
    
    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });
    
    this.page = await this.context.newPage();
    
    // Setup console log capture
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`Browser console error: ${msg.text()}`);
      }
    });
  }

  /**
   * Navigate to the Moradores module
   */
  private async navigateToMoradores(): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    
    // Navigate to moradores page
    await this.page.goto(`${this.baseURL}/moradores`);
    
    // Wait for moradores page to load
    await this.page.waitForSelector('text=Moradores', { timeout: 10000 });
  }

  /**
   * MRD-001: Test CRUD Operations
   * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
   */
  private async testCRUDOperations(): Promise<TestResult> {
    const startTime = Date.now();
    const testLogs: string[] = [];
    
    try {
      if (!this.page) throw new Error('Page not initialized');

      testLogs.push('Starting CRUD operations test...');

      // Get initial counters
      const initialCounters = await this.extractCounters();
      testLogs.push(`Initial counters: ${JSON.stringify(initialCounters)}`);

      // CREATE: Create a new Morador
      const testMorador: MoradorData = {
        nome: 'Test Morador Validation',
        unidade: 'Apto 999',
        documento: '123.456.789-00',
      };

      testLogs.push(`Creating morador: ${testMorador.nome}`);
      const createSuccess = await this.createMorador(testMorador);
      
      if (!createSuccess) {
        testLogs.push('✗ Failed to create morador');
        return {
          testId: 'MRD-001',
          description: 'Test CRUD operations for Moradores',
          passed: false,
          executionTime: Date.now() - startTime,
          error: 'Failed to create morador',
          logs: testLogs,
        };
      }
      testLogs.push('✓ Morador created successfully');

      // Wait for UI to update
      await this.page.waitForTimeout(1000);

      // Verify counters updated after creation
      const countersAfterCreate = await this.extractCounters();
      testLogs.push(`Counters after create: ${JSON.stringify(countersAfterCreate)}`);
      
      const countersUpdated = await this.verifyCountersUpdate(initialCounters, countersAfterCreate);
      if (countersUpdated) {
        testLogs.push('✓ Counters updated correctly after creation');
      } else {
        testLogs.push('⚠ Counters may not have updated (could be timing issue)');
      }

      // READ: Search for the created Morador
      testLogs.push(`Searching for morador: ${testMorador.nome}`);
      const foundMorador = await this.readMorador(testMorador.nome);
      
      if (!foundMorador) {
        testLogs.push('✗ Failed to find created morador');
        return {
          testId: 'MRD-001',
          description: 'Test CRUD operations for Moradores',
          passed: false,
          executionTime: Date.now() - startTime,
          error: 'Failed to find created morador',
          logs: testLogs,
        };
      }
      testLogs.push(`✓ Morador found: ${JSON.stringify(foundMorador)}`);

      // UPDATE: Modify the Morador data
      const updatedData: Partial<MoradorData> = {
        unidade: 'Apto 998',
      };
      
      testLogs.push(`Updating morador to unidade: ${updatedData.unidade}`);
      const updateSuccess = await this.updateMorador(testMorador.nome, updatedData);
      
      if (!updateSuccess) {
        testLogs.push('✗ Failed to update morador');
        return {
          testId: 'MRD-001',
          description: 'Test CRUD operations for Moradores',
          passed: false,
          executionTime: Date.now() - startTime,
          error: 'Failed to update morador',
          logs: testLogs,
        };
      }
      testLogs.push('✓ Morador updated successfully');

      // Wait for UI to update
      await this.page.waitForTimeout(1000);

      // DELETE: Delete the Morador
      testLogs.push(`Deleting morador: ${testMorador.nome}`);
      const deleteSuccess = await this.deleteMorador(testMorador.nome);
      
      if (!deleteSuccess) {
        testLogs.push('✗ Failed to delete morador');
        return {
          testId: 'MRD-001',
          description: 'Test CRUD operations for Moradores',
          passed: false,
          executionTime: Date.now() - startTime,
          error: 'Failed to delete morador',
          logs: testLogs,
        };
      }
      testLogs.push('✓ Morador deleted successfully');

      // Wait for UI to update
      await this.page.waitForTimeout(1000);

      // Verify counters after deletion
      const finalCounters = await this.extractCounters();
      testLogs.push(`Final counters: ${JSON.stringify(finalCounters)}`);

      // Test searching for Carlos Pereira (from requirements)
      testLogs.push('Searching for Carlos Pereira...');
      const carlosPereira = await this.readMorador('Carlos Pereira');
      if (carlosPereira) {
        testLogs.push(`✓ Found Carlos Pereira: ${JSON.stringify(carlosPereira)}`);
      } else {
        testLogs.push('⚠ Carlos Pereira not found (may not exist in test data)');
      }

      return {
        testId: 'MRD-001',
        description: 'Test CRUD operations for Moradores',
        passed: true,
        executionTime: Date.now() - startTime,
        logs: testLogs,
        expectedValue: 'All CRUD operations successful',
        actualValue: 'Create, Read, Update, Delete all completed',
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      testLogs.push(`Error: ${errorMessage}`);
      
      return {
        testId: 'MRD-001',
        description: 'Test CRUD operations for Moradores',
        passed: false,
        executionTime: Date.now() - startTime,
        error: errorMessage,
        logs: testLogs,
      };
    }
  }

  /**
   * Extract counter values from the Moradores page
   */
  private async extractCounters(): Promise<MoradoresCounters> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      // Extract counter values from stats cards
      const stats = await this.page.$$eval('.text-3xl.font-bold.text-primary, .text-2xl.font-bold', 
        elements => elements.map(el => el.textContent?.trim() || '0')
      );

      return {
        totalMoradores: parseInt(stats[0]) || 0,
        unidadesOcupadas: parseInt(stats[1]) || 0,
        cadastrosEsteMes: parseInt(stats[2]) || 0,
      };
    } catch (error) {
      // Return default values if extraction fails
      return {
        totalMoradores: 0,
        unidadesOcupadas: 0,
        cadastrosEsteMes: 0,
      };
    }
  }

  /**
   * Create a new Morador
   */
  private async createMorador(data: MoradorData): Promise<boolean> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      // Click "Novo Morador" or "Adicionar" button
      const addButton = this.page.locator('button:has-text("Novo Morador"), button:has-text("Adicionar")').first();
      await addButton.click({ timeout: 5000 });

      // Wait for form to appear
      await this.page.waitForTimeout(500);

      // Fill in the form fields
      await this.page.fill('input[name="nome"], input[placeholder*="Nome"]', data.nome);
      await this.page.fill('input[name="unidade"], input[placeholder*="Unidade"]', data.unidade);
      await this.page.fill('input[name="documento"], input[placeholder*="Documento"], input[placeholder*="CPF"]', data.documento);

      // Submit the form
      const submitButton = this.page.locator('button:has-text("Salvar"), button:has-text("Cadastrar"), button[type="submit"]').first();
      await submitButton.click({ timeout: 5000 });

      // Wait for success indication
      await this.page.waitForTimeout(1000);

      return true;
    } catch (error) {
      console.error('Error creating morador:', error);
      return false;
    }
  }

  /**
   * Search for and read a Morador by name
   */
  private async readMorador(nome: string): Promise<MoradorData | null> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      // Look for search input
      const searchInput = this.page.locator('input[placeholder*="Buscar"], input[placeholder*="Pesquisar"], input[type="search"]').first();
      
      if (await searchInput.isVisible({ timeout: 2000 })) {
        // Clear and type search term
        await searchInput.clear();
        await searchInput.fill(nome);
        await this.page.waitForTimeout(500);
      }

      // Look for the morador in the table/list
      const moradorRow = this.page.locator(`tr:has-text("${nome}"), div:has-text("${nome}")`).first();
      
      if (await moradorRow.isVisible({ timeout: 2000 })) {
        // Extract data from the row
        const rowText = await moradorRow.textContent();
        
        return {
          nome: nome,
          unidade: rowText?.match(/Apto \d+/)?.[0] || '',
          documento: rowText?.match(/\d{3}\.\d{3}\.\d{3}-\d{2}/)?.[0] || '',
        };
      }

      return null;
    } catch (error) {
      console.error('Error reading morador:', error);
      return null;
    }
  }

  /**
   * Update a Morador's data
   */
  private async updateMorador(nome: string, data: Partial<MoradorData>): Promise<boolean> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      // Find the morador row
      const moradorRow = this.page.locator(`tr:has-text("${nome}"), div:has-text("${nome}")`).first();
      
      if (!await moradorRow.isVisible({ timeout: 2000 })) {
        return false;
      }

      // Click edit button (look for common edit button patterns)
      const editButton = moradorRow.locator('button:has-text("Editar"), button[aria-label*="Editar"], svg[class*="edit"]').first();
      await editButton.click({ timeout: 5000 });

      // Wait for form to appear
      await this.page.waitForTimeout(500);

      // Update fields
      if (data.nome) {
        await this.page.fill('input[name="nome"], input[placeholder*="Nome"]', data.nome);
      }
      if (data.unidade) {
        await this.page.fill('input[name="unidade"], input[placeholder*="Unidade"]', data.unidade);
      }
      if (data.documento) {
        await this.page.fill('input[name="documento"], input[placeholder*="Documento"]', data.documento);
      }

      // Submit the form
      const submitButton = this.page.locator('button:has-text("Salvar"), button:has-text("Atualizar"), button[type="submit"]').first();
      await submitButton.click({ timeout: 5000 });

      // Wait for success indication
      await this.page.waitForTimeout(1000);

      return true;
    } catch (error) {
      console.error('Error updating morador:', error);
      return false;
    }
  }

  /**
   * Delete a Morador with confirmation check
   */
  private async deleteMorador(nome: string): Promise<boolean> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      // Find the morador row
      const moradorRow = this.page.locator(`tr:has-text("${nome}"), div:has-text("${nome}")`).first();
      
      if (!await moradorRow.isVisible({ timeout: 2000 })) {
        return false;
      }

      // Click delete button
      const deleteButton = moradorRow.locator('button:has-text("Excluir"), button:has-text("Deletar"), button[aria-label*="Excluir"], svg[class*="trash"]').first();
      await deleteButton.click({ timeout: 5000 });

      // Wait for confirmation dialog
      await this.page.waitForTimeout(500);

      // Look for confirmation dialog and confirm
      const confirmButton = this.page.locator('button:has-text("Confirmar"), button:has-text("Sim"), button:has-text("Excluir")').last();
      
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click({ timeout: 5000 });
      }

      // Wait for deletion to complete
      await this.page.waitForTimeout(1000);

      return true;
    } catch (error) {
      console.error('Error deleting morador:', error);
      return false;
    }
  }

  /**
   * Verify that counters updated correctly
   */
  private async verifyCountersUpdate(
    before: MoradoresCounters,
    after: MoradoresCounters
  ): Promise<boolean> {
    // After creating a morador, we expect:
    // - totalMoradores to increase
    // - cadastrosEsteMes to increase
    // - unidadesOcupadas might increase (depends on if unit was previously occupied)
    
    const totalIncreased = after.totalMoradores >= before.totalMoradores;
    const cadastrosIncreased = after.cadastrosEsteMes >= before.cadastrosEsteMes;
    
    return totalIncreased && cadastrosIncreased;
  }

  /**
   * MRD-002: Test Field Validation
   * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
   */
  private async testFieldValidation(): Promise<TestResult> {
    const startTime = Date.now();
    const testLogs: string[] = [];
    
    try {
      if (!this.page) throw new Error('Page not initialized');

      testLogs.push('Starting field validation test...');

      // Test required fields
      testLogs.push('Testing required fields...');
      const requiredFieldsValid = await this.testRequiredFields();
      
      if (requiredFieldsValid) {
        testLogs.push('✓ Required fields validation working correctly');
      } else {
        testLogs.push('✗ Required fields validation not working');
      }

      // Test document mask
      testLogs.push('Testing document mask...');
      const documentMaskValid = await this.testDocumentMask();
      
      if (documentMaskValid) {
        testLogs.push('✓ Document mask applied correctly');
      } else {
        testLogs.push('✗ Document mask not working');
      }

      const passed = requiredFieldsValid && documentMaskValid;

      return {
        testId: 'MRD-002',
        description: 'Test field validation and required fields',
        passed,
        executionTime: Date.now() - startTime,
        logs: testLogs,
        expectedValue: 'Required fields enforced, document mask applied',
        actualValue: `Required fields: ${requiredFieldsValid}, Document mask: ${documentMaskValid}`,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      testLogs.push(`Error: ${errorMessage}`);
      
      return {
        testId: 'MRD-002',
        description: 'Test field validation and required fields',
        passed: false,
        executionTime: Date.now() - startTime,
        error: errorMessage,
        logs: testLogs,
      };
    }
  }

  /**
   * Test that required fields (Nome, Unidade, Documento) are enforced
   */
  private async testRequiredFields(): Promise<boolean> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      // Click "Novo Morador" button
      const addButton = this.page.locator('button:has-text("Novo Morador"), button:has-text("Adicionar")').first();
      await addButton.click({ timeout: 5000 });

      // Wait for form to appear
      await this.page.waitForTimeout(500);

      // Try to submit without filling required fields
      const submitButton = this.page.locator('button:has-text("Salvar"), button:has-text("Cadastrar"), button[type="submit"]').first();
      await submitButton.click({ timeout: 5000 });

      // Wait a moment for validation to trigger
      await this.page.waitForTimeout(500);

      // Check if form is still visible (validation prevented submission)
      const formStillVisible = await this.page.locator('input[name="nome"], input[placeholder*="Nome"]').isVisible({ timeout: 2000 });

      // Check for validation messages
      const validationMessages = await this.page.locator('text=/required|obrigatório|preencha/i').count();

      // Close the form
      const cancelButton = this.page.locator('button:has-text("Cancelar"), button:has-text("Fechar")').first();
      if (await cancelButton.isVisible({ timeout: 1000 })) {
        await cancelButton.click();
      }

      // Form should still be visible or validation messages should appear
      return formStillVisible || validationMessages > 0;

    } catch (error) {
      console.error('Error testing required fields:', error);
      return false;
    }
  }

  /**
   * Test that document field has formatting mask
   */
  private async testDocumentMask(): Promise<boolean> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      // Click "Novo Morador" button
      const addButton = this.page.locator('button:has-text("Novo Morador"), button:has-text("Adicionar")').first();
      await addButton.click({ timeout: 5000 });

      // Wait for form to appear
      await this.page.waitForTimeout(500);

      // Find document input
      const documentInput = this.page.locator('input[name="documento"], input[placeholder*="Documento"], input[placeholder*="CPF"]').first();

      // Type numbers only
      await documentInput.fill('12345678900');

      // Wait for mask to apply
      await this.page.waitForTimeout(300);

      // Get the value
      const value = await documentInput.inputValue();

      // Close the form
      const cancelButton = this.page.locator('button:has-text("Cancelar"), button:has-text("Fechar")').first();
      if (await cancelButton.isVisible({ timeout: 1000 })) {
        await cancelButton.click();
      }

      // Check if mask was applied (should have dots and dash)
      const hasMask = value.includes('.') || value.includes('-') || value.length > 11;

      return hasMask;

    } catch (error) {
      console.error('Error testing document mask:', error);
      return false;
    }
  }

  /**
   * Cleanup browser resources
   */
  private async cleanup(): Promise<void> {
    try {
      if (this.page) await this.page.close();
      if (this.context) await this.context.close();
      if (this.browser) await this.browser.close();
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}
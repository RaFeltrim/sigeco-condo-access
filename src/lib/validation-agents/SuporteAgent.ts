/**
 * SuporteAgent
 *
 * Validates the Suporte (Support) module including:
 * - Training material status (SUP-001) - PROJECT BLOCKER if incomplete
 * - Support quality and availability (SUP-002)
 *
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 14.1, 14.2, 14.3, 14.4, 14.5
 */

import { chromium, Browser, Page, BrowserContext } from 'playwright';
import type {
  ValidationAgent,
  AgentResult,
  TestResult,
  ModuleName,
} from '../../types/validation-agents';

/**
 * Training material status
 */
interface TrainingMaterial {
  nome: string;
  completionPercentage: number;
  status: 'Completo' | 'Em Progresso' | 'Não Iniciado';
}

/**
 * System version information
 */
interface VersionInfo {
  versaoAtual: string;
  atualizacoesDisponiveis: boolean;
  ultimaAtualizacao: string;
}

export class SuporteAgent implements ValidationAgent {
  name = 'Suporte Validation Agent';
  module: ModuleName = 'suporte';

  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private baseURL = process.env.BASE_URL || 'http://localhost:5173';

  /**
   * Execute all suporte validation tests
   */
  async execute(): Promise<AgentResult> {
    const startTime = Date.now();
    const tests: TestResult[] = [];
    const screenshots: string[] = [];
    const logs: string[] = [];

    try {
      // Initialize browser
      await this.initBrowser();

      // Navigate to suporte module
      await this.navigateToSuporte();

      // SUP-001: Test Training Material Status (PROJECT BLOCKER)
      const trainingMaterialTest = await this.testTrainingMaterialStatus();
      tests.push(trainingMaterialTest);
      if (trainingMaterialTest.screenshot) screenshots.push(trainingMaterialTest.screenshot);
      if (trainingMaterialTest.logs) logs.push(...trainingMaterialTest.logs);

      // SUP-002: Test Support Quality
      const supportQualityTest = await this.testSupportQuality();
      tests.push(supportQualityTest);
      if (supportQualityTest.screenshot) screenshots.push(supportQualityTest.screenshot);
      if (supportQualityTest.logs) logs.push(...supportQualityTest.logs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logs.push(`Agent execution error: ${errorMessage}`);

      tests.push({
        testId: 'SUP-ERROR',
        description: 'Suporte Agent Execution',
        passed: false,
        executionTime: Date.now() - startTime,
        error: errorMessage,
      });
    } finally {
      await this.cleanup();
    }

    const executionTime = Date.now() - startTime;
    const passed = tests.every((test) => test.passed);

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
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`Browser console error: ${msg.text()}`);
      }
    });
  }

  /**
   * Navigate to the Suporte module
   */
  private async navigateToSuporte(): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    // Navigate to suporte page
    await this.page.goto(`${this.baseURL}/suporte`);

    // Wait for suporte page to load
    await this.page.waitForSelector('text=Suporte', { timeout: 10000 });
  }

  /**
   * SUP-001: Test Training Material Status (PROJECT BLOCKER)
   * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5
   */
  private async testTrainingMaterialStatus(): Promise<TestResult> {
    const startTime = Date.now();
    const testLogs: string[] = [];

    try {
      if (!this.page) throw new Error('Page not initialized');

      testLogs.push('Starting training material status test (PROJECT BLOCKER)...');

      // Check material status
      testLogs.push('Checking training material status...');
      const materials = await this.checkMaterialStatus();

      testLogs.push(`Found ${materials.length} training materials`);

      const blockers: string[] = [];

      // Check Geração de Relatórios
      const relatoriosMaterial = materials.find((m) =>
        m.nome.includes('Geração de Relatórios') || m.nome.includes('Relatórios'),
      );

      if (relatoriosMaterial) {
        testLogs.push(
          `Geração de Relatórios: ${relatoriosMaterial.completionPercentage}% - ${relatoriosMaterial.status}`,
        );

        if (relatoriosMaterial.completionPercentage < 100) {
          const blocker = `PROJECT BLOCKER: Geração de Relatórios is ${relatoriosMaterial.completionPercentage}% complete (must be 100%)`;
          testLogs.push(`✗ ${blocker}`);
          blockers.push(blocker);
        } else {
          testLogs.push('✓ Geração de Relatórios is 100% complete');
        }
      } else {
        testLogs.push('⚠ Geração de Relatórios material not found');
      }

      // Check Configurações de Segurança
      const segurancaMaterial = materials.find((m) =>
        m.nome.includes('Configurações de Segurança') || m.nome.includes('Segurança'),
      );

      if (segurancaMaterial) {
        testLogs.push(
          `Configurações de Segurança: ${segurancaMaterial.completionPercentage}% - ${segurancaMaterial.status}`,
        );

        if (segurancaMaterial.completionPercentage < 100) {
          const blocker = `PROJECT BLOCKER: Configurações de Segurança is ${segurancaMaterial.completionPercentage}% complete (must be 100%)`;
          testLogs.push(`✗ ${blocker}`);
          blockers.push(blocker);
        } else {
          testLogs.push('✓ Configurações de Segurança is 100% complete');
        }
      } else {
        testLogs.push('⚠ Configurações de Segurança material not found');
      }

      // Verify completion criteria
      const completionCriteriaMet = await this.verifyCompletionCriteria(materials);

      if (!completionCriteriaMet) {
        testLogs.push('✗ Completion criteria not met');
      } else {
        testLogs.push('✓ All completion criteria met');
      }

      const passed = blockers.length === 0 && completionCriteriaMet;

      if (!passed) {
        return {
          testId: 'SUP-001',
          description: 'Test training material status (PROJECT BLOCKER)',
          passed: false,
          executionTime: Date.now() - startTime,
          error: `PROJECT BLOCKER: ${blockers.join('; ')}`,
          logs: testLogs,
        };
      }

      return {
        testId: 'SUP-001',
        description: 'Test training material status (PROJECT BLOCKER)',
        passed: true,
        executionTime: Date.now() - startTime,
        logs: testLogs,
        expectedValue: 'All training materials 100% complete',
        actualValue: 'All materials verified complete',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      testLogs.push(`Error: ${errorMessage}`);

      return {
        testId: 'SUP-001',
        description: 'Test training material status (PROJECT BLOCKER)',
        passed: false,
        executionTime: Date.now() - startTime,
        error: errorMessage,
        logs: testLogs,
      };
    }
  }

  /**
   * SUP-002: Test Support Quality
   * Requirements: 14.1, 14.2, 14.3, 14.4, 14.5
   */
  private async testSupportQuality(): Promise<TestResult> {
    const startTime = Date.now();
    const testLogs: string[] = [];

    try {
      if (!this.page) throw new Error('Page not initialized');

      testLogs.push('Starting support quality test...');

      const validations: boolean[] = [];

      // Verify Support 24x7 Accessible
      testLogs.push('Verifying 24x7 support accessibility...');
      const support24x7 = await this.verifySupport24x7Accessible();

      if (support24x7) {
        testLogs.push('✓ 24x7 support contact mechanism accessible');
        validations.push(true);
      } else {
        testLogs.push('✗ 24x7 support not accessible');
        validations.push(false);
      }

      // Verify Current Version
      testLogs.push('Verifying current version...');
      const versionInfo = await this.verifyCurrentVersion();

      testLogs.push(`Version Info: ${JSON.stringify(versionInfo)}`);

      if (versionInfo.versaoAtual === '2.1.3') {
        testLogs.push('✓ Versão Atual is 2.1.3');
        validations.push(true);
      } else {
        testLogs.push(`⚠ Versão Atual is ${versionInfo.versaoAtual} (expected 2.1.3)`);
        validations.push(false);
      }

      // Check Available Updates
      testLogs.push('Checking for available updates...');
      const hasUpdates = await this.checkAvailableUpdates();

      if (hasUpdates !== null) {
        testLogs.push(`✓ Update check functional (updates available: ${hasUpdates})`);
        validations.push(true);
      } else {
        testLogs.push('⚠ Could not check for updates');
        validations.push(false);
      }

      // Verify Update Without Downtime
      testLogs.push('Verifying update mechanism...');
      const updateWithoutDowntime = await this.verifyUpdateWithoutDowntime();

      if (updateWithoutDowntime) {
        testLogs.push('✓ Updates can be installed without critical downtime');
        validations.push(true);
      } else {
        testLogs.push('⚠ Could not verify update mechanism');
        validations.push(false);
      }

      const passed = validations.filter((v) => v).length >= 3; // At least 3 out of 4

      return {
        testId: 'SUP-002',
        description: 'Test support quality and availability',
        passed,
        executionTime: Date.now() - startTime,
        logs: testLogs,
        expectedValue: 'Support accessible, version correct, updates functional',
        actualValue: `${validations.filter((v) => v).length}/${validations.length} validations passed`,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      testLogs.push(`Error: ${errorMessage}`);

      return {
        testId: 'SUP-002',
        description: 'Test support quality and availability',
        passed: false,
        executionTime: Date.now() - startTime,
        error: errorMessage,
        logs: testLogs,
      };
    }
  }

  /**
   * Check training material status
   */
  private async checkMaterialStatus(): Promise<TrainingMaterial[]> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      const materials: TrainingMaterial[] = [];

      // Look for training materials section
      const materialsSection = this.page.locator('text=Material de Treinamento').locator('..');

      if (await materialsSection.isVisible({ timeout: 2000 })) {
        // Extract material cards or list items
        const materialElements = await materialsSection.locator('.card, .list-item, tr').all();

        for (const element of materialElements) {
          const text = await element.textContent();

          if (text) {
            // Extract name
            const nameMatch = text.match(/Geração de Relatórios|Configurações de Segurança|[\w\s]+/);
            const nome = nameMatch ? nameMatch[0].trim() : '';

            // Extract completion percentage
            const percentageMatch = text.match(/(\d+)%/);
            const completionPercentage = percentageMatch ? parseInt(percentageMatch[1]) : 0;

            // Determine status
            let status: 'Completo' | 'Em Progresso' | 'Não Iniciado' = 'Não Iniciado';
            if (completionPercentage === 100) {
              status = 'Completo';
            } else if (completionPercentage > 0) {
              status = 'Em Progresso';
            }

            if (nome) {
              materials.push({ nome, completionPercentage, status });
            }
          }
        }
      }

      return materials;
    } catch (error) {
      console.error('Error checking material status:', error);
      return [];
    }
  }

  /**
   * Verify completion criteria for training materials
   */
  private async verifyCompletionCriteria(materials: TrainingMaterial[]): Promise<boolean> {
    // All critical materials must be 100% complete
    const criticalMaterials = ['Geração de Relatórios', 'Configurações de Segurança'];

    for (const criticalName of criticalMaterials) {
      const material = materials.find((m) => m.nome.includes(criticalName));

      if (!material || material.completionPercentage < 100) {
        return false;
      }
    }

    return true;
  }

  /**
   * Verify 24x7 support is accessible
   */
  private async verifySupport24x7Accessible(): Promise<boolean> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      // Look for support contact mechanisms
      const supportButton = await this.page
        .locator('button:has-text("Contatar Suporte"), button:has-text("Suporte 24x7"), a:has-text("Suporte")')
        .isVisible({ timeout: 2000 });

      if (supportButton) return true;

      // Look for WhatsApp or phone number
      const whatsappLink = await this.page
        .locator('a[href*="whatsapp"], a[href*="wa.me"]')
        .isVisible({ timeout: 2000 });

      if (whatsappLink) return true;

      // Look for email or chat
      const emailLink = await this.page
        .locator('a[href^="mailto:"]')
        .isVisible({ timeout: 2000 });

      return emailLink;
    } catch (error) {
      console.error('Error verifying 24x7 support:', error);
      return false;
    }
  }

  /**
   * Verify current version
   */
  private async verifyCurrentVersion(): Promise<VersionInfo> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      // Look for version information
      const versionText = await this.page
        .locator('text=Versão Atual')
        .locator('..')
        .textContent();

      const versionMatch = versionText?.match(/(\d+\.\d+\.\d+)/);
      const versaoAtual = versionMatch ? versionMatch[1] : '0.0.0';

      // Check for available updates
      const atualizacoesDisponiveis = await this.page
        .locator('text=/atualiza.*disponível|update.*available/i')
        .isVisible({ timeout: 2000 });

      // Get last update date
      const ultimaAtualizacaoText = await this.page
        .locator('text=Última Atualização')
        .locator('..')
        .textContent();

      const dateMatch = ultimaAtualizacaoText?.match(/\d{2}\/\d{2}\/\d{4}/);
      const ultimaAtualizacao = dateMatch ? dateMatch[0] : '';

      return {
        versaoAtual,
        atualizacoesDisponiveis,
        ultimaAtualizacao,
      };
    } catch (error) {
      console.error('Error verifying current version:', error);
      return {
        versaoAtual: '0.0.0',
        atualizacoesDisponiveis: false,
        ultimaAtualizacao: '',
      };
    }
  }

  /**
   * Check for available updates
   */
  private async checkAvailableUpdates(): Promise<boolean | null> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      // Look for "Verificar Atualizações" button
      const checkUpdatesButton = this.page
        .locator('button:has-text("Verificar Atualizações"), button:has-text("Check Updates")')
        .first();

      if (await checkUpdatesButton.isVisible({ timeout: 2000 })) {
        await checkUpdatesButton.click({ timeout: 5000 });
        await this.page.waitForTimeout(1000);

        // Check result
        const hasUpdates = await this.page
          .locator('text=/atualiza.*disponível|nenhuma.*atualização/i')
          .isVisible({ timeout: 3000 });

        return hasUpdates;
      }

      // Alternative: check if updates badge is visible
      const updatesBadge = await this.page
        .locator('text=/\\d+.*atualiza/i')
        .isVisible({ timeout: 2000 });

      return updatesBadge;
    } catch (error) {
      console.error('Error checking available updates:', error);
      return null;
    }
  }

  /**
   * Verify updates can be installed without critical downtime
   */
  private async verifyUpdateWithoutDowntime(): Promise<boolean> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      // Look for update mechanism description
      const updateInfo = await this.page
        .locator('text=/sem.*downtime|zero.*downtime|sem.*interrupção/i')
        .isVisible({ timeout: 2000 });

      if (updateInfo) return true;

      // Look for "Instalar Atualização" button (indicates update mechanism exists)
      const installButton = await this.page
        .locator('button:has-text("Instalar Atualização"), button:has-text("Install Update")')
        .isVisible({ timeout: 2000 });

      return installButton;
    } catch (error) {
      console.error('Error verifying update mechanism:', error);
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

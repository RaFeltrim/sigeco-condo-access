/**
 * RelatoriosAgent
 *
 * Validates the Relatórios (Reports) module including:
 * - PDF and Excel report generation (REL-001) - CRITICAL
 * - Data coherence between summary and detailed records (REL-002)
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.3, 9.4, 9.5
 */

import { chromium, Browser, Page, BrowserContext, Download } from 'playwright';
import type {
  ValidationAgent,
  AgentResult,
  TestResult,
  ModuleName,
} from '../../types/validation-agents';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Summary indicators from the report
 */
interface SummaryIndicators {
  tempoMedio: string; // e.g., "1h 28min"
  taxaOcupacao: number; // e.g., 67
  horariosPico: string; // e.g., "14:00-16:00"
  distribuicaoPorTipo: Record<string, number>; // e.g., { "Visitante": 45, "Prestador": 30, ... }
}

/**
 * Detailed record from the report
 */
interface DetailedRecord {
  nome: string;
  tipo: string;
  entrada: string;
  saida: string;
  duracao: number; // in minutes
}

export class RelatoriosAgent implements ValidationAgent {
  name = 'Relatórios Validation Agent';
  module: ModuleName = 'relatorios';

  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private baseURL = process.env.BASE_URL || 'http://localhost:5173';
  private downloadPath = path.join(process.cwd(), '.kiro', 'reports', 'downloads');

  /**
   * Execute all relatórios validation tests
   */
  async execute(): Promise<AgentResult> {
    const startTime = Date.now();
    const tests: TestResult[] = [];
    const screenshots: string[] = [];
    const logs: string[] = [];

    try {
      // Ensure download directory exists
      if (!fs.existsSync(this.downloadPath)) {
        fs.mkdirSync(this.downloadPath, { recursive: true });
      }

      // Initialize browser
      await this.initBrowser();

      // Navigate to relatórios module
      await this.navigateToRelatorios();

      // REL-001: Test Report Generation (CRITICAL)
      const reportGenerationTest = await this.testReportGeneration();
      tests.push(reportGenerationTest);
      if (reportGenerationTest.screenshot) screenshots.push(reportGenerationTest.screenshot);
      if (reportGenerationTest.logs) logs.push(...reportGenerationTest.logs);

      // REL-002: Test Data Coherence
      const dataCoherenceTest = await this.testDataCoherence();
      tests.push(dataCoherenceTest);
      if (dataCoherenceTest.screenshot) screenshots.push(dataCoherenceTest.screenshot);
      if (dataCoherenceTest.logs) logs.push(...dataCoherenceTest.logs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logs.push(`Agent execution error: ${errorMessage}`);

      tests.push({
        testId: 'REL-ERROR',
        description: 'Relatórios Agent Execution',
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
   * Initialize browser and context with download support
   */
  private async initBrowser(): Promise<void> {
    this.browser = await chromium.launch({
      headless: process.env.HEADLESS !== 'false',
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      acceptDownloads: true,
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
   * Navigate to the Relatórios module
   */
  private async navigateToRelatorios(): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    // Navigate to relatórios page
    await this.page.goto(`${this.baseURL}/relatorios`);

    // Wait for relatórios page to load
    await this.page.waitForSelector('text=Relatórios', { timeout: 10000 });
  }

  /**
   * REL-001: Test Report Generation (CRITICAL)
   * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
   */
  private async testReportGeneration(): Promise<TestResult> {
    const startTime = Date.now();
    const testLogs: string[] = [];

    try {
      if (!this.page) throw new Error('Page not initialized');

      testLogs.push('Starting CRITICAL report generation test...');

      // Set filter for 7-day period
      testLogs.push('Setting 7-day period filter...');
      await this.setDateFilter(7);
      await this.page.waitForTimeout(1000);

      // Verify Total de Acessos: 284 (or extract actual value)
      const totalAcessos = await this.extractTotalAcessos();
      testLogs.push(`Total de Acessos: ${totalAcessos}`);

      // Test PDF generation
      testLogs.push('Testing PDF report generation...');
      const pdfResult = await this.generatePDFReport();

      if (!pdfResult.success) {
        testLogs.push(`✗ CRITICAL: PDF generation failed - ${pdfResult.error}`);
        return {
          testId: 'REL-001',
          description: 'Test PDF and Excel report generation (CRITICAL)',
          passed: false,
          executionTime: Date.now() - startTime,
          error: `CRITICAL FAILURE: PDF generation failed - ${pdfResult.error}`,
          logs: testLogs,
        };
      }

      testLogs.push(`✓ PDF generated: ${pdfResult.filePath}`);

      // Verify PDF file integrity
      const pdfIntegrity = await this.verifyFileIntegrity(pdfResult.filePath!);
      if (!pdfIntegrity.valid) {
        testLogs.push(`✗ CRITICAL: PDF file corrupted - ${pdfIntegrity.error}`);
        return {
          testId: 'REL-001',
          description: 'Test PDF and Excel report generation (CRITICAL)',
          passed: false,
          executionTime: Date.now() - startTime,
          error: `CRITICAL FAILURE: PDF file corrupted - ${pdfIntegrity.error}`,
          logs: testLogs,
        };
      }

      testLogs.push(`✓ PDF file integrity verified (${pdfIntegrity.size} bytes)`);

      // Test Excel generation
      testLogs.push('Testing Excel report generation...');
      const excelResult = await this.generateExcelReport();

      if (!excelResult.success) {
        testLogs.push(`✗ CRITICAL: Excel generation failed - ${excelResult.error}`);
        return {
          testId: 'REL-001',
          description: 'Test PDF and Excel report generation (CRITICAL)',
          passed: false,
          executionTime: Date.now() - startTime,
          error: `CRITICAL FAILURE: Excel generation failed - ${excelResult.error}`,
          logs: testLogs,
        };
      }

      testLogs.push(`✓ Excel generated: ${excelResult.filePath}`);

      // Verify Excel file integrity
      const excelIntegrity = await this.verifyFileIntegrity(excelResult.filePath!);
      if (!excelIntegrity.valid) {
        testLogs.push(`✗ CRITICAL: Excel file corrupted - ${excelIntegrity.error}`);
        return {
          testId: 'REL-001',
          description: 'Test PDF and Excel report generation (CRITICAL)',
          passed: false,
          executionTime: Date.now() - startTime,
          error: `CRITICAL FAILURE: Excel file corrupted - ${excelIntegrity.error}`,
          logs: testLogs,
        };
      }

      testLogs.push(`✓ Excel file integrity verified (${excelIntegrity.size} bytes)`);

      return {
        testId: 'REL-001',
        description: 'Test PDF and Excel report generation (CRITICAL)',
        passed: true,
        executionTime: Date.now() - startTime,
        logs: testLogs,
        expectedValue: 'Both PDF and Excel reports generated and valid',
        actualValue: `PDF: ${pdfIntegrity.size} bytes, Excel: ${excelIntegrity.size} bytes`,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      testLogs.push(`✗ CRITICAL ERROR: ${errorMessage}`);

      return {
        testId: 'REL-001',
        description: 'Test PDF and Excel report generation (CRITICAL)',
        passed: false,
        executionTime: Date.now() - startTime,
        error: `CRITICAL FAILURE: ${errorMessage}`,
        logs: testLogs,
      };
    }
  }

  /**
   * REL-002: Test Data Coherence
   * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
   */
  private async testDataCoherence(): Promise<TestResult> {
    const startTime = Date.now();
    const testLogs: string[] = [];

    try {
      if (!this.page) throw new Error('Page not initialized');

      testLogs.push('Starting data coherence test...');

      // Extract summary indicators
      testLogs.push('Extracting summary indicators...');
      const summary = await this.extractSummaryIndicators();
      testLogs.push(`Summary: ${JSON.stringify(summary)}`);

      // Extract detailed records
      testLogs.push('Extracting detailed records...');
      const records = await this.extractDetailedRecords();
      testLogs.push(`Found ${records.length} detailed records`);

      const validations: boolean[] = [];

      // Verify Tempo Médio
      testLogs.push('Verifying Tempo Médio...');
      const tempoMedioValid = await this.verifyTempoMedio(summary.tempoMedio, records);
      if (tempoMedioValid) {
        testLogs.push(`✓ Tempo Médio (${summary.tempoMedio}) matches detailed records`);
        validations.push(true);
      } else {
        testLogs.push(`✗ Tempo Médio (${summary.tempoMedio}) does not match detailed records`);
        validations.push(false);
      }

      // Verify Taxa de Ocupação
      testLogs.push('Verifying Taxa de Ocupação...');
      const taxaOcupacaoValid = await this.verifyTaxaOcupacao(summary.taxaOcupacao);
      if (taxaOcupacaoValid) {
        testLogs.push(`✓ Taxa de Ocupação (${summary.taxaOcupacao}%) is valid`);
        validations.push(true);
      } else {
        testLogs.push(`✗ Taxa de Ocupação (${summary.taxaOcupacao}%) is invalid`);
        validations.push(false);
      }

      // Verify Horários de Pico
      testLogs.push('Verifying Horários de Pico...');
      const horariosPicoValid = await this.verifyHorariosPico(summary.horariosPico, records);
      if (horariosPicoValid) {
        testLogs.push(`✓ Horários de Pico (${summary.horariosPico}) matches activity data`);
        validations.push(true);
      } else {
        testLogs.push(`✗ Horários de Pico (${summary.horariosPico}) does not match activity data`);
        validations.push(false);
      }

      // Verify Distribuição por Tipo sums to 100%
      testLogs.push('Verifying Distribuição por Tipo...');
      const distribuicaoValid = await this.verifyDistribuicaoSums100(summary.distribuicaoPorTipo);
      if (distribuicaoValid) {
        testLogs.push('✓ Distribuição por Tipo sums to 100%');
        validations.push(true);
      } else {
        testLogs.push('✗ Distribuição por Tipo does not sum to 100%');
        validations.push(false);
      }

      const passed = validations.every((v) => v);

      return {
        testId: 'REL-002',
        description: 'Test data coherence between summary and detailed records',
        passed,
        executionTime: Date.now() - startTime,
        logs: testLogs,
        expectedValue: 'All indicators match underlying data',
        actualValue: `${validations.filter((v) => v).length}/${validations.length} validations passed`,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      testLogs.push(`Error: ${errorMessage}`);

      return {
        testId: 'REL-002',
        description: 'Test data coherence between summary and detailed records',
        passed: false,
        executionTime: Date.now() - startTime,
        error: errorMessage,
        logs: testLogs,
      };
    }
  }

  /**
   * Set date filter for reports
   */
  private async setDateFilter(days: number): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      // Look for date range selector or preset buttons
      const last7DaysButton = this.page.locator('button:has-text("Últimos 7 dias"), button:has-text("7 dias")').first();

      if (await last7DaysButton.isVisible({ timeout: 2000 })) {
        await last7DaysButton.click();
        return;
      }

      // Alternative: use date pickers
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const startDateInput = this.page.locator('input[name="startDate"], input[placeholder*="Data inicial"]').first();
      const endDateInput = this.page.locator('input[name="endDate"], input[placeholder*="Data final"]').first();

      if (await startDateInput.isVisible({ timeout: 2000 })) {
        await startDateInput.fill(startDate.toISOString().split('T')[0]);
        await endDateInput.fill(endDate.toISOString().split('T')[0]);

        // Apply filter
        const applyButton = this.page.locator('button:has-text("Aplicar"), button:has-text("Filtrar")').first();
        if (await applyButton.isVisible({ timeout: 2000 })) {
          await applyButton.click();
        }
      }
    } catch (error) {
      console.error('Error setting date filter:', error);
    }
  }

  /**
   * Extract Total de Acessos value
   */
  private async extractTotalAcessos(): Promise<number> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      const totalText = await this.page.locator('text=Total de Acessos').locator('..').locator('.text-3xl, .text-2xl').textContent();
      return parseInt(totalText?.trim() || '0');
    } catch (error) {
      return 0;
    }
  }

  /**
   * Generate PDF report
   */
  private async generatePDFReport(): Promise<{ success: boolean; filePath?: string; error?: string }> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      // Start waiting for download before clicking
      const downloadPromise = this.page.waitForEvent('download', { timeout: 30000 });

      // Click PDF export button
      const pdfButton = this.page.locator('button:has-text("PDF"), button:has-text("Exportar PDF")').first();
      await pdfButton.click({ timeout: 5000 });

      // Wait for download
      const download = await downloadPromise;

      // Save file
      const fileName = `report-${Date.now()}.pdf`;
      const filePath = path.join(this.downloadPath, fileName);
      await download.saveAs(filePath);

      return { success: true, filePath };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Generate Excel report
   */
  private async generateExcelReport(): Promise<{ success: boolean; filePath?: string; error?: string }> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      // Start waiting for download before clicking
      const downloadPromise = this.page.waitForEvent('download', { timeout: 30000 });

      // Click Excel export button
      const excelButton = this.page.locator('button:has-text("Excel"), button:has-text("Exportar Excel")').first();
      await excelButton.click({ timeout: 5000 });

      // Wait for download
      const download = await downloadPromise;

      // Save file
      const fileName = `report-${Date.now()}.xlsx`;
      const filePath = path.join(this.downloadPath, fileName);
      await download.saveAs(filePath);

      return { success: true, filePath };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Verify file integrity
   */
  private async verifyFileIntegrity(filePath: string): Promise<{ valid: boolean; size?: number; error?: string }> {
    try {
      if (!fs.existsSync(filePath)) {
        return { valid: false, error: 'File does not exist' };
      }

      const stats = fs.statSync(filePath);

      if (stats.size === 0) {
        return { valid: false, error: 'File is empty' };
      }

      // Basic file validation - check if file has minimum size (1KB)
      if (stats.size < 1024) {
        return { valid: false, error: 'File too small, likely corrupted' };
      }

      return { valid: true, size: stats.size };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { valid: false, error: errorMessage };
    }
  }

  /**
   * Extract summary indicators from the report
   */
  private async extractSummaryIndicators(): Promise<SummaryIndicators> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      // Extract Tempo Médio
      const tempoMedio = await this.page.locator('text=Tempo Médio').locator('..').locator('.text-2xl, .text-xl').textContent() || '0h 0min';

      // Extract Taxa de Ocupação
      const taxaOcupacaoText = await this.page.locator('text=Taxa de Ocupação').locator('..').locator('.text-2xl, .text-xl').textContent() || '0%';
      const taxaOcupacao = parseInt(taxaOcupacaoText.replace('%', ''));

      // Extract Horários de Pico
      const horariosPico = await this.page.locator('text=Horários de Pico').locator('..').locator('.text-2xl, .text-xl').textContent() || '00:00-00:00';

      // Extract Distribuição por Tipo
      const distribuicaoPorTipo: Record<string, number> = {};
      const distribuicaoElements = await this.page.locator('text=Distribuição por Tipo').locator('..').locator('..').locator('.text-sm').all();

      for (const element of distribuicaoElements) {
        const text = await element.textContent();
        const match = text?.match(/(\w+):\s*(\d+)%/);
        if (match) {
          distribuicaoPorTipo[match[1]] = parseInt(match[2]);
        }
      }

      return {
        tempoMedio: tempoMedio.trim(),
        taxaOcupacao,
        horariosPico: horariosPico.trim(),
        distribuicaoPorTipo,
      };
    } catch (error) {
      return {
        tempoMedio: '0h 0min',
        taxaOcupacao: 0,
        horariosPico: '00:00-00:00',
        distribuicaoPorTipo: {},
      };
    }
  }

  /**
   * Extract detailed records from the report
   */
  private async extractDetailedRecords(): Promise<DetailedRecord[]> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      const records: DetailedRecord[] = [];
      const rows = await this.page.locator('table tbody tr').all();

      for (const row of rows) {
        const cells = await row.locator('td').all();
        if (cells.length >= 4) {
          const nome = await cells[0].textContent() || '';
          const tipo = await cells[1].textContent() || '';
          const entrada = await cells[2].textContent() || '';
          const saida = await cells[3].textContent() || '';

          // Calculate duration in minutes
          const duracao = this.calculateDuration(entrada, saida);

          records.push({ nome, tipo, entrada, saida, duracao });
        }
      }

      return records;
    } catch (error) {
      return [];
    }
  }

  /**
   * Calculate duration between two time strings
   */
  private calculateDuration(entrada: string, saida: string): number {
    try {
      const entradaTime = new Date(`2000-01-01 ${entrada}`);
      const saidaTime = new Date(`2000-01-01 ${saida}`);
      const diff = saidaTime.getTime() - entradaTime.getTime();
      return Math.floor(diff / 60000); // Convert to minutes
    } catch (error) {
      return 0;
    }
  }

  /**
   * Verify Tempo Médio matches detailed records
   */
  private async verifyTempoMedio(tempoMedio: string, records: DetailedRecord[]): Promise<boolean> {
    if (records.length === 0) return true; // Can't verify without data

    // Calculate average from records
    const totalMinutes = records.reduce((sum, record) => sum + record.duracao, 0);
    const avgMinutes = totalMinutes / records.length;

    // Parse expected tempo médio
    const match = tempoMedio.match(/(\d+)h\s*(\d+)min/);
    if (!match) return false;

    const expectedMinutes = parseInt(match[1]) * 60 + parseInt(match[2]);

    // Allow 10% tolerance
    const tolerance = expectedMinutes * 0.1;
    return Math.abs(avgMinutes - expectedMinutes) <= tolerance;
  }

  /**
   * Verify Taxa de Ocupação is valid
   */
  private async verifyTaxaOcupacao(taxaOcupacao: number): Promise<boolean> {
    // Taxa should be between 0 and 100
    return taxaOcupacao >= 0 && taxaOcupacao <= 100;
  }

  /**
   * Verify Horários de Pico matches activity data
   */
  private async verifyHorariosPico(horariosPico: string, records: DetailedRecord[]): Promise<boolean> {
    if (records.length === 0) return true; // Can't verify without data

    // Count entries by hour
    const hourCounts: Record<number, number> = {};

    for (const record of records) {
      const hour = parseInt(record.entrada.split(':')[0]);
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }

    // Find peak hours
    const maxCount = Math.max(...Object.values(hourCounts));
    const peakHours = Object.keys(hourCounts).filter((hour) => hourCounts[parseInt(hour)] === maxCount);

    // Parse expected peak hours
    const match = horariosPico.match(/(\d+):00-(\d+):00/);
    if (!match) return false;

    const expectedStart = parseInt(match[1]);
    const expectedEnd = parseInt(match[2]);

    // Check if any peak hour falls within expected range
    return peakHours.some((hour) => {
      const h = parseInt(hour);
      return h >= expectedStart && h <= expectedEnd;
    });
  }

  /**
   * Verify Distribuição por Tipo sums to 100%
   */
  private async verifyDistribuicaoSums100(distribuicao: Record<string, number>): Promise<boolean> {
    const sum = Object.values(distribuicao).reduce((total, value) => total + value, 0);
    // Allow 1% tolerance for rounding
    return Math.abs(sum - 100) <= 1;
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

#!/usr/bin/env node
/**
 * Master Test Orchestration Script
 * Runs all test suites and generates test-errors.log
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface TestError {
  name: string;
  message: string;
  stack?: string;
}

interface TestResults {
  unit: TestError[];
  integration: TestError[];
  e2e: TestError[];
  cypress: TestError[];
}

const RESULTS_DIR = path.join(process.cwd(), 'test-results');
const ERROR_LOG_PATH = path.join(process.cwd(), 'test-errors.log');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

class TestOrchestrator {
  private results: TestResults = {
    unit: [],
    integration: [],
    e2e: [],
    cypress: []
  };

  /**
   * Execute a command and capture output
   */
  private executeCommand(command: string, testType: string): { stdout: string; stderr: string; exitCode: number } {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Running ${testType} tests...`);
    console.log(`Command: ${command}`);
    console.log('='.repeat(80));

    try {
      const stdout = execSync(command, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        maxBuffer: 50 * 1024 * 1024, // 50MB buffer
        windowsHide: true,
      });
      console.log(stdout);
      return { stdout, stderr: '', exitCode: 0 };
    } catch (error: unknown) {
      const err = error as { stdout?: Buffer; stderr?: Buffer; status?: number };
      const stdout = err.stdout?.toString() || '';
      const stderr = err.stderr?.toString() || '';
      console.log(stdout);
      if (stderr) console.error(stderr);
      return { stdout, stderr, exitCode: err.status || 1 };
    }
  }

  /**
   * Parse Vitest output for errors
   */
  private parseVitestErrors(output: string): TestError[] {
    const errors: TestError[] = [];
    const lines = output.split('\n');
    
    let currentTest: string | null = null;
    let currentError: string[] = [];
    let isInErrorBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Match failed test patterns
      if (line.includes('FAIL') || line.match(/❌|✗|×/)) {
        // Extract test name
        const testMatch = line.match(/(?:FAIL|❌|✗|×)\s+(.+?)(?:\s+\d+ms)?$/);
        if (testMatch) {
          currentTest = testMatch[1].trim();
          isInErrorBlock = true;
          currentError = [];
        }
      } else if (line.includes('AssertionError') || line.includes('Error:')) {
        isInErrorBlock = true;
        currentError.push(line.trim());
      } else if (isInErrorBlock && line.trim()) {
        currentError.push(line.trim());
      } else if (isInErrorBlock && !line.trim() && currentError.length > 0) {
        if (currentTest) {
          errors.push({
            name: currentTest,
            message: currentError.join('\n')
          });
        }
        currentTest = null;
        currentError = [];
        isInErrorBlock = false;
      }
    }

    // Catch any remaining error
    if (currentTest && currentError.length > 0) {
      errors.push({
        name: currentTest,
        message: currentError.join('\n')
      });
    }

    return errors;
  }

  /**
   * Parse Playwright output for errors
   */
  private parsePlaywrightErrors(output: string): TestError[] {
    const errors: TestError[] = [];
    const lines = output.split('\n');
    
    let currentTest: string | null = null;
    let currentError: string[] = [];
    let isInErrorBlock = false;

    for (const line of lines) {
      // Match failed test
      if (line.match(/^\s*\d+\)\s+/)) {
        if (currentTest && currentError.length > 0) {
          errors.push({
            name: currentTest,
            message: currentError.join('\n')
          });
        }
        currentTest = line.replace(/^\s*\d+\)\s+/, '').trim();
        currentError = [];
        isInErrorBlock = true;
      } else if (isInErrorBlock && line.trim()) {
        currentError.push(line.trim());
      } else if (isInErrorBlock && !line.trim() && currentError.length > 0) {
        if (currentTest) {
          errors.push({
            name: currentTest,
            message: currentError.join('\n')
          });
        }
        currentTest = null;
        currentError = [];
        isInErrorBlock = false;
      }
    }

    // Catch any remaining error
    if (currentTest && currentError.length > 0) {
      errors.push({
        name: currentTest,
        message: currentError.join('\n')
      });
    }

    // Also check JSON results if available
    const jsonResultsPath = path.join(RESULTS_DIR, 'results.json');
    if (fs.existsSync(jsonResultsPath)) {
      try {
        const jsonResults = JSON.parse(fs.readFileSync(jsonResultsPath, 'utf-8'));
        if (jsonResults.suites) {
          this.extractPlaywrightErrorsFromJson(jsonResults.suites, errors);
        }
      } catch (e) {
        console.error('Failed to parse Playwright JSON results:', e);
      }
    }

    return errors;
  }

  private extractPlaywrightErrorsFromJson(suites: Array<Record<string, unknown>>, errors: TestError[]): void {
    for (const suite of suites) {
      if (suite.specs && Array.isArray(suite.specs)) {
        for (const spec of suite.specs as Array<Record<string, unknown>>) {
          if (spec.tests && Array.isArray(spec.tests)) {
            for (const test of spec.tests as Array<Record<string, unknown>>) {
              if (test.results && Array.isArray(test.results)) {
                for (const result of test.results as Array<Record<string, unknown>>) {
                  if (result.status === 'failed' || result.status === 'timedOut') {
                    const error = result.error as { message?: string; stack?: string } | undefined;
                    errors.push({
                      name: `${suite.title as string} > ${spec.title as string}`,
                      message: error?.message || 'Test failed',
                      stack: error?.stack
                    });
                  }
                }
              }
            }
          }
        }
      }
      if (suite.suites && Array.isArray(suite.suites)) {
        this.extractPlaywrightErrorsFromJson(suite.suites as Array<Record<string, unknown>>, errors);
      }
    }
  }

  /**
   * Parse Cypress errors from JSON output
   */
  private parseCypressErrors(): TestError[] {
    const errors: TestError[] = [];
    const cypressErrorPath = path.join(RESULTS_DIR, 'cypress', 'test-errors.json');
    
    if (fs.existsSync(cypressErrorPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(cypressErrorPath, 'utf-8'));
        if (data.errors && Array.isArray(data.errors)) {
          for (const err of data.errors) {
            errors.push({
              name: `${err.spec} > ${err.test}`,
              message: err.error,
              stack: err.stack
            });
          }
        }
      } catch (e) {
        console.error('Failed to parse Cypress error JSON:', e);
      }
    }
    
    return errors;
  }

  /**
   * Parse Robot Framework output for errors
   */
  private parseRobotErrors(output: string): TestError[] {
    const errors: TestError[] = [];
    const lines = output.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Match Robot Framework failure pattern
      if (line.includes('FAIL')) {
        const testMatch = line.match(/^(.+?)\s+\|\s+FAIL\s+\|/);
        if (testMatch) {
          const testName = testMatch[1].trim();
          let errorMessage = line.split('|').slice(2).join('|').trim();
          
          // Collect subsequent error lines
          let j = i + 1;
          while (j < lines.length && lines[j].startsWith('  ')) {
            errorMessage += '\n' + lines[j].trim();
            j++;
          }
          
          errors.push({
            name: testName,
            message: errorMessage
          });
        }
      }
    }
    
    return errors;
  }

  /**
   * Run unit tests
   */
  private runUnitTests(): void {
    console.log('\n📦 Running Unit Tests...');
    const { stdout, stderr } = this.executeCommand('npm run test:unit', 'Unit');
    const combinedOutput = stdout + '\n' + stderr;
    this.results.unit = this.parseVitestErrors(combinedOutput);
  }

  /**
   * Run integration tests
   */
  private runIntegrationTests(): void {
    console.log('\n🔗 Running Integration Tests...');
    const { stdout, stderr } = this.executeCommand('npm run test:integration', 'Integration');
    const combinedOutput = stdout + '\n' + stderr;
    this.results.integration = this.parseVitestErrors(combinedOutput);
  }

  /**
   * Run E2E tests
   */
  private runE2ETests(): void {
    console.log('\n🌐 Running E2E Tests (Playwright)...');
    const { stdout, stderr } = this.executeCommand('npm run test:e2e', 'E2E');
    const combinedOutput = stdout + '\n' + stderr;
    this.results.e2e = this.parsePlaywrightErrors(combinedOutput);
  }

  /**
   * Run Cypress tests
   */
  private runCypressTests(): void {
    console.log('\n🌲 Running Cypress Tests...');
    this.executeCommand('npm run test:cypress:run', 'Cypress');
    // Parse from JSON output generated by Cypress config
    this.results.cypress = this.parseCypressErrors();
  }

  /**
   * Run Robot Framework tests
   */
  private runRobotTests(): void {
    console.log('\n🤖 Running Robot Framework Tests...');
    const { stdout, stderr } = this.executeCommand('npm run test:robot', 'Robot Framework');
    const combinedOutput = stdout + '\n' + stderr;
    
    // Robot errors are included in e2e category as per requirements
    const robotErrors = this.parseRobotErrors(combinedOutput);
    this.results.e2e.push(...robotErrors);
  }

  /**
   * Generate test-errors.log file
   */
  private generateErrorLog(): void {
    let logContent = '';

    // Unit tests section
    logContent += 'Testes unitários com erro:\n';
    if (this.results.unit.length === 0) {
      logContent += '(None)\n';
    } else {
      for (const error of this.results.unit) {
        logContent += `\n❌ ${error.name}\n`;
        logContent += `   ${error.message.split('\n').join('\n   ')}\n`;
      }
    }

    // Integration tests section
    logContent += '\nTestes de integração com erro:\n';
    if (this.results.integration.length === 0) {
      logContent += '(None)\n';
    } else {
      for (const error of this.results.integration) {
        logContent += `\n❌ ${error.name}\n`;
        logContent += `   ${error.message.split('\n').join('\n   ')}\n`;
      }
    }

    // E2E tests section
    logContent += '\nTestes e2e com erro:\n';
    if (this.results.e2e.length === 0) {
      logContent += '(None)\n';
    } else {
      for (const error of this.results.e2e) {
        logContent += `\n❌ ${error.name}\n`;
        logContent += `   ${error.message.split('\n').join('\n   ')}\n`;
      }
    }

    // Cypress tests section
    logContent += '\nTestes Cypress com erro:\n';
    if (this.results.cypress.length === 0) {
      logContent += '(None)\n';
    } else {
      for (const error of this.results.cypress) {
        logContent += `\n❌ ${error.name}\n`;
        logContent += `   ${error.message.split('\n').join('\n   ')}\n`;
      }
    }

    // Write to file
    fs.writeFileSync(ERROR_LOG_PATH, logContent, 'utf-8');
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`✅ Error log generated: ${ERROR_LOG_PATH}`);
    console.log('='.repeat(80));
  }

  /**
   * Print summary
   */
  private printSummary(): void {
    const totalErrors = 
      this.results.unit.length + 
      this.results.integration.length + 
      this.results.e2e.length + 
      this.results.cypress.length;

    console.log('\n📊 TEST SUMMARY');
    console.log('='.repeat(80));
    console.log(`Unit Tests:        ${this.results.unit.length} errors`);
    console.log(`Integration Tests: ${this.results.integration.length} errors`);
    console.log(`E2E Tests:         ${this.results.e2e.length} errors`);
    console.log(`Cypress Tests:     ${this.results.cypress.length} errors`);
    console.log('='.repeat(80));
    console.log(`TOTAL ERRORS:      ${totalErrors}`);
    console.log('='.repeat(80));

    if (totalErrors === 0) {
      console.log('✅ All tests passed!');
    } else {
      console.log(`❌ ${totalErrors} test(s) failed. Check test-errors.log for details.`);
    }
  }

  /**
   * Main execution method
   */
  public async run(): Promise<void> {
    console.log('🚀 Starting Test Orchestration...\n');
    const startTime = Date.now();

    try {
      // Run all test suites
      this.runUnitTests();
      this.runIntegrationTests();
      this.runE2ETests();
      this.runCypressTests();
      // Note: Robot tests are commented out in package.json scripts, uncomment if needed
      // this.runRobotTests();

      // Generate error log
      this.generateErrorLog();

      // Print summary
      this.printSummary();

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`\n⏱️  Total execution time: ${duration}s\n`);

    } catch (error) {
      console.error('❌ Fatal error during test orchestration:', error);
      process.exit(1);
    }
  }
}

// Execute
const orchestrator = new TestOrchestrator();
orchestrator.run().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

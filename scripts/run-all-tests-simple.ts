#!/usr/bin/env node
/**
 * Simplified Test Runner - Runs tests sequentially and generates test-errors.log
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const ERROR_LOG_PATH = path.join(process.cwd(), 'test-errors.log');

interface TestError {
  name: string;
  message: string;
}

interface TestResults {
  unit: TestError[];
  integration: TestError[];
  e2e: TestError[];
  cypress: TestError[];
}

function executeTest(command: string, testType: string): string {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`▶ Running ${testType} tests...`);
  console.log('='.repeat(80));
  
  try {
    const output = execSync(command, {
      encoding: 'utf-8',
      maxBuffer: 50 * 1024 * 1024,
      windowsHide: true,
    });
    return output;
  } catch (error: unknown) {
    const err = error as { stdout?: Buffer };
    return err.stdout?.toString() || '';
  }
}

function parseVitestErrors(output: string): TestError[] {
  const errors: TestError[] = [];
  const failRegex = /FAIL\s+(.+?)$/gm;
  const lines = output.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for FAIL lines
    if (line.includes('FAIL') && !line.includes('Test Files')) {
      const testName = line.replace(/.*FAIL\s+/, '').trim();
      let errorMsg = '';
      
      // Collect error lines
      let j = i + 1;
      while (j < lines.length && j < i + 20) {
        const nextLine = lines[j];
        if (nextLine.includes('AssertionError') || nextLine.includes('Error:') || nextLine.includes('expected')) {
          errorMsg += nextLine.trim() + '\n';
        } else if (errorMsg && nextLine.trim() === '') {
          break;
        } else if (errorMsg) {
          errorMsg += nextLine.trim() + '\n';
        }
        j++;
      }
      
      if (testName && errorMsg) {
        errors.push({ name: testName, message: errorMsg.trim() });
      }
    }
  }
  
  return errors;
}

function parsePlaywrightErrors(output: string): TestError[] {
  const errors: TestError[] = [];
  const lines = output.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for failure patterns like "1) [chromium] › test.spec.ts:10:5 › test name"
    if (line.match(/^\s*\d+\)/)) {
      const testName = line.replace(/^\s*\d+\)\s*/, '').trim();
      let errorMsg = '';
      
      // Collect error details
      let j = i + 1;
      while (j < lines.length && j < i + 15) {
        const nextLine = lines[j];
        if (nextLine.match(/^\s*\d+\)/)) break; // Next error
        if (nextLine.trim()) {
          errorMsg += nextLine.trim() + '\n';
        }
        j++;
      }
      
      errors.push({ name: testName, message: errorMsg.trim() });
    }
  }
  
  return errors;
}

function parseCypressErrors(): TestError[] {
  const errors: TestError[] = [];
  const cypressErrorPath = path.join(process.cwd(), 'test-results', 'cypress', 'test-errors.json');
  
  if (fs.existsSync(cypressErrorPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(cypressErrorPath, 'utf-8'));
      if (data.errors && Array.isArray(data.errors)) {
        for (const err of data.errors) {
          errors.push({
            name: `${err.spec} > ${err.test}`,
            message: err.error
          });
        }
      }
    } catch (e) {
      // Silent fail
    }
  }
  
  return errors;
}

function generateErrorLog(results: TestResults): void {
  let content = '';
  
  // Unit tests
  content += 'Testes unitários com erro:\n';
  if (results.unit.length === 0) {
    content += '(None)\n';
  } else {
    for (const err of results.unit) {
      content += `\n❌ ${err.name}\n`;
      content += `   ${err.message.split('\n').join('\n   ')}\n`;
    }
  }
  
  // Integration tests
  content += '\nTestes de integração com erro:\n';
  if (results.integration.length === 0) {
    content += '(None)\n';
  } else {
    for (const err of results.integration) {
      content += `\n❌ ${err.name}\n`;
      content += `   ${err.message.split('\n').join('\n   ')}\n`;
    }
  }
  
  // E2E tests
  content += '\nTestes e2e com erro:\n';
  if (results.e2e.length === 0) {
    content += '(None)\n';
  } else {
    for (const err of results.e2e) {
      content += `\n❌ ${err.name}\n`;
      content += `   ${err.message.split('\n').join('\n   ')}\n`;
    }
  }
  
  // Cypress tests
  content += '\nTestes Cypress com erro:\n';
  if (results.cypress.length === 0) {
    content += '(None)\n';
  } else {
    for (const err of results.cypress) {
      content += `\n❌ ${err.name}\n`;
      content += `   ${err.message.split('\n').join('\n   ')}\n`;
    }
  }
  
  fs.writeFileSync(ERROR_LOG_PATH, content, 'utf-8');
  console.log(`\n✅ Error log generated: ${ERROR_LOG_PATH}\n`);
}

async function main(): Promise<void> {
  console.log('🚀 SIGECO Test Orchestration System\n');
  const startTime = Date.now();
  
  const results: TestResults = {
    unit: [],
    integration: [],
    e2e: [],
    cypress: []
  };
  
  // Run Unit Tests
  try {
    const output = executeTest('npm run test:unit -- --run --reporter=verbose', 'Unit');
    results.unit = parseVitestErrors(output);
    console.log(`✓ Unit tests complete: ${results.unit.length} errors`);
  } catch (e) {
    console.error('❌ Unit tests failed to run');
  }
  
  // Run Integration Tests
  try {
    const output = executeTest('npm run test:integration -- --run --reporter=verbose', 'Integration');
    results.integration = parseVitestErrors(output);
    console.log(`✓ Integration tests complete: ${results.integration.length} errors`);
  } catch (e) {
    console.error('❌ Integration tests failed to run');
  }
  
  // Run E2E Tests
  try {
    const output = executeTest('npm run test:e2e', 'E2E (Playwright)');
    results.e2e = parsePlaywrightErrors(output);
    console.log(`✓ E2E tests complete: ${results.e2e.length} errors`);
  } catch (e) {
    console.error('❌ E2E tests failed to run');
  }
  
  // Run Cypress Tests
  try {
    executeTest('npm run test:cypress:run', 'Cypress');
    results.cypress = parseCypressErrors();
    console.log(`✓ Cypress tests complete: ${results.cypress.length} errors`);
  } catch (e) {
    console.error('❌ Cypress tests failed to run');
  }
  
  // Generate log
  generateErrorLog(results);
  
  // Summary
  const total = results.unit.length + results.integration.length + results.e2e.length + results.cypress.length;
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`Unit Tests:        ${results.unit.length} errors`);
  console.log(`Integration Tests: ${results.integration.length} errors`);
  console.log(`E2E Tests:         ${results.e2e.length} errors`);
  console.log(`Cypress Tests:     ${results.cypress.length} errors`);
  console.log('='.repeat(80));
  console.log(`TOTAL ERRORS:      ${total}`);
  console.log('='.repeat(80));
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n⏱️  Execution time: ${duration}s`);
  
  if (total === 0) {
    console.log('\n✅ All tests passed!');
  } else {
    console.log(`\n❌ ${total} error(s) found. Check test-errors.log`);
  }
}

main().catch(console.error);

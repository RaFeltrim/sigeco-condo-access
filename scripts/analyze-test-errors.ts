#!/usr/bin/env node

/**
 * Cypress Test Error Analyzer and Auto-Fixer
 * 
 * This script analyzes test errors captured during Cypress runs and automatically
 * fixes common issues like:
 * - Wrong selectors
 * - Missing elements
 * - Timeout issues
 * - Assertion failures
 */

import * as fs from 'fs';
import * as path from 'path';

interface TestError {
  spec: string;
  test: string;
  error: string;
  stack?: string;
  timestamp: string;
}

interface ErrorLog {
  summary: {
    totalErrors: number;
    generatedAt: string;
  };
  errors: TestError[];
}

interface FixSuggestion {
  spec: string;
  test: string;
  errorType: string;
  originalError: string;
  suggestedFix: string;
  confidence: 'high' | 'medium' | 'low';
  autoFixable: boolean;
}

class TestErrorAnalyzer {
  private errorLogPath: string;
  private fixReportPath: string;

  constructor() {
    this.errorLogPath = path.join(process.cwd(), 'test-results', 'cypress', 'test-errors.json');
    this.fixReportPath = path.join(process.cwd(), 'test-results', 'cypress', 'fix-report.json');
  }

  /**
   * Read and parse error log
   */
  readErrorLog(): ErrorLog | null {
    if (!fs.existsSync(this.errorLogPath)) {
      console.log('❌ No error log found. Run tests first.');
      return null;
    }

    const content = fs.readFileSync(this.errorLogPath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Analyze error and generate fix suggestions
   */
  analyzeError(error: TestError): FixSuggestion {
    const { spec, test, error: errorMsg } = error;

    // Selector not found errors
    if (errorMsg.includes('Expected to find element') || errorMsg.includes('but never found it')) {
      const selectorMatch = errorMsg.match(/Expected to find element: ([^,]+)/);
      const selector = selectorMatch ? selectorMatch[1].trim() : 'unknown';
      
      return {
        spec,
        test,
        errorType: 'SELECTOR_NOT_FOUND',
        originalError: errorMsg,
        suggestedFix: `Element '${selector}' not found. Check if:\n  1. Element exists in the page\n  2. Selector is correct (try using data-testid)\n  3. Element is rendered after async operation (add cy.wait or increase timeout)`,
        confidence: 'high',
        autoFixable: false
      };
    }

    // Timeout errors
    if (errorMsg.includes('Timed out retrying')) {
      return {
        spec,
        test,
        errorType: 'TIMEOUT',
        originalError: errorMsg,
        suggestedFix: 'Increase timeout or add explicit wait:\n  cy.get(selector, { timeout: 15000 })\n  or\n  cy.wait(1000)',
        confidence: 'medium',
        autoFixable: false
      };
    }

    // Assertion failures
    if (errorMsg.includes('expected') && errorMsg.includes('to')) {
      return {
        spec,
        test,
        errorType: 'ASSERTION_FAILURE',
        originalError: errorMsg,
        suggestedFix: 'Review assertion logic. Check actual vs expected values.',
        confidence: 'medium',
        autoFixable: false
      };
    }

    // Click failures (pointer-events: none)
    if (errorMsg.includes('pointer-events: none')) {
      return {
        spec,
        test,
        errorType: 'CLICK_BLOCKED',
        originalError: errorMsg,
        suggestedFix: 'Add { force: true } to click command:\n  cy.click({ force: true })',
        confidence: 'high',
        autoFixable: true
      };
    }

    // Element not visible
    if (errorMsg.includes('not visible')) {
      return {
        spec,
        test,
        errorType: 'ELEMENT_NOT_VISIBLE',
        originalError: errorMsg,
        suggestedFix: 'Element exists but not visible. Check CSS or add wait for visibility:\n  cy.should(\'be.visible\')',
        confidence: 'medium',
        autoFixable: false
      };
    }

    // Multiple elements found
    if (errorMsg.includes('subject contained') && errorMsg.includes('elements')) {
      const countMatch = errorMsg.match(/contained (\d+) elements/);
      const count = countMatch ? countMatch[1] : 'multiple';
      
      return {
        spec,
        test,
        errorType: 'MULTIPLE_ELEMENTS',
        originalError: errorMsg,
        suggestedFix: `Found ${count} elements instead of 1. Make selector more specific or use:\n  .first()\n  .eq(0)\n  .filter('[specific-attribute]')`,
        confidence: 'high',
        autoFixable: true
      };
    }

    // Default case
    return {
      spec,
      test,
      errorType: 'UNKNOWN',
      originalError: errorMsg,
      suggestedFix: 'Manual review required',
      confidence: 'low',
      autoFixable: false
    };
  }

  /**
   * Generate fix report
   */
  generateFixReport(errorLog: ErrorLog): FixSuggestion[] {
    console.log('\n📊 Analyzing test errors...\n');
    
    const suggestions = errorLog.errors.map(error => this.analyzeError(error));
    
    // Group by error type
    const grouped = suggestions.reduce((acc, suggestion) => {
      if (!acc[suggestion.errorType]) {
        acc[suggestion.errorType] = [];
      }
      acc[suggestion.errorType].push(suggestion);
      return acc;
    }, {} as Record<string, FixSuggestion[]>);

    // Print summary
    console.log('📋 Error Summary:\n');
    Object.entries(grouped).forEach(([type, items]) => {
      console.log(`  ${type}: ${items.length} occurrences`);
    });

    console.log('\n');

    // Save report
    const report = {
      analyzedAt: new Date().toISOString(),
      totalErrors: suggestions.length,
      autoFixable: suggestions.filter(s => s.autoFixable).length,
      byType: grouped,
      suggestions
    };

    fs.writeFileSync(this.fixReportPath, JSON.stringify(report, null, 2));
    console.log(`✅ Fix report saved to: ${this.fixReportPath}\n`);

    return suggestions;
  }

  /**
   * Print detailed suggestions
   */
  printSuggestions(suggestions: FixSuggestion[]) {
    console.log('🔧 Suggested Fixes:\n');
    console.log('='.repeat(80));
    
    suggestions.forEach((suggestion, index) => {
      console.log(`\n[${index + 1}] ${suggestion.spec}`);
      console.log(`    Test: ${suggestion.test}`);
      console.log(`    Error Type: ${suggestion.errorType}`);
      console.log(`    Confidence: ${suggestion.confidence}`);
      console.log(`    Auto-fixable: ${suggestion.autoFixable ? '✓' : '✗'}`);
      console.log(`\n    Original Error:`);
      console.log(`    ${suggestion.originalError.substring(0, 200)}...`);
      console.log(`\n    Suggested Fix:`);
      console.log(`    ${suggestion.suggestedFix}`);
      console.log('\n' + '-'.repeat(80));
    });
  }

  /**
   * Main analysis function
   */
  analyze() {
    const errorLog = this.readErrorLog();
    
    if (!errorLog) {
      return;
    }

    if (errorLog.errors.length === 0) {
      console.log('✅ No errors to analyze. All tests passed!');
      return;
    }

    console.log(`\n📁 Found ${errorLog.errors.length} test errors`);
    console.log(`📅 Generated at: ${errorLog.summary.generatedAt}\n`);

    const suggestions = this.generateFixReport(errorLog);
    this.printSuggestions(suggestions);

    // Summary
    const autoFixable = suggestions.filter(s => s.autoFixable).length;
    console.log(`\n\n📊 Summary:`);
    console.log(`   Total Errors: ${suggestions.length}`);
    console.log(`   Auto-fixable: ${autoFixable}`);
    console.log(`   Manual Review: ${suggestions.length - autoFixable}`);
    console.log(`\n💡 Review the fix report at: ${this.fixReportPath}\n`);
  }
}

// Run analyzer
if (require.main === module) {
  const analyzer = new TestErrorAnalyzer();
  analyzer.analyze();
}

export { TestErrorAnalyzer };

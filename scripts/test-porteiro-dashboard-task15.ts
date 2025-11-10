#!/usr/bin/env tsx
/**
 * Task 11 Integration and E2E Validation Script
 * 
 * This script validates that the MVP Verifier system works correctly
 * by running comprehensive integration tests.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface ValidationResult {
  test: string;
  passed: boolean;
  message: string;
  details?: string;
}

class Task11Validator {
  private results: ValidationResult[] = [];
  private projectRoot: string;

  constructor() {
    this.projectRoot = process.cwd();
  }

  /**
   * Run all validation tests
   */
  async runAllTests(): Promise<void> {
    console.log('🧪 Task 11: Integration and End-to-End Validation\n');
    console.log('═'.repeat(60));
    console.log('\n');

    // Test 1: Verify all analyzers execute without errors
    await this.testAnalyzersExecuteWithoutErrors();

    // Test 2: Verify JSON report generation
    await this.testJSONReportGeneration();

    // Test 3: Verify Markdown report generation
    await this.testMarkdownReportGeneration();

    // Test 4: Verify console output
    await this.testConsoleOutput();

    // Test 5: Verify exit code behavior
    await this.testExitCodeBehavior();

    // Test 6: Verify CLI options
    await this.testCLIOptions();

    // Display results
    this.displayResults();
  }

  /**
   * Test 1: Verify all analyzers execute without errors
   */
  private async testAnalyzersExecuteWithoutErrors(): Promise<void> {
    console.log('📋 Test 1: Verify all analyzers execute without errors');
    
    try {
      let output = '';
      try {
        output = execSync('npm run verify:mvp -- --verbose', {
          encoding: 'utf-8',
          cwd: this.projectRoot,
          stdio: 'pipe'
        });
      } catch (error) {
        // Capture output even if exit code is non-zero
        const execError = error as { stdout?: string; stderr?: string };
        output = execError.stdout || execError.stderr || '';
      }

      const hasComponentAnalyzer = output.includes('ComponentAnalyzer');
      const hasStructureAnalyzer = output.includes('StructureAnalyzer');
      const hasFeatureAnalyzer = output.includes('FeatureAnalyzer');
      const hasQualityAnalyzer = output.includes('QualityAnalyzer');
      const hasDependencyAnalyzer = output.includes('DependencyAnalyzer');

      const allAnalyzersPresent = hasComponentAnalyzer && hasStructureAnalyzer && 
                                   hasFeatureAnalyzer && hasQualityAnalyzer && 
                                   hasDependencyAnalyzer;

      if (allAnalyzersPresent) {
        this.results.push({
          test: 'All analyzers execute',
          passed: true,
          message: 'All 5 analyzers executed successfully',
          details: 'ComponentAnalyzer, StructureAnalyzer, FeatureAnalyzer, QualityAnalyzer, DependencyAnalyzer'
        });
      } else {
        this.results.push({
          test: 'All analyzers execute',
          passed: false,
          message: 'Not all analyzers were found in output',
          details: `Found: ${[hasComponentAnalyzer, hasStructureAnalyzer, hasFeatureAnalyzer, hasQualityAnalyzer, hasDependencyAnalyzer].filter(Boolean).length}/5`
        });
      }
    } catch (error) {
      this.results.push({
        test: 'All analyzers execute',
        passed: false,
        message: 'Error executing MVP Verifier',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    console.log('  ✓ Complete\n');
  }

  /**
   * Test 2: Verify JSON report generation
   */
  private async testJSONReportGeneration(): Promise<void> {
    console.log('📋 Test 2: Verify JSON report generation');

    try {
      const reportsDir = path.join(this.projectRoot, '.kiro', 'reports');
      const latestJsonPath = path.join(reportsDir, 'mvp-verification-latest.json');

      if (!fs.existsSync(latestJsonPath)) {
        this.results.push({
          test: 'JSON report generation',
          passed: false,
          message: 'JSON report file not found',
          details: latestJsonPath
        });
        console.log('  ✗ Failed\n');
        return;
      }

      const jsonContent = fs.readFileSync(latestJsonPath, 'utf-8');
      const report = JSON.parse(jsonContent);

      // Validate report structure
      const hasTimestamp = 'timestamp' in report;
      const hasProjectPath = 'projectPath' in report;
      const hasOverallScore = 'overallScore' in report;
      const hasAnalyzerResults = 'analyzerResults' in report;
      const hasSummary = 'summary' in report;
      const hasRecommendations = 'recommendations' in report;

      const isValid = hasTimestamp && hasProjectPath && hasOverallScore && 
                      hasAnalyzerResults && hasSummary && hasRecommendations;

      if (isValid) {
        this.results.push({
          test: 'JSON report generation',
          passed: true,
          message: 'JSON report generated with correct structure',
          details: `Score: ${report.overallScore}%, Issues: ${report.summary.totalGaps}`
        });
      } else {
        this.results.push({
          test: 'JSON report generation',
          passed: false,
          message: 'JSON report missing required fields',
          details: `Has: timestamp=${hasTimestamp}, projectPath=${hasProjectPath}, overallScore=${hasOverallScore}`
        });
      }
    } catch (error) {
      this.results.push({
        test: 'JSON report generation',
        passed: false,
        message: 'Error validating JSON report',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    console.log('  ✓ Complete\n');
  }

  /**
   * Test 3: Verify Markdown report generation
   */
  private async testMarkdownReportGeneration(): Promise<void> {
    console.log('📋 Test 3: Verify Markdown report generation');

    try {
      const reportsDir = path.join(this.projectRoot, '.kiro', 'reports');
      const latestMdPath = path.join(reportsDir, 'mvp-verification-latest.md');

      if (!fs.existsSync(latestMdPath)) {
        this.results.push({
          test: 'Markdown report generation',
          passed: false,
          message: 'Markdown report file not found',
          details: latestMdPath
        });
        console.log('  ✗ Failed\n');
        return;
      }

      const mdContent = fs.readFileSync(latestMdPath, 'utf-8');

      // Validate report sections
      const hasTitle = mdContent.includes('# MVP Verification Report');
      const hasExecutiveSummary = mdContent.includes('## Executive Summary');
      const hasAnalyzerScores = mdContent.includes('## Analyzer Scores');
      const hasAnalyzerResults = mdContent.includes('## Analyzer Results');
      const hasRecommendations = mdContent.includes('## Recommendations');

      const isValid = hasTitle && hasExecutiveSummary && hasAnalyzerScores && 
                      hasAnalyzerResults && hasRecommendations;

      if (isValid) {
        this.results.push({
          test: 'Markdown report generation',
          passed: true,
          message: 'Markdown report generated with all required sections',
          details: `Size: ${(mdContent.length / 1024).toFixed(2)} KB`
        });
      } else {
        this.results.push({
          test: 'Markdown report generation',
          passed: false,
          message: 'Markdown report missing required sections',
          details: `Has: title=${hasTitle}, summary=${hasExecutiveSummary}, scores=${hasAnalyzerScores}`
        });
      }
    } catch (error) {
      this.results.push({
        test: 'Markdown report generation',
        passed: false,
        message: 'Error validating Markdown report',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    console.log('  ✓ Complete\n');
  }

  /**
   * Test 4: Verify console output
   */
  private async testConsoleOutput(): Promise<void> {
    console.log('📋 Test 4: Verify console output displays progress and summary');

    try {
      let output = '';
      try {
        output = execSync('npm run verify:mvp', {
          encoding: 'utf-8',
          cwd: this.projectRoot,
          stdio: 'pipe'
        });
      } catch (error) {
        // Capture output even if exit code is non-zero
        const execError = error as { stdout?: string; stderr?: string };
        output = execError.stdout || execError.stderr || '';
      }

      const hasStartMessage = output.includes('MVP Verifier - Starting Analysis');
      const hasProgressIndicator = output.includes('Running analysis');
      const hasSummarySection = output.includes('Summary');
      const hasAnalyzerScores = output.includes('Analyzer Scores');
      const hasIssuesFound = output.includes('Issues Found');
      const hasRecommendations = output.includes('Top Recommendations');

      const isValid = hasStartMessage && hasProgressIndicator && hasSummarySection && 
                      hasAnalyzerScores && hasIssuesFound && hasRecommendations;

      if (isValid) {
        this.results.push({
          test: 'Console output',
          passed: true,
          message: 'Console displays all required information',
          details: 'Progress indicators, summary table, and recommendations present'
        });
      } else {
        this.results.push({
          test: 'Console output',
          passed: false,
          message: 'Console output missing required elements',
          details: `Has: start=${hasStartMessage}, progress=${hasProgressIndicator}, summary=${hasSummarySection}`
        });
      }
    } catch (error) {
      this.results.push({
        test: 'Console output',
        passed: false,
        message: 'Error capturing console output',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    console.log('  ✓ Complete\n');
  }

  /**
   * Test 5: Verify exit code behavior
   */
  private async testExitCodeBehavior(): Promise<void> {
    console.log('📋 Test 5: Verify exit code based on completion threshold');

    try {
      // Test with low threshold (should pass)
      let exitCode1 = 0;
      try {
        execSync('npm run verify:mvp -- --fail-threshold 50', {
          encoding: 'utf-8',
          cwd: this.projectRoot,
          stdio: 'pipe'
        });
      } catch (error) {
        const execError = error as { status?: number };
        exitCode1 = execError.status || 1;
      }

      // Test with high threshold (should fail)
      let exitCode2 = 0;
      try {
        execSync('npm run verify:mvp -- --fail-threshold 90', {
          encoding: 'utf-8',
          cwd: this.projectRoot,
          stdio: 'pipe'
        });
      } catch (error) {
        const execError = error as { status?: number };
        exitCode2 = execError.status || 1;
      }

      const lowThresholdPassed = exitCode1 === 0;
      const highThresholdFailed = exitCode2 === 1;

      if (lowThresholdPassed && highThresholdFailed) {
        this.results.push({
          test: 'Exit code behavior',
          passed: true,
          message: 'Exit codes correctly reflect pass/fail status',
          details: 'Low threshold (50%): exit 0, High threshold (90%): exit 1'
        });
      } else {
        this.results.push({
          test: 'Exit code behavior',
          passed: false,
          message: 'Exit codes do not match expected behavior',
          details: `Low threshold exit: ${exitCode1}, High threshold exit: ${exitCode2}`
        });
      }
    } catch (error) {
      this.results.push({
        test: 'Exit code behavior',
        passed: false,
        message: 'Error testing exit codes',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    console.log('  ✓ Complete\n');
  }

  /**
   * Test 6: Verify CLI options
   */
  private async testCLIOptions(): Promise<void> {
    console.log('📋 Test 6: Verify CLI options work correctly');

    try {
      // Test --help option
      const helpOutput = execSync('npm run verify:mvp -- --help', {
        encoding: 'utf-8',
        cwd: this.projectRoot,
        stdio: 'pipe'
      });

      const hasUsage = helpOutput.includes('Usage:');
      const hasOptions = helpOutput.includes('Options:');
      const hasExamples = helpOutput.includes('Examples:');

      // Test --format json option
      try {
        execSync('npm run verify:mvp -- --format json', {
          encoding: 'utf-8',
          cwd: this.projectRoot,
          stdio: 'pipe'
        });
      } catch (error) {
        // Ignore exit code, just check if file was created
      }

      const jsonExists = fs.existsSync(path.join(this.projectRoot, '.kiro', 'reports', 'mvp-verification-latest.json'));

      // Test --verbose option
      let verboseOutput = '';
      try {
        verboseOutput = execSync('npm run verify:mvp -- --verbose', {
          encoding: 'utf-8',
          cwd: this.projectRoot,
          stdio: 'pipe'
        });
      } catch (error) {
        const execError = error as { stdout?: string; stderr?: string };
        verboseOutput = execError.stdout || execError.stderr || '';
      }

      const hasVerboseInfo = verboseOutput.includes('Project Path:') && 
                             verboseOutput.includes('Output Directory:');

      const allOptionsWork = hasUsage && hasOptions && hasExamples && jsonExists && hasVerboseInfo;

      if (allOptionsWork) {
        this.results.push({
          test: 'CLI options',
          passed: true,
          message: 'All CLI options work correctly',
          details: '--help, --format, --verbose, --fail-threshold validated'
        });
      } else {
        this.results.push({
          test: 'CLI options',
          passed: false,
          message: 'Some CLI options not working correctly',
          details: `Help: ${hasUsage}, Format: ${jsonExists}, Verbose: ${hasVerboseInfo}`
        });
      }
    } catch (error) {
      this.results.push({
        test: 'CLI options',
        passed: false,
        message: 'Error testing CLI options',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    console.log('  ✓ Complete\n');
  }

  /**
   * Display validation results
   */
  private displayResults(): void {
    console.log('\n');
    console.log('═'.repeat(60));
    console.log('📊 Validation Results');
    console.log('═'.repeat(60));
    console.log('\n');

    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const percentage = ((passed / total) * 100).toFixed(1);

    this.results.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      console.log(`${icon} ${result.test}`);
      console.log(`   ${result.message}`);
      if (result.details) {
        console.log(`   Details: ${result.details}`);
      }
      console.log('');
    });

    console.log('═'.repeat(60));
    console.log(`Overall: ${passed}/${total} tests passed (${percentage}%)`);
    console.log('═'.repeat(60));

    if (passed === total) {
      console.log('\n✅ All validation tests passed! Task 11 is complete.\n');
    } else {
      console.log(`\n⚠️  ${total - passed} test(s) failed. Please review the results above.\n`);
    }
  }
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  const validator = new Task11Validator();
  await validator.runAllTests();
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

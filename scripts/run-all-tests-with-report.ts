/**
 * Comprehensive Test Runner with Progress Bar and Detailed Report
 * Runs all test suites simultaneously and generates analysis
 */

import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface TestSuite {
  name: string;
  command: string;
  args: string[];
  weight: number; // For progress calculation
}

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip' | 'running';
  duration: number;
  output: string;
  errors: string[];
  passed: number;
  failed: number;
  total: number;
}

class TestRunner {
  private testSuites: TestSuite[] = [
    { name: 'TypeScript Type Check', command: 'npm', args: ['run', 'type-check'], weight: 10 },
    { name: 'ESLint', command: 'npm', args: ['run', 'lint'], weight: 10 },
    { name: 'Build', command: 'npm', args: ['run', 'build'], weight: 15 },
    { name: 'Unit Tests (Vitest)', command: 'npm', args: ['run', 'test:unit'], weight: 20 },
    { name: 'E2E Tests (Playwright)', command: 'npm', args: ['run', 'test:e2e'], weight: 25 },
    { name: 'Cypress E2E', command: 'npm', args: ['run', 'test:cypress:ci'], weight: 20 },
  ];

  private results: Map<string, TestResult> = new Map();
  private startTime: number = 0;
  private progressInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.results = new Map(
      this.testSuites.map(suite => [
        suite.name,
        {
          name: suite.name,
          status: 'running',
          duration: 0,
          output: '',
          errors: [],
          passed: 0,
          failed: 0,
          total: 0,
        },
      ])
    );
  }

  private getProgressPercentage(): number {
    let completedWeight = 0;
    const totalWeight = this.testSuites.reduce((sum, suite) => sum + suite.weight, 0);

    this.testSuites.forEach(suite => {
      const result = this.results.get(suite.name);
      if (result && result.status !== 'running') {
        completedWeight += suite.weight;
      }
    });

    return Math.round((completedWeight / totalWeight) * 100);
  }

  private displayProgress(): void {
    const percentage = this.getProgressPercentage();
    const barLength = 50;
    const filledLength = Math.round((percentage / 100) * barLength);
    const emptyLength = barLength - filledLength;

    const bar = '█'.repeat(filledLength) + '░'.repeat(emptyLength);
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);

    // Clear line and display progress
    process.stdout.write('\r\x1b[K');
    process.stdout.write(
      `\x1b[36m[${bar}]\x1b[0m ${percentage}% | Elapsed: ${elapsed}s | Running: ${this.getRunningTests()}`
    );
  }

  private getRunningTests(): string {
    const running: string[] = [];
    this.results.forEach((result, name) => {
      if (result.status === 'running') {
        running.push(name.split(' ')[0]);
      }
    });
    return running.join(', ') || 'None';
  }

  private runTestSuite(suite: TestSuite): Promise<TestResult> {
    return new Promise(resolve => {
      const startTime = Date.now();
      let stdout = '';
      let stderr = '';

      const proc: ChildProcess = spawn(suite.command, suite.args, {
        shell: true,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, FORCE_COLOR: '0' },
      });

      proc.stdout?.on('data', data => {
        stdout += data.toString();
      });

      proc.stderr?.on('data', data => {
        stderr += data.toString();
      });

      proc.on('close', code => {
        const duration = Date.now() - startTime;
        const output = stdout + stderr;
        const result = this.parseTestOutput(suite.name, output, code === 0, duration);

        this.results.set(suite.name, result);
        resolve(result);
      });

      proc.on('error', err => {
        const duration = Date.now() - startTime;
        const result: TestResult = {
          name: suite.name,
          status: 'fail',
          duration,
          output: err.message,
          errors: [err.message],
          passed: 0,
          failed: 1,
          total: 1,
        };

        this.results.set(suite.name, result);
        resolve(result);
      });
    });
  }

  private parseTestOutput(
    suiteName: string,
    output: string,
    success: boolean,
    duration: number
  ): TestResult {
    const errors: string[] = [];
    let passed = 0;
    let failed = 0;
    let total = 0;

    // Parse Playwright output
    if (output.includes('playwright')) {
      const passMatch = output.match(/(\d+) passed/);
      const failMatch = output.match(/(\d+) failed/);
      if (passMatch) passed = parseInt(passMatch[1]);
      if (failMatch) failed = parseInt(failMatch[1]);
      total = passed + failed;
    }

    // Parse Vitest output
    if (output.includes('Test Files') || output.includes('vitest')) {
      const testMatch = output.match(/(\d+) passed.*?(\d+) failed/);
      if (testMatch) {
        passed = parseInt(testMatch[1]) || 0;
        failed = parseInt(testMatch[2]) || 0;
      }
      total = passed + failed;
    }

    // Parse Cypress output
    if (output.includes('cypress')) {
      const passMatch = output.match(/(\d+) of (\d+) passed/);
      if (passMatch) {
        passed = parseInt(passMatch[1]);
        total = parseInt(passMatch[2]);
        failed = total - passed;
      }
    }

    // Extract errors
    const errorMatches = output.match(/Error:.*$/gm);
    if (errorMatches) {
      errors.push(...errorMatches.slice(0, 5)); // Limit to 5 errors
    }

    // ESLint specific
    if (suiteName.includes('ESLint')) {
      const problemMatch = output.match(/(\d+) problems? \((\d+) errors?, (\d+) warnings?\)/);
      if (problemMatch) {
        const totalProblems = parseInt(problemMatch[1]);
        const errorCount = parseInt(problemMatch[2]);
        failed = totalProblems;
        total = totalProblems;
        passed = 0;
      }
    }

    return {
      name: suiteName,
      status: success ? 'pass' : 'fail',
      duration,
      output,
      errors,
      passed,
      failed,
      total: total || (success ? 1 : 0),
    };
  }

  private generateReport(): string {
    const totalDuration = Date.now() - this.startTime;
    let report = '\n\n';
    report += '═'.repeat(100) + '\n';
    report += '  COMPREHENSIVE TEST REPORT - SIGECO\n';
    report += '═'.repeat(100) + '\n\n';

    report += `📅 Generated: ${new Date().toLocaleString()}\n`;
    report += `⏱️  Total Duration: ${(totalDuration / 1000).toFixed(2)}s\n\n`;

    // Summary table
    report += '┌────────────────────────────────────┬──────────┬──────────┬──────────┬──────────┬──────────────┐\n';
    report += '│ Test Suite                         │  Status  │  Passed  │  Failed  │  Total   │   Duration   │\n';
    report += '├────────────────────────────────────┼──────────┼──────────┼──────────┼──────────┼──────────────┤\n';

    let totalPassed = 0;
    let totalFailed = 0;
    let totalTests = 0;

    this.results.forEach(result => {
      const status = result.status === 'pass' ? '✅ PASS' : '❌ FAIL';
      const durationStr = `${(result.duration / 1000).toFixed(1)}s`;

      report += `│ ${result.name.padEnd(34)} │ ${status.padEnd(8)} │ ${String(result.passed).padStart(8)} │ ${String(result.failed).padStart(8)} │ ${String(result.total).padStart(8)} │ ${durationStr.padStart(12)} │\n`;

      totalPassed += result.passed;
      totalFailed += result.failed;
      totalTests += result.total;
    });

    report += '├────────────────────────────────────┼──────────┼──────────┼──────────┼──────────┼──────────────┤\n';
    const overallStatus = totalFailed === 0 ? '✅ PASS' : '❌ FAIL';
    report += `│ ${'TOTAL'.padEnd(34)} │ ${overallStatus.padEnd(8)} │ ${String(totalPassed).padStart(8)} │ ${String(totalFailed).padStart(8)} │ ${String(totalTests).padStart(8)} │ ${((totalDuration / 1000).toFixed(1) + 's').padStart(12)} │\n`;
    report += '└────────────────────────────────────┴──────────┴──────────┴──────────┴──────────┴──────────────┘\n\n';

    // Detailed errors section
    const failedSuites = Array.from(this.results.values()).filter(r => r.status === 'fail');

    if (failedSuites.length > 0) {
      report += '\n🔍 DETAILED ERROR ANALYSIS\n';
      report += '═'.repeat(100) + '\n\n';

      failedSuites.forEach((result, index) => {
        report += `${index + 1}. ${result.name}\n`;
        report += '─'.repeat(100) + '\n';
        report += `Status: ❌ FAILED\n`;
        report += `Duration: ${(result.duration / 1000).toFixed(2)}s\n`;
        report += `Failed Tests: ${result.failed}/${result.total}\n\n`;

        if (result.errors.length > 0) {
          report += 'Error Messages:\n';
          result.errors.forEach((error, i) => {
            report += `  ${i + 1}. ${error.trim().substring(0, 200)}\n`;
          });
        }

        report += '\n';
      });
    }

    // Recommendations
    report += '\n💡 RECOMMENDATIONS\n';
    report += '═'.repeat(100) + '\n\n';

    const recommendations = this.generateRecommendations();
    recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });

    report += '\n';
    report += '═'.repeat(100) + '\n';

    return report;
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const failedSuites = Array.from(this.results.values()).filter(r => r.status === 'fail');

    if (failedSuites.length === 0) {
      recommendations.push('✅ All tests passed! Your codebase is in excellent shape.');
      recommendations.push('Consider increasing test coverage to maintain quality.');
      return recommendations;
    }

    failedSuites.forEach(result => {
      const suiteName = result.name.toLowerCase();

      if (suiteName.includes('eslint')) {
        recommendations.push(
          `🔧 Fix ESLint issues: Run 'npm run lint:fix' to auto-fix formatting issues.`
        );
        recommendations.push(
          `   Review remaining errors manually - they likely require code changes.`
        );
      }

      if (suiteName.includes('typescript') || suiteName.includes('type')) {
        recommendations.push(
          `📝 Fix TypeScript errors: Review type definitions and ensure proper typing.`
        );
        recommendations.push(
          `   Common issues: missing imports, incorrect type annotations, unused variables.`
        );
      }

      if (suiteName.includes('build')) {
        recommendations.push(
          `🏗️  Build failures detected: Fix compilation errors before deployment.`
        );
        recommendations.push(`   Check for missing dependencies or configuration issues.`);
      }

      if (suiteName.includes('playwright') || suiteName.includes('e2e')) {
        recommendations.push(
          `🎭 E2E test failures (${result.failed}/${result.total}): Review test selectors and assertions.`
        );
        recommendations.push(
          `   Common issues: incorrect selectors, timing issues, incomplete features.`
        );
        recommendations.push(
          `   Many failures are expected at 68% MVP completion - focus on critical paths first.`
        );
      }

      if (suiteName.includes('cypress')) {
        recommendations.push(
          `🌲 Cypress test failures: Ensure dev server is running and selectors are correct.`
        );
        recommendations.push(`   Check screenshots in test-results/cypress/ for visual debugging.`);
      }

      if (suiteName.includes('vitest') || suiteName.includes('unit')) {
        recommendations.push(
          `🧪 Unit test failures: Review test logic and mock data.`
        );
        recommendations.push(`   Update tests to match current implementation.`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('Focus on completing remaining MVP features (32% to go).');
      recommendations.push('Prioritize fixing failing E2E tests for critical user flows.');
    }

    return recommendations;
  }

  private saveReport(report: string): void {
    const reportDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const reportPath = path.join(reportDir, `test-report-${timestamp}.txt`);

    fs.writeFileSync(reportPath, report, 'utf-8');
    console.log(`\n\n📄 Full report saved to: ${reportPath}`);
  }

  async run(): Promise<void> {
    console.log('\n🚀 Starting Comprehensive Test Suite...\n');
    console.log(`📊 Running ${this.testSuites.length} test suites in parallel\n`);

    this.startTime = Date.now();

    // Start progress display
    this.progressInterval = setInterval(() => this.displayProgress(), 100);

    // Run all tests in parallel
    await Promise.all(this.testSuites.map(suite => this.runTestSuite(suite)));

    // Stop progress display
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }

    // Final progress display
    this.displayProgress();
    console.log('\n');

    // Generate and display report
    const report = this.generateReport();
    console.log(report);

    // Save report
    this.saveReport(report);

    // Exit with appropriate code
    const hasFailures = Array.from(this.results.values()).some(r => r.status === 'fail');
    process.exit(hasFailures ? 1 : 0);
  }
}

// Run the test runner
const runner = new TestRunner();
runner.run().catch(err => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});

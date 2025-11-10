/**
 * ReportAggregator
 *
 * Aggregates validation results from all agents and generates comprehensive reports
 * in JSON and Markdown formats.
 *
 * Requirements: 15.1, 15.2, 15.3, 15.4, 15.5
 */

import type {
  AgentResult,
  ValidationReport,
  ValidationSummary,
  TestResult,
  ModuleName,
} from '../../types/validation-agents';
import * as fs from 'fs';
import * as path from 'path';

export class ReportAggregator {
  /**
   * Aggregate results from all agents into a validation report
   */
  aggregateResults(
    agentResults: Record<string, AgentResult>,
    executionTime: number,
    environment: string = process.env.NODE_ENV || 'development',
  ): ValidationReport {
    // Calculate test statistics
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    const skippedTests = 0;

    for (const result of Object.values(agentResults)) {
      totalTests += result.tests.length;
      passedTests += result.tests.filter((t) => t.passed).length;
      failedTests += result.tests.filter((t) => !t.passed).length;
    }

    // Calculate overall health score
    const overallHealthScore = this.calculateHealthScore(agentResults);

    // Build summary
    const summary = this.buildSummary(agentResults, executionTime);

    // Generate recommendations
    const recommendations = this.generateRecommendations(agentResults, summary);

    return {
      timestamp: new Date().toISOString(),
      environment,
      overallHealthScore,
      totalTests,
      passedTests,
      failedTests,
      skippedTests,
      agentResults,
      summary,
      recommendations,
    };
  }

  /**
   * Calculate overall system health score (0-100)
   */
  calculateHealthScore(agentResults: Record<string, AgentResult>): number {
    if (Object.keys(agentResults).length === 0) {
      return 0;
    }

    let totalTests = 0;
    let passedTests = 0;

    for (const result of Object.values(agentResults)) {
      totalTests += result.tests.length;
      passedTests += result.tests.filter((t) => t.passed).length;
    }

    if (totalTests === 0) {
      return 0;
    }

    return Math.round((passedTests / totalTests) * 100);
  }

  /**
   * Identify critical failures that should block deployment
   */
  identifyCriticalFailures(agentResults: Record<string, AgentResult>): TestResult[] {
    const criticalFailures: TestResult[] = [];

    // Critical test IDs that should block deployment
    const CRITICAL_TESTS = ['REL-001', 'BCK-001', 'SUP-001'];

    for (const result of Object.values(agentResults)) {
      for (const test of result.tests) {
        if (!test.passed && CRITICAL_TESTS.includes(test.testId)) {
          criticalFailures.push(test);
        }
      }
    }

    return criticalFailures;
  }

  /**
   * Build validation summary
   */
  private buildSummary(
    agentResults: Record<string, AgentResult>,
    executionTime: number,
  ): ValidationSummary {
    const criticalFailures = this.identifyCriticalFailures(agentResults);
    const moduleStatus = {} as Record<ModuleName, 'passed' | 'failed' | 'partial'>;

    // Analyze each agent result
    for (const result of Object.values(agentResults)) {
      const passedCount = result.tests.filter((t) => t.passed).length;
      const totalCount = result.tests.length;

      if (passedCount === totalCount) {
        moduleStatus[result.module] = 'passed';
      } else if (passedCount === 0) {
        moduleStatus[result.module] = 'failed';
      } else {
        moduleStatus[result.module] = 'partial';
      }
    }

    return {
      criticalFailures,
      moduleStatus,
      executionTime,
      browserInfo: {
        name: 'chromium',
        version: 'latest',
      },
    };
  }

  /**
   * Generate actionable recommendations based on test results
   */
  generateRecommendations(
    agentResults: Record<string, AgentResult>,
    summary: ValidationSummary,
  ): string[] {
    const recommendations: string[] = [];

    // Check for critical failures
    if (summary.criticalFailures.length > 0) {
      recommendations.push(
        `🚨 CRITICAL: ${summary.criticalFailures.length} critical test(s) failed. These MUST be resolved before deployment.`,
      );

      for (const failure of summary.criticalFailures) {
        recommendations.push(`   - ${failure.testId}: ${failure.description} - ${failure.error}`);
      }
    }

    // Check for failed modules
    const failedModules = Object.entries(summary.moduleStatus)
      .filter(([_, status]) => status === 'failed')
      .map(([module]) => module);

    if (failedModules.length > 0) {
      recommendations.push(
        `❌ The following modules have failed all tests: ${failedModules.join(', ')}`,
      );
    }

    // Check for partial failures
    const partialModules = Object.entries(summary.moduleStatus)
      .filter(([_, status]) => status === 'partial')
      .map(([module]) => module);

    if (partialModules.length > 0) {
      recommendations.push(
        `⚠️ The following modules have partial failures: ${partialModules.join(', ')}`,
      );
    }

    // Check for agents that failed to execute
    const failedAgents = Object.values(agentResults).filter(
      (result) => result.tests.length === 0 && !result.passed,
    );

    if (failedAgents.length > 0) {
      recommendations.push(
        `🔧 ${failedAgents.length} agent(s) failed to execute. Check logs for details.`,
      );
    }

    // Check for PROJECT BLOCKER (SUP-001)
    const projectBlocker = summary.criticalFailures.find((f) => f.testId === 'SUP-001');
    if (projectBlocker) {
      recommendations.push(
        `🛑 PROJECT BLOCKER: Training materials incomplete. Project cannot proceed until resolved.`,
      );
    }

    // Positive feedback if all tests passed
    if (recommendations.length === 0) {
      recommendations.push(
        '✅ All validation tests passed successfully. System is healthy and ready for deployment.',
      );
    }

    return recommendations;
  }

  /**
   * Generate JSON report
   */
  generateJSON(report: ValidationReport): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Generate Markdown report
   */
  generateMarkdown(report: ValidationReport): string {
    const lines: string[] = [];

    // Header
    lines.push('# System Validation Report');
    lines.push('');
    lines.push(`**Generated:** ${new Date(report.timestamp).toLocaleString()}`);
    lines.push(`**Environment:** ${report.environment}`);
    lines.push(`**Overall Health Score:** ${report.overallHealthScore}%`);
    lines.push('');

    // Executive Summary
    lines.push('## Executive Summary');
    lines.push('');
    lines.push(`- **Total Tests:** ${report.totalTests}`);
    lines.push(`- **Passed:** ${report.passedTests} ✓`);
    lines.push(`- **Failed:** ${report.failedTests} ✗`);
    lines.push(`- **Skipped:** ${report.skippedTests} ⊘`);
    lines.push(`- **Execution Time:** ${(report.summary.executionTime / 1000).toFixed(2)}s`);
    lines.push('');

    // Module Status
    lines.push('## Module Status');
    lines.push('');
    lines.push('| Module | Status | Tests Passed | Tests Failed |');
    lines.push('|--------|--------|--------------|--------------|');

    for (const [agentName, result] of Object.entries(report.agentResults)) {
      const statusEmoji =
        report.summary.moduleStatus[result.module] === 'passed'
          ? '✅'
          : report.summary.moduleStatus[result.module] === 'failed'
            ? '❌'
            : '⚠️';
      const passed = result.tests.filter((t) => t.passed).length;
      const failed = result.tests.filter((t) => !t.passed).length;

      lines.push(
        `| ${result.module} | ${statusEmoji} ${report.summary.moduleStatus[result.module]} | ${passed} | ${failed} |`,
      );
    }
    lines.push('');

    // Critical Failures
    if (report.summary.criticalFailures.length > 0) {
      lines.push('## 🚨 Critical Failures');
      lines.push('');
      lines.push('The following critical tests failed and MUST be resolved:');
      lines.push('');

      for (const failure of report.summary.criticalFailures) {
        lines.push(`### ${failure.testId}: ${failure.description}`);
        lines.push('');
        lines.push(`**Error:** ${failure.error}`);
        lines.push('');
        if (failure.logs && failure.logs.length > 0) {
          lines.push('**Logs:**');
          lines.push('```');
          lines.push(failure.logs.join('\n'));
          lines.push('```');
          lines.push('');
        }
      }
    }

    // Detailed Results by Agent
    lines.push('## Detailed Results');
    lines.push('');

    for (const [agentName, result] of Object.entries(report.agentResults)) {
      lines.push(`### ${agentName}`);
      lines.push('');
      lines.push(`**Module:** ${result.module}`);
      lines.push(`**Status:** ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
      lines.push(`**Execution Time:** ${(result.executionTime / 1000).toFixed(2)}s`);
      lines.push('');

      if (result.tests.length > 0) {
        lines.push('**Tests:**');
        lines.push('');

        for (const test of result.tests) {
          const statusIcon = test.passed ? '✅' : '❌';
          lines.push(`- ${statusIcon} **${test.testId}**: ${test.description}`);

          if (!test.passed && test.error) {
            lines.push(`  - **Error:** ${test.error}`);
          }

          if (test.expectedValue && test.actualValue) {
            lines.push(`  - **Expected:** ${test.expectedValue}`);
            lines.push(`  - **Actual:** ${test.actualValue}`);
          }

          lines.push('');
        }
      }
    }

    // Recommendations
    lines.push('## Recommendations');
    lines.push('');

    for (const recommendation of report.recommendations) {
      lines.push(`- ${recommendation}`);
    }
    lines.push('');

    // Footer
    lines.push('---');
    lines.push('');
    lines.push('*Report generated by SIGECO System Validation Agents*');

    return lines.join('\n');
  }

  /**
   * Save report to file
   */
  saveReport(report: ValidationReport, outputDir: string, format: 'json' | 'markdown' | 'both' = 'both'): {
    jsonPath?: string;
    markdownPath?: string;
  } {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date(report.timestamp).toISOString().replace(/[:.]/g, '-');
    const result: { jsonPath?: string; markdownPath?: string } = {};

    // Save JSON
    if (format === 'json' || format === 'both') {
      const jsonPath = path.join(outputDir, `system-validation-${timestamp}.json`);
      fs.writeFileSync(jsonPath, this.generateJSON(report), 'utf-8');
      result.jsonPath = jsonPath;

      // Create symlink to latest
      const latestJsonPath = path.join(outputDir, 'system-validation-latest.json');
      if (fs.existsSync(latestJsonPath)) {
        fs.unlinkSync(latestJsonPath);
      }
      fs.writeFileSync(latestJsonPath, this.generateJSON(report), 'utf-8');
    }

    // Save Markdown
    if (format === 'markdown' || format === 'both') {
      const markdownPath = path.join(outputDir, `system-validation-${timestamp}.md`);
      fs.writeFileSync(markdownPath, this.generateMarkdown(report), 'utf-8');
      result.markdownPath = markdownPath;

      // Create symlink to latest
      const latestMarkdownPath = path.join(outputDir, 'system-validation-latest.md');
      if (fs.existsSync(latestMarkdownPath)) {
        fs.unlinkSync(latestMarkdownPath);
      }
      fs.writeFileSync(latestMarkdownPath, this.generateMarkdown(report), 'utf-8');
    }

    return result;
  }
}

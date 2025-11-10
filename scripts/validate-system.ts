#!/usr/bin/env node
/**
 * System Validation CLI
 *
 * Command-line interface for running system validation agents.
 *
 * Usage:
 *   npm run validate:system
 *   npm run validate:system -- --module=dashboard
 *   npm run validate:system -- --verbose --headless=false
 *
 * Requirements: 16.1, 16.2, 16.3, 16.4, 16.5
 */

import { ValidationOrchestrator } from '../src/lib/validation-agents/ValidationOrchestrator';
import { DashboardAgent } from '../src/lib/validation-agents/DashboardAgent';
import { MoradoresAgent } from '../src/lib/validation-agents/MoradoresAgent';
import { AgendamentosAgent } from '../src/lib/validation-agents/AgendamentosAgent';
import { RelatoriosAgent } from '../src/lib/validation-agents/RelatoriosAgent';
import { FuncionariosAgent } from '../src/lib/validation-agents/FuncionariosAgent';
import { BackupAgent } from '../src/lib/validation-agents/BackupAgent';
import { SuporteAgent } from '../src/lib/validation-agents/SuporteAgent';
import { ReportAggregator } from '../src/lib/validation-agents/ReportAggregator';
import { RealtimeLogger } from '../src/lib/validation-agents/RealtimeLogger';
import type { ModuleName, ValidationReport } from '../src/types/validation-agents';
import * as path from 'path';

/**
 * CLI options
 */
interface CLIOptions {
  module?: ModuleName;
  verbose?: boolean;
  headless?: boolean;
  outputDir?: string;
  failFast?: boolean;
}

/**
 * Parse command line arguments
 */
function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {
    verbose: false,
    headless: true,
    outputDir: path.join(process.cwd(), '.kiro', 'reports'),
    failFast: false,
  };

  for (const arg of args) {
    if (arg.startsWith('--module=')) {
      options.module = arg.split('=')[1] as ModuleName;
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg.startsWith('--headless=')) {
      options.headless = arg.split('=')[1] === 'true';
    } else if (arg.startsWith('--output-dir=')) {
      options.outputDir = arg.split('=')[1];
    } else if (arg === '--fail-fast') {
      options.failFast = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

/**
 * Print help message
 */
function printHelp(): void {
  console.log(`
System Validation CLI

Usage:
  npm run validate:system [options]

Options:
  --module=<name>        Run validation for specific module only
                         (dashboard, moradores, agendamentos, relatorios, funcionarios, backup, suporte)
  --verbose, -v          Enable verbose output
  --headless=<bool>      Run browser in headless mode (default: true)
  --output-dir=<path>    Directory for output files (default: .kiro/reports)
  --fail-fast            Stop execution on first failure
  --help, -h             Show this help message

Examples:
  npm run validate:system
  npm run validate:system -- --module=dashboard
  npm run validate:system -- --verbose --headless=false
  npm run validate:system -- --fail-fast --output-dir=./reports
`);
}

/**
 * Display progress indicator
 */
function displayProgress(agentName: string, status: 'running' | 'passed' | 'failed'): void {
  const icons = {
    running: '⏳',
    passed: '✅',
    failed: '❌',
  };

  const colors = {
    running: '\x1b[33m', // Yellow
    passed: '\x1b[32m', // Green
    failed: '\x1b[31m', // Red
  };

  const reset = '\x1b[0m';

  console.log(`${colors[status]}${icons[status]} ${agentName}${reset}`);
}

/**
 * Display summary table
 */
function displaySummary(report: ValidationReport): void {
  console.log('\n' + '='.repeat(80));
  console.log('VALIDATION SUMMARY');
  console.log('='.repeat(80));
  console.log(`Timestamp:           ${new Date(report.timestamp).toLocaleString()}`);
  console.log(`Environment:         ${report.environment}`);
  console.log(`Overall Health:      ${report.overallHealthScore}%`);
  console.log(`Total Tests:         ${report.totalTests}`);
  console.log(`Passed:              ${report.passedTests} ✓`);
  console.log(`Failed:              ${report.failedTests} ✗`);
  console.log(`Skipped:             ${report.skippedTests} ⊘`);
  console.log(`Execution Time:      ${(report.summary.executionTime / 1000).toFixed(2)}s`);
  console.log('='.repeat(80));

  // Module status
  console.log('\nMODULE STATUS:');
  for (const [module, status] of Object.entries(report.summary.moduleStatus)) {
    const statusIcon = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⚠️';
    console.log(`  ${statusIcon} ${module.padEnd(20)} ${status.toUpperCase()}`);
  }

  // Critical failures
  if (report.summary.criticalFailures.length > 0) {
    console.log('\n🚨 CRITICAL FAILURES:');
    for (const failure of report.summary.criticalFailures) {
      console.log(`  ❌ ${failure.testId}: ${failure.description}`);
      console.log(`     Error: ${failure.error}`);
    }
  }

  // Recommendations
  console.log('\nRECOMMENDATIONS:');
  for (const recommendation of report.recommendations) {
    console.log(`  ${recommendation}`);
  }

  console.log('='.repeat(80) + '\n');
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  const options = parseArgs();

  // Initialize realtime logger
  const logger = new RealtimeLogger({
    verbose: options.verbose,
    enableColors: true,
  });

  logger.displaySection('🚀 SIGECO System Validation');
  logger.info('Starting validation process...');

  if (options.verbose) {
    logger.debug('Configuration', undefined, options);
  }

  // Set environment variables
  if (options.headless !== undefined) {
    process.env.HEADLESS = options.headless ? 'true' : 'false';
  }

  try {
    // Create orchestrator
    const orchestrator = new ValidationOrchestrator();

    // Register all agents
    orchestrator.registerAgent(new DashboardAgent());
    orchestrator.registerAgent(new MoradoresAgent());
    orchestrator.registerAgent(new AgendamentosAgent());
    orchestrator.registerAgent(new RelatoriosAgent());
    orchestrator.registerAgent(new FuncionariosAgent());
    orchestrator.registerAgent(new BackupAgent());
    orchestrator.registerAgent(new SuporteAgent());

    logger.success(`Registered ${orchestrator.getAgentCount()} agents`);
    
    if (options.verbose) {
      for (const agentName of orchestrator.getAgentNames()) {
        logger.debug(`  - ${agentName}`);
      }
    }

    // Run validation
    let report: ValidationReport;

    if (options.module) {
      logger.info(`Running validation for module: ${options.module}`);
      logger.displaySubsection(`Module: ${options.module}`);
      
      const stopSpinner = logger.displaySpinner(`Executing ${options.module} validation...`);
      report = await orchestrator.runModule(options.module);
      stopSpinner();
      
      logger.success(`Module validation completed`);
    } else {
      logger.info('Running validation for all modules');
      logger.displaySubsection('Executing All Agents');

      // Display progress for each agent
      const agentNames = orchestrator.getAgentNames();
      const agentResults: Record<string, any> = {};
      let currentAgent = 0;

      for (const agentName of agentNames) {
        currentAgent++;
        logger.displayProgress(currentAgent, agentNames.length, 'Overall Progress');
        
        displayProgress(agentName, 'running');
        logger.info(`Starting ${agentName}...`, agentName);

        try {
          // Get the agent and run it
          const agents = orchestrator.getModuleAgents(
            agentName.includes('Dashboard')
              ? 'dashboard'
              : agentName.includes('Moradores')
                ? 'moradores'
                : agentName.includes('Agendamentos')
                  ? 'agendamentos'
                  : agentName.includes('Relatórios')
                    ? 'relatorios'
                    : agentName.includes('Funcionários')
                      ? 'funcionarios'
                      : agentName.includes('Backup')
                        ? 'backup'
                        : 'suporte',
          );

          if (agents.length > 0) {
            const result = await agents[0].execute();
            agentResults[agentName] = result;

            displayProgress(agentName, result.passed ? 'passed' : 'failed');
            
            if (result.passed) {
              logger.success(`${agentName} completed successfully`, agentName);
            } else {
              logger.error(`${agentName} failed`, agentName);
            }

            // Display test summary
            const passed = result.tests.filter((t) => t.passed).length;
            const failed = result.tests.filter((t) => !t.passed).length;
            logger.displayTestSummary(agentName, passed, failed, result.executionTime);

            // Display logs in verbose mode
            if (options.verbose && result.logs && result.logs.length > 0) {
              logger.debug('Agent logs:', agentName, result.logs);
            }

            if (options.failFast && !result.passed) {
              logger.warning('Fail-fast enabled. Stopping execution.');
              break;
            }
          }
        } catch (error) {
          displayProgress(agentName, 'failed');
          logger.error(`Error running ${agentName}`, agentName, error);

          if (options.failFast) {
            logger.warning('Fail-fast enabled. Stopping execution.');
            break;
          }
        }
      }

      // Build report manually
      const aggregator = new ReportAggregator();
      const executionTime = Object.values(agentResults).reduce(
        (sum, r) => sum + r.executionTime,
        0,
      );
      report = aggregator.aggregateResults(agentResults, executionTime);
    }

    // Display summary
    displaySummary(report);

    // Save reports
    logger.displaySubsection('Generating Reports');
    logger.info('Saving validation reports...');
    
    const aggregator = new ReportAggregator();
    const savedPaths = aggregator.saveReport(report, options.outputDir!, 'both');

    logger.success('Reports saved successfully');
    
    if (savedPaths.jsonPath) {
      logger.info(`JSON:     ${savedPaths.jsonPath}`);
      logger.info(`Latest:   ${path.join(options.outputDir!, 'system-validation-latest.json')}`);
    }
    if (savedPaths.markdownPath) {
      logger.info(`Markdown: ${savedPaths.markdownPath}`);
      logger.info(`Latest:   ${path.join(options.outputDir!, 'system-validation-latest.md')}`);
    }

    // Exit with appropriate code
    const exitCode = report.passedTests === report.totalTests ? 0 : 1;

    logger.displaySection('Validation Complete');
    
    if (exitCode === 0) {
      logger.success('All validations passed!');
    } else {
      logger.error('Some validations failed. Check the report for details.');
    }

    // Export logger logs if verbose
    if (options.verbose) {
      const logPath = path.join(options.outputDir!, `validation-logs-${Date.now()}.json`);
      const fs = await import('fs');
      fs.writeFileSync(logPath, logger.exportJSON(), 'utf-8');
      logger.info(`Detailed logs saved to: ${logPath}`);
    }

    process.exit(exitCode);
  } catch (error) {
    logger.error('Fatal error during validation', undefined, error);
    process.exit(1);
  }
}

// Run main function
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

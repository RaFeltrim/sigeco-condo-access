/**
 * Example: Using MoradoresAgent with ValidationOrchestrator
 * 
 * This example demonstrates how to use the MoradoresAgent to validate
 * the Moradores module of the SIGECO system.
 */

import { ValidationOrchestrator } from '../src/lib/validation-agents/ValidationOrchestrator';
import { MoradoresAgent } from '../src/lib/validation-agents/MoradoresAgent';
import { DashboardAgent } from '../src/lib/validation-agents/DashboardAgent';

async function runMoradoresValidation() {
  // Create orchestrator
  const orchestrator = new ValidationOrchestrator();

  // Register agents
  orchestrator.registerAgent(new DashboardAgent());
  orchestrator.registerAgent(new MoradoresAgent());

  console.log('Starting Moradores module validation...\n');

  try {
    // Run validation for moradores module only
    const report = await orchestrator.runModule('moradores');

    // Display results
    console.log('='.repeat(60));
    console.log('MORADORES VALIDATION REPORT');
    console.log('='.repeat(60));
    console.log(`Timestamp: ${report.timestamp}`);
    console.log(`Environment: ${report.environment}`);
    console.log(`Overall Health Score: ${report.overallHealthScore}%`);
    console.log(`Total Tests: ${report.totalTests}`);
    console.log(`Passed: ${report.passedTests}`);
    console.log(`Failed: ${report.failedTests}`);
    console.log('='.repeat(60));

    // Display agent results
    for (const [agentName, result] of Object.entries(report.agentResults)) {
      console.log(`\n${agentName}:`);
      console.log(`  Status: ${result.passed ? '✓ PASSED' : '✗ FAILED'}`);
      console.log(`  Execution Time: ${result.executionTime}ms`);
      console.log(`  Tests: ${result.tests.length}`);

      // Display individual test results
      for (const test of result.tests) {
        const status = test.passed ? '✓' : '✗';
        console.log(`    ${status} ${test.testId}: ${test.description}`);
        
        if (!test.passed && test.error) {
          console.log(`      Error: ${test.error}`);
        }
      }
    }

    // Display recommendations
    if (report.recommendations.length > 0) {
      console.log('\n' + '='.repeat(60));
      console.log('RECOMMENDATIONS:');
      console.log('='.repeat(60));
      for (const recommendation of report.recommendations) {
        console.log(`  ${recommendation}`);
      }
    }

    // Exit with appropriate code
    process.exit(report.passedTests === report.totalTests ? 0 : 1);

  } catch (error) {
    console.error('Error running validation:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMoradoresValidation();
}

export { runMoradoresValidation };

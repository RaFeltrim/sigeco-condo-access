/**
 * ValidationOrchestrator
 * 
 * Orchestrates the execution of all validation agents, manages their lifecycle,
 * and aggregates results into a comprehensive validation report.
 * 
 * Requirements: 15.1, 15.2, 15.3, 16.1
 */

import type {
  ValidationAgent,
  AgentResult,
  ValidationReport,
  ModuleName,
  ValidationSummary,
  TestResult,
} from '../../types/validation-agents';

export class ValidationOrchestrator {
  private agents: Map<string, ValidationAgent> = new Map();
  private moduleAgents: Map<ModuleName, ValidationAgent[]> = new Map();

  /**
   * Register a validation agent with the orchestrator
   * @param agent - The validation agent to register
   */
  registerAgent(agent: ValidationAgent): void {
    // Store agent by name
    this.agents.set(agent.name, agent);

    // Store agent by module for module-specific execution
    const moduleAgentList = this.moduleAgents.get(agent.module) || [];
    moduleAgentList.push(agent);
    this.moduleAgents.set(agent.module, moduleAgentList);
  }

  /**
   * Execute all registered validation agents
   * @returns Promise resolving to a complete validation report
   */
  async runAll(): Promise<ValidationReport> {
    const startTime = Date.now();
    const agentResults: Record<string, AgentResult> = {};
    const allAgents = Array.from(this.agents.values());

    // Execute all agents with error handling
    for (const agent of allAgents) {
      try {
        const result = await agent.execute();
        agentResults[agent.name] = result;
      } catch (error) {
        // Continue execution even if an agent fails
        const errorMessage = error instanceof Error ? error.message : String(error);
        agentResults[agent.name] = {
          agentName: agent.name,
          module: agent.module,
          passed: false,
          executionTime: 0,
          tests: [],
          logs: [`Agent execution failed: ${errorMessage}`],
        };
      }
    }

    const executionTime = Date.now() - startTime;

    // Build the validation report
    return this.buildReport(agentResults, executionTime);
  }

  /**
   * Execute validation agents for a specific module
   * @param moduleName - The module to validate
   * @returns Promise resolving to a validation report for the specified module
   */
  async runModule(moduleName: ModuleName): Promise<ValidationReport> {
    const startTime = Date.now();
    const agentResults: Record<string, AgentResult> = {};
    const moduleAgentList = this.moduleAgents.get(moduleName);

    if (!moduleAgentList || moduleAgentList.length === 0) {
      throw new Error(`No agents registered for module: ${moduleName}`);
    }

    // Execute all agents for the specified module with error handling
    for (const agent of moduleAgentList) {
      try {
        const result = await agent.execute();
        agentResults[agent.name] = result;
      } catch (error) {
        // Continue execution even if an agent fails
        const errorMessage = error instanceof Error ? error.message : String(error);
        agentResults[agent.name] = {
          agentName: agent.name,
          module: agent.module,
          passed: false,
          executionTime: 0,
          tests: [],
          logs: [`Agent execution failed: ${errorMessage}`],
        };
      }
    }

    const executionTime = Date.now() - startTime;

    // Build the validation report
    return this.buildReport(agentResults, executionTime);
  }

  /**
   * Calculate overall system health score (0-100)
   * @returns Health score based on test pass rate
   */
  getHealthScore(): number {
    const allResults = Array.from(this.agents.values());
    
    if (allResults.length === 0) {
      return 0;
    }

    // Calculate based on agent pass rate
    const passedAgents = allResults.filter(agent => {
      // This is a placeholder - actual results would come from execution
      return true;
    }).length;

    return Math.round((passedAgents / allResults.length) * 100);
  }

  /**
   * Build a complete validation report from agent results
   * @param agentResults - Results from all executed agents
   * @param executionTime - Total execution time in milliseconds
   * @returns Complete validation report
   */
  private buildReport(
    agentResults: Record<string, AgentResult>,
    executionTime: number
  ): ValidationReport {
    // Calculate test statistics
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    const skippedTests = 0;

    for (const result of Object.values(agentResults)) {
      totalTests += result.tests.length;
      passedTests += result.tests.filter(t => t.passed).length;
      failedTests += result.tests.filter(t => !t.passed).length;
    }

    // Calculate overall health score
    const overallHealthScore = totalTests > 0 
      ? Math.round((passedTests / totalTests) * 100)
      : 0;

    // Build summary
    const summary = this.buildSummary(agentResults, executionTime);

    // Generate recommendations
    const recommendations = this.generateRecommendations(agentResults, summary);

    return {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
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
   * Build validation summary from agent results
   * @param agentResults - Results from all executed agents
   * @param executionTime - Total execution time in milliseconds
   * @returns Validation summary
   */
  private buildSummary(
    agentResults: Record<string, AgentResult>,
    executionTime: number
  ): ValidationSummary {
    const criticalFailures: TestResult[] = [];
    const moduleStatus: Record<ModuleName, 'passed' | 'failed' | 'partial'> = {} as any;

    // Critical test IDs that should block deployment
    const CRITICAL_TESTS = ['REL-001', 'BCK-001', 'DSB-003'];

    // Analyze each agent result
    for (const result of Object.values(agentResults)) {
      // Identify critical failures
      for (const test of result.tests) {
        if (!test.passed && CRITICAL_TESTS.includes(test.testId)) {
          criticalFailures.push(test);
        }
      }

      // Determine module status
      const passedCount = result.tests.filter(t => t.passed).length;
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
        version: 'unknown',
      },
    };
  }

  /**
   * Generate actionable recommendations based on test results
   * @param agentResults - Results from all executed agents
   * @param summary - Validation summary
   * @returns Array of recommendation strings
   */
  private generateRecommendations(
    agentResults: Record<string, AgentResult>,
    summary: ValidationSummary
  ): string[] {
    const recommendations: string[] = [];

    // Check for critical failures
    if (summary.criticalFailures.length > 0) {
      recommendations.push(
        `⚠️ CRITICAL: ${summary.criticalFailures.length} critical test(s) failed. These must be resolved before deployment.`
      );
    }

    // Check for failed modules
    const failedModules = Object.entries(summary.moduleStatus)
      .filter(([_, status]) => status === 'failed')
      .map(([module]) => module);

    if (failedModules.length > 0) {
      recommendations.push(
        `❌ The following modules have failed all tests: ${failedModules.join(', ')}`
      );
    }

    // Check for partial failures
    const partialModules = Object.entries(summary.moduleStatus)
      .filter(([_, status]) => status === 'partial')
      .map(([module]) => module);

    if (partialModules.length > 0) {
      recommendations.push(
        `⚠️ The following modules have partial failures: ${partialModules.join(', ')}`
      );
    }

    // Check for agents that failed to execute
    const failedAgents = Object.values(agentResults)
      .filter(result => result.tests.length === 0 && !result.passed);

    if (failedAgents.length > 0) {
      recommendations.push(
        `🔧 ${failedAgents.length} agent(s) failed to execute. Check logs for details.`
      );
    }

    // Positive feedback if all tests passed
    if (recommendations.length === 0) {
      recommendations.push(
        '✅ All validation tests passed successfully. System is healthy and ready for deployment.'
      );
    }

    return recommendations;
  }

  /**
   * Get the number of registered agents
   * @returns Number of registered agents
   */
  getAgentCount(): number {
    return this.agents.size;
  }

  /**
   * Get all registered agent names
   * @returns Array of agent names
   */
  getAgentNames(): string[] {
    return Array.from(this.agents.keys());
  }

  /**
   * Get agents for a specific module
   * @param moduleName - The module name
   * @returns Array of agents for the module
   */
  getModuleAgents(moduleName: ModuleName): ValidationAgent[] {
    return this.moduleAgents.get(moduleName) || [];
  }
}

# System Validation Agents

This directory contains validation agents for the SIGECO system. Each agent is responsible for validating a specific module of the application.

## Available Agents

### DashboardAgent
Validates the Dashboard Administrativo module including:
- KPI values and percentage variations (DSB-001)
- Ad Blocker compatibility (DSB-002)
- Stress testing under load (DSB-003)

**Requirements**: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5

### MoradoresAgent
Validates the Moradores (Residents) module including:
- CRUD operations (Create, Read, Update, Delete) (MRD-001)
- Field validation and required fields (MRD-002)

**Requirements**: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5

## Usage

### Basic Usage

```typescript
import { ValidationOrchestrator } from './ValidationOrchestrator';
import { MoradoresAgent } from './MoradoresAgent';

// Create orchestrator
const orchestrator = new ValidationOrchestrator();

// Register agent
orchestrator.registerAgent(new MoradoresAgent());

// Run validation
const report = await orchestrator.runModule('moradores');

console.log(`Health Score: ${report.overallHealthScore}%`);
console.log(`Tests Passed: ${report.passedTests}/${report.totalTests}`);
```

### Running All Agents

```typescript
import { ValidationOrchestrator } from './ValidationOrchestrator';
import { DashboardAgent } from './DashboardAgent';
import { MoradoresAgent } from './MoradoresAgent';

const orchestrator = new ValidationOrchestrator();

// Register all agents
orchestrator.registerAgent(new DashboardAgent());
orchestrator.registerAgent(new MoradoresAgent());

// Run all validations
const report = await orchestrator.runAll();
```

## Environment Variables

- `BASE_URL`: Base URL of the application (default: `http://localhost:5173`)
- `HEADLESS`: Run browser in headless mode (default: `true`, set to `false` for debugging)

## Test Results

Each agent returns an `AgentResult` containing:
- `agentName`: Name of the agent
- `module`: Module being validated
- `passed`: Whether all tests passed
- `executionTime`: Total execution time in milliseconds
- `tests`: Array of individual test results
- `screenshots`: Paths to captured screenshots
- `logs`: Execution logs

## Test IDs

### MoradoresAgent Test IDs
- `MRD-001`: CRUD operations test
- `MRD-002`: Field validation test
- `MRD-ERROR`: Agent execution error

## Creating a New Agent

To create a new validation agent:

1. Create a new file in this directory (e.g., `AgendamentosAgent.ts`)
2. Implement the `ValidationAgent` interface
3. Define test methods for each validation scenario
4. Register the agent with the `ValidationOrchestrator`

Example:

```typescript
import { chromium, Browser, Page } from 'playwright';
import type { ValidationAgent, AgentResult, TestResult, ModuleName } from '../../types/validation-agents';

export class MyAgent implements ValidationAgent {
  name = 'My Validation Agent';
  module: ModuleName = 'my-module';
  
  private browser: Browser | null = null;
  private page: Page | null = null;

  async execute(): Promise<AgentResult> {
    const startTime = Date.now();
    const tests: TestResult[] = [];

    try {
      await this.initBrowser();
      
      // Run your tests
      const test1 = await this.testSomething();
      tests.push(test1);

    } finally {
      await this.cleanup();
    }

    return {
      agentName: this.name,
      module: this.module,
      passed: tests.every(t => t.passed),
      executionTime: Date.now() - startTime,
      tests,
      screenshots: [],
      logs: [],
    };
  }

  private async initBrowser(): Promise<void> {
    this.browser = await chromium.launch({
      headless: process.env.HEADLESS !== 'false',
    });
    this.page = await this.browser.newPage();
  }

  private async testSomething(): Promise<TestResult> {
    // Implement your test logic
    return {
      testId: 'MY-001',
      description: 'Test something',
      passed: true,
      executionTime: 100,
    };
  }

  private async cleanup(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.browser) await this.browser.close();
  }
}
```

## Testing

Run the validation agent tests:

```bash
npm run test -- tests/validation-agents/MoradoresAgent.test.ts --run
```

## See Also

- [ValidationOrchestrator](./ValidationOrchestrator.ts) - Orchestrates agent execution
- [Type Definitions](../../types/validation-agents.ts) - TypeScript interfaces
- [Usage Example](../../../examples/moradores-agent-usage.ts) - Complete usage example

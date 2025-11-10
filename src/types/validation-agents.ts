/**
 * Core types for the System Validation Agents
 * 
 * This module defines the interfaces and types used across all validation agents
 * to ensure consistent structure and behavior.
 */

/**
 * Supported module names in the SIGECO system
 */
export type ModuleName = 
  | 'dashboard' 
  | 'moradores' 
  | 'agendamentos' 
  | 'relatorios' 
  | 'funcionarios' 
  | 'backup' 
  | 'suporte';

/**
 * Test execution status
 */
export type TestStatus = 'passed' | 'failed' | 'skipped';

/**
 * Result of a single test execution
 */
export interface TestResult {
  /** Unique identifier for the test (e.g., 'DSB-001', 'MRD-002') */
  testId: string;
  
  /** Human-readable description of what the test validates */
  description: string;
  
  /** Whether the test passed */
  passed: boolean;
  
  /** Execution time in milliseconds */
  executionTime: number;
  
  /** Error message if test failed */
  error?: string;
  
  /** Expected value for comparison tests */
  expectedValue?: unknown;
  
  /** Actual value received during test */
  actualValue?: unknown;
  
  /** Path to screenshot captured during test */
  screenshot?: string;
  
  /** Console logs or other diagnostic information */
  logs?: string[];
}

/**
 * Result of a validation agent execution
 */
export interface AgentResult {
  /** Name of the agent that executed */
  agentName: string;
  
  /** Module being validated */
  module: ModuleName;
  
  /** Whether all tests in this agent passed */
  passed: boolean;
  
  /** Total execution time for the agent in milliseconds */
  executionTime: number;
  
  /** Individual test results */
  tests: TestResult[];
  
  /** Paths to screenshots captured during agent execution */
  screenshots?: string[];
  
  /** Logs from the agent execution */
  logs?: string[];
  
  /** Additional metadata about the agent execution */
  metadata?: Record<string, unknown>;
}

/**
 * Summary information for the validation report
 */
export interface ValidationSummary {
  /** Critical test failures that should block deployment */
  criticalFailures: TestResult[];
  
  /** Status of each module: passed (all tests passed), failed (all tests failed), partial (some passed) */
  moduleStatus: Record<ModuleName, 'passed' | 'failed' | 'partial'>;
  
  /** Total execution time for all agents in milliseconds */
  executionTime: number;
  
  /** Browser information */
  browserInfo: {
    name: string;
    version: string;
  };
}

/**
 * Complete validation report aggregating all agent results
 */
export interface ValidationReport {
  /** ISO timestamp of when the validation was executed */
  timestamp: string;
  
  /** Environment where validation was executed (e.g., 'development', 'staging') */
  environment: string;
  
  /** Overall system health score (0-100) */
  overallHealthScore: number;
  
  /** Total number of tests executed */
  totalTests: number;
  
  /** Number of tests that passed */
  passedTests: number;
  
  /** Number of tests that failed */
  failedTests: number;
  
  /** Number of tests that were skipped */
  skippedTests: number;
  
  /** Results from each agent, keyed by agent name */
  agentResults: Record<string, AgentResult>;
  
  /** Summary information and analysis */
  summary: ValidationSummary;
  
  /** Actionable recommendations based on test results */
  recommendations: string[];
}

/**
 * Base interface that all validation agents must implement
 */
export interface ValidationAgent {
  /** Unique name of the agent */
  name: string;
  
  /** Module that this agent validates */
  module: ModuleName;
  
  /**
   * Execute all tests for this agent
   * @returns Promise resolving to the agent's test results
   */
  execute(): Promise<AgentResult>;
}

/**
 * Configuration options for CLI execution
 */
export interface CLIOptions {
  /** Run specific module only */
  module?: ModuleName;
  
  /** Enable verbose output */
  verbose?: boolean;
  
  /** Run browser in headless mode */
  headless?: boolean;
  
  /** Directory for output files */
  outputDir?: string;
  
  /** Stop execution on first failure */
  failFast?: boolean;
}

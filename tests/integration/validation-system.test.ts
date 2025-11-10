/**
 * Integration tests for the System Validation framework
 * 
 * These tests verify that all components work together correctly:
 * - Agents can be instantiated
 * - ValidationOrchestrator can register and run agents
 * - ReportAggregator can generate reports
 * - All agents follow the correct interface
 */

import { describe, it, expect } from 'vitest';
import { ValidationOrchestrator } from '../../src/lib/validation-agents/ValidationOrchestrator';
import { DashboardAgent } from '../../src/lib/validation-agents/DashboardAgent';
import { MoradoresAgent } from '../../src/lib/validation-agents/MoradoresAgent';
import { AgendamentosAgent } from '../../src/lib/validation-agents/AgendamentosAgent';
import { RelatoriosAgent } from '../../src/lib/validation-agents/RelatoriosAgent';
import { FuncionariosAgent } from '../../src/lib/validation-agents/FuncionariosAgent';
import { BackupAgent } from '../../src/lib/validation-agents/BackupAgent';
import { SuporteAgent } from '../../src/lib/validation-agents/SuporteAgent';
import { ReportAggregator } from '../../src/lib/validation-agents/ReportAggregator';
import type { ValidationAgent, AgentResult } from '../../src/types/validation-agents';

describe('Validation System Integration', () => {
  describe('Agent Instantiation', () => {
    it('should instantiate all agents', () => {
      const agents = [
        new DashboardAgent(),
        new MoradoresAgent(),
        new AgendamentosAgent(),
        new RelatoriosAgent(),
        new FuncionariosAgent(),
        new BackupAgent(),
        new SuporteAgent(),
      ];

      expect(agents).toHaveLength(7);
      agents.forEach(agent => {
        expect(agent).toBeDefined();
        expect(agent.name).toBeDefined();
        expect(agent.module).toBeDefined();
        expect(typeof agent.execute).toBe('function');
      });
    });

    it('should have correct agent names', () => {
      const agents = [
        new DashboardAgent(),
        new MoradoresAgent(),
        new AgendamentosAgent(),
        new RelatoriosAgent(),
        new FuncionariosAgent(),
        new BackupAgent(),
        new SuporteAgent(),
      ];

      const expectedNames = [
        'Dashboard Validation Agent',
        'Moradores Validation Agent',
        'Agendamentos Validation Agent',
        'Relatórios Validation Agent',
        'Funcionários Validation Agent',
        'Backup Validation Agent',
        'Suporte Validation Agent',
      ];

      agents.forEach((agent, index) => {
        expect(agent.name).toBe(expectedNames[index]);
      });
    });

    it('should have correct module assignments', () => {
      const agents = [
        new DashboardAgent(),
        new MoradoresAgent(),
        new AgendamentosAgent(),
        new RelatoriosAgent(),
        new FuncionariosAgent(),
        new BackupAgent(),
        new SuporteAgent(),
      ];

      const expectedModules = [
        'dashboard',
        'moradores',
        'agendamentos',
        'relatorios',
        'funcionarios',
        'backup',
        'suporte',
      ];

      agents.forEach((agent, index) => {
        expect(agent.module).toBe(expectedModules[index]);
      });
    });
  });

  describe('ValidationOrchestrator', () => {
    it('should register agents', () => {
      const orchestrator = new ValidationOrchestrator();
      
      orchestrator.registerAgent(new DashboardAgent());
      orchestrator.registerAgent(new MoradoresAgent());

      expect(orchestrator.getAgentCount()).toBe(2);
    });

    it('should get agent names', () => {
      const orchestrator = new ValidationOrchestrator();
      
      orchestrator.registerAgent(new DashboardAgent());
      orchestrator.registerAgent(new MoradoresAgent());

      const names = orchestrator.getAgentNames();
      expect(names).toContain('Dashboard Validation Agent');
      expect(names).toContain('Moradores Validation Agent');
    });

    it('should get module agents', () => {
      const orchestrator = new ValidationOrchestrator();
      
      orchestrator.registerAgent(new DashboardAgent());
      orchestrator.registerAgent(new MoradoresAgent());

      const dashboardAgents = orchestrator.getModuleAgents('dashboard');
      expect(dashboardAgents).toHaveLength(1);
      expect(dashboardAgents[0].module).toBe('dashboard');

      const moradoresAgents = orchestrator.getModuleAgents('moradores');
      expect(moradoresAgents).toHaveLength(1);
      expect(moradoresAgents[0].module).toBe('moradores');
    });

    it('should register all 7 agents', () => {
      const orchestrator = new ValidationOrchestrator();
      
      orchestrator.registerAgent(new DashboardAgent());
      orchestrator.registerAgent(new MoradoresAgent());
      orchestrator.registerAgent(new AgendamentosAgent());
      orchestrator.registerAgent(new RelatoriosAgent());
      orchestrator.registerAgent(new FuncionariosAgent());
      orchestrator.registerAgent(new BackupAgent());
      orchestrator.registerAgent(new SuporteAgent());

      expect(orchestrator.getAgentCount()).toBe(7);
    });
  });

  describe('ReportAggregator', () => {
    it('should calculate health score', () => {
      const aggregator = new ReportAggregator();
      
      const mockResults: Record<string, AgentResult> = {
        'Test Agent 1': {
          agentName: 'Test Agent 1',
          module: 'dashboard',
          passed: true,
          executionTime: 1000,
          tests: [
            { testId: 'T1', description: 'Test 1', passed: true, executionTime: 500 },
            { testId: 'T2', description: 'Test 2', passed: true, executionTime: 500 },
          ],
          screenshots: [],
          logs: [],
        },
        'Test Agent 2': {
          agentName: 'Test Agent 2',
          module: 'moradores',
          passed: false,
          executionTime: 1000,
          tests: [
            { testId: 'T3', description: 'Test 3', passed: true, executionTime: 500 },
            { testId: 'T4', description: 'Test 4', passed: false, executionTime: 500 },
          ],
          screenshots: [],
          logs: [],
        },
      };

      const healthScore = aggregator.calculateHealthScore(mockResults);
      expect(healthScore).toBe(75); // 3 out of 4 tests passed
    });

    it('should identify critical failures', () => {
      const aggregator = new ReportAggregator();
      
      const mockResults: Record<string, AgentResult> = {
        'Test Agent': {
          agentName: 'Test Agent',
          module: 'relatorios',
          passed: false,
          executionTime: 1000,
          tests: [
            { testId: 'REL-001', description: 'Critical Test', passed: false, executionTime: 500, error: 'Critical failure' },
            { testId: 'REL-002', description: 'Normal Test', passed: false, executionTime: 500 },
          ],
          screenshots: [],
          logs: [],
        },
      };

      const criticalFailures = aggregator.identifyCriticalFailures(mockResults);
      expect(criticalFailures).toHaveLength(1);
      expect(criticalFailures[0].testId).toBe('REL-001');
    });

    it('should generate JSON report', () => {
      const aggregator = new ReportAggregator();
      
      const mockResults: Record<string, AgentResult> = {
        'Test Agent': {
          agentName: 'Test Agent',
          module: 'dashboard',
          passed: true,
          executionTime: 1000,
          tests: [
            { testId: 'T1', description: 'Test 1', passed: true, executionTime: 500 },
          ],
          screenshots: [],
          logs: [],
        },
      };

      const report = aggregator.aggregateResults(mockResults, 1000);
      const json = aggregator.generateJSON(report);

      expect(json).toBeDefined();
      expect(typeof json).toBe('string');
      
      const parsed = JSON.parse(json);
      expect(parsed.timestamp).toBeDefined();
      expect(parsed.overallHealthScore).toBe(100);
      expect(parsed.totalTests).toBe(1);
      expect(parsed.passedTests).toBe(1);
    });

    it('should generate Markdown report', () => {
      const aggregator = new ReportAggregator();
      
      const mockResults: Record<string, AgentResult> = {
        'Test Agent': {
          agentName: 'Test Agent',
          module: 'dashboard',
          passed: true,
          executionTime: 1000,
          tests: [
            { testId: 'T1', description: 'Test 1', passed: true, executionTime: 500 },
          ],
          screenshots: [],
          logs: [],
        },
      };

      const report = aggregator.aggregateResults(mockResults, 1000);
      const markdown = aggregator.generateMarkdown(report);

      expect(markdown).toBeDefined();
      expect(typeof markdown).toBe('string');
      expect(markdown).toContain('# System Validation Report');
      expect(markdown).toContain('## Executive Summary');
      expect(markdown).toContain('Test Agent');
    });

    it('should generate recommendations', () => {
      const aggregator = new ReportAggregator();
      
      const mockResults: Record<string, AgentResult> = {
        'Test Agent': {
          agentName: 'Test Agent',
          module: 'dashboard',
          passed: true,
          executionTime: 1000,
          tests: [
            { testId: 'T1', description: 'Test 1', passed: true, executionTime: 500 },
          ],
          screenshots: [],
          logs: [],
        },
      };

      const report = aggregator.aggregateResults(mockResults, 1000);

      expect(report.recommendations).toBeDefined();
      expect(report.recommendations.length).toBeGreaterThan(0);
      expect(report.recommendations[0]).toContain('✅');
    });
  });

  describe('Agent Interface Compliance', () => {
    it('all agents should implement ValidationAgent interface', () => {
      const agents: ValidationAgent[] = [
        new DashboardAgent(),
        new MoradoresAgent(),
        new AgendamentosAgent(),
        new RelatoriosAgent(),
        new FuncionariosAgent(),
        new BackupAgent(),
        new SuporteAgent(),
      ];

      agents.forEach(agent => {
        // Check required properties
        expect(agent).toHaveProperty('name');
        expect(agent).toHaveProperty('module');
        expect(agent).toHaveProperty('execute');

        // Check types
        expect(typeof agent.name).toBe('string');
        expect(typeof agent.module).toBe('string');
        expect(typeof agent.execute).toBe('function');

        // Check name is not empty
        expect(agent.name.length).toBeGreaterThan(0);
        
        // Check module is valid
        const validModules = ['dashboard', 'moradores', 'agendamentos', 'relatorios', 'funcionarios', 'backup', 'suporte'];
        expect(validModules).toContain(agent.module);
      });
    });
  });

  describe('System Integration', () => {
    it('should create complete validation system', () => {
      const orchestrator = new ValidationOrchestrator();
      const aggregator = new ReportAggregator();

      // Register all agents
      orchestrator.registerAgent(new DashboardAgent());
      orchestrator.registerAgent(new MoradoresAgent());
      orchestrator.registerAgent(new AgendamentosAgent());
      orchestrator.registerAgent(new RelatoriosAgent());
      orchestrator.registerAgent(new FuncionariosAgent());
      orchestrator.registerAgent(new BackupAgent());
      orchestrator.registerAgent(new SuporteAgent());

      expect(orchestrator.getAgentCount()).toBe(7);

      // Verify all modules are covered
      const modules: Array<'dashboard' | 'moradores' | 'agendamentos' | 'relatorios' | 'funcionarios' | 'backup' | 'suporte'> = [
        'dashboard',
        'moradores',
        'agendamentos',
        'relatorios',
        'funcionarios',
        'backup',
        'suporte',
      ];

      modules.forEach(module => {
        const agents = orchestrator.getModuleAgents(module);
        expect(agents.length).toBeGreaterThan(0);
      });
    });
  });
});

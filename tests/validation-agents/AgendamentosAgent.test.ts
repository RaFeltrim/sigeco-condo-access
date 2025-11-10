/**
 * Tests for AgendamentosAgent
 */

import { describe, it, expect } from 'vitest';
import { AgendamentosAgent } from '../../src/lib/validation-agents/AgendamentosAgent';

describe('AgendamentosAgent', () => {
  it('should be instantiable', () => {
    const agent = new AgendamentosAgent();
    expect(agent).toBeDefined();
  });

  it('should have correct name', () => {
    const agent = new AgendamentosAgent();
    expect(agent.name).toBe('Agendamentos Validation Agent');
  });

  it('should have correct module', () => {
    const agent = new AgendamentosAgent();
    expect(agent.module).toBe('agendamentos');
  });

  it('should have execute method', () => {
    const agent = new AgendamentosAgent();
    expect(typeof agent.execute).toBe('function');
  });
});

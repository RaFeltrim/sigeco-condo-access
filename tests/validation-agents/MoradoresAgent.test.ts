/**
 * Tests for MoradoresAgent
 * 
 * These tests verify that the MoradoresAgent is properly structured
 * and can be instantiated correctly.
 */

import { describe, it, expect } from 'vitest';
import { MoradoresAgent } from '../../src/lib/validation-agents/MoradoresAgent';

describe('MoradoresAgent', () => {
  it('should be instantiable', () => {
    const agent = new MoradoresAgent();
    expect(agent).toBeDefined();
  });

  it('should have correct name', () => {
    const agent = new MoradoresAgent();
    expect(agent.name).toBe('Moradores Validation Agent');
  });

  it('should have correct module', () => {
    const agent = new MoradoresAgent();
    expect(agent.module).toBe('moradores');
  });

  it('should have execute method', () => {
    const agent = new MoradoresAgent();
    expect(typeof agent.execute).toBe('function');
  });
});

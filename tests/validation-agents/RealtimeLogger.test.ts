/**
 * Tests for RealtimeLogger
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RealtimeLogger } from '../../src/lib/validation-agents/RealtimeLogger';

describe('RealtimeLogger', () => {
  let logger: RealtimeLogger;
  let consoleLogSpy: any;

  beforeEach(() => {
    logger = new RealtimeLogger({ verbose: false, enableColors: false });
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('Basic Logging', () => {
    it('should log info messages', () => {
      logger.info('Test info message');
      
      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe('info');
      expect(logs[0].message).toBe('Test info message');
    });

    it('should log success messages', () => {
      logger.success('Test success message');
      
      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe('success');
      expect(logs[0].message).toBe('Test success message');
    });

    it('should log warning messages', () => {
      logger.warning('Test warning message');
      
      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe('warning');
      expect(logs[0].message).toBe('Test warning message');
    });

    it('should log error messages', () => {
      logger.error('Test error message');
      
      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe('error');
      expect(logs[0].message).toBe('Test error message');
    });

    it('should not log debug messages when verbose is false', () => {
      logger.debug('Test debug message');
      
      const logs = logger.getLogs();
      expect(logs).toHaveLength(0);
    });

    it('should log debug messages when verbose is true', () => {
      const verboseLogger = new RealtimeLogger({ verbose: true });
      verboseLogger.debug('Test debug message');
      
      const logs = verboseLogger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe('debug');
    });
  });

  describe('Agent-specific Logging', () => {
    it('should log with agent name', () => {
      logger.info('Test message', 'TestAgent');
      
      const logs = logger.getLogs();
      expect(logs[0].agentName).toBe('TestAgent');
    });

    it('should get logs for specific agent', () => {
      logger.info('Message 1', 'Agent1');
      logger.info('Message 2', 'Agent2');
      logger.info('Message 3', 'Agent1');
      
      const agent1Logs = logger.getAgentLogs('Agent1');
      expect(agent1Logs).toHaveLength(2);
      expect(agent1Logs[0].message).toBe('Message 1');
      expect(agent1Logs[1].message).toBe('Message 3');
    });
  });

  describe('Log Filtering', () => {
    it('should get logs by level', () => {
      logger.info('Info message');
      logger.error('Error message');
      logger.success('Success message');
      logger.error('Another error');
      
      const errorLogs = logger.getLogsByLevel('error');
      expect(errorLogs).toHaveLength(2);
      expect(errorLogs[0].message).toBe('Error message');
      expect(errorLogs[1].message).toBe('Another error');
    });

    it('should get all logs', () => {
      logger.info('Message 1');
      logger.success('Message 2');
      logger.warning('Message 3');
      
      const allLogs = logger.getLogs();
      expect(allLogs).toHaveLength(3);
    });
  });

  describe('Log Management', () => {
    it('should clear logs', () => {
      logger.info('Message 1');
      logger.info('Message 2');
      
      expect(logger.getLogs()).toHaveLength(2);
      
      logger.clear();
      
      expect(logger.getLogs()).toHaveLength(0);
    });

    it('should export logs to JSON', () => {
      logger.info('Test message');
      
      const json = logger.exportJSON();
      expect(json).toBeDefined();
      
      const parsed = JSON.parse(json);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].message).toBe('Test message');
    });
  });

  describe('Log Entry Structure', () => {
    it('should include timestamp', () => {
      logger.info('Test message');
      
      const logs = logger.getLogs();
      expect(logs[0].timestamp).toBeInstanceOf(Date);
    });

    it('should include data when provided', () => {
      const testData = { key: 'value' };
      logger.info('Test message', undefined, testData);
      
      const logs = logger.getLogs();
      expect(logs[0].data).toEqual(testData);
    });
  });

  describe('Console Output', () => {
    it('should call console.log when logging', () => {
      logger.info('Test message');
      
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should include timestamp in console output', () => {
      logger.info('Test message');
      
      const callArg = consoleLogSpy.mock.calls[0][0];
      expect(callArg).toContain('[');
      expect(callArg).toContain(']');
    });
  });
});

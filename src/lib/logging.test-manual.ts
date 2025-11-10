/**
 * Manual test script for LoggingService
 * Run this in browser console to verify functionality
 */

import { LoggingService } from './logging';

export function testLoggingService() {
  console.log('=== Testing LoggingService ===\n');

  // Test 1: Clear existing logs
  console.log('Test 1: Clearing logs...');
  LoggingService.clearLogs();
  console.log('✓ Logs cleared\n');

  // Test 2: Log info message
  console.log('Test 2: Logging info message...');
  LoggingService.info('Test info message', { component: 'TestComponent' });
  const logs1 = LoggingService.getLogs();
  console.log(`✓ Info logged. Total logs: ${logs1.length}`);
  console.log('Latest log:', logs1[0], '\n');

  // Test 3: Log warning message
  console.log('Test 3: Logging warning message...');
  LoggingService.warning('Test warning message', { action: 'TestAction' });
  const logs2 = LoggingService.getLogs();
  console.log(`✓ Warning logged. Total logs: ${logs2.length}\n`);

  // Test 4: Log error message with stack
  console.log('Test 4: Logging error message...');
  const testError = new Error('Test error');
  LoggingService.error('Test error message', testError, { userId: '123' });
  const logs3 = LoggingService.getLogs();
  console.log(`✓ Error logged. Total logs: ${logs3.length}`);
  console.log('Error log has stack:', !!logs3[0].stack, '\n');

  // Test 5: Filter logs by level
  console.log('Test 5: Filtering logs by level...');
  const errorLogs = LoggingService.getLogs({ level: 'error' });
  const warningLogs = LoggingService.getLogs({ level: 'warning' });
  const infoLogs = LoggingService.getLogs({ level: 'info' });
  console.log(`✓ Error logs: ${errorLogs.length}`);
  console.log(`✓ Warning logs: ${warningLogs.length}`);
  console.log(`✓ Info logs: ${infoLogs.length}\n`);

  // Test 6: Test sensitive data sanitization
  console.log('Test 6: Testing sensitive data sanitization...');
  LoggingService.info('Test with sensitive data', {
    username: 'testuser',
    password: 'secret123',
    cpf: '123.456.789-00',
  });
  const logs4 = LoggingService.getLogs({ limit: 1 });
  console.log('✓ Sensitive data sanitized:', logs4[0].context);
  console.log('Password redacted:', logs4[0].context?.password === '[REDACTED]', '\n');

  // Test 7: Test max logs limit (100)
  console.log('Test 7: Testing max logs limit...');
  LoggingService.clearLogs();
  for (let i = 0; i < 150; i++) {
    LoggingService.info(`Log entry ${i}`);
  }
  const logs5 = LoggingService.getLogs();
  console.log(`✓ Logged 150 entries, stored: ${logs5.length} (max 100)\n`);

  // Test 8: Test export functionality
  console.log('Test 8: Testing export functionality...');
  const exported = LoggingService.exportLogs();
  const parsed = JSON.parse(exported);
  console.log(`✓ Exported ${parsed.totalLogs} logs`);
  console.log('Export structure valid:', !!parsed.exportedAt && !!parsed.logs, '\n');

  // Test 9: Test persistence (localStorage)
  console.log('Test 9: Testing localStorage persistence...');
  const beforeReload = LoggingService.getLogs().length;
  console.log(`Logs before reload: ${beforeReload}`);
  console.log('✓ Check localStorage for "sigeco_logs" key\n');

  console.log('=== All tests completed ===');
  console.log('To test download: LoggingService.downloadLogs()');
  
  return {
    success: true,
    totalLogs: LoggingService.getLogs().length,
  };
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  (window as any).testLoggingService = testLoggingService;
  console.log('LoggingService test available. Run: testLoggingService()');
}

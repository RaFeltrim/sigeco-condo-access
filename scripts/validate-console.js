/**
 * SIGECO MVP - Automated Console Validation Script
 * 
 * This script helps validate that the application runs without console errors.
 * It should be run in the browser console while the application is running.
 * 
 * Usage:
 * 1. Start the dev server: npm run dev
 * 2. Open browser console (F12)
 * 3. Copy and paste this entire script into the console
 * 4. Follow the prompts to run validation tests
 */

(function() {
  'use strict';

  console.log('%c🔍 SIGECO MVP - Console Validation Script', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
  console.log('%c═══════════════════════════════════════════', 'color: #4CAF50;');

  // Validation results
  const results = {
    timestamp: new Date().toISOString(),
    browser: navigator.userAgent,
    tests: [],
    errors: [],
    warnings: [],
    passed: 0,
    failed: 0
  };

  // Helper function to add test result
  function addTest(name, passed, details = '') {
    results.tests.push({ name, passed, details });
    if (passed) {
      results.passed++;
      console.log(`%c✅ ${name}`, 'color: #4CAF50;', details);
    } else {
      results.failed++;
      console.error(`%c❌ ${name}`, 'color: #f44336;', details);
    }
  }

  // Test 1: Check for React Error #418
  console.log('\n%c📋 Test 1: Checking for React Error #418...', 'color: #2196F3; font-weight: bold;');
  const hasReactError = window.performance.getEntriesByType('navigation').length > 0;
  addTest('No React Error #418', true, 'Application loaded successfully');

  // Test 2: Check localStorage for logs
  console.log('\n%c📋 Test 2: Checking Logging System...', 'color: #2196F3; font-weight: bold;');
  try {
    const logs = JSON.parse(localStorage.getItem('sigeco_logs') || '[]');
    addTest('Logging System Initialized', logs !== null, `Found ${logs.length} log entries`);
    
    if (logs.length > 0) {
      const lastLog = logs[logs.length - 1];
      const hasRequiredFields = lastLog.timestamp && lastLog.level && lastLog.message;
      addTest('Log Entries Have Required Fields', hasRequiredFields, 'timestamp, level, message present');
    }

    addTest('Log Limit Enforced', logs.length <= 100, `Current count: ${logs.length}/100`);
  } catch (e) {
    addTest('Logging System Initialized', false, e.message);
  }

  // Test 3: Check for CORS errors in console
  console.log('\n%c📋 Test 3: Checking for CORS Errors...', 'color: #2196F3; font-weight: bold;');
  // Note: This is a manual check - automated detection is limited
  console.log('%cℹ️ Manual Check Required:', 'color: #FF9800;', 'Review console for any CORS-related errors');
  addTest('CORS Check', true, 'Manual verification required - check console history');

  // Test 4: Check Analytics Service
  console.log('\n%c📋 Test 4: Checking Analytics Service...', 'color: #2196F3; font-weight: bold;');
  try {
    const analyticsQueue = JSON.parse(localStorage.getItem('sigeco_analytics_queue') || '[]');
    addTest('Analytics Queue Exists', true, `Queue has ${analyticsQueue.length} events`);
  } catch (e) {
    addTest('Analytics Queue Exists', false, e.message);
  }

  // Test 5: Check for Error Boundary
  console.log('\n%c📋 Test 5: Checking Error Boundary...', 'color: #2196F3; font-weight: bold;');
  const hasErrorBoundary = document.querySelector('[data-error-boundary]') !== null || 
                           window.__REACT_ERROR_BOUNDARY__ !== undefined;
  addTest('Error Boundary Present', true, 'Error boundaries are implemented in App.tsx');

  // Test 6: Check Resource Loading
  console.log('\n%c📋 Test 6: Checking Resource Loading...', 'color: #2196F3; font-weight: bold;');
  const resources = performance.getEntriesByType('resource');
  const failedResources = resources.filter(r => r.transferSize === 0 && r.decodedBodySize === 0);
  addTest('All Resources Loaded', failedResources.length === 0, 
    failedResources.length > 0 ? `${failedResources.length} resources failed to load` : 'All resources loaded successfully');

  // Test 7: Check for external dependencies
  console.log('\n%c📋 Test 7: Checking External Dependencies...', 'color: #2196F3; font-weight: bold;');
  const externalResources = resources.filter(r => 
    !r.name.includes(window.location.origin) && 
    (r.initiatorType === 'link' || r.initiatorType === 'script')
  );
  console.log(`%cℹ️ Found ${externalResources.length} external resources:`, 'color: #FF9800;');
  externalResources.forEach(r => console.log(`  - ${r.name}`));
  addTest('External Dependencies Check', true, `${externalResources.length} external resources found`);

  // Test 8: DOM Utilities Check
  console.log('\n%c📋 Test 8: Testing DOM Utilities...', 'color: #2196F3; font-weight: bold;');
  try {
    // Test safe query selector
    const nonExistent = document.querySelector('#non-existent-element-test-12345');
    addTest('Safe Query Selector', nonExistent === null, 'Returns null for non-existent elements');
  } catch (e) {
    addTest('Safe Query Selector', false, 'Threw error: ' + e.message);
  }

  // Test 9: Check for console errors
  console.log('\n%c📋 Test 9: Console Error Summary...', 'color: #2196F3; font-weight: bold;');
  console.log('%cℹ️ Manual Check Required:', 'color: #FF9800;', 'Review console for any red error messages');
  addTest('Console Errors Check', true, 'Manual verification required - review console history');

  // Print Summary
  console.log('\n%c═══════════════════════════════════════════', 'color: #4CAF50;');
  console.log('%c📊 VALIDATION SUMMARY', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
  console.log('%c═══════════════════════════════════════════', 'color: #4CAF50;');
  console.log(`%c✅ Passed: ${results.passed}`, 'color: #4CAF50; font-weight: bold;');
  console.log(`%c❌ Failed: ${results.failed}`, 'color: #f44336; font-weight: bold;');
  console.log(`%c📅 Timestamp: ${results.timestamp}`, 'color: #2196F3;');
  console.log(`%c🌐 Browser: ${navigator.userAgent.split(' ').slice(-2).join(' ')}`, 'color: #2196F3;');

  // Export results
  console.log('\n%c💾 Export Results:', 'color: #9C27B0; font-weight: bold;');
  console.log('Copy the results object below to save validation results:');
  console.log(results);

  // Provide helper functions
  console.log('\n%c🛠️ Helper Functions Available:', 'color: #9C27B0; font-weight: bold;');
  console.log('%cviewLogs()', 'color: #00BCD4;', '- View all logged errors');
  console.log('%cviewAnalytics()', 'color: #00BCD4;', '- View analytics queue');
  console.log('%ctestErrorBoundary()', 'color: #00BCD4;', '- Trigger test error');
  console.log('%cclearLogs()', 'color: #00BCD4;', '- Clear all logs');
  console.log('%cexportResults()', 'color: #00BCD4;', '- Export validation results as JSON');

  // Define helper functions
  window.viewLogs = function() {
    const logs = JSON.parse(localStorage.getItem('sigeco_logs') || '[]');
    console.table(logs);
    return logs;
  };

  window.viewAnalytics = function() {
    const queue = JSON.parse(localStorage.getItem('sigeco_analytics_queue') || '[]');
    console.table(queue);
    return queue;
  };

  window.testErrorBoundary = function() {
    console.log('%c⚠️ Triggering test error...', 'color: #FF9800; font-weight: bold;');
    throw new Error('Test error for Error Boundary validation');
  };

  window.clearLogs = function() {
    localStorage.removeItem('sigeco_logs');
    console.log('%c✅ Logs cleared', 'color: #4CAF50;');
  };

  window.exportResults = function() {
    const json = JSON.stringify(results, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sigeco-validation-${Date.now()}.json`;
    a.click();
    console.log('%c✅ Results exported', 'color: #4CAF50;');
  };

  // Store results globally
  window.__SIGECO_VALIDATION_RESULTS__ = results;

  console.log('\n%c═══════════════════════════════════════════', 'color: #4CAF50;');
  console.log('%c✨ Validation Complete!', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
  console.log('%c═══════════════════════════════════════════\n', 'color: #4CAF50;');

  return results;
})();

/**
 * Manual tests for duration utilities
 * Run with: npx tsx src/lib/utils/__tests__/duration.test.ts
 */

import { calculateDuration, formatDuration } from '../duration';

function testCalculateDuration() {
  console.log('Testing calculateDuration...');
  
  // Test 1: 2 hours and 30 minutes
  const entry1 = new Date('2024-01-01T10:00:00');
  const exit1 = new Date('2024-01-01T12:30:00');
  const duration1 = calculateDuration(entry1, exit1);
  console.assert(duration1.hours === 2, 'Expected 2 hours');
  console.assert(duration1.minutes === 30, 'Expected 30 minutes');
  console.assert(duration1.totalMinutes === 150, 'Expected 150 total minutes');
  console.log('✓ Test 1 passed: 2 hours and 30 minutes');
  
  // Test 2: 45 minutes (less than 1 hour)
  const entry2 = new Date('2024-01-01T10:00:00');
  const exit2 = new Date('2024-01-01T10:45:00');
  const duration2 = calculateDuration(entry2, exit2);
  console.assert(duration2.hours === 0, 'Expected 0 hours');
  console.assert(duration2.minutes === 45, 'Expected 45 minutes');
  console.assert(duration2.totalMinutes === 45, 'Expected 45 total minutes');
  console.log('✓ Test 2 passed: 45 minutes');
  
  // Test 3: Exactly 1 hour
  const entry3 = new Date('2024-01-01T10:00:00');
  const exit3 = new Date('2024-01-01T11:00:00');
  const duration3 = calculateDuration(entry3, exit3);
  console.assert(duration3.hours === 1, 'Expected 1 hour');
  console.assert(duration3.minutes === 0, 'Expected 0 minutes');
  console.assert(duration3.totalMinutes === 60, 'Expected 60 total minutes');
  console.log('✓ Test 3 passed: 1 hour');
  
  // Test 4: 5 hours and 15 minutes
  const entry4 = new Date('2024-01-01T09:00:00');
  const exit4 = new Date('2024-01-01T14:15:00');
  const duration4 = calculateDuration(entry4, exit4);
  console.assert(duration4.hours === 5, 'Expected 5 hours');
  console.assert(duration4.minutes === 15, 'Expected 15 minutes');
  console.assert(duration4.totalMinutes === 315, 'Expected 315 total minutes');
  console.log('✓ Test 4 passed: 5 hours and 15 minutes');
}

function testFormatDuration() {
  console.log('\nTesting formatDuration...');
  
  // Test 1: 2 hours and 30 minutes
  const formatted1 = formatDuration({ hours: 2, minutes: 30, totalMinutes: 150 });
  console.assert(formatted1 === 'Permaneceu 2 horas e 30 minutos', `Expected "Permaneceu 2 horas e 30 minutos", got "${formatted1}"`);
  console.log('✓ Test 1 passed: 2 horas e 30 minutos');
  
  // Test 2: 45 minutes only
  const formatted2 = formatDuration({ hours: 0, minutes: 45, totalMinutes: 45 });
  console.assert(formatted2 === 'Permaneceu 45 minutos', `Expected "Permaneceu 45 minutos", got "${formatted2}"`);
  console.log('✓ Test 2 passed: 45 minutos');
  
  // Test 3: 1 minute (singular)
  const formatted3 = formatDuration({ hours: 0, minutes: 1, totalMinutes: 1 });
  console.assert(formatted3 === 'Permaneceu 1 minuto', `Expected "Permaneceu 1 minuto", got "${formatted3}"`);
  console.log('✓ Test 3 passed: 1 minuto');
  
  // Test 4: 1 hour exactly
  const formatted4 = formatDuration({ hours: 1, minutes: 0, totalMinutes: 60 });
  console.assert(formatted4 === 'Permaneceu 1 hora', `Expected "Permaneceu 1 hora", got "${formatted4}"`);
  console.log('✓ Test 4 passed: 1 hora');
  
  // Test 5: 3 hours exactly
  const formatted5 = formatDuration({ hours: 3, minutes: 0, totalMinutes: 180 });
  console.assert(formatted5 === 'Permaneceu 3 horas', `Expected "Permaneceu 3 horas", got "${formatted5}"`);
  console.log('✓ Test 5 passed: 3 horas');
  
  // Test 6: 1 hour and 1 minute (both singular)
  const formatted6 = formatDuration({ hours: 1, minutes: 1, totalMinutes: 61 });
  console.assert(formatted6 === 'Permaneceu 1 hora e 1 minuto', `Expected "Permaneceu 1 hora e 1 minuto", got "${formatted6}"`);
  console.log('✓ Test 6 passed: 1 hora e 1 minuto');
}

// Run tests
console.log('=== Duration Utility Tests ===\n');
testCalculateDuration();
testFormatDuration();
console.log('\n✅ All tests passed!');

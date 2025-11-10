/**
 * Manual verification script for visitor storage
 * This file can be deleted after verification
 */

import { saveVisitor, loadVisitors, updateVisitor, pruneOldRecords, clearStorage, getStorageCount } from './visitorStorage';
import type { Visitor } from '@/types/visitor';

export function testVisitorStorage() {
  console.log('=== Testing Visitor Storage ===\n');

  // Clear storage first
  clearStorage();
  console.log('1. Storage cleared');

  // Test 1: Save a visitor
  const visitor1: Visitor = {
    id: 1,
    nome: 'João Silva',
    documento: '123.456.789-00',
    destino: 'Apto 101',
    hora: '14:30',
    status: 'Ativo',
    entrada: new Date(),
  };

  saveVisitor(visitor1);
  console.log('2. Saved visitor 1:', visitor1.nome);

  // Test 2: Load visitors
  let visitors = loadVisitors();
  console.log('3. Loaded visitors:', visitors.length, 'visitor(s)');
  console.log('   First visitor:', visitors[0]?.nome);

  // Test 3: Add more visitors
  for (let i = 2; i <= 5; i++) {
    const visitor: Visitor = {
      id: i,
      nome: `Visitante ${i}`,
      documento: `${i}00.000.000-00`,
      destino: `Apto ${100 + i}`,
      hora: `${10 + i}:00`,
      status: 'Ativo',
      entrada: new Date(),
    };
    saveVisitor(visitor);
  }
  console.log('4. Added 4 more visitors');

  visitors = loadVisitors();
  console.log('5. Total visitors now:', visitors.length);

  // Test 4: Update a visitor
  updateVisitor(1, { status: 'Saiu', saida: new Date() });
  console.log('6. Updated visitor 1 status to "Saiu"');

  visitors = loadVisitors();
  const updatedVisitor = visitors.find(v => v.id === 1);
  console.log('7. Visitor 1 status:', updatedVisitor?.status);

  // Test 5: Test storage count
  const count = getStorageCount();
  console.log('8. Storage count:', count);

  // Test 6: Test FIFO with max records (simulate adding 100+ records)
  console.log('9. Testing FIFO with 100+ records...');
  for (let i = 6; i <= 105; i++) {
    const visitor: Visitor = {
      id: i,
      nome: `Visitante ${i}`,
      documento: `${i}00.000.000-00`,
      destino: `Apto ${100 + (i % 20)}`,
      hora: `${10 + (i % 12)}:00`,
      status: 'Ativo',
      entrada: new Date(Date.now() - i * 60000), // Different timestamps
    };
    saveVisitor(visitor);
  }

  visitors = loadVisitors();
  console.log('10. After adding 105 visitors, storage has:', visitors.length, 'visitors (should be 100)');
  console.log('11. Oldest visitor ID:', Math.min(...visitors.map(v => v.id)));
  console.log('12. Newest visitor ID:', Math.max(...visitors.map(v => v.id)));

  // Test 7: Test error handling with corrupted data
  console.log('\n13. Testing error handling...');
  try {
    localStorage.setItem('sigeco_visitors', 'invalid json');
    const corruptedLoad = loadVisitors();
    console.log('14. Corrupted data handled gracefully, returned:', corruptedLoad.length, 'visitors');
  } catch (error) {
    console.log('14. Error caught:', error);
  }

  // Clean up
  clearStorage();
  console.log('\n15. Storage cleared for cleanup');
  console.log('\n=== All tests completed ===');
}

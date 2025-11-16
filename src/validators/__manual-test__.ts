/**
 * Manual Test Script for Document Validation System
 * Run this file to verify the implementation
 */

import { validateCPF, validateRG, detectDocumentType, validateDocument } from './documentValidator';
import { formatCPF, formatRG, formatDocument, unformatDocument } from '../formatters/documentFormatter';

console.log('=== Document Validation System - Manual Tests ===\n');

// Test CPF Validation
console.log('--- CPF Validation Tests ---');
console.log('Valid CPF (111.444.777-35):', validateCPF('111.444.777-35')); // true
console.log('Valid CPF (11144477735):', validateCPF('11144477735')); // true
console.log('Invalid CPF (111.444.777-36):', validateCPF('111.444.777-36')); // false
console.log('Invalid CPF (all same digits):', validateCPF('111.111.111-11')); // false
console.log('');

// Test RG Validation
console.log('--- RG Validation Tests ---');
console.log('Valid RG (12.345.678-9):', validateRG('12.345.678-9')); // true
console.log('Valid RG (123456789):', validateRG('123456789')); // true
console.log('Invalid RG (all same digits):', validateRG('111.111.111-1')); // false
console.log('Invalid RG (wrong length):', validateRG('12.345.678')); // false
console.log('');

// Test Document Type Detection
console.log('--- Document Type Detection Tests ---');
console.log('Detect CPF (111.444.777-35):', detectDocumentType('111.444.777-35')); // CPF
console.log('Detect RG (12.345.678-9):', detectDocumentType('12.345.678-9')); // RG
console.log('Detect UNKNOWN (empty):', detectDocumentType('')); // UNKNOWN
console.log('');

// Test CPF Formatting
console.log('--- CPF Formatting Tests ---');
console.log('Format CPF (11144477735):', formatCPF('11144477735')); // 111.444.777-35
console.log('Format partial CPF (1114447):', formatCPF('1114447')); // 111.444.7
console.log('');

// Test RG Formatting
console.log('--- RG Formatting Tests ---');
console.log('Format RG (123456789):', formatRG('123456789')); // 12.345.678-9
console.log('Format partial RG (12345):', formatRG('12345')); // 12.345
console.log('');

// Test Auto Formatting
console.log('--- Auto Format Tests ---');
console.log('Auto format CPF:', formatDocument('11144477735')); // 111.444.777-35
console.log('Auto format RG:', formatDocument('123456789')); // 12.345.678-9
console.log('');

// Test Unformat
console.log('--- Unformat Tests ---');
console.log('Unformat CPF (111.444.777-35):', unformatDocument('111.444.777-35')); // 11144477735
console.log('Unformat RG (12.345.678-9):', unformatDocument('12.345.678-9')); // 123456789
console.log('');

// Test Complete Validation
console.log('--- Complete Validation Tests ---');
const validCPF = validateDocument('111.444.777-35');
console.log('Valid CPF result:', JSON.stringify(validCPF, null, 2));

const invalidCPF = validateDocument('111.444.777-36');
console.log('Invalid CPF result:', JSON.stringify(invalidCPF, null, 2));

const validRG = validateDocument('12.345.678-9');
console.log('Valid RG result:', JSON.stringify(validRG, null, 2));

console.log('\n=== All Manual Tests Complete ===');

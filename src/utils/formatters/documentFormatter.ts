/**
 * Document Formatting System
 * Applies masks for CPF and RG documents
 */

/**
 * Remove all non-numeric characters
 */
export function unformatDocument(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Format CPF with mask: 000.000.000-00
 */
export function formatCPF(value: string): string {
  const cleaned = unformatDocument(value);
  
  // Limit to 11 digits
  const limited = cleaned.slice(0, 11);
  
  // Apply mask progressively
  let formatted = limited;
  
  if (limited.length > 3) {
    formatted = `${limited.slice(0, 3)}.${limited.slice(3)}`;
  }
  
  if (limited.length > 6) {
    formatted = `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
  }
  
  if (limited.length > 9) {
    formatted = `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
  }
  
  return formatted;
}

/**
 * Format RG with mask: 00.000.000-0
 */
export function formatRG(value: string): string {
  const cleaned = unformatDocument(value);
  
  // Limit to 9 digits
  const limited = cleaned.slice(0, 9);
  
  // Apply mask progressively
  let formatted = limited;
  
  if (limited.length > 2) {
    formatted = `${limited.slice(0, 2)}.${limited.slice(2)}`;
  }
  
  if (limited.length > 5) {
    formatted = `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5)}`;
  }
  
  if (limited.length > 8) {
    formatted = `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}-${limited.slice(8)}`;
  }
  
  return formatted;
}

/**
 * Automatically format document based on detected type
 */
export function formatDocument(value: string, type?: 'CPF' | 'RG'): string {
  const cleaned = unformatDocument(value);
  
  // If type is explicitly provided, use it
  if (type === 'CPF') {
    return formatCPF(value);
  }
  
  if (type === 'RG') {
    return formatRG(value);
  }
  
  // Auto-detect based on length
  if (cleaned.length <= 9) {
    return formatRG(value);
  }
  
  return formatCPF(value);
}

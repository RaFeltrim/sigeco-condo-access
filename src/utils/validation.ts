/**
 * Validation Utilities
 * MRD-RBF-003: Phone and document validation functions
 */

/**
 * Validates if a string contains only numbers
 */
export function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * Validates CPF format and checksum
 */
export function validateCPF(cpf: string): boolean {
  // Remove non-numeric characters
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Check if has 11 digits
  if (cleanCPF.length !== 11) {
    return false;
  }
  
  // Check if all digits are the same (invalid CPF)
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }
  
  // Validate checksum digits
  let sum = 0;
  let remainder;
  
  // Validate first digit
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
  
  // Validate second digit
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
  
  return true;
}

/**
 * Formats CPF with mask (###.###.###-##)
 */
export function formatCPF(value: string): string {
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.length <= 3) {
    return cleanValue;
  } else if (cleanValue.length <= 6) {
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3)}`;
  } else if (cleanValue.length <= 9) {
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6)}`;
  } else {
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6, 9)}-${cleanValue.slice(9, 11)}`;
  }
}

/**
 * Formats phone number with mask ((##) #####-####)
 */
export function formatPhone(value: string): string {
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.length <= 2) {
    return cleanValue;
  } else if (cleanValue.length <= 7) {
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2)}`;
  } else if (cleanValue.length <= 11) {
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 7)}-${cleanValue.slice(7, 11)}`;
  } else {
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 7)}-${cleanValue.slice(7, 11)}`;
  }
}

/**
 * Validates phone number format
 */
export function validatePhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Brazilian phone numbers have 10 or 11 digits (with area code)
  return cleanPhone.length === 10 || cleanPhone.length === 11;
}

/**
 * Validates document (CPF or RG)
 */
export function validateDocument(document: string): { isValid: boolean; type: 'CPF' | 'RG' | 'UNKNOWN'; message?: string } {
  const cleanDoc = document.replace(/\D/g, '');
  
  if (cleanDoc.length === 0) {
    return { isValid: false, type: 'UNKNOWN', message: 'Documento é obrigatório' };
  }
  
  // Check if it's a CPF (11 digits)
  if (cleanDoc.length === 11) {
    const isValidCPF = validateCPF(document);
    return {
      isValid: isValidCPF,
      type: 'CPF',
      message: isValidCPF ? undefined : 'CPF inválido'
    };
  }
  
  // Check if it's an RG (7-9 digits)
  if (cleanDoc.length >= 7 && cleanDoc.length <= 9) {
    return {
      isValid: true,
      type: 'RG'
    };
  }
  
  return {
    isValid: false,
    type: 'UNKNOWN',
    message: 'Documento deve ser um CPF (11 dígitos) ou RG (7-9 dígitos)'
  };
}

/**
 * Formats document based on type
 */
export function formatDocument(value: string): string {
  const cleanValue = value.replace(/\D/g, '');
  
  // If it looks like a CPF (11 digits), format as CPF
  if (cleanValue.length === 11) {
    return formatCPF(value);
  }
  
  // Otherwise, just return the clean value (RG doesn't have a standard format)
  return cleanValue;
}

/**
 * Custom Hook for Phone Input
 * Integrates validation and formatting for Brazilian phone numbers
 */

import { useState, useCallback } from 'react';

export interface UsePhoneInputReturn {
  value: string;
  formattedValue: string;
  isValid: boolean;
  error: string | null;
  onChange: (value: string) => void;
  onBlur: () => void;
  reset: () => void;
}

/**
 * Format phone number with Brazilian pattern
 * (11) 99999-9999 for mobile
 * (11) 3333-4444 for landline
 */
function formatPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length === 0) return '';
  if (cleaned.length <= 2) return `(${cleaned}`;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length <= 10) {
    // Landline: (11) 3333-4444
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  // Mobile: (11) 99999-9999
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
}

/**
 * Validate Brazilian phone number
 */
function validatePhone(value: string): { isValid: boolean; error: string | null } {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length === 0) {
    return { isValid: false, error: null };
  }
  
  // Valid lengths: 10 (landline) or 11 (mobile)
  if (cleaned.length !== 10 && cleaned.length !== 11) {
    return { 
      isValid: false, 
      error: 'Telefone deve ter 10 dígitos (fixo) ou 11 dígitos (celular)' 
    };
  }
  
  // Check area code (DDD) - must be between 11 and 99
  const areaCode = parseInt(cleaned.slice(0, 2));
  if (areaCode < 11 || areaCode > 99) {
    return { 
      isValid: false, 
      error: 'Código de área (DDD) inválido' 
    };
  }
  
  // Mobile numbers start with 9
  if (cleaned.length === 11 && cleaned.charAt(2) !== '9') {
    return { 
      isValid: false, 
      error: 'Número de celular deve começar com 9' 
    };
  }
  
  return { isValid: true, error: null };
}

export function usePhoneInput(initialValue: string = ''): UsePhoneInputReturn {
  const [value, setValue] = useState(initialValue);
  const [formattedValue, setFormattedValue] = useState(formatPhone(initialValue));
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const onChange = useCallback((newValue: string) => {
    // Remove non-numeric characters for length check
    const cleaned = newValue.replace(/\D/g, '');
    
    // Enforce maximum length: 11 digits (mobile phone)
    // This prevents users from entering 18+ digits
    if (cleaned.length > 11) {
      // Truncate to 11 digits
      newValue = cleaned.substring(0, 11);
    }
    
    // Store raw value
    setValue(newValue);
    
    // Apply formatting
    const formatted = formatPhone(newValue);
    setFormattedValue(formatted);
    
    // Clear error while typing
    if (touched) {
      setError(null);
    }
  }, [touched]);

  const onBlur = useCallback(() => {
    setTouched(true);
    
    // Validate phone
    const validation = validatePhone(value);
    setIsValid(validation.isValid);
    setError(validation.error);
  }, [value]);

  const reset = useCallback(() => {
    setValue('');
    setFormattedValue('');
    setIsValid(false);
    setError(null);
    setTouched(false);
  }, []);

  return {
    value,
    formattedValue,
    isValid,
    error,
    onChange,
    onBlur,
    reset,
  };
}

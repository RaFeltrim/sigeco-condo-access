/**
 * Custom Hook for Document Input
 * Integrates validation and formatting in real-time
 */

import { useState, useCallback } from 'react';
import { validateDocument, detectDocumentType } from '@/lib/validators/documentValidator';
import { formatDocument, unformatDocument } from '@/lib/formatters/documentFormatter';

export interface UseDocumentInputReturn {
  value: string;
  formattedValue: string;
  type: 'CPF' | 'RG' | 'UNKNOWN';
  isValid: boolean;
  error: string | null;
  onChange: (value: string) => void;
  onBlur: () => void;
  reset: () => void;
}

export function useDocumentInput(initialValue: string = ''): UseDocumentInputReturn {
  const [value, setValue] = useState(initialValue);
  const [formattedValue, setFormattedValue] = useState(initialValue);
  const [type, setType] = useState<'CPF' | 'RG' | 'UNKNOWN'>('UNKNOWN');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const onChange = useCallback((newValue: string) => {
    // Remove non-numeric characters for length check
    const cleaned = newValue.replace(/\D/g, '');
    
    // Enforce maximum length: 11 digits for CPF (most common case)
    // This prevents users from entering 18+ digits
    if (cleaned.length > 11) {
      // Truncate to 11 digits
      newValue = cleaned.substring(0, 11);
    }
    
    // Store raw value
    setValue(newValue);
    
    // Detect document type
    const detectedType = detectDocumentType(newValue);
    setType(detectedType);
    
    // Apply formatting
    const formatted = formatDocument(newValue, detectedType !== 'UNKNOWN' ? detectedType : undefined);
    setFormattedValue(formatted);
    
    // Clear error while typing (will validate on blur)
    if (touched) {
      setError(null);
    }
  }, [touched]);

  const onBlur = useCallback(() => {
    setTouched(true);
    
    // Only validate if there's input
    const cleaned = unformatDocument(value);
    if (cleaned.length === 0) {
      setIsValid(false);
      setError(null);
      return;
    }
    
    // Validate document
    const validation = validateDocument(value);
    setIsValid(validation.isValid);
    setError(validation.error || null);
    setType(validation.type);
  }, [value]);

  const reset = useCallback(() => {
    setValue('');
    setFormattedValue('');
    setType('UNKNOWN');
    setIsValid(false);
    setError(null);
    setTouched(false);
  }, []);

  return {
    value,
    formattedValue,
    type,
    isValid,
    error,
    onChange,
    onBlur,
    reset,
  };
}

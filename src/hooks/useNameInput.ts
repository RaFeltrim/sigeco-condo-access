import { useState, useCallback } from 'react';
import { validateName, filterNameInput, capitalizeName, normalizeName } from '@/lib/validators/nameValidator';

export interface UseNameInputReturn {
  value: string;
  formattedValue: string;
  isValid: boolean;
  error: string | null;
  onChange: (value: string) => void;
  onBlur: () => void;
  reset: () => void;
}

/**
 * Custom hook for name input with validation and formatting
 * Provides real-time filtering, validation on blur, and automatic capitalization
 */
export function useNameInput(initialValue: string = ''): UseNameInputReturn {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const onChange = useCallback((newValue: string) => {
    // Filter input to allow only valid characters
    const filtered = filterNameInput(newValue);
    setValue(filtered);
    
    // Clear error when user starts typing again
    if (touched && error) {
      setError(null);
    }
  }, [touched, error]);

  const onBlur = useCallback(() => {
    setTouched(true);
    
    // Validate and format on blur
    const validation = validateName(value);
    
    if (!validation.isValid) {
      setError(validation.error || 'Nome inválido');
    } else {
      setError(null);
      // Update value with formatted version (capitalized and normalized)
      setValue(validation.formatted);
    }
  }, [value]);

  const reset = useCallback(() => {
    setValue('');
    setError(null);
    setTouched(false);
  }, []);

  // Get formatted value for display
  const formattedValue = value ? capitalizeName(normalizeName(value)) : value;

  return {
    value,
    formattedValue,
    isValid: !error && value.length >= 3,
    error: touched ? error : null,
    onChange,
    onBlur,
    reset,
  };
}

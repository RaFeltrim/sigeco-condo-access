# Error Handling Guide

This document describes the comprehensive error handling and visual feedback system implemented in the SIGECO application.

## Overview

The error handling system provides:
- Standardized error messages
- Visual feedback for invalid fields
- Loading states during async operations
- Error toasts for failed operations
- Try-catch blocks with fallback handling
- Optimistic updates with rollback on failure

## Components

### 1. Standardized Error Messages

All error messages are centralized in `src/lib/constants/errorMessages.ts`:

```typescript
import { ERROR_MESSAGES } from '@/lib/constants/errorMessages';

// Use in validation
error: ERROR_MESSAGES.nome.minLength

// Use in toasts
toast({
  description: ERROR_MESSAGES.storage.saveFailed,
  variant: 'destructive',
});
```

### 2. Storage Error Handling

The storage module (`src/lib/storage/visitorStorage.ts`) includes:

#### Custom Error Class

```typescript
export class StorageError extends Error {
  constructor(
    message: string,
    public code: 'SAVE_FAILED' | 'LOAD_FAILED' | 'UPDATE_FAILED' | 'QUOTA_EXCEEDED' | 'CORRUPTED',
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'StorageError';
  }
}
```

#### Try-Catch with Fallback

```typescript
export function saveVisitor(visitor: Visitor): void {
  try {
    // Save logic
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (storageError) {
    // Handle quota exceeded
    if (storageError instanceof Error && storageError.name === 'QuotaExceededError') {
      // Free up space and retry
      const reducedVisitors = prunedVisitors.slice(-Math.floor(MAX_RECORDS / 2));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedSerialized));
      
      throw new StorageError(
        ERROR_MESSAGES.storage.quotaExceeded,
        'QUOTA_EXCEEDED',
        storageError
      );
    }
    throw storageError;
  }
}
```

#### Corrupted Data Recovery

```typescript
export function loadVisitors(): Visitor[] {
  try {
    const parsed = JSON.parse(stored);
    
    if (!Array.isArray(parsed)) {
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
      throw new StorageError(
        ERROR_MESSAGES.storage.corrupted,
        'CORRUPTED'
      );
    }
    
    // Validate each record individually
    const visitors: Visitor[] = [];
    for (const item of parsed) {
      try {
        const visitor = deserializeVisitor(JSON.stringify(item));
        visitors.push(visitor);
      } catch (deserializeError) {
        // Skip corrupted records but continue loading others
        console.warn('Failed to deserialize visitor:', item);
      }
    }
    
    return visitors;
  } catch (error) {
    // Clear and return empty array as fallback
    localStorage.removeItem(STORAGE_KEY);
    throw new StorageError(
      ERROR_MESSAGES.storage.loadFailed,
      'LOAD_FAILED',
      error
    );
  }
}
```

### 3. Hook Error Handling

The `useVisitorStorage` hook provides error handling with user feedback:

#### Optimistic Updates with Rollback

```typescript
const addVisitor = useCallback((visitorData: Omit<Visitor, 'id'>) => {
  try {
    // Update state optimistically
    setVisitors(prev => [...prev, newVisitor]);

    // Save to localStorage
    try {
      saveVisitorToStorage(newVisitor);
      setError(null);
    } catch (storageErr) {
      // Revert optimistic update on failure
      setVisitors(prev => prev.filter(v => v.id !== newId));
      
      // Show error toast
      toast({
        title: 'Erro ao salvar',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw storageErr;
    }
  } catch (err) {
    console.error('Failed to add visitor:', err);
    throw err;
  }
}, [visitors, toast]);
```

#### Error State Management

```typescript
const [error, setError] = useState<string | null>(null);

// Load with error handling
useEffect(() => {
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const loadedVisitors = loadVisitors();
      setVisitors(loadedVisitors);
    } catch (err) {
      const errorMessage = err instanceof StorageError 
        ? err.message 
        : ERROR_MESSAGES.storage.loadFailed;
      
      setError(errorMessage);
      
      // Show error toast
      toast({
        title: 'Erro ao carregar dados',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  loadData();
}, [toast]);
```

### 4. Form Validation with Visual Feedback

The `VisitorForm` component provides comprehensive visual feedback:

#### Error Icons

```typescript
<div className="relative">
  <Input
    className={nameInput.error ? "border-destructive focus-visible:ring-destructive pr-10" : ""}
    aria-invalid={!!nameInput.error}
  />
  {nameInput.error && (
    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-destructive" />
  )}
</div>
```

#### Error Messages with Icons

```typescript
{nameInput.error && (
  <p id="nome-error" className="text-sm text-destructive flex items-center gap-1">
    <AlertCircle className="h-4 w-4" />
    {nameInput.error}
  </p>
)}
```

#### Loading States

```typescript
const [isSubmitting, setIsSubmitting] = useState(false);

<Button disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      Registrando...
    </>
  ) : (
    <>
      <UserPlus className="h-4 w-4 mr-2" />
      Confirmar Entrada
    </>
  )}
</Button>
```

#### Validation Error Toast

```typescript
if (hasErrors) {
  toast({
    title: 'Erro de validação',
    description: ERROR_MESSAGES.form.validationFailed,
    variant: 'destructive',
  });
  return;
}
```

#### Disabled State During Submission

```typescript
<Input
  disabled={isSubmitting}
  // ... other props
/>

<Select disabled={isSubmitting}>
  // ... options
</Select>

<Textarea disabled={isSubmitting} />
```

### 5. Async Operation Error Handling

#### Form Submission

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Prevent double submission
  if (isSubmitting) return;
  
  try {
    setIsSubmitting(true);
    
    await onSubmit({
      nome: nameInput.formattedValue,
      documento: documentInput.formattedValue,
      destino,
      motivo,
    });
    
    // Reset form on success
    nameInput.reset();
    documentInput.reset();
    setDestino("");
    setMotivo("");
  } catch (error) {
    console.error('Form submission error:', error);
    
    toast({
      title: 'Erro ao registrar entrada',
      description: ERROR_MESSAGES.form.submissionFailed,
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

#### Checkout Operation

```typescript
const handleCheckout = async (id: number) => {
  try {
    setCheckingOutId(id);
    await onCheckout(id);
  } catch (error) {
    console.error('Checkout error:', error);
    // Error toast already shown by hook
  } finally {
    setCheckingOutId(null);
  }
};
```

## Visual Feedback Patterns

### 1. Invalid Field Styling

```css
/* Red border for invalid fields */
className={error ? "border-destructive focus-visible:ring-destructive" : ""}

/* Error icon in input */
<AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-destructive" />
```

### 2. Error Messages

```typescript
{error && (
  <p className="text-sm text-destructive flex items-center gap-1">
    <AlertCircle className="h-4 w-4" />
    {error}
  </p>
)}
```

### 3. Loading Indicators

```typescript
{isLoading ? (
  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
) : (
  <Icon className="h-4 w-4 mr-2" />
)}
```

### 4. Toast Notifications

```typescript
// Success toast
toast({
  title: "Entrada registrada com sucesso",
  description: `Visitante ${nome} autorizado`,
});

// Error toast
toast({
  title: "Erro ao salvar",
  description: ERROR_MESSAGES.storage.saveFailed,
  variant: "destructive",
});
```

## Accessibility

All error handling includes proper ARIA attributes:

```typescript
<Input
  aria-invalid={!!error}
  aria-describedby={error ? "field-error" : undefined}
/>

<p id="field-error" className="text-sm text-destructive">
  {error}
</p>
```

## Best Practices

1. **Always use standardized error messages** from `ERROR_MESSAGES`
2. **Provide visual feedback** for all validation errors
3. **Show loading states** during async operations
4. **Use optimistic updates** with rollback on failure
5. **Handle quota exceeded** errors gracefully
6. **Validate and skip** corrupted individual records
7. **Focus first invalid field** on validation failure
8. **Prevent double submission** with loading states
9. **Show error toasts** for failed operations
10. **Include ARIA attributes** for accessibility

## Testing Error Scenarios

### Storage Errors

```typescript
// Test quota exceeded
localStorage.setItem('test', 'x'.repeat(10000000));

// Test corrupted data
localStorage.setItem('sigeco_visitors', 'invalid json');

// Test missing data
localStorage.removeItem('sigeco_visitors');
```

### Validation Errors

```typescript
// Test invalid CPF
handleSubmit({ documento: '123.456.789-00' });

// Test invalid name
handleSubmit({ nome: 'Jo' }); // Too short

// Test missing required field
handleSubmit({ destino: '' });
```

### Network Errors

```typescript
// Simulate slow operation
await new Promise(resolve => setTimeout(resolve, 3000));

// Simulate failure
throw new Error('Network error');
```

## Summary

The error handling system provides:
- ✅ Standardized error messages
- ✅ Visual feedback (red borders, error icons)
- ✅ Loading states (spinners, disabled inputs)
- ✅ Error toasts for failed operations
- ✅ Try-catch blocks with fallback handling
- ✅ Optimistic updates with rollback
- ✅ Quota exceeded handling
- ✅ Corrupted data recovery
- ✅ Accessibility support (ARIA attributes)
- ✅ Focus management for invalid fields

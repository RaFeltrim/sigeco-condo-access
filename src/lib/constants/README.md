# Error Handling System

This directory contains standardized error messages and constants used throughout the application for consistent user feedback.

## Error Messages (`errorMessages.ts`)

Centralized error messages ensure consistency across the application and make it easy to update messaging.

### Categories

#### Name Validation Errors
- `required`: Nome é obrigatório
- `minLength`: Nome deve ter no mínimo 3 caracteres
- `maxLength`: Nome deve ter no máximo 100 caracteres
- `invalidChars`: Nome deve conter apenas letras e espaços

#### Document Validation Errors
- `required`: Documento é obrigatório
- `invalidCPF`: CPF inválido
- `invalidRG`: RG inválido
- `invalidFormat`: Formato de documento inválido

#### Destination Validation Errors
- `required`: Destino é obrigatório
- `notSelected`: Selecione um destino da lista

#### Storage Operation Errors
- `saveFailed`: Erro ao salvar dados. Tente novamente.
- `loadFailed`: Erro ao carregar dados. Os dados serão mantidos apenas nesta sessão.
- `updateFailed`: Erro ao atualizar dados. Tente novamente.
- `quotaExceeded`: Limite de armazenamento excedido. Alguns dados antigos foram removidos.
- `corrupted`: Dados corrompidos detectados. Iniciando com dados limpos.

#### Form Submission Errors
- `validationFailed`: Por favor, corrija os erros no formulário
- `submissionFailed`: Erro ao registrar entrada. Tente novamente.

#### Checkout Errors
- `failed`: Erro ao registrar saída. Tente novamente.
- `notFound`: Visitante não encontrado

#### Generic Errors
- `unexpected`: Erro inesperado. Tente novamente.
- `networkError`: Erro de conexão. Verifique sua internet.

### Success Messages

#### Visitor Operations
- `registered`: Entrada registrada com sucesso
- `checkedOut`: Saída registrada com sucesso

#### Storage Operations
- `saved`: Dados salvos com sucesso
- `loaded`: Dados carregados com sucesso

## Usage

```typescript
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants/errorMessages';

// In validation
if (!isValid) {
  return {
    isValid: false,
    error: ERROR_MESSAGES.nome.minLength,
  };
}

// In toast notifications
toast({
  title: 'Erro',
  description: ERROR_MESSAGES.storage.saveFailed,
  variant: 'destructive',
});
```

## Benefits

1. **Consistency**: All error messages are standardized across the application
2. **Maintainability**: Easy to update messages in one place
3. **Localization Ready**: Centralized messages make it easier to add translations
4. **Type Safety**: TypeScript ensures correct message references
5. **Documentation**: Clear categorization helps developers find the right message

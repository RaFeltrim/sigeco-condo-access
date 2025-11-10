/**
 * Standardized Error Messages
 * Centralized error messages for consistent user feedback
 */

export const ERROR_MESSAGES = {
  // Name validation errors
  nome: {
    required: 'Nome é obrigatório',
    minLength: 'Nome deve ter no mínimo 3 caracteres',
    maxLength: 'Nome deve ter no máximo 100 caracteres',
    invalidChars: 'Nome deve conter apenas letras e espaços',
  },
  
  // Document validation errors
  documento: {
    required: 'Documento é obrigatório',
    invalidCPF: 'CPF inválido',
    invalidRG: 'RG inválido',
    invalidFormat: 'Formato de documento inválido',
  },
  
  // Destination validation errors
  destino: {
    required: 'Destino é obrigatório',
    notSelected: 'Selecione um destino da lista',
  },
  
  // Storage operation errors
  storage: {
    saveFailed: 'Erro ao salvar dados. Tente novamente.',
    loadFailed: 'Erro ao carregar dados. Os dados serão mantidos apenas nesta sessão.',
    updateFailed: 'Erro ao atualizar dados. Tente novamente.',
    quotaExceeded: 'Limite de armazenamento excedido. Alguns dados antigos foram removidos.',
    corrupted: 'Dados corrompidos detectados. Iniciando com dados limpos.',
  },
  
  // Form submission errors
  form: {
    validationFailed: 'Por favor, corrija os erros no formulário',
    submissionFailed: 'Erro ao registrar entrada. Tente novamente.',
  },
  
  // Checkout errors
  checkout: {
    failed: 'Erro ao registrar saída. Tente novamente.',
    notFound: 'Visitante não encontrado',
  },
  
  // Generic errors
  generic: {
    unexpected: 'Erro inesperado. Tente novamente.',
    networkError: 'Erro de conexão. Verifique sua internet.',
  },
} as const;

/**
 * Success messages for positive feedback
 */
export const SUCCESS_MESSAGES = {
  visitor: {
    registered: 'Entrada registrada com sucesso',
    checkedOut: 'Saída registrada com sucesso',
  },
  storage: {
    saved: 'Dados salvos com sucesso',
    loaded: 'Dados carregados com sucesso',
  },
} as const;

/**
 * Global Error Handlers - Captura erros não tratados globalmente
 * 
 * Implementa handlers para window.error e unhandledrejection,
 * integrando com o LoggingService.
 */

import { LoggingService } from './logging';

/**
 * Inicializa handlers globais de erro
 */
export function initializeGlobalErrorHandlers(): void {
  // Handler para erros não capturados
  window.addEventListener('error', (event: ErrorEvent) => {
    LoggingService.error(
      'Uncaught error',
      event.error || new Error(event.message),
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'window.error',
      }
    );

    // Previne que o erro seja logado novamente no console
    // em produção (já está sendo logado pelo LoggingService)
    if (!import.meta.env.DEV) {
      event.preventDefault();
    }
  });

  // Handler para promises rejeitadas não tratadas
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));

    LoggingService.error(
      'Unhandled promise rejection',
      error,
      {
        reason: event.reason,
        type: 'unhandledrejection',
      }
    );

    // Previne que o erro seja logado novamente no console
    // em produção (já está sendo logado pelo LoggingService)
    if (!import.meta.env.DEV) {
      event.preventDefault();
    }
  });

  LoggingService.info('Global error handlers initialized');
}

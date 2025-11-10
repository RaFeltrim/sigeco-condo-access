/**
 * useUserActivityLogger - Hook para integrar o logger de atividades
 * 
 * Configura listeners de eventos para capturar interações do usuário
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UserActivityLogger } from '@/services/UserActivityLogger';

export const useUserActivityLogger = () => {
  const location = useLocation();

  useEffect(() => {
    // Só ativar em modo desenvolvimento
    if (!import.meta.env.DEV) {
      return;
    }

    // Iniciar o logger
    UserActivityLogger.start();

    // Handler para clicks
    const handleClick = (event: MouseEvent) => {
      UserActivityLogger.logClick(event);
    };

    // Handler para inputs (change events)
    const handleInput = (event: Event) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        // Armazenar valor anterior se disponível
        const previousValue = (target as HTMLInputElement).dataset.previousValue;
        UserActivityLogger.logInput(target, previousValue);
        
        // Atualizar valor anterior
        (target as HTMLInputElement).dataset.previousValue = target.value;
      }
    };

    // Handler para focus (inicializar valor anterior)
    const handleFocus = (event: FocusEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        (target as HTMLInputElement).dataset.previousValue = target.value;
      }
    };

    // Handler para erros não tratados
    const handleError = (event: ErrorEvent) => {
      UserActivityLogger.logError(event.error || event.message, 'Window Error');
    };

    // Handler para rejeições de promises não tratadas
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason));
      UserActivityLogger.logError(error, 'Unhandled Promise Rejection');
    };

    // Registrar listeners
    document.addEventListener('click', handleClick, true);
    document.addEventListener('change', handleInput, true);
    document.addEventListener('input', handleInput, true);
    document.addEventListener('focus', handleFocus, true);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Registrar atalho de teclado para baixar relatório (Ctrl+Shift+L)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        UserActivityLogger.downloadReport();
        console.log('[UserActivityLogger] Relatório baixado!');
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Log inicial
    UserActivityLogger.logSystem('Aplicação iniciada', {
      path: location.pathname,
      mode: import.meta.env.MODE,
    });

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('change', handleInput, true);
      document.removeEventListener('input', handleInput, true);
      document.removeEventListener('focus', handleFocus, true);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      document.removeEventListener('keydown', handleKeyDown);
      
      UserActivityLogger.stop();
    };
  }, []); // Executar apenas uma vez na montagem

  // Rastrear navegação
  useEffect(() => {
    if (!import.meta.env.DEV || !UserActivityLogger.isLogging()) {
      return;
    }

    // Log de navegação
    const previousPath = sessionStorage.getItem('lastPath') || '/';
    if (previousPath !== location.pathname) {
      UserActivityLogger.logNavigation(previousPath, location.pathname);
      sessionStorage.setItem('lastPath', location.pathname);
    }
  }, [location, location.pathname]);

  return {
    isLogging: UserActivityLogger.isLogging(),
    downloadReport: () => UserActivityLogger.downloadReport(),
  };
};

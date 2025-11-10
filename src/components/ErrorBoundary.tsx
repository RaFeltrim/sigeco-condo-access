/**
 * ErrorBoundary - Componente para capturar erros não tratados durante renderização
 * 
 * Captura erros em componentes React e exibe UI amigável ao usuário,
 * integrando com o LoggingService para registro de erros.
 */

import React, { Component, ReactNode } from 'react';
import { LoggingService } from '@/lib/logging';
import { ErrorFallback } from './ErrorFallback';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  context?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  context?: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to LoggingService
    LoggingService.error(
      'React Error Boundary caught error',
      error,
      {
        componentStack: errorInfo.componentStack,
        context: this.props.context || 'unknown',
      }
    );

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || ErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
          context={this.props.context}
        />
      );
    }

    return this.props.children;
  }
}

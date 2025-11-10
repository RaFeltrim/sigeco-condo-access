/**
 * ErrorFallback - UI amigável exibida quando um erro é capturado
 * 
 * Fornece opções para o usuário tentar novamente ou voltar ao início,
 * com mensagem clara sobre o erro ocorrido.
 */

import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ErrorFallbackProps } from './ErrorBoundary';

export const ErrorFallback = ({ error, resetError, context }: ErrorFallbackProps) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-6 w-6" />
            <CardTitle>Algo deu errado</CardTitle>
          </div>
          <CardDescription>
            Ocorreu um erro inesperado na aplicação.
            {context && ` (${context})`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Não se preocupe, seus dados estão seguros. Você pode tentar novamente
              ou voltar à página inicial.
            </AlertDescription>
          </Alert>

          {isDevelopment && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Detalhes do erro (apenas em desenvolvimento):
              </p>
              <p className="text-xs text-gray-600 font-mono break-all">
                {error.message}
              </p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                    Ver stack trace
                  </summary>
                  <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            onClick={resetError}
            variant="default"
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="flex-1"
          >
            <Home className="mr-2 h-4 w-4" />
            Voltar ao Início
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

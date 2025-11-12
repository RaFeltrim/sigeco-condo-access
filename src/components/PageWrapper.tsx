import { ReactNode } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorPage } from "@/components/ui/error-display";

interface PageWrapperProps {
  children: ReactNode;
  isLoading?: boolean;
  error?: Error | string | null;
  onRetry?: () => void;
  loadingText?: string;
  className?: string;
}

export const PageWrapper = ({
  children,
  isLoading = false,
  error = null,
  onRetry,
  loadingText = "Carregando...",
  className = ""
}: PageWrapperProps) => {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <LoadingSpinner size="lg" text={loadingText} />
      </div>
    );
  }

  if (error) {
    const errorMessage = typeof error === 'string' 
      ? error 
      : error.message || 'Ocorreu um erro ao carregar os dados';

    return (
      <div className={className}>
        <ErrorPage
          message={errorMessage}
          onRetry={onRetry}
        />
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};

export default PageWrapper;

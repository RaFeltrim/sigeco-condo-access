import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/utils/cn";

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
  variant?: "default" | "destructive";
}

export const ErrorDisplay = ({
  title = "Erro",
  message,
  onRetry,
  className = "",
  variant = "destructive"
}: ErrorDisplayProps) => {
  return (
    <Alert variant={variant} className={cn("", className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span>{message}</span>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="w-fit"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

interface ErrorPageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}

export const ErrorPage = ({
  title = "Algo deu errado",
  message,
  onRetry,
  onGoBack
}: ErrorPageProps) => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
      <AlertCircle className="h-16 w-16 text-destructive" />
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground max-w-md">{message}</p>
      </div>
      <div className="flex gap-2">
        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>
        )}
        {onGoBack && (
          <Button variant="outline" onClick={onGoBack}>
            Voltar
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * ActivityLoggerIndicator - Indicador visual de que o logging está ativo
 * 
 * Mostra um badge no canto da tela e permite baixar o relatório
 */

import { useState, useEffect } from 'react';
import { UserActivityLogger } from '@/services/UserActivityLogger';
import { Button } from '@/components/ui/button';
import { Download, Activity } from 'lucide-react';

export const ActivityLoggerIndicator = () => {
  const [isLogging, setIsLogging] = useState(false);
  const [logCount, setLogCount] = useState(0);

  useEffect(() => {
    // Só mostrar em modo desenvolvimento
    if (!import.meta.env.DEV) {
      return;
    }

    setIsLogging(UserActivityLogger.isLogging());

    // Atualizar contagem de logs periodicamente
    const interval = setInterval(() => {
      setIsLogging(UserActivityLogger.isLogging());
      setLogCount(UserActivityLogger.getLogs().length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isLogging) {
    return null;
  }

  const handleDownload = () => {
    UserActivityLogger.downloadReport();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
      <Activity className="w-4 h-4 animate-pulse" />
      <span className="text-sm font-medium">
        Registrando atividades ({logCount})
      </span>
      <Button
        size="sm"
        variant="secondary"
        onClick={handleDownload}
        className="ml-2"
        title="Baixar relatório (Ctrl+Shift+L)"
      >
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );
};

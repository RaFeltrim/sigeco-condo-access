/**
 * LoggingService - Sistema centralizado de logging para SIGECO
 * 
 * Responsável por registrar erros, warnings e informações importantes
 * com armazenamento em localStorage e capacidade de exportação.
 */

export type LogLevel = 'error' | 'warning' | 'info';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  stack?: string;
  userAgent: string;
}

interface LogFilter {
  level?: LogLevel;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

const STORAGE_KEY = 'sigeco_logs';
const MAX_LOGS = 100;

class LoggingServiceClass {
  private logs: LogEntry[] = [];

  constructor() {
    this.loadLogs();
  }

  /**
   * Registra um erro no sistema
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log('error', message, context, error?.stack);
  }

  /**
   * Registra um warning no sistema
   */
  warning(message: string, context?: Record<string, unknown>): void {
    this.log('warning', message, context);
  }

  /**
   * Registra uma informação no sistema
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  /**
   * Método interno para registrar logs
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    stack?: string
  ): void {
    const entry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      level,
      message,
      context: this.sanitizeContext(context),
      stack,
      userAgent: navigator.userAgent,
    };

    this.logs.unshift(entry);

    // Limitar a 100 entradas
    if (this.logs.length > MAX_LOGS) {
      this.logs = this.logs.slice(0, MAX_LOGS);
    }

    this.saveLogs();

    // Log no console em desenvolvimento
    if (import.meta.env.DEV) {
      this.logToConsole(entry);
    }
  }

  /**
   * Recupera logs com filtros opcionais
   */
  getLogs(filter?: LogFilter): LogEntry[] {
    let filtered = [...this.logs];

    if (filter?.level) {
      filtered = filtered.filter(log => log.level === filter.level);
    }

    if (filter?.startDate) {
      filtered = filtered.filter(
        log => new Date(log.timestamp) >= filter.startDate!
      );
    }

    if (filter?.endDate) {
      filtered = filtered.filter(
        log => new Date(log.timestamp) <= filter.endDate!
      );
    }

    if (filter?.limit) {
      filtered = filtered.slice(0, filter.limit);
    }

    return filtered;
  }

  /**
   * Exporta logs em formato JSON para análise
   */
  exportLogs(): string {
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalLogs: this.logs.length,
      logs: this.logs.map(log => ({
        ...log,
        timestamp: log.timestamp.toISOString(),
      })),
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Baixa logs como arquivo JSON
   */
  downloadLogs(filename: string = 'sigeco-logs.json'): void {
    const data = this.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Limpa todos os logs
   */
  clearLogs(): void {
    this.logs = [];
    this.saveLogs();
  }

  /**
   * Carrega logs do localStorage
   */
  private loadLogs(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Array<Omit<LogEntry, 'timestamp'> & { timestamp: string }>;
        this.logs = parsed.map((log) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar logs do localStorage:', error);
      this.logs = [];
    }
  }

  /**
   * Salva logs no localStorage
   */
  private saveLogs(): void {
    try {
      const serialized = this.logs.map(log => ({
        ...log,
        timestamp: log.timestamp.toISOString(),
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (error) {
      console.error('Erro ao salvar logs no localStorage:', error);
    }
  }

  /**
   * Gera ID único para log
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sanitiza contexto removendo informações sensíveis
   */
  private sanitizeContext(
    context?: Record<string, unknown>
  ): Record<string, unknown> | undefined {
    if (!context) return undefined;

    const sanitized = { ...context };
    const sensitiveKeys = ['password', 'senha', 'token', 'cpf', 'rg', 'documento'];

    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Log no console do navegador
   */
  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`;

    switch (entry.level) {
      case 'error':
        console.error(prefix, entry.message, entry.context, entry.stack);
        break;
      case 'warning':
        console.warn(prefix, entry.message, entry.context);
        break;
      case 'info':
        console.info(prefix, entry.message, entry.context);
        break;
    }
  }
}

// Singleton instance
export const LoggingService = new LoggingServiceClass();

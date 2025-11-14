# LoggingService - Sistema de Logging Centralizado

## Visão Geral

O LoggingService é um sistema centralizado de logging para o SIGECO que registra erros, warnings e informações importantes com armazenamento automático em localStorage.

## Características

- ✅ Registro de erros, warnings e informações
- ✅ Armazenamento automático em localStorage (limite de 100 entradas)
- ✅ Captura automática de contexto (timestamp, userAgent, stack trace)
- ✅ Sanitização de dados sensíveis (senhas, CPF, tokens, etc.)
- ✅ Exportação de logs em formato JSON
- ✅ Download de logs para análise
- ✅ Filtros por nível, data e limite
- ✅ Logs no console em modo desenvolvimento

## Uso Básico

```typescript
import { LoggingService } from '@/lib/logging';

// Registrar erro
try {
  // código que pode falhar
} catch (error) {
  LoggingService.error('Falha ao processar dados', error as Error, {
    component: 'DataProcessor',
    userId: '123'
  });
}

// Registrar warning
LoggingService.warning('Recurso externo não disponível', {
  resource: 'analytics',
  fallback: 'local-queue'
});

// Registrar informação
LoggingService.info('Relatório gerado com sucesso', {
  reportType: 'PDF',
  recordCount: 150
});
```

## Recuperar Logs

```typescript
// Todos os logs
const allLogs = LoggingService.getLogs();

// Filtrar por nível
const errors = LoggingService.getLogs({ level: 'error' });
const warnings = LoggingService.getLogs({ level: 'warning' });

// Filtrar por data
const recentLogs = LoggingService.getLogs({
  startDate: new Date('2024-01-01'),
  endDate: new Date()
});

// Limitar quantidade
const last10 = LoggingService.getLogs({ limit: 10 });
```

## Exportar e Baixar Logs

```typescript
// Exportar como string JSON
const jsonString = LoggingService.exportLogs();

// Baixar arquivo JSON
LoggingService.downloadLogs('sigeco-logs-2024-01-15.json');
```

## Limpar Logs

```typescript
// Limpar todos os logs
LoggingService.clearLogs();
```

## Estrutura do Log

```typescript
interface LogEntry {
  id: string;                    // ID único do log
  timestamp: Date;               // Data/hora do log
  level: 'error' | 'warning' | 'info';  // Nível do log
  message: string;               // Mensagem descritiva
  context?: Record<string, any>; // Contexto adicional
  stack?: string;                // Stack trace (para erros)
  userAgent: string;             // User agent do navegador
}
```

## Sanitização de Dados Sensíveis

O LoggingService automaticamente sanitiza dados sensíveis no contexto:

- `password` / `senha`
- `token`
- `cpf`
- `rg`
- `documento`

Esses campos serão substituídos por `[REDACTED]` nos logs.

## Armazenamento

- **Localização**: localStorage com chave `sigeco_logs`
- **Limite**: 100 entradas (mais antigas são removidas automaticamente)
- **Persistência**: Logs persistem entre sessões do navegador

## Modo Desenvolvimento

Em modo desenvolvimento (`import.meta.env.DEV`), os logs também são exibidos no console do navegador com formatação apropriada:

- Erros: `console.error`
- Warnings: `console.warn`
- Info: `console.info`

## Testes Manuais

Para testar o LoggingService no navegador:

```typescript
import { testLoggingService } from '@/lib/logging.test-manual';

// Executar suite de testes
testLoggingService();
```

Ou no console do navegador:
```javascript
testLoggingService();
```

## Integração com Error Boundaries

O LoggingService será integrado com Error Boundaries para captura automática de erros React:

```typescript
// Em ErrorBoundary.tsx
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  LoggingService.error('React error boundary caught', error, {
    componentStack: errorInfo.componentStack
  });
}
```

## Requisitos Atendidos

- ✅ Requirement 1.4: Registro de erros não tratados
- ✅ Requirement 6.4: Logging de falhas de localização de elementos

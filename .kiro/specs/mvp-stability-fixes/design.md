# Design Document

## Overview

Este documento descreve a arquitetura e estratégia de implementação para resolver os problemas críticos de estabilidade do SIGECO MVP. O sistema atual é uma aplicação React 18 com Vite, utilizando TypeScript, React Router, TanStack Query e shadcn/ui para componentes.

Os problemas identificados incluem:
- Erro React #418 (crash não tratado)
- Falhas de CORS em recursos externos
- Sistema de relatórios sem validação de download
- Bloqueio de analytics por adblockers
- Ausência de validações de existência de elementos DOM

## Architecture

### Current Stack
- **Frontend Framework**: React 18.3.1 com TypeScript
- **Build Tool**: Vite 5.4.19
- **Routing**: React Router DOM 6.30.1
- **State Management**: TanStack Query 5.83.0
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod

### Architectural Layers

```
┌─────────────────────────────────────────┐
│         Error Boundary Layer            │
│  (Global + Route-level error handling)  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Application Layer                │
│  (App.tsx, Routes, Pages)               │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Service Layer                    │
│  (Analytics, Reports, Logging)          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Utility Layer                    │
│  (DOM Helpers, Validators, Formatters)  │
└─────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Error Boundary System

**Component: ErrorBoundary**
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}
```

**Purpose**: Capturar erros não tratados durante renderização e exibir UI amigável ao usuário.

**Implementation Strategy**:
- Error Boundary global no App.tsx envolvendo toda a aplicação
- Error Boundaries específicos para rotas críticas (PorteiroDashboard, RelatoriosPage)
- Fallback UI com opção de "Tentar Novamente" e "Voltar ao Início"
- Integração com sistema de logging

### 2. Logging Service

**Service: LoggingService**
```typescript
interface LogEntry {
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  message: string;
  context?: Record<string, any>;
  stack?: string;
}

interface LoggingService {
  error(message: string, error?: Error, context?: Record<string, any>): void;
  warning(message: string, context?: Record<string, any>): void;
  info(message: string, context?: Record<string, any>): void;
  getLogs(filter?: LogFilter): LogEntry[];
}
```

**Purpose**: Centralizar registro de erros e eventos para análise posterior.

**Implementation Strategy**:
- Armazenamento local (localStorage) com limite de 100 entradas
- Formato estruturado para facilitar análise
- Método de exportação para envio ao suporte
- Integração com Error Boundaries

### 3. Resource Loader

**Utility: ResourceValidator**
```typescript
interface ResourceConfig {
  url: string;
  type: 'css' | 'script' | 'font';
  fallback?: string;
  required: boolean;
}

interface ResourceValidator {
  validateResources(configs: ResourceConfig[]): Promise<ValidationResult>;
  loadLocalFallback(resource: ResourceConfig): Promise<void>;
}
```

**Purpose**: Validar carregamento de recursos e usar fallbacks locais quando necessário.

**Implementation Strategy**:
- Remover dependências externas desnecessárias
- Hospedar fontes Google localmente
- Validar carregamento de recursos críticos no bootstrap
- Implementar fallbacks para recursos opcionais

### 4. Report Generation Service

**Service: ReportService**
```typescript
interface ReportFilter {
  periodo?: string;
  tipo?: string;
  status?: string;
  destino?: string;
  dataInicio?: Date;
  dataFim?: Date;
}

interface ReportData {
  registros: VisitaRegistro[];
  estatisticas: Estatisticas;
  metadata: ReportMetadata;
}

interface ReportService {
  generatePDF(filter: ReportFilter): Promise<Blob>;
  generateExcel(filter: ReportFilter): Promise<Blob>;
  downloadReport(blob: Blob, filename: string): void;
  validateReportData(data: ReportData): ValidationResult;
}
```

**Purpose**: Gerar relatórios em PDF/Excel com validação completa do processo.

**Implementation Strategy**:
- Usar biblioteca jsPDF para geração de PDF
- Usar biblioteca xlsx (SheetJS) para geração de Excel
- Validar dados antes da geração
- Implementar download automático com verificação
- Adicionar loading states e feedback visual
- Timeout de 5 segundos para geração

### 5. Analytics Service

**Service: AnalyticsService**
```typescript
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: Date;
}

interface AnalyticsProvider {
  name: string;
  track(event: AnalyticsEvent): Promise<boolean>;
  isBlocked(): boolean;
}

interface AnalyticsService {
  track(eventName: string, properties?: Record<string, any>): void;
  registerProvider(provider: AnalyticsProvider): void;
  getSuccessRate(): number;
}
```

**Purpose**: Sistema de analytics resiliente a bloqueadores.

**Implementation Strategy**:
- Implementar queue local para eventos
- Tentar múltiplos providers (fallback)
- Usar server-side tracking quando possível
- Armazenar eventos localmente se todos os providers falharem
- Limitar a 3 providers essenciais
- Implementar retry logic com exponential backoff

### 6. DOM Utilities

**Utility: DOMHelpers**
```typescript
interface WaitOptions {
  timeout?: number;
  interval?: number;
  errorMessage?: string;
}

interface DOMHelpers {
  waitForElement(selector: string, options?: WaitOptions): Promise<Element>;
  elementExists(selector: string): boolean;
  safeQuerySelector<T extends Element>(selector: string): T | null;
  waitForPageLoad(additionalDelay?: number): Promise<void>;
}
```

**Purpose**: Utilitários para manipulação segura do DOM.

**Implementation Strategy**:
- Implementar esperas inteligentes com timeout
- Validar existência antes de manipulação
- Adicionar delay de 1 segundo após carregamento de página
- Retornar null em vez de lançar exceções
- Logging de falhas de localização de elementos

## Data Models

### LogEntry Model
```typescript
interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  message: string;
  context?: {
    component?: string;
    action?: string;
    userId?: string;
    [key: string]: any;
  };
  stack?: string;
  userAgent: string;
}
```

### AnalyticsEvent Model
```typescript
interface AnalyticsEvent {
  id: string;
  name: string;
  properties: Record<string, any>;
  timestamp: Date;
  sent: boolean;
  retryCount: number;
  providers: string[];
}
```

### ReportMetadata Model
```typescript
interface ReportMetadata {
  generatedAt: Date;
  generatedBy: string;
  filters: ReportFilter;
  totalRecords: number;
  format: 'pdf' | 'excel';
  version: string;
}
```

## Error Handling

### Error Categories

1. **Critical Errors** (Require immediate user notification)
   - React rendering errors
   - Network failures
   - Data corruption

2. **Recoverable Errors** (Silent retry with logging)
   - Analytics tracking failures
   - Non-critical resource loading failures

3. **Validation Errors** (User feedback)
   - Form validation
   - Report generation with invalid filters

### Error Handling Strategy

```typescript
// Global error handler
window.addEventListener('error', (event) => {
  LoggingService.error('Uncaught error', event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

// Promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  LoggingService.error('Unhandled promise rejection', event.reason);
});

// React Error Boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    LoggingService.error('React error boundary caught', error, {
      componentStack: errorInfo.componentStack
    });
  }
}
```

### CORS Resolution Strategy

1. **Audit External Resources**
   - Identificar todas as dependências externas
   - Avaliar necessidade de cada recurso

2. **Self-Host Critical Resources**
   - Baixar e hospedar fontes Google localmente
   - Incluir recursos no bundle quando possível

3. **Remove Unnecessary Dependencies**
   - Remover scripts de analytics bloqueados
   - Simplificar dependências externas

4. **Configure Proper CORS Headers**
   - Para recursos que devem permanecer externos
   - Documentar configurações necessárias

## Testing Strategy

### Unit Tests
- LoggingService: Testar armazenamento e recuperação de logs
- DOMHelpers: Testar esperas e validações
- ReportService: Testar geração de dados (mock de PDF/Excel)
- AnalyticsService: Testar queue e retry logic

### Integration Tests
- ErrorBoundary: Simular erros e verificar fallback UI
- ReportService: Testar fluxo completo de geração e download
- AnalyticsService: Testar com providers mockados

### E2E Tests (Manual para MVP)
- Testar geração de relatório PDF com download
- Testar geração de relatório Excel com download
- Verificar que não há erros no console após operações
- Testar recuperação de erro com "Tentar Novamente"

### Console Validation
- Executar aplicação em modo desenvolvimento
- Verificar ausência de erros críticos no console
- Verificar ausência de warnings de CORS
- Validar que analytics não gera erros visíveis

### Performance Testing
- Geração de relatório com 1000+ registros < 5 segundos
- Carregamento inicial da aplicação < 2 segundos
- Navegação entre páginas < 500ms

## Definition of Done Checklist

Para cada tarefa implementada, validar:

- [ ] Código implementado e revisado
- [ ] Testes unitários escritos e passando
- [ ] Testes de integração passando (quando aplicável)
- [ ] Executado em navegador com console aberto
- [ ] Zero erros críticos no console
- [ ] Zero warnings de CORS no console
- [ ] Funcionalidade testada manualmente
- [ ] Documentação atualizada (se necessário)
- [ ] Code review aprovado
- [ ] Merged para branch principal

## Implementation Phases

### Phase 1: Foundation (Crítico)
- Implementar Error Boundary system
- Implementar LoggingService
- Resolver erros CORS
- Implementar DOMHelpers

### Phase 2: Reports (Crítico)
- Implementar ReportService completo
- Adicionar geração de PDF
- Adicionar geração de Excel
- Validar download end-to-end

### Phase 3: Analytics (Alta Prioridade)
- Implementar AnalyticsService
- Configurar providers resilientes
- Implementar queue local
- Testar com adblockers

### Phase 4: Quality Assurance (Alta Prioridade)
- Validação completa do DoD
- Testes de console em todos os fluxos
- Documentação de processos
- Preparação para piloto

## Technical Decisions

### Decision 1: Error Boundary Placement
**Decision**: Implementar Error Boundary global + boundaries específicos por rota crítica

**Rationale**: 
- Boundary global captura erros inesperados
- Boundaries específicos permitem recuperação granular
- Usuário não perde todo o contexto em caso de erro

### Decision 2: Report Generation Libraries
**Decision**: jsPDF para PDF, SheetJS para Excel

**Rationale**:
- Bibliotecas maduras e bem mantidas
- Funcionam client-side (sem backend necessário)
- Boa documentação e exemplos
- Suporte a formatação avançada

### Decision 3: Analytics Strategy
**Decision**: Client-side com fallback para queue local

**Rationale**:
- MVP não tem backend para server-side tracking
- Queue local garante que dados não são perdidos
- Permite implementar server-side posteriormente
- Resiliente a bloqueadores

### Decision 4: Resource Loading
**Decision**: Self-host todas as fontes e recursos críticos

**Rationale**:
- Elimina dependência de CDNs externos
- Resolve problemas de CORS
- Melhora performance (menos requests externos)
- Maior controle sobre versões

### Decision 5: Logging Storage
**Decision**: localStorage com limite de 100 entradas

**Rationale**:
- Simples de implementar
- Persiste entre sessões
- Suficiente para debugging
- Não requer backend
- Limite previne crescimento infinito

## Security Considerations

1. **Data Sanitization**: Sanitizar dados antes de incluir em logs
2. **PII Protection**: Não logar informações sensíveis (documentos, senhas)
3. **XSS Prevention**: Validar inputs em relatórios
4. **Resource Integrity**: Validar integridade de recursos self-hosted
5. **Error Messages**: Não expor detalhes técnicos sensíveis ao usuário

## Performance Considerations

1. **Lazy Loading**: Carregar bibliotecas de relatório apenas quando necessário
2. **Debouncing**: Debounce em filtros de relatório
3. **Memoization**: Memoizar cálculos de estatísticas
4. **Virtual Scrolling**: Para tabelas com muitos registros (futuro)
5. **Bundle Size**: Monitorar tamanho do bundle após adicionar bibliotecas

## Monitoring and Observability

### Metrics to Track
- Taxa de erros capturados por Error Boundary
- Taxa de sucesso de analytics (target: 80%)
- Tempo de geração de relatórios (target: < 5s)
- Número de erros CORS (target: 0)
- Número de erros no console (target: 0)

### Logging Strategy
- Todos os erros devem ser logados
- Eventos importantes devem ser logados (info level)
- Logs devem incluir contexto suficiente para debugging
- Logs devem ser exportáveis para análise

## Migration Strategy

Como este é um MVP em produção, a estratégia de migração é:

1. **Implementar em branch separada**
2. **Testar extensivamente em ambiente de desenvolvimento**
3. **Deploy em horário de baixo movimento**
4. **Monitorar logs após deploy**
5. **Rollback plan**: Manter versão anterior disponível para rollback rápido

## Future Enhancements

Após estabilização do MVP:

1. **Server-side Analytics**: Implementar tracking server-side
2. **Advanced Error Reporting**: Integrar com Sentry ou similar
3. **Performance Monitoring**: Adicionar métricas de performance
4. **Automated Testing**: Expandir cobertura de testes
5. **Report Templates**: Permitir customização de relatórios

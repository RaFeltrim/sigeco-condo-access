# Design Document - System Validation Agents

## Overview

O Sistema de Agentes de Validação é uma suíte de testes automatizados end-to-end que valida a funcionalidade completa do SIGECO através de agentes especializados. Cada agente simula interações reais de usuário, valida fluxos de trabalho completos, e verifica a integridade dos dados em diferentes módulos do sistema.

A arquitetura utiliza Playwright para automação de browser, Vitest para assertions e orquestração, e um sistema de relatórios consolidado que agrega resultados de todos os agentes.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLI Interface                        │
│              (validate:system command)                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Validation Orchestrator                     │
│         (Manages agent execution & reporting)            │
└─┬───────┬───────┬───────┬───────┬───────┬───────┬──────┘
  │       │       │       │       │       │       │
  ▼       ▼       ▼       ▼       ▼       ▼       ▼
┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
│DSB │ │MRD │ │AGE │ │REL │ │INS │ │BCK │ │SUP │
│Agent│ │Agent│ │Agent│ │Agent│ │Agent│ │Agent│ │Agent│
└──┬─┘ └──┬─┘ └──┬─┘ └──┬─┘ └──┬─┘ └──┬─┘ └──┬─┘
   │      │      │      │      │      │      │
   └──────┴──────┴──────┴──────┴──────┴──────┘
                     │
                     ▼
            ┌────────────────┐
            │Report Aggregator│
            └────────┬───────┘
                     │
           ┌─────────┴─────────┐
           ▼                   ▼
     ┌──────────┐        ┌──────────┐
     │JSON Report│        │MD Report │
     └──────────┘        └──────────┘
```

### Key Design Principles

1. **Agent Isolation**: Cada agente é independente e pode ser executado isoladamente
2. **Real User Simulation**: Agentes simulam interações reais de usuário via Playwright
3. **Data Validation**: Verificação rigorosa de coerência entre UI e dados subjacentes
4. **Comprehensive Reporting**: Relatórios detalhados com screenshots e logs de falhas
5. **CI/CD Ready**: Integração fácil com pipelines de CI/CD via CLI

## Components and Interfaces

### 1. CLI Interface (`scripts/validate-system.ts`)

**Responsibility**: Ponto de entrada da aplicação, parsing de argumentos, exibição de progresso

```typescript
interface CLIOptions {
  module?: string; // Run specific module: 'dashboard' | 'moradores' | 'agendamentos' | etc.
  verbose?: boolean;
  headless?: boolean; // Run browser in headless mode
  outputDir?: string;
  failFast?: boolean; // Stop on first failure
}

class SystemValidationCLI {
  async run(options: CLIOptions): Promise<number>; // exit code
  private displayProgress(agent: string, status: 'running' | 'passed' | 'failed'): void;
  private displaySummary(report: ValidationReport): void;
}
```

### 2. Validation Orchestrator (`src/lib/validation-agents/ValidationOrchestrator.ts`)

**Responsibility**: Orquestração de todos os agentes, gerenciamento de execução paralela/sequencial

```typescript
interface ValidationOrchestrator {
  registerAgent(agent: ValidationAgent): void;
  runAll(): Promise<ValidationReport>;
  runModule(moduleName: string): Promise<ValidationReport>;
  getHealthScore(): number;
}

interface ValidationAgent {
  name: string;
  module: string;
  execute(): Promise<AgentResult>;
}

interface AgentResult {
  agentName: string;
  module: string;
  passed: boolean;
  executionTime: number;
  tests: TestResult[];
  screenshots?: string[];
  logs?: string[];
}

interface TestResult {
  testId: string;
  description: string;
  passed: boolean;
  error?: string;
  expectedValue?: any;
  actualValue?: any;
}
```

### 3. Dashboard Validation Agent (`src/lib/validation-agents/DashboardAgent.ts`)

**Responsibility**: Validação do Dashboard Administrativo (DSB-001, DSB-002, DSB-003)

```typescript
interface DashboardMetrics {
  acessosHoje: number;
  visitantesAtivos: number;
  totalSemanal: number;
  sistemaOnline: number;
  variacaoAcessos: string;
  variacaoVisitantes: string;
}

class DashboardAgent implements ValidationAgent {
  name = 'Dashboard Validation Agent';
  module = 'dashboard';
  
  async execute(): Promise<AgentResult>;
  
  // DSB-001: Validate KPIs
  private async validateKPIs(): Promise<TestResult>;
  private async extractKPIValues(): Promise<DashboardMetrics>;
  private async crossReferenceWithLogs(): Promise<boolean>;
  
  // DSB-002: Ad Blocker Test
  private async testWithAdBlocker(): Promise<TestResult>;
  private async enableAdBlocker(): Promise<void>;
  private async checkConsoleErrors(): Promise<string[]>;
  
  // DSB-003: Stress Test
  private async executeStressTest(): Promise<TestResult>;
  private async simulateEntries(count: number): Promise<void>;
  private async simulateExits(count: number): Promise<void>;
  private async checkForReactError418(): Promise<boolean>;
}
```

### 4. Moradores Validation Agent (`src/lib/validation-agents/MoradoresAgent.ts`)

**Responsibility**: Validação do módulo de Gerenciamento de Moradores (MRD-001, MRD-002)

```typescript
interface MoradorData {
  nome: string;
  unidade: string;
  documento: string;
  status: 'Ativo' | 'Inativo';
}

interface MoradoresCounters {
  totalMoradores: number;
  unidadesOcupadas: number;
  cadastrosEsteMes: number;
}

class MoradoresAgent implements ValidationAgent {
  name = 'Moradores Validation Agent';
  module = 'moradores';
  
  async execute(): Promise<AgentResult>;
  
  // MRD-001: CRUD Operations
  private async testCRUDOperations(): Promise<TestResult>;
  private async createMorador(data: MoradorData): Promise<boolean>;
  private async readMorador(nome: string): Promise<MoradorData | null>;
  private async updateMorador(nome: string, data: Partial<MoradorData>): Promise<boolean>;
  private async deleteMorador(nome: string): Promise<boolean>;
  private async verifyCountersUpdate(before: MoradoresCounters, after: MoradoresCounters): Promise<boolean>;
  
  // MRD-002: Field Validation
  private async testFieldValidation(): Promise<TestResult>;
  private async testRequiredFields(): Promise<boolean>;
  private async testDocumentMask(): Promise<boolean>;
}
```

### 5. Agendamentos Validation Agent (`src/lib/validation-agents/AgendamentosAgent.ts`)

**Responsibility**: Validação do módulo de Agendamento de Visitas (AGE-001, AGE-002)

```typescript
interface AgendamentoData {
  apartamento: string;
  morador: string;
  visitante: string;
  data: string;
  status: 'Pendente' | 'Confirmado' | 'Cancelado';
}

interface AgendamentosCounters {
  agendamentosHoje: number;
  proximosAgendamentos: number;
  confirmados: number;
  pendentes: number;
}

class AgendamentosAgent implements ValidationAgent {
  name = 'Agendamentos Validation Agent';
  module = 'agendamentos';
  
  async execute(): Promise<AgentResult>;
  
  // AGE-001: Complete Workflow
  private async testCompleteWorkflow(): Promise<TestResult>;
  private async createAgendamento(data: AgendamentoData): Promise<boolean>;
  private async changeStatus(id: string, newStatus: AgendamentoData['status']): Promise<boolean>;
  private async verifyDisplayInCalendar(data: AgendamentoData): Promise<boolean>;
  
  // AGE-002: Status Behavior
  private async testStatusBehavior(): Promise<TestResult>;
  private async verifyCanceledExcludedFromCounters(): Promise<boolean>;
  private async verifyOnlyValidStatusInCalendar(): Promise<boolean>;
}
```

### 6. Relatórios Validation Agent (`src/lib/validation-agents/RelatoriosAgent.ts`)

**Responsibility**: Validação crítica do módulo de Relatórios (REL-001, REL-002)

```typescript
interface ReportData {
  periodo: string;
  totalAcessos: number;
  tempoMedio: string;
  taxaOcupacao: string;
  horariosPico: string;
  distribuicaoPorTipo: Record<string, number>;
}

class RelatoriosAgent implements ValidationAgent {
  name = 'Relatórios Validation Agent';
  module = 'relatorios';
  
  async execute(): Promise<AgentResult>;
  
  // REL-001: Report Generation (CRITICAL)
  private async testReportGeneration(): Promise<TestResult>;
  private async generatePDFReport(): Promise<string>; // Returns file path
  private async generateExcelReport(): Promise<string>;
  private async verifyFileIntegrity(filePath: string): Promise<boolean>;
  private async verifyFileNotEmpty(filePath: string): Promise<boolean>;
  
  // REL-002: Data Coherence
  private async testDataCoherence(): Promise<TestResult>;
  private async extractSummaryIndicators(): Promise<ReportData>;
  private async extractDetailedRecords(): Promise<any[]>;
  private async verifyTempoMedio(summary: string, records: any[]): Promise<boolean>;
  private async verifyTaxaOcupacao(summary: string, records: any[]): Promise<boolean>;
  private async verifyHorariosPico(summary: string, records: any[]): Promise<boolean>;
  private async verifyDistribuicaoSums100(distribuicao: Record<string, number>): Promise<boolean>;
}
```

### 7. Funcionários Validation Agent (`src/lib/validation-agents/FuncionariosAgent.ts`)

**Responsibility**: Validação do módulo de Controle de Insumos (INS-001, INS-002)

```typescript
interface FuncionarioData {
  nome: string;
  documento: string;
  funcao: string;
  status: 'Ativo' | 'Inativo';
}

class FuncionariosAgent implements ValidationAgent {
  name = 'Funcionários Validation Agent';
  module = 'funcionarios';
  
  async execute(): Promise<AgentResult>;
  
  // INS-001: Functional Flow
  private async testFunctionalFlow(): Promise<TestResult>;
  private async createFuncionario(data: FuncionarioData): Promise<boolean>;
  private async verifyInList(nome: string): Promise<boolean>;
  private async verifyCounterUpdate(): Promise<boolean>;
  
  // INS-002: Entry/Exit Management
  private async testEntryExitManagement(): Promise<TestResult>;
  private async verifyInactiveRequiresReactivation(): Promise<boolean>;
}
```

### 8. Backup Validation Agent (`src/lib/validation-agents/BackupAgent.ts`)

**Responsibility**: Validação de Backup e Segurança (BCK-001, BCK-002)

```typescript
interface BackupConfig {
  backupAutomatico: boolean;
  backupNaNuvem: boolean;
  criptografiaAvancada: boolean;
  algoritmo: string;
}

class BackupAgent implements ValidationAgent {
  name = 'Backup Validation Agent';
  module = 'backup';
  
  async execute(): Promise<AgentResult>;
  
  // BCK-001: Backup/Restore Test
  private async testBackupRestore(): Promise<TestResult>;
  private async executeBackup(): Promise<string>; // Returns backup ID
  private async executeRestore(backupId: string): Promise<boolean>;
  private async verifyDatabaseIntegrity(): Promise<boolean>;
  private async verifyAuditLog(action: 'Backup' | 'Restauração'): Promise<boolean>;
  
  // BCK-002: Security Compliance
  private async testSecurityCompliance(): Promise<TestResult>;
  private async verifyBackupConfig(): Promise<BackupConfig>;
  private async testSecurityAlerts(): Promise<boolean>;
  private async simulateFailedLogin(): Promise<boolean>;
}
```

### 9. Suporte Validation Agent (`src/lib/validation-agents/SuporteAgent.ts`)

**Responsibility**: Validação do módulo de Suporte Avançado (SUP-001, SUP-002)

```typescript
interface TrainingMaterial {
  nome: string;
  progresso: number; // 0-100
  status: 'Não Iniciado' | 'Em Progresso' | 'Concluído';
}

class SuporteAgent implements ValidationAgent {
  name = 'Suporte Validation Agent';
  module = 'suporte';
  
  async execute(): Promise<AgentResult>;
  
  // SUP-001: Training Material Status
  private async testTrainingMaterialStatus(): Promise<TestResult>;
  private async checkMaterialStatus(nome: string): Promise<TrainingMaterial>;
  private async verifyCompletionCriteria(): Promise<boolean>;
  
  // SUP-002: Support Quality
  private async testSupportQuality(): Promise<TestResult>;
  private async verifySupport24x7Accessible(): Promise<boolean>;
  private async verifyCurrentVersion(): Promise<string>;
  private async checkAvailableUpdates(): Promise<number>;
  private async verifyUpdateWithoutDowntime(): Promise<boolean>;
}
```

### 10. Report Aggregator (`src/lib/validation-agents/ReportAggregator.ts`)

**Responsibility**: Agregação de resultados de todos os agentes e geração de relatórios

```typescript
interface ValidationReport {
  timestamp: string;
  overallHealthScore: number; // 0-100
  totalTests: number;
  passedTests: number;
  failedTests: number;
  agentResults: Record<string, AgentResult>;
  summary: {
    criticalFailures: TestResult[];
    moduleStatus: Record<string, 'passed' | 'failed' | 'partial'>;
  };
  recommendations: string[];
}

class ReportAggregator {
  aggregateResults(results: AgentResult[]): ValidationReport;
  generateJSON(report: ValidationReport): string;
  generateMarkdown(report: ValidationReport): string;
  calculateHealthScore(results: AgentResult[]): number;
  identifyCriticalFailures(results: AgentResult[]): TestResult[];
  generateRecommendations(report: ValidationReport): string[];
}
```

## Data Models

### Core Types (`src/types/validation-agents.ts`)

```typescript
export type ModuleName = 
  | 'dashboard' 
  | 'moradores' 
  | 'agendamentos' 
  | 'relatorios' 
  | 'funcionarios' 
  | 'backup' 
  | 'suporte';

export type TestStatus = 'passed' | 'failed' | 'skipped';

export interface TestResult {
  testId: string;
  description: string;
  passed: boolean;
  executionTime: number;
  error?: string;
  expectedValue?: any;
  actualValue?: any;
  screenshot?: string;
  logs?: string[];
}

export interface AgentResult {
  agentName: string;
  module: ModuleName;
  passed: boolean;
  executionTime: number;
  tests: TestResult[];
  screenshots?: string[];
  logs?: string[];
  metadata?: Record<string, unknown>;
}

export interface ValidationReport {
  timestamp: string;
  environment: string;
  overallHealthScore: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  agentResults: Record<string, AgentResult>;
  summary: ValidationSummary;
  recommendations: string[];
}

export interface ValidationSummary {
  criticalFailures: TestResult[];
  moduleStatus: Record<ModuleName, 'passed' | 'failed' | 'partial'>;
  executionTime: number;
  browserInfo: {
    name: string;
    version: string;
  };
}
```

## Error Handling

### Error Strategy

1. **Agent Failures**: Se um agente falhar, não deve bloquear outros
   - Cada agent é executado em try-catch
   - Falhas são capturadas com screenshots e logs
   - Relatório indica quais agents falharam e por quê

2. **Browser Errors**: Tratamento de timeouts e elementos não encontrados
   - Retry automático com backoff exponencial
   - Screenshots em cada falha
   - Logs detalhados do console do browser

3. **Data Validation Errors**: Comparação de valores esperados vs. atuais
   - Mensagens claras mostrando diferenças
   - Contexto completo da validação que falhou
   - Sugestões de correção quando possível

4. **File System Errors**: Validação de arquivos gerados (PDFs, Excel)
   - Verificação de existência do arquivo
   - Validação de tamanho mínimo
   - Verificação de integridade (headers corretos)

### Error Types

```typescript
class AgentExecutionError extends Error {
  constructor(
    public agentName: string,
    public testId: string,
    public originalError: Error
  ) {
    super(`Agent ${agentName} failed at test ${testId}: ${originalError.message}`);
  }
}

class ValidationError extends Error {
  constructor(
    public testId: string,
    public expected: any,
    public actual: any
  ) {
    super(`Validation failed for ${testId}: expected ${expected}, got ${actual}`);
  }
}

class BrowserInteractionError extends Error {
  constructor(
    public selector: string,
    public action: string,
    public timeout: number
  ) {
    super(`Failed to ${action} element ${selector} after ${timeout}ms`);
  }
}
```

## Testing Strategy

### Unit Tests

**Target**: Funções auxiliares e utilitários de cada agent

```typescript
// DashboardAgent.test.ts
describe('DashboardAgent Utilities', () => {
  it('should correctly parse KPI values from DOM', () => {
    const html = '<div class="kpi-value">47</div>';
    const value = parseKPIValue(html);
    expect(value).toBe(47);
  });

  it('should calculate percentage variation correctly', () => {
    const variation = calculateVariation(100, 112);
    expect(variation).toBe('+12%');
  });
});
```

### Integration Tests

**Target**: Cada agent individualmente contra o sistema real

```typescript
// DashboardAgent.integration.test.ts
describe('DashboardAgent Integration', () => {
  it('should validate KPIs successfully', async () => {
    const agent = new DashboardAgent();
    const result = await agent.execute();
    
    expect(result.passed).toBe(true);
    expect(result.tests).toHaveLength(3); // DSB-001, DSB-002, DSB-003
  });
});
```

### E2E Tests

**Target**: Orquestrador completo executando todos os agents

```typescript
// ValidationOrchestrator.e2e.test.ts
describe('System Validation E2E', () => {
  it('should run all agents and generate report', async () => {
    const orchestrator = new ValidationOrchestrator();
    const report = await orchestrator.runAll();
    
    expect(report.overallHealthScore).toBeGreaterThan(0);
    expect(report.agentResults).toHaveProperty('Dashboard Validation Agent');
    expect(fs.existsSync('.kiro/reports/system-validation-latest.json')).toBe(true);
  });
});
```

## Implementation Notes

### Playwright Configuration

```typescript
// playwright.config.ts for validation agents
export default defineConfig({
  testDir: './src/lib/validation-agents',
  timeout: 60000, // 1 minute per test
  retries: 2, // Retry failed tests twice
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### Test Data Management

Criar dados de teste consistentes em `tests/fixtures/validation-data/`:
- `moradores-test-data.json`: Dados de moradores para testes
- `agendamentos-test-data.json`: Dados de agendamentos
- `funcionarios-test-data.json`: Dados de funcionários

### Report Output Locations

- JSON: `.kiro/reports/system-validation-{timestamp}.json`
- Markdown: `.kiro/reports/system-validation-{timestamp}.md`
- Screenshots: `.kiro/reports/screenshots/{agent-name}/{test-id}.png`
- Videos: `.kiro/reports/videos/{agent-name}.webm`
- Latest symlink: `.kiro/reports/system-validation-latest.{json,md}`

### CLI Integration

Adicionar ao `package.json`:

```json
{
  "scripts": {
    "validate:system": "tsx scripts/validate-system.ts",
    "validate:dashboard": "tsx scripts/validate-system.ts --module dashboard",
    "validate:moradores": "tsx scripts/validate-system.ts --module moradores",
    "validate:ci": "tsx scripts/validate-system.ts --headless --fail-fast"
  }
}
```

### Performance Considerations

1. **Parallel Execution**: Executar agents independentes em paralelo
2. **Browser Reuse**: Reutilizar contexto do browser entre testes do mesmo agent
3. **Smart Waiting**: Usar waitForSelector com timeouts apropriados
4. **Screenshot Optimization**: Capturar screenshots apenas em falhas

### Ad Blocker Simulation

Para DSB-002, usar extensão do Playwright:

```typescript
async enableAdBlocker() {
  const context = await browser.newContext({
    // Block common tracking domains
    blockedURLs: [
      '**/analytics.js',
      '**/gtag.js',
      '**/ga.js',
      '**/*analytics*',
      '**/*tracking*'
    ]
  });
}
```

### Critical Test Markers

Marcar testes críticos que devem bloquear deploy:

```typescript
const CRITICAL_TESTS = [
  'REL-001', // Report generation
  'BCK-001', // Backup/Restore
  'DSB-003', // React Error #418
];

function isCriticalFailure(testId: string): boolean {
  return CRITICAL_TESTS.includes(testId);
}
```

### Future Enhancements

1. **Visual Regression Testing**: Comparar screenshots entre versões
2. **Performance Metrics**: Medir tempo de carregamento e resposta
3. **Accessibility Testing**: Integrar axe-core para validação a11y
4. **Load Testing**: Simular múltiplos usuários simultâneos
5. **API Validation**: Validar chamadas de API subjacentes
6. **Mobile Testing**: Executar agents em viewports mobile

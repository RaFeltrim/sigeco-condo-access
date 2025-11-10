# Design Document - MVP Verifier

## Overview

O MVP Verifier é uma ferramenta de análise estática que examina o projeto SIGECO para identificar gaps de implementação. A ferramenta utiliza análise de AST (Abstract Syntax Tree) para TypeScript/React, verificação de sistema de arquivos, e análise de dependências para gerar relatórios detalhados sobre o estado do MVP.

A arquitetura é modular, permitindo que diferentes analisadores trabalhem de forma independente e seus resultados sejam agregados em um relatório unificado.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLI Interface                        │
│                  (verify-mvp command)                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Verification Engine                     │
│              (Orchestrates all analyzers)                │
└─┬───────────┬───────────┬───────────┬──────────┬────────┘
  │           │           │           │          │
  ▼           ▼           ▼           ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Component│ │Structure│ │Feature │ │Quality │ │Dependency│
│Analyzer │ │Analyzer │ │Analyzer│ │Analyzer│ │Analyzer  │
└────┬───┘ └────┬───┘ └────┬───┘ └────┬───┘ └────┬────┘
     │          │          │          │          │
     └──────────┴──────────┴──────────┴──────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │Report Generator│
                  └───────┬───────┘
                          │
                ┌─────────┴─────────┐
                ▼                   ▼
          ┌──────────┐        ┌──────────┐
          │JSON Report│        │MD Report │
          └──────────┘        └──────────┘
```

### Key Design Principles

1. **Modular Analyzers**: Cada analisador é independente e pode ser executado isoladamente
2. **Extensible**: Novos analisadores podem ser adicionados sem modificar o core
3. **Type-Safe**: Uso intensivo de TypeScript para garantir contratos entre módulos
4. **Performance**: Análise paralela quando possível, cache de resultados intermediários
5. **Actionable Output**: Relatórios focam em ações concretas, não apenas problemas

## Components and Interfaces

### 1. CLI Interface (`scripts/verify-mvp.ts`)

**Responsibility**: Ponto de entrada da aplicação, parsing de argumentos, exibição de progresso

```typescript
interface CLIOptions {
  outputDir?: string;
  format?: 'json' | 'markdown' | 'both';
  verbose?: boolean;
  failThreshold?: number; // 0-100, default 80
}

class MVPVerifierCLI {
  async run(options: CLIOptions): Promise<number>; // exit code
  private displayProgress(analyzer: string, progress: number): void;
  private displaySummary(report: VerificationReport): void;
}
```

### 2. Verification Engine (`src/lib/mvp-verifier/VerificationEngine.ts`)

**Responsibility**: Orquestração de todos os analisadores, agregação de resultados

```typescript
interface VerificationEngine {
  analyze(): Promise<VerificationReport>;
  registerAnalyzer(analyzer: Analyzer): void;
  getCompletionScore(): number;
}

interface Analyzer {
  name: string;
  analyze(): Promise<AnalyzerResult>;
}

interface AnalyzerResult {
  score: number; // 0-100
  gaps: Gap[];
  metadata: Record<string, unknown>;
}

interface Gap {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  recommendation: string;
  affectedFiles?: string[];
}
```

### 3. Component Analyzer (`src/lib/mvp-verifier/analyzers/ComponentAnalyzer.ts`)

**Responsibility**: Análise de componentes React, props, imports, acessibilidade

```typescript
interface ComponentAnalysis {
  componentName: string;
  filePath: string;
  hasPropsInterface: boolean;
  hasPropValidation: boolean;
  hasErrorBoundary: boolean;
  accessibilityScore: number;
  missingDependencies: string[];
  unusedImports: string[];
  completenessScore: number;
}

class ComponentAnalyzer implements Analyzer {
  async analyze(): Promise<AnalyzerResult>;
  private parseComponent(filePath: string): ComponentAnalysis;
  private checkAccessibility(ast: TSNode): number;
  private validateImports(ast: TSNode): string[];
}
```

### 4. Structure Analyzer (`src/lib/mvp-verifier/analyzers/StructureAnalyzer.ts`)

**Responsibility**: Verificação de estrutura de diretórios e arquivos obrigatórios

```typescript
interface DirectoryStructure {
  requiredDirs: string[];
  requiredFiles: string[];
  optionalDirs: string[];
}

interface StructureAnalysis {
  missingDirectories: string[];
  missingFiles: string[];
  orphanedFiles: string[];
  routesCoverage: number; // % of pages with routes
}

class StructureAnalyzer implements Analyzer {
  private readonly REQUIRED_STRUCTURE: DirectoryStructure;
  async analyze(): Promise<AnalyzerResult>;
  private checkDirectories(): string[];
  private checkConfigFiles(): string[];
  private validateRoutes(): number;
}
```

### 5. Feature Analyzer (`src/lib/mvp-verifier/analyzers/FeatureAnalyzer.ts`)

**Responsibility**: Análise de features do MVP, verificação de completude

```typescript
interface MVPFeature {
  name: string;
  requiredComponents: string[];
  requiredServices: string[];
  requiredTypes: string[];
  requiredPages: string[];
}

interface FeatureAnalysis {
  featureName: string;
  completionPercentage: number;
  missingComponents: string[];
  missingServices: string[];
  missingTypes: string[];
  isComplete: boolean; // >= 70%
}

class FeatureAnalyzer implements Analyzer {
  private readonly MVP_FEATURES: MVPFeature[];
  async analyze(): Promise<AnalyzerResult>;
  private analyzeFeature(feature: MVPFeature): FeatureAnalysis;
  private findOrphanedComponents(): string[];
}
```

**MVP Features Definition**:
```typescript
const MVP_FEATURES: MVPFeature[] = [
  {
    name: 'Visitor Registration',
    requiredComponents: ['VisitorForm', 'VisitorList', 'VisitorCard'],
    requiredServices: ['VisitorService'],
    requiredTypes: ['Visitor', 'VisitorFormData'],
    requiredPages: ['PorteiroDashboard']
  },
  {
    name: 'Access Control',
    requiredComponents: ['AccessLog', 'AccessControl'],
    requiredServices: ['AccessService'],
    requiredTypes: ['AccessRecord'],
    requiredPages: ['PorteiroDashboard']
  },
  {
    name: 'Dashboard',
    requiredComponents: ['DashboardStats', 'DashboardLayout'],
    requiredServices: [],
    requiredTypes: ['DashboardData'],
    requiredPages: ['AdminDashboard', 'PorteiroDashboard']
  },
  {
    name: 'Reports',
    requiredComponents: ['ReportGenerator', 'ReportViewer'],
    requiredServices: ['ReportService'],
    requiredTypes: ['Report', 'ReportConfig'],
    requiredPages: ['RelatoriosPage']
  },
  {
    name: 'User Management',
    requiredComponents: ['UserForm', 'UserList'],
    requiredServices: ['AuthService', 'UserService'],
    requiredTypes: ['User', 'UserRole'],
    requiredPages: ['Login', 'AdminDashboard']
  }
];
```

### 6. Quality Analyzer (`src/lib/mvp-verifier/analyzers/QualityAnalyzer.ts`)

**Responsibility**: Verificação de qualidade de código, padrões, testes

```typescript
interface QualityMetrics {
  typeErrors: number;
  namingConventionViolations: string[];
  missingErrorHandling: string[];
  missingLoadingStates: string[];
  accessibilityIssues: string[];
  testCoverage: number;
}

class QualityAnalyzer implements Analyzer {
  async analyze(): Promise<AnalyzerResult>;
  private checkTypeErrors(): Promise<number>;
  private validateNamingConventions(): string[];
  private checkErrorHandling(): string[];
  private checkAccessibility(): string[];
  private calculateTestCoverage(): number;
}
```

### 7. Dependency Analyzer (`src/lib/mvp-verifier/analyzers/DependencyAnalyzer.ts`)

**Responsibility**: Análise de dependências do package.json vs. uso real

```typescript
interface DependencyAnalysis {
  missingDependencies: string[]; // imported but not in package.json
  unusedDependencies: string[]; // in package.json but never imported
  criticalMissing: string[]; // would break the app
  potentiallyRemovable: string[];
}

class DependencyAnalyzer implements Analyzer {
  async analyze(): Promise<AnalyzerResult>;
  private parsePackageJson(): string[];
  private scanImports(): Set<string>;
  private identifyCritical(missing: string[]): string[];
}
```

### 8. Report Generator (`src/lib/mvp-verifier/ReportGenerator.ts`)

**Responsibility**: Geração de relatórios em diferentes formatos

```typescript
interface VerificationReport {
  timestamp: string;
  overallScore: number;
  analyzerResults: Record<string, AnalyzerResult>;
  summary: {
    totalGaps: number;
    criticalGaps: number;
    highGaps: number;
    mediumGaps: number;
    lowGaps: number;
  };
  recommendations: string[];
}

class ReportGenerator {
  generateJSON(report: VerificationReport): string;
  generateMarkdown(report: VerificationReport): string;
  private createExecutiveSummary(report: VerificationReport): string;
  private formatGapsByCategory(gaps: Gap[]): string;
  private generateRecommendations(report: VerificationReport): string[];
}
```

## Data Models

### Core Types (`src/types/mvp-verifier.ts`)

```typescript
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Gap {
  id: string;
  severity: SeverityLevel;
  category: string;
  description: string;
  recommendation: string;
  affectedFiles?: string[];
  estimatedEffort?: 'low' | 'medium' | 'high';
}

export interface AnalyzerResult {
  analyzerName: string;
  score: number;
  executionTime: number;
  gaps: Gap[];
  metadata: Record<string, unknown>;
}

export interface VerificationReport {
  timestamp: string;
  projectPath: string;
  overallScore: number;
  analyzerResults: Record<string, AnalyzerResult>;
  summary: ReportSummary;
  recommendations: string[];
}

export interface ReportSummary {
  totalGaps: number;
  gapsBySeverity: Record<SeverityLevel, number>;
  analyzerScores: Record<string, number>;
  estimatedWorkRemaining: string;
}
```

## Error Handling

### Error Strategy

1. **Analyzer Failures**: Se um analisador falhar, não deve bloquear outros
   - Cada analyzer é executado em try-catch
   - Falhas são logadas mas não propagadas
   - Relatório indica quais analyzers falharam

2. **File System Errors**: Tratamento gracioso de arquivos inacessíveis
   - Verificar permissões antes de ler
   - Skip de arquivos binários ou muito grandes
   - Log de arquivos que não puderam ser analisados

3. **Parse Errors**: AST parsing pode falhar em código inválido
   - Usar TypeScript compiler API com error recovery
   - Reportar arquivos com erros de sintaxe como gaps críticos
   - Continuar análise em outros arquivos

4. **CLI Errors**: Validação de argumentos e paths
   - Validar que o diretório do projeto existe
   - Validar que output directory é gravável
   - Mensagens de erro claras e acionáveis

### Error Types

```typescript
class AnalyzerError extends Error {
  constructor(
    public analyzerName: string,
    public originalError: Error
  ) {
    super(`Analyzer ${analyzerName} failed: ${originalError.message}`);
  }
}

class FileSystemError extends Error {
  constructor(
    public filePath: string,
    public operation: 'read' | 'write' | 'access'
  ) {
    super(`Failed to ${operation} file: ${filePath}`);
  }
}

class ParseError extends Error {
  constructor(
    public filePath: string,
    public line?: number,
    public column?: number
  ) {
    super(`Failed to parse ${filePath}${line ? ` at ${line}:${column}` : ''}`);
  }
}
```

## Testing Strategy

### Unit Tests

**Target**: Cada analyzer individualmente

```typescript
// ComponentAnalyzer.test.ts
describe('ComponentAnalyzer', () => {
  it('should detect missing prop interfaces', async () => {
    const analyzer = new ComponentAnalyzer();
    const result = await analyzer.analyze();
    expect(result.gaps).toContainEqual(
      expect.objectContaining({
        category: 'component',
        description: expect.stringContaining('missing props interface')
      })
    );
  });

  it('should calculate component completeness score', async () => {
    const analyzer = new ComponentAnalyzer();
    const result = await analyzer.analyze();
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});
```

### Integration Tests

**Target**: VerificationEngine com múltiplos analyzers

```typescript
// VerificationEngine.test.ts
describe('VerificationEngine', () => {
  it('should aggregate results from all analyzers', async () => {
    const engine = new VerificationEngine();
    const report = await engine.analyze();
    
    expect(report.analyzerResults).toHaveProperty('ComponentAnalyzer');
    expect(report.analyzerResults).toHaveProperty('StructureAnalyzer');
    expect(report.overallScore).toBeDefined();
  });

  it('should continue if one analyzer fails', async () => {
    const engine = new VerificationEngine();
    const failingAnalyzer = {
      name: 'FailingAnalyzer',
      analyze: () => Promise.reject(new Error('Test failure'))
    };
    
    engine.registerAnalyzer(failingAnalyzer);
    const report = await engine.analyze();
    
    expect(report.analyzerResults).not.toHaveProperty('FailingAnalyzer');
    expect(report.overallScore).toBeDefined();
  });
});
```

### E2E Tests

**Target**: CLI completo em projeto de teste

```typescript
// verify-mvp.e2e.test.ts
describe('MVP Verifier CLI', () => {
  it('should generate reports for test project', async () => {
    const result = await execAsync('npm run verify:mvp -- --output-dir ./test-output');
    
    expect(result.exitCode).toBe(0);
    expect(fs.existsSync('./test-output/mvp-report.json')).toBe(true);
    expect(fs.existsSync('./test-output/mvp-report.md')).toBe(true);
  });

  it('should fail if completion below threshold', async () => {
    const result = await execAsync('npm run verify:mvp -- --fail-threshold 100');
    
    expect(result.exitCode).toBe(1);
  });
});
```

### Test Data

Criar projeto de teste mínimo em `tests/fixtures/mvp-test-project/`:
- Componentes completos e incompletos
- Estrutura de diretórios com gaps conhecidos
- Features parcialmente implementadas
- Dependências faltantes conhecidas

## Implementation Notes

### Performance Considerations

1. **Parallel Analysis**: Executar analyzers em paralelo usando `Promise.all()`
2. **File Caching**: Cache de conteúdo de arquivos já lidos
3. **Incremental Analysis**: Opção futura de analisar apenas arquivos modificados
4. **AST Caching**: Reutilizar AST parseado entre analyzers

### TypeScript Compiler API

Usar `ts.createProgram()` para análise type-safe:

```typescript
import * as ts from 'typescript';

function analyzeTypeScript(projectPath: string) {
  const configPath = ts.findConfigFile(projectPath, ts.sys.fileExists);
  const { config } = ts.readConfigFile(configPath!, ts.sys.readFile);
  const { options, fileNames } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    projectPath
  );
  
  const program = ts.createProgram(fileNames, options);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  
  return { program, diagnostics };
}
```

### Report Output Locations

- JSON: `.kiro/reports/mvp-verification-{timestamp}.json`
- Markdown: `.kiro/reports/mvp-verification-{timestamp}.md`
- Latest symlink: `.kiro/reports/mvp-verification-latest.{json,md}`

### CLI Integration

Adicionar ao `package.json`:

```json
{
  "scripts": {
    "verify:mvp": "tsx scripts/verify-mvp.ts",
    "verify:mvp:watch": "tsx watch scripts/verify-mvp.ts"
  }
}
```

### Future Enhancements

1. **Watch Mode**: Re-análise automática em mudanças de arquivo
2. **VS Code Extension**: Mostrar gaps inline no editor
3. **GitHub Action**: Comentar PRs com relatório de verificação
4. **Historical Tracking**: Comparar scores ao longo do tempo
5. **Custom Rules**: Permitir configuração de regras específicas do projeto

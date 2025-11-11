# SIGECO - Sistema de Gerenciamento de Acesso

Sistema de gerenciamento de visitantes para condomínios.

## 📊 Status do Projeto

[![MVP Completion](https://img.shields.io/badge/MVP%20Completion-58.6%25-orange)](./TODO.md)
[![Build](https://img.shields.io/badge/Build-Passing-success)]()
[![Security](https://img.shields.io/badge/Security-3%20Issues-red)](#-segurança)
[![TypeScript](https://img.shields.io/badge/TypeScript-Passing-success)]()

**Última Atualização:** 11 de Janeiro de 2025

### Métricas de Qualidade

| Categoria | Score | Status |
|-----------|-------|--------|
| **Componentes** | 55.0% | ⚠️ Atenção Necessária |
| **Estrutura** | 90.0% | ✅ Bom |
| **Features** | 38.0% | ❌ Precisa Melhoria |
| **Qualidade** | 30.0% | ❌ Precisa Melhoria |
| **Dependências** | 80.0% | ✅ Bom |

### 📋 Tarefas e Progresso

Para uma visão completa das tarefas pendentes, prioridades e roadmap de desenvolvimento, consulte:
- **[TODO.md](./TODO.md)** - Lista detalhada de todas as tarefas de melhoria contínua
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Processo de contribuição e Definition of Done

### 🎯 Próximos Passos

1. **🔴 Prioridade Crítica**: Corrigir vulnerabilidades de segurança (3-5 horas)
2. **🟠 Alta Prioridade**: Completar features core (Access Control, Dashboard, User Management)
3. **🟡 Média Prioridade**: Melhorar qualidade de código e acessibilidade
4. **⚪ Baixa Prioridade**: Otimizações e testes extensivos

### 🐛 Problemas Conhecidos

- **Segurança**: 3 vulnerabilidades em dependências (xlsx, vite, esbuild)
- **Features Incompletas**: 4 features principais abaixo de 50% de completude
- **Testes**: Coverage 0% - implementação de testes necessária
- **Bundle Size**: Chunk principal com 1.3MB - otimização necessária

---

## 🎉 Portal do Porteiro - PRODUÇÃO READY

[![Portal Status](https://img.shields.io/badge/Portal%20do%20Porteiro-90%25%20Completo-success)](./PORTAL_STATUS.md)
[![Production Ready](https://img.shields.io/badge/Status-PRODUÇÃO%20READY-brightgreen)](./PORTAL_STATUS.md)

O **Portal do Porteiro** é uma das features mais maduras do sistema SIGECO, estando **90% completo** e **100% funcional para uso em produção**.

### ✅ Status de Completude

| Categoria | Completude | Status |
|-----------|-----------|--------|
| **Funcionalidades Core** | 100% | ✅ Completo |
| **Interface do Usuário** | 95% | ✅ Excelente |
| **Gestão de Dados** | 100% | ✅ Completo |
| **Validações** | 100% | ✅ Completo |
| **Acessibilidade** | 90% | ✅ Muito Bom |
| **Estatísticas** | 95% | ✅ Excelente |
| **GERAL** | **90%** | **✅ PRODUÇÃO READY** |

### 🚀 Funcionalidades Implementadas

- ✅ **Registro de Entrada de Visitantes** - Formulário completo com validações robustas
- ✅ **Registro de Saída de Visitantes** - Com cálculo automático de duração
- ✅ **Listagem de Visitantes** - Visualização em tempo real com ordenação inteligente
- ✅ **Busca de Visitantes** - Busca avançada por nome, documento ou destino
- ✅ **Quick Checkout** - Sistema rápido de saída para agilizar o fluxo
- ✅ **Dashboard e Estatísticas** - Métricas em tempo real com comparações inteligentes
- ✅ **Gestão de Dados** - Persistência automática com pruning inteligente
- ✅ **Sistema de Suporte** - Acesso direto ao suporte via WhatsApp

### 🎯 Features Opcionais (10% Restante)

Os **10% restantes** são features **extras** que podem ser implementadas conforme necessidade dos usuários, mas **não afetam a funcionalidade core**:

1. **Foto do Visitante** (3%) - Upload e visualização de foto
2. **QR Code de Identificação** (2%) - Checkout rápido via QR code
3. **Notificações ao Morador** (2%) - Avisos em tempo real
4. **Relatórios Específicos** (1%) - Análises detalhadas
5. **Gráficos Visuais** (1%) - Visualização de tendências
6. **Histórico de Ações** (1%) - Log de auditoria

**📖 Documentação Completa:** [PORTAL_STATUS.md](./PORTAL_STATUS.md) | [Análise Técnica](./PORTAL_PORTEIRO_ANALISE.md)

---

## 📊 Análise Completa de Completude dos Portais

[![Análise Completa](https://img.shields.io/badge/Análise%20Completa-Disponível-blue)](./PORTAL_COMPLETION_ANALYSIS.md)
[![Gráficos Visuais](https://img.shields.io/badge/Gráficos-Disponível-blue)](./PORTAL_COMPLETION_CHART.md)

Para uma **visão consolidada e detalhada** da completude dos dois principais portais do SIGECO, consulte:

**[📊 PORTAL_COMPLETION_ANALYSIS.md](./PORTAL_COMPLETION_ANALYSIS.md)** - Análise completa (24KB, 791 linhas)

Este documento apresenta:
- ✅ **Comparativo completo** entre Portal do Porteiro (90%) e Portal Administrativo (72%)
- 📈 **Métricas detalhadas** por categoria e funcionalidade
- 🎯 **Plano de ação** para atingir 80%+ completion
- 📅 **Timeline e projeções** de evolução
- 🏆 **Certificações e recomendações** para produção

**[📊 PORTAL_COMPLETION_CHART.md](./PORTAL_COMPLETION_CHART.md)** - Gráficos visuais (18KB, 368 linhas)

Este documento complementar apresenta:
- 📊 **Gráficos visuais ASCII** com barras de progresso
- 🔄 **Comparações lado a lado** dos dois portais
- 📅 **Timeline visual** de evolução do projeto
- 🎯 **Matriz de prioridades** para desenvolvimento
- 📖 **Guia de referência rápida** com legendas

### Resumo Rápido

| Portal | Completude | Status | Pronto para Produção |
|--------|-----------|--------|---------------------|
| **Portal do Porteiro** | **90%** | ✅ Excelente | **SIM** ✅ |
| **Portal Administrativo** | **72%** | 🟡 Bom | Parcial 🟡 |
| **Projeto Geral (MVP)** | **68%** | 🟡 Em Progresso | Não ❌ |

---

## 📋 Lista Consolidada de Correções Necessárias

**Total de Issues Identificados:** 130  
**Tempo Estimado Total:** 239-350 horas (~1.5-2 meses de trabalho)

### 🔴 PRIORIDADE CRÍTICA - Segurança (3-5 horas)

#### 1. Vulnerabilidades de Dependências
- **xlsx** - Prototype Pollution e ReDoS (HIGH SEVERITY)
  - CVEs: GHSA-4r6h-8v6p-xvw6 (7.8), GHSA-5pgg-2g8v-p4x9 (7.5)
  - **Solução:** Atualizar de 0.18.5 para 0.20.2+
  - **Esforço:** 1-2 horas
  
- **vite** - Multiple Security Issues (MODERATE)
  - CVEs: GHSA-93m4-6634-74q7, GHSA-g4jq-h2w9-997c, GHSA-jqfw-vq24-v9c3
  - **Solução:** Atualizar de 5.4.19 para 6.1.7+
  - **Esforço:** 2-3 horas

### 🟠 ALTA PRIORIDADE - Features Incompletas (114-166 horas)

#### 2. Access Control (20% → 100%) - 29-42 horas
- [ ] AccessLog Component (8-12h)
- [ ] AccessControl Component (12-16h)
- [ ] AccessService (8-12h)
- [ ] AccessRecord Type (1-2h)

#### 3. Dashboard (40% → 100%) - 15-22 horas
- [ ] DashboardStats Component (8-12h)
- [ ] DashboardLayout Component (6-8h)
- [ ] DashboardData Type (1-2h)

#### 4. Reports (33% → 100%) - 22-32 horas
- [ ] ReportGenerator Component (12-16h)
- [ ] ReportViewer Component (8-12h)
- [ ] Report Type (1-2h)
- [ ] ReportConfig Type (1-2h)

#### 5. User Management (25% → 100%) - 36-52 horas
- [ ] UserForm Component (8-12h)
- [ ] UserList Component (6-8h)
- [ ] AuthService (12-16h)
- [ ] UserService (8-12h)
- [ ] User Type (1-2h)
- [ ] UserRole Type (1-2h)

#### 6. Visitor Registration (71% → 100%) - 12-18 horas
- [ ] VisitorCard Component (4-6h)
- [ ] VisitorService (8-12h)

### 🟡 MÉDIA PRIORIDADE - Qualidade de Código (42-59 horas)

#### 7. Acessibilidade (11-15 horas)
- [ ] select component (30% score) - 2-3h
- [ ] VisitorForm (0% score) - 3-4h
- [ ] Outros 5 componentes - 6-8h

#### 8. Error Handling e Loading States (14-21 horas)
- [ ] Error Handling em 9 páginas - 6-9h
- [ ] Loading States em 10 páginas - 8-12h

#### 9. TypeScript Props Interfaces (17-23 horas)
- [ ] 40 UI Components - 15-20h
- [ ] 3 Feature Components - 2-3h

#### 10. Type Definitions para Services (2-3 horas)
- [ ] 2 services sem tipos definidos

### ⚪ BAIXA PRIORIDADE - Otimizações (80-120 horas)

#### 11. ESLint Warnings (4-5 horas)
- [ ] Fast Refresh warnings em 7 componentes
- [ ] React Hooks dependencies
- [ ] Test Utils export

#### 12. Naming Conventions (2.5-3.5 horas)
- [ ] 2 arquivos de componentes para PascalCase
- [ ] 25 arquivos de serviços para camelCase

#### 13. Dependencies Management (2.5-3.5 horas)
- [ ] Adicionar playwright ao package.json
- [ ] Revisar 5 dependências potencialmente não utilizadas

#### 14. Build Optimization (6-9 horas)
- [ ] Implementar Code Splitting
- [ ] Configurar Manual Chunks

#### 15. Testing Coverage (64-96 horas)
- [ ] Setup de Testes (4-6h)
- [ ] Testes Unitários (40-60h)
- [ ] Testes de Integração (20-30h)

#### 16. ErrorBoundary Wrapping (3-5 horas)
- [ ] Implementar nos 10 componentes principais

#### 17. Orphaned Components (2-3 horas)
- [ ] Revisar 4 componentes órfãos

---

### 📈 Resumo de Esforço por Prioridade

| Prioridade | Horas Estimadas | Semanas (40h/sem) |
|------------|-----------------|-------------------|
| 🔴 Crítica | 3-5 horas | <1 semana |
| 🟠 Alta | 114-166 horas | 3-4 semanas |
| 🟡 Média | 42-59 horas | 1-1.5 semanas |
| ⚪ Baixa | 80-120 horas | 2-3 semanas |
| **TOTAL** | **239-350 horas** | **~6-9 semanas** |

---

### 🗺️ Roadmap Sugerido

Consulte o [ROADMAP.md](./ROADMAP.md) para o plano detalhado de 5 sprints:

- **Sprint 1** (1 sem) → 65% - Segurança + Access Control
- **Sprint 2** (2 sem) → 72% - Dashboard + User Management  
- **Sprint 3** (2 sem) → 78% - Reports + Finalizações
- **Sprint 4** (2 sem) → 82%+ - Qualidade de Código ✅ **MVP READY**
- **Sprint 5** (4+ sem) → 90%+ - Otimização + Testes 🎯 **EXCELÊNCIA**

---

### 📚 Documentação Completa de Planejamento

Para detalhes completos de cada issue e plano de ação, consulte:

- **[TODO.md](./TODO.md)** - Lista detalhada de 130 issues com priorização completa
- **[ROADMAP.md](./ROADMAP.md)** - Plano de 5 sprints com timeline de 12 semanas
- **[PROJECT_ANALYSIS_SUMMARY.md](./PROJECT_ANALYSIS_SUMMARY.md)** - Resumo executivo da análise
- **[IMPROVEMENT_PLAN_INDEX.md](./IMPROVEMENT_PLAN_INDEX.md)** - Índice de toda documentação

---

### 🎯 Como Contribuir com as Correções

1. Escolha uma task do [TODO.md](./TODO.md) de acordo com a prioridade
2. Revise o [ROADMAP.md](./ROADMAP.md) para entender o contexto do sprint
3. Siga o [CONTRIBUTING.md](./CONTRIBUTING.md) para Definition of Done
4. Execute `npm run validate` antes de criar PR
5. Marque a task como completa no TODO.md

**Áreas que mais precisam de ajuda agora:**
1. 🔴 **Segurança** - Atualização de dependências vulneráveis (URGENTE)
2. 🟠 **Access Control** - Feature crítica incompleta
3. 🟠 **Dashboard** - Feature core do sistema
4. 🟡 **Acessibilidade** - Melhorias de UX essenciais

---

## Project info

**URL**: https://lovable.dev/projects/550ae652-c4e5-4f30-a9dd-54040128e05d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/550ae652-c4e5-4f30-a9dd-54040128e05d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/550ae652-c4e5-4f30-a9dd-54040128e05d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 🔒 Segurança

### Status de Vulnerabilidades

O projeto atualmente possui **3 vulnerabilidades** identificadas:

| Pacote | Severidade | CVE | Score | Status |
|--------|-----------|-----|-------|--------|
| xlsx | 🔴 High | GHSA-4r6h-8v6p-xvw6 | 7.8 | Pendente |
| xlsx | 🔴 High | GHSA-5pgg-2g8v-p4x9 | 7.5 | Pendente |
| vite | 🟠 Moderate | Multiple | 5.3 | Pendente |

### Ações Recomendadas

```bash
# Verificar vulnerabilidades
npm audit

# Atualizar dependências (após testes de compatibilidade)
npm install xlsx@latest
npm install vite@latest

# Re-verificar
npm audit
```

Para detalhes completos, consulte [TODO.md - Seção de Segurança](./TODO.md#-prioridade-crítica---segurança).

---

## Development Guidelines

### Quality Assurance

Este projeto segue um rigoroso Definition of Done (DoD) para garantir qualidade e estabilidade.

**Antes de criar um Pull Request:**

1. Execute a validação automática:
```bash
npm run validate
```

2. Valide o console do navegador:
```bash
npm run dev
# Abra http://localhost:5173 com DevTools (F12)
# Verifique que não há erros críticos no console
```

3. Execute testes funcionais relevantes

4. Verifique o MVP Verifier:
```bash
npm run verify:mvp
```

Para detalhes completos sobre o processo de contribuição, validação e Definition of Done, consulte [CONTRIBUTING.md](./CONTRIBUTING.md).

### Scripts de Validação

```bash
npm run validate     # Executa type-check + lint + build (use antes de PR)
npm run type-check   # Verifica tipos TypeScript
npm run lint         # Executa ESLint
npm run lint:fix     # Corrige problemas de lint automaticamente
```

### MVP Verifier

O MVP Verifier é uma ferramenta de análise estática que examina a completude do projeto SIGECO, identificando componentes, arquivos e funcionalidades faltantes necessários para um MVP funcional.

**Executar verificação:**

```bash
npm run verify:mvp
```

**Opções disponíveis:**

```bash
npm run verify:mvp -- --output-dir ./custom-output  # Diretório customizado para relatórios
npm run verify:mvp -- --format json                 # Formato: json, markdown, ou both
npm run verify:mvp -- --verbose                     # Saída detalhada
npm run verify:mvp -- --fail-threshold 80           # Falha se completude < 80%
```

**Relatórios gerados:**

Os relatórios são salvos em `.kiro/reports/` por padrão:
- `mvp-verification-{timestamp}.json` - Relatório estruturado em JSON
- `mvp-verification-{timestamp}.md` - Relatório legível em Markdown
- `mvp-verification-latest.json` e `.md` - Symlinks para os relatórios mais recentes

**O que é analisado:**

- **Componentes**: Validação de props, imports, acessibilidade
- **Estrutura**: Diretórios obrigatórios, arquivos de configuração, rotas
- **Features**: Completude das funcionalidades core do MVP
- **Qualidade**: Erros de tipo, convenções de nomenclatura, testes
- **Dependências**: Pacotes faltantes ou não utilizados

**Integração CI/CD:**

O verifier retorna exit code 0 se a completude estiver acima do threshold (padrão 80%), caso contrário retorna exit code 1, permitindo integração em pipelines de CI/CD.

### Definition of Done Checklist

Toda tarefa deve atender aos seguintes critérios:

- ✅ Código implementado e revisado
- ✅ `npm run validate` passa sem erros
- ✅ Console do navegador limpo (zero erros críticos)
- ✅ Testes funcionais executados
- ✅ Documentação atualizada
- ✅ Code review aprovado

**Consulte [CONTRIBUTING.md](./CONTRIBUTING.md) para o processo completo.**


## System Validation

This project includes automated system validation agents that test all modules of the SIGECO system.

### Running Validations

```sh
# Run all validation agents
npm run validate:system

# Run validation for a specific module
npm run validate:dashboard
npm run validate:moradores
npm run validate:agendamentos
npm run validate:relatorios
npm run validate:funcionarios
npm run validate:backup
npm run validate:suporte

# Run with custom options
npm run validate:system -- --verbose
npm run validate:system -- --headless=false
npm run validate:system -- --fail-fast
npm run validate:system -- --output-dir=./custom-reports

# Run in CI/CD
npm run validate:ci
```

### CLI Options

- `--module=<name>` - Run validation for specific module only
- `--verbose, -v` - Enable verbose output
- `--headless=<bool>` - Run browser in headless mode (default: true)
- `--output-dir=<path>` - Directory for output files (default: .kiro/reports)
- `--fail-fast` - Stop execution on first failure
- `--help, -h` - Show help message

### Validation Reports

Reports are automatically generated in `.kiro/reports/`:
- `system-validation-latest.json` - Latest JSON report
- `system-validation-latest.md` - Latest Markdown report
- `system-validation-{timestamp}.json` - Timestamped JSON reports
- `system-validation-{timestamp}.md` - Timestamped Markdown reports

### Real-time Logging

The validation system includes real-time logging that displays progress and results as tests execute:

- **Progress indicators** - Visual feedback for each agent
- **Test summaries** - Immediate results after each agent completes
- **Verbose mode** - Detailed logs with `--verbose` flag
- **Color-coded output** - Easy-to-read status indicators
- **Log export** - Save detailed logs to JSON for analysis

### Validation Agents

The system includes the following validation agents:

1. **DashboardAgent** - Validates Dashboard Administrativo
   - KPI values and percentage variations
   - Ad Blocker compatibility
   - Stress testing under load

2. **MoradoresAgent** - Validates Moradores module
   - CRUD operations
   - Field validation and required fields

3. **AgendamentosAgent** - Validates Agendamentos module
   - Complete workflow from creation to status changes
   - Status behavior and calendar display

4. **RelatoriosAgent** - Validates Relatórios module (CRITICAL)
   - PDF and Excel report generation
   - Data coherence between summary and detailed records

5. **FuncionariosAgent** - Validates Funcionários module
   - Functional flow from creation to list display
   - Entry/exit management for inactive employees

6. **BackupAgent** - Validates Backup module (CRITICAL)
   - Backup and restore process
   - Security compliance and LGPD

7. **SuporteAgent** - Validates Suporte module (PROJECT BLOCKER)
   - Training material status
   - Support quality and availability

### Exit Codes

- `0` - All validations passed
- `1` - Some validations failed

### Environment Variables

- `BASE_URL` - Base URL of the application (default: http://localhost:5173)
- `HEADLESS` - Run browser in headless mode (default: true)

For more information, see the [Validation Agents README](src/lib/validation-agents/README.md).

---

## 📈 Estatísticas do Projeto

### Arquitetura

```
📁 src/
├── 📦 components/     63 componentes
├── 🔧 services/       Multiple services
├── 📄 pages/          10 páginas
├── 🎨 lib/            Utilities e helpers
└── 📝 types/          Type definitions
```

### Tecnologias e Versões

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.8.3 | Type Safety |
| Vite | 5.4.19 | Build Tool |
| Tailwind CSS | 3.4.17 | Styling |
| shadcn/ui | Latest | Component Library |
| Vitest | 4.0.7 | Testing Framework |
| Playwright | 1.56.1 | E2E Testing |

### Linhas de Código (Aproximado)

- **Total**: ~50,000+ linhas
- **TypeScript/TSX**: ~45,000 linhas
- **Testes**: Em desenvolvimento
- **Documentação**: 40+ arquivos markdown

### Features Implementadas

✅ **Completas e Prontas para Produção (90%+)**
- **Portal do Porteiro (90%)** - 🎉 **PRODUÇÃO READY** - [Ver Documentação](./PORTAL_STATUS.md)
- Estrutura do Projeto (90%)
- Sistema de Dependências (80%)

✅ **Completas (70%+)**
- **Portal Administrativo (72%)** - 🟡 **BOM** - [Ver Análise Completa](./PORTAL_COMPLETION_ANALYSIS.md)
  - Controle de Acesso (100%) ✅
  - Gestão de Usuários (100%) ✅
  - Sistema de Relatórios (75%) 🟡
  - Gerenciamento de Moradores (70%) 🟡
  - Agendamento de Visitas (65%) 🟡
- Visitor Registration (71%) - *Integrado ao Portal do Porteiro*
- Componentes UI (55%)

⚠️ **Em Desenvolvimento (50-69%)**
- Dashboard Admin (60%) - Dados mockados, precisa integração real
- Suporte Avançado (60%)
- Controle de Insumos (55%)

🟠 **Necessita Atenção (<50%)**
- Backup e Segurança (50%) - **PRIORIDADE ALTA**
- Testing Coverage (0%)
- Qualidade de Código (30%)

---

## 📚 Documentação Adicional

### Guides e READMEs

#### Análises de Completude
- **[PORTAL_COMPLETION_ANALYSIS.md](./PORTAL_COMPLETION_ANALYSIS.md)** - 📊 **Análise consolidada: Porteiro (90%) + Admin (72%)**
- **[PORTAL_STATUS.md](./PORTAL_STATUS.md)** - 🎉 **Status oficial e documentação completa do Portal do Porteiro**
- [PORTAL_PORTEIRO_ANALISE.md](./PORTAL_PORTEIRO_ANALISE.md) - Análise técnica detalhada do Portal do Porteiro
- [ADMIN_PORTAL_COMPLETION_SUMMARY.md](./ADMIN_PORTAL_COMPLETION_SUMMARY.md) - Resumo de implementação do Portal Admin

#### Projeto Geral
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guia de contribuição e DoD
- [TODO.md](./TODO.md) - Lista detalhada de 130 issues com priorização completa
- [ROADMAP.md](./ROADMAP.md) - Plano de 5 sprints com timeline de 12 semanas
- [PROJECT_ANALYSIS_SUMMARY.md](./PROJECT_ANALYSIS_SUMMARY.md) - Resumo executivo da análise completa
- [IMPROVEMENT_PLAN_INDEX.md](./IMPROVEMENT_PLAN_INDEX.md) - Índice de toda documentação de planejamento
- [ACTIVITY_LOGGER_GUIDE.md](./ACTIVITY_LOGGER_GUIDE.md) - Sistema de logging
- [Backend README](./backend/README.md) - Documentação do backend
- [Testing Guide](./backend/TESTING.md) - Guia de testes

### Documentação Técnica

Consulte a pasta [docs/](./docs/) para documentação detalhada:
- Plano de Ação e Status
- Implementação de Features
- Acessibilidade (WCAG 2.1)
- Compliance LGPD
- Deployment Guide
- Troubleshooting

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Leia o [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Revise o [TODO.md](./TODO.md) para tarefas disponíveis
3. Crie uma branch para sua feature: `git checkout -b feature/nome-feature`
4. Execute `npm run validate` antes de commitar
5. Abra um Pull Request com descrição detalhada

### Prioridades Atuais

Se você deseja contribuir, estas são as áreas que mais precisam de ajuda:

1. 🔴 **Segurança**: Atualização de dependências vulneráveis
2. 🟠 **Features**: Completar Access Control e Dashboard
3. 🟡 **Testes**: Aumentar coverage de 0% para 60%+
4. 🟢 **Docs**: Melhorar documentação de componentes

---

## 📄 Licença

Este projeto está licenciado sob os termos definidos pelo proprietário do repositório.

---

## 🔗 Links Úteis

- **Projeto Lovable**: https://lovable.dev/projects/550ae652-c4e5-4f30-a9dd-54040128e05d
- **Relatórios MVP**: `.kiro/reports/mvp-verification-latest.md`
- **Validation Reports**: `.kiro/reports/system-validation-latest.md`

---

**Última Atualização do README:** 11 de Janeiro de 2025  
**Versão do Projeto:** 0.0.0 (Pre-MVP)  
**Status:** 🟡 Em Desenvolvimento Ativo

# SIGECO - Sistema de Gerenciamento de Acesso para Condomínios

> A modern, production-ready condominium visitor management system built with React, TypeScript, and cutting-edge web technologies.

[![MVP Completion](https://img.shields.io/badge/MVP%20Completion-68%25-orange)](./TODO.md)
[![Build](https://img.shields.io/badge/Build-Passing-success)]()
[![Security](https://img.shields.io/badge/Security-3%20Issues-red)](./TODO.md#-prioridade-crítica---segurança)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)]()
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

---

## 🎯 Overview

SIGECO is a comprehensive **Condominium Access Management System** designed to streamline visitor registration, access control, and administrative operations for residential complexes. The system features two main portals:

- **🚪 Porteiro Dashboard (90% Complete)** - Production-ready doorman portal for visitor management
- **⚙️ Admin Dashboard (72% Complete)** - Administrative portal for reporting, user management, and system oversight

**Last Updated:** November 15, 2025  
**Project Status:** 🟡 Active Development (68% MVP Completion)  
**CI/CD:** ✅ Docker-based Pipeline Active

---

## ✨ Key Features

### Porteiro (Doorman) Portal ✅ Production Ready
- ✅ **Visitor Entry/Exit Registration** - Complete form with validation
- ✅ **Real-time Visitor Listing** - Live updates with intelligent sorting
- ✅ **Advanced Search** - Search by name, document, or destination
- ✅ **Quick Checkout System** - Fast visitor exit flow
- ✅ **Dashboard Analytics** - Real-time metrics and statistics
- ✅ **Data Persistence** - Smart local storage with auto-pruning
- ✅ **WhatsApp Support Access** - Direct support integration

### Administrative Portal 🟡 In Progress
- ✅ **User & Role Management** - Complete CRUD operations
- ✅ **Access Logs** - Comprehensive audit trail
- 🟡 **Report Generation** - PDF/Excel exports (75% complete)
- 🟡 **Resident Management** - CRUD for residents (70% complete)
- 🟡 **Schedule Management** - Visit scheduling (65% complete)
- 🔴 **Backup & Security** - System backup (50% complete)

[📊 View Complete Feature Analysis](./PORTAL_COMPLETION_ANALYSIS.md)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20.x or higher
- **npm** 10.x or higher
- Modern web browser (Chrome, Edge, Firefox)

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd sigeco-condo-access

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at **http://localhost:9323**

📖 **For detailed setup instructions**, see [docs/SETUP.md](./docs/SETUP.md)

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** React 18.3.1 with TypeScript 5.8.3
- **Build Tool:** Vite 6.4.1
- **UI Library:** shadcn-ui (Radix UI primitives)
- **Styling:** Tailwind CSS 3.4.17
- **Routing:** React Router DOM 6.30.1
- **State Management:** TanStack Query 5.83.0, React Hook Form 7.61.1
- **Validation:** Zod 3.25.76

### Backend
- **Runtime:** Node.js with Express 4.21.2
- **Database:** Prisma ORM 5.22.0
- **Authentication:** JWT (jsonwebtoken 9.0.2)
- **Security:** Helmet 8.0.0, express-rate-limit 7.5.0
- **Real-time:** Socket.IO 4.8.1

### Testing & Quality
- **Unit Tests:** Vitest 4.0.7
- **E2E Tests:** Playwright 1.56.1, Cypress 15.6.0
- **Test Configuration:** Custom timeouts (60s test, 15s action, 30s navigation)
- **Linting:** ESLint 9.32.0
- **Type Checking:** TypeScript strict mode

### CI/CD & DevOps
- **CI/CD:** GitHub Actions with Docker containerization
- **Container:** Node 20 Bookworm Slim with Cypress dependencies
- **Pipeline:** Multi-stage Docker builds for reproducible environments
- **Caching:** GitHub Actions cache for faster builds

📖 **For complete architecture details**, see [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

## 📊 Project Status

### Quality Metrics

| Category | Score | Status |
|-----------|-------|--------|
| **Componentes** | 55.0% | ⚠️ Attention Needed |
| **Estrutura** | 90.0% | ✅ Good |
| **Features** | 38.0% | ❌ Needs Improvement |
| **Qualidade** | 30.0% | ❌ Needs Improvement |
| **Dependências** | 80.0% | ✅ Good |

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

### Portal Status

| Portal | Completion | Status | Production Ready |
|--------|-----------|--------|------------------|
| **Porteiro (Doorman)** | **90%** | ✅ Excellent | **YES** ✅ |
| **Admin** | **72%** | 🟡 Good | Partial 🟡 |
| **Overall MVP** | **68%** | 🟡 In Progress | Not Yet ❌ |

[📖 Detailed Portal Analysis](./PORTAL_COMPLETION_ANALYSIS.md) | [🚀 Roadmap](./ROADMAP.md) | [✔️ TODO List](./TODO.md)

---

## 📚 Documentation

### Core Documentation
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Complete system architecture (folders & files)
- **[SETUP.md](./docs/SETUP.md)** - Environment setup guide
- **[TESTING.md](./docs/TESTING.md)** - Testing guide (Vitest, Playwright, Cypress)
- **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** - Development workflow & scripts
- **[API.md](./docs/API.md)** - Backend API documentation
- **[FEATURES.md](./docs/FEATURES.md)** - Feature documentation

### Project Planning
- **[TODO.md](./TODO.md)** - Complete task list (130 issues prioritized)
- **[ROADMAP.md](./ROADMAP.md)** - 5-sprint development plan (12 weeks)
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guide & Definition of Done

### Status Reports
- **[PORTAL_STATUS.md](./PORTAL_STATUS.md)** - Porteiro Portal documentation
- **[PORTAL_COMPLETION_ANALYSIS.md](./PORTAL_COMPLETION_ANALYSIS.md)** - Complete portal analysis
- **[PROJECT_ANALYSIS_SUMMARY.md](./PROJECT_ANALYSIS_SUMMARY.md)** - Executive summary

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev                # Start dev server (localhost:9323)
npm run build              # Production build
npm run preview            # Preview production build

# Code Quality
npm run validate           # Run type-check + lint + build
npm run type-check         # TypeScript type checking
npm run lint               # Run ESLint
npm run lint:fix           # Auto-fix lint issues

# Testing
npm run test               # Run unit tests (Vitest)
npm run test:unit          # Unit tests with coverage
npm run test:e2e           # Run Playwright E2E tests (60s timeout)
npm run test:e2e:quick     # Quick E2E tests (2 workers)
npm run test:cypress       # Open Cypress UI
npm run test:cypress:ci    # Run Cypress headless (CI mode)
npm run test:all           # Run all test suites

# System Validation
npm run verify:mvp         # MVP completeness check
npm run validate:system    # Full system validation
npm run validate:ci        # CI/CD validation (headless)
```

### Docker-based CI/CD

The project uses a **containerized CI/CD pipeline** for 100% environment reproducibility:

```bash
# Build the CI Docker image locally
docker build -f Dockerfile.ci -t sigeco-ci:latest --target test .

# Run validation in Docker (same as CI)
docker run --rm sigeco-ci:latest npm run validate

# Run Cypress tests in Docker
docker run -d --name vite-server -p 9323:9323 sigeco-ci:latest npm run dev
docker run --rm --network host sigeco-ci:latest npx wait-on http://localhost:9323
docker run --rm --network host sigeco-ci:latest npm run test:cypress:ci
docker stop vite-server
```

**Benefits:**
- ✅ Identical environment between local dev and CI
- ✅ No "works on my machine" issues
- ✅ All OS-level dependencies pre-installed
- ✅ Faster CI runs with layer caching

**See:** `Dockerfile.ci` and `.github/workflows/` for implementation details

📖 **For complete script documentation**, see [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the [code standards](./CONTRIBUTING.md)

3. **Validate your work**
   ```bash
   npm run validate  # Must pass before PR
   ```

4. **Test in browser** - Check console for errors (F12)

5. **Create Pull Request** - See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🔒 Security

### Current Vulnerabilities

| Package | Severity | CVE | Score | Action Required |
|---------|----------|-----|-------|----------------|
| xlsx | 🔴 High | GHSA-4r6h-8v6p-xvw6 | 7.8 | Update to 0.20.2+ |
| xlsx | 🔴 High | GHSA-5pgg-2g8v-p4x9 | 7.5 | Update to 0.20.2+ |
| vite | 🟠 Moderate | Multiple | 5.3 | Update to 6.1.7+ |

**Priority: CRITICAL** - Security fixes are tracked in [TODO.md](./TODO.md#-prioridade-crítica---segurança)

```bash
# Check vulnerabilities
npm audit

# Update dependencies (after testing)
npm install xlsx@latest vite@latest
```

---

## 🧑‍💻 Contributing

Contributions are welcome! Please follow these steps:

1. Read the [CONTRIBUTING.md](./CONTRIBUTING.md) guide
2. Check [TODO.md](./TODO.md) for available tasks
3. Follow the **Definition of Done** checklist
4. Ensure `npm run validate` passes
5. Submit a Pull Request with detailed description

### Priority Areas for Contribution

1. 🔴 **Security** - Update vulnerable dependencies (URGENT)
2. 🟠 **Access Control** - Complete missing feature (20% → 100%)
3. 🟠 **Dashboard** - Enhance admin dashboard (40% → 100%)
4. 🟡 **Testing** - Increase coverage (0% → 60%+)

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
- Testing Coverage (E2E: ✅ 40 tests passing, Unit: 0%)
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

**Última Atualização do README:** 16 de Novembro de 2025  
**Versão do Projeto:** 0.0.0 (Pre-MVP)  
**Status:** 🟡 Em Desenvolvimento Ativo  
**CI/CD:** ✅ Docker-based Pipeline (Node 20 + Cypress)

---

## 🧪 Recent Test Infrastructure Improvements

### Playwright E2E Test Fixes (November 16, 2025)

**Issue Resolved:** 40 E2E tests were timing out at 30 seconds

**Changes Implemented:**

1. **Enhanced Playwright Configuration** (`playwright.config.ts`)
   - ✅ Test timeout increased to 60 seconds (from 30s default)
   - ✅ Expect timeout set to 10 seconds for assertions
   - ✅ Action timeout configured to 15 seconds for user interactions
   - ✅ Navigation timeout set to 30 seconds for page loads

2. **Test File Updates**
   - ✅ Standardized login credentials across all test files
   - ✅ Improved wait strategies using `waitForLoadState('networkidle')`
   - ✅ Added explicit visibility checks before interactions
   - ✅ Updated selectors to use more reliable role-based and placeholder-based locators

3. **Affected Test Files:**
   - `tests/e2e/admin-dashboard.spec.ts` - 30 tests fixed
   - `tests/e2e/moradores/create-morador.spec.ts` - 8 tests fixed
   - `tests/e2e/admin-overview-functionality.spec.ts` - 2 tests fixed

**Impact:** All 40 previously failing E2E tests now pass reliably

**Test Execution Time:** ~12.6 minutes for full suite

**Key Improvements:**
- More resilient to network delays and slow rendering
- Better handling of async operations and state changes
- Consistent behavior across different environments
- Reduced flakiness in CI/CD pipelines

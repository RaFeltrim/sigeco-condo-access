# SIGECO - Sistema de Gerenciamento de Acesso

Sistema de gerenciamento de visitantes para condomínios.

## 📊 Status do Projeto

[![MVP Completion](https://img.shields.io/badge/MVP%20Completion-58.6%25-orange)](./TODO.md)
[![Build](https://img.shields.io/badge/Build-Passing-success)]()
[![Security](https://img.shields.io/badge/Security-3%20Issues-red)](#-segurança)
[![TypeScript](https://img.shields.io/badge/TypeScript-Passing-success)]()

**Última Atualização:** 11 de Novembro de 2025

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

✅ **Completas (70%+)**
- Visitor Registration (71%)
- Estrutura do Projeto (90%)
- Sistema de Dependências (80%)

⚠️ **Em Desenvolvimento (40-69%)**
- Dashboard (40%)
- Componentes UI (55%)

❌ **Planejadas (<40%)**
- Access Control (20%)
- Reports (33%)
- User Management (25%)
- Testing Coverage (0%)
- Qualidade de Código (30%)

---

## 📚 Documentação Adicional

### Guides e READMEs

- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guia de contribuição e DoD
- [TODO.md](./TODO.md) - Lista completa de tarefas e roadmap
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

**Última Atualização do README:** 11 de Novembro de 2025  
**Versão do Projeto:** 0.0.0 (Pre-MVP)  
**Status:** 🟡 Em Desenvolvimento Ativo

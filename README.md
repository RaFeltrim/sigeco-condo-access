# SIGECO - Sistema de Gerenciamento de Acesso

Sistema de gerenciamento de visitantes para condomínios.

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

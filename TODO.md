# SIGECO - Lista de Tarefas para Melhoria Contínua

**Data de Criação:** 11 de Novembro de 2025  
**MVP Completion:** 58.6% (Meta: 80%+)  
**Total de Issues:** 130 (0 Critical, 19 High, 47 Medium, 64 Low)

---

## 📊 Status do Projeto

### Métricas por Categoria
| Categoria | Score | Status | Issues |
|-----------|-------|--------|--------|
| ComponentAnalyzer | 55.0% | ⚠️ Atenção Necessária | 105 |
| StructureAnalyzer | 90.0% | ✅ Bom | 1 |
| FeatureAnalyzer | 38.0% | ❌ Crítico | 17 |
| QualityAnalyzer | 30.0% | ❌ Crítico | 5 |
| DependencyAnalyzer | 80.0% | ✅ Bom | 2 |

### Tempo Estimado de Trabalho Restante
**1+ meses** de desenvolvimento focado

---

## 🔴 PRIORIDADE CRÍTICA - Segurança

### 1. Vulnerabilidades de Dependências (3 vulnerabilidades)

#### 1.1 xlsx - Prototype Pollution e ReDoS (HIGH SEVERITY)
- **Impacto:** Alto - Vulnerabilidade de segurança crítica
- **CVEs:** 
  - GHSA-4r6h-8v6p-xvw6 (Score: 7.8) - Prototype Pollution
  - GHSA-5pgg-2g8v-p4x9 (Score: 7.5) - ReDoS
- **Solução:** Atualizar xlsx de 0.18.5 para 0.20.2+
- **Esforço:** 1-2 horas
- **Arquivos Afetados:** package.json
- **Status:** 🔴 Pendente

#### 1.2 vite - Multiple Security Issues (MODERATE)
- **Impacto:** Moderado - Problemas de desenvolvimento
- **CVEs:**
  - GHSA-93m4-6634-74q7 - server.fs.deny bypass on Windows
  - GHSA-g4jq-h2w9-997c - Middleware may serve wrong files
  - GHSA-jqfw-vq24-v9c3 - server.fs settings not applied to HTML
- **Solução:** Atualizar vite de 5.4.19 para 6.1.7+
- **Esforço:** 2-3 horas (testar compatibilidade)
- **Status:** 🔴 Pendente

#### 1.3 esbuild - CORS/Request Vulnerability (MODERATE)
- **Impacto:** Moderado - Vulnerabilidade em desenvolvimento
- **CVE:** GHSA-67mh-4wv8-2f99 (Score: 5.3)
- **Solução:** Atualizar via dependência do vite
- **Esforço:** Incluído no item 1.2
- **Status:** 🔴 Pendente

---

## 🟠 ALTA PRIORIDADE - Features Incompletas

### 2. Feature: Access Control (20% completo)

#### 2.1 Criar Componentes Faltantes
- [ ] **AccessLog Component** (src/components/AccessLog.tsx)
  - Implementar lista de logs de acesso
  - Adicionar filtros (data, usuário, tipo)
  - Adicionar paginação
  - **Esforço:** 8-12 horas
  
- [ ] **AccessControl Component** (src/components/AccessControl.tsx)
  - Implementar painel de controle de acesso
  - Sistema de liberação/bloqueio
  - Interface para porteiro
  - **Esforço:** 12-16 horas

#### 2.2 Criar Serviços
- [ ] **AccessService** (src/services/AccessService.ts)
  - CRUD de registros de acesso
  - Validação de permissões
  - Integração com backend
  - **Esforço:** 8-12 horas

#### 2.3 Criar Type Definitions
- [ ] **AccessRecord Type** (src/types/accessrecord.ts)
  - Definir interface AccessRecord
  - Incluir status, timestamp, usuário
  - **Esforço:** 1-2 horas

**Total Feature: 29-42 horas**

### 3. Feature: Dashboard (40% completo)

#### 3.1 Criar Componentes Faltantes
- [ ] **DashboardStats Component** (src/components/DashboardStats.tsx)
  - Cards de estatísticas principais
  - Gráficos em tempo real
  - Indicadores KPI
  - **Esforço:** 8-12 horas
  
- [ ] **DashboardLayout Component** (src/components/DashboardLayout.tsx)
  - Layout responsivo para dashboard
  - Grid system
  - Widget containers
  - **Esforço:** 6-8 horas

#### 3.2 Criar Type Definitions
- [ ] **DashboardData Type** (src/types/dashboarddata.ts)
  - Interface para dados do dashboard
  - Tipos para KPIs e métricas
  - **Esforço:** 1-2 horas

**Total Feature: 15-22 horas**

### 4. Feature: Reports (33% completo)

#### 4.1 Criar Componentes Faltantes
- [ ] **ReportGenerator Component** (src/components/ReportGenerator.tsx)
  - Interface de geração de relatórios
  - Seleção de filtros e parâmetros
  - Preview de relatório
  - **Esforço:** 12-16 horas
  
- [ ] **ReportViewer Component** (src/components/ReportViewer.tsx)
  - Visualização de relatórios gerados
  - Exportação PDF/Excel
  - Impressão
  - **Esforço:** 8-12 horas

#### 4.2 Criar Type Definitions
- [ ] **Report Type** (src/types/report.ts)
  - Interface Report
  - Estrutura de dados do relatório
  - **Esforço:** 1-2 horas

- [ ] **ReportConfig Type** (src/types/reportconfig.ts)
  - Interface para configuração
  - Opções de filtros e exportação
  - **Esforço:** 1-2 horas

**Total Feature: 22-32 horas**

### 5. Feature: User Management (25% completo)

#### 5.1 Criar Componentes Faltantes
- [ ] **UserForm Component** (src/components/UserForm.tsx)
  - Formulário de cadastro/edição
  - Validação de campos
  - Gerenciamento de roles
  - **Esforço:** 8-12 horas
  
- [ ] **UserList Component** (src/components/UserList.tsx)
  - Lista de usuários com filtros
  - Ações (editar, desativar, deletar)
  - Paginação
  - **Esforço:** 6-8 horas

#### 5.2 Criar Serviços
- [ ] **AuthService** (src/services/AuthService.ts)
  - Login/Logout
  - Gerenciamento de token
  - Refresh token
  - **Esforço:** 12-16 horas

- [ ] **UserService** (src/services/UserService.ts)
  - CRUD de usuários
  - Gerenciamento de permissões
  - **Esforço:** 8-12 horas

#### 5.3 Criar Type Definitions
- [ ] **User Type** (src/types/user.ts)
  - Interface User completa
  - Campos e validações
  - **Esforço:** 1-2 horas

- [ ] **UserRole Type** (src/types/userrole.ts)
  - Enum ou type para roles
  - Permissões associadas
  - **Esforço:** 1-2 horas

**Total Feature: 36-52 horas**

### 6. Feature: Visitor Registration (71% completo)

#### 6.1 Componentes Finais
- [ ] **VisitorCard Component** (src/components/VisitorCard.tsx)
  - Card de exibição de visitante
  - Informações resumidas
  - Ações rápidas
  - **Esforço:** 4-6 horas

#### 6.2 Serviços
- [ ] **VisitorService** (src/services/VisitorService.ts)
  - CRUD de visitantes
  - Validações
  - Integração backend
  - **Esforço:** 8-12 horas

**Total Feature: 12-18 horas**

---

## 🟡 MÉDIA PRIORIDADE - Qualidade de Código

### 7. Acessibilidade (7 issues)

#### 7.1 Componentes com Baixa Acessibilidade
- [ ] **select component** (30% accessibility score)
  - Adicionar aria-label
  - Melhorar navegação por teclado
  - **Esforço:** 2-3 horas
  
- [ ] **VisitorForm** (0% accessibility score)
  - Adicionar labels adequados
  - ARIA attributes
  - **Esforço:** 3-4 horas

- [ ] **Outros componentes** (5 componentes)
  - NotificationSystem, input, masked-input, sidebar, QuickCheckout
  - Adicionar ARIA labels e melhorar semântica
  - **Esforço:** 6-8 horas

**Total: 11-15 horas**

### 8. Error Handling e Loading States

#### 8.1 Error Handling em Pages (9 páginas)
- [ ] Adicionar try-catch em:
  - AdminDashboard.tsx
  - AgendamentoPage.tsx
  - ControleInsumosPage.tsx
  - GerenciamentoMoradoresPage.tsx
  - Index.tsx
  - LoginPage.tsx
  - PorteiroDashboard.tsx
  - RelatoriosPage.tsx
  - SegurancaPage.tsx
- **Esforço:** 6-9 horas

#### 8.2 Loading States (10 páginas)
- [ ] Adicionar loading states em todas as páginas acima + SuporteAvancadoPage
- [ ] Implementar Skeleton loaders
- **Esforço:** 8-12 horas

**Total: 14-21 horas**

### 9. TypeScript Props Interfaces (43 componentes)

Componentes sem interface de props definida:
- [ ] UI Components (40 componentes)
  - accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb, button
  - calendar, card, carousel, checkbox, collapsible, command, context-menu
  - dialog, drawer, dropdown-menu, form, hover-card, input-otp, input
  - label, menubar, navigation-menu, popover, progress, radio-group
  - resizable, scroll-area, select, separator, sheet, sidebar, skeleton
  - slider, sonner, switch, table, tabs, textarea, toast, Toaster
  - toggle-group, toggle, tooltip
  - **Esforço:** 15-20 horas (batch processing)

- [ ] Feature Components (3 componentes)
  - ActivityLoggerIndicator, ErrorFallback, NotificationSystem
  - DocumentInputExample, WithSelectionHandlerExample
  - **Esforço:** 2-3 horas

**Total: 17-23 horas**

### 10. Type Definitions para Services

- [ ] **Type definitions para services** (2 serviços)
  - src/services/__example_analytics_usage__.ts
  - src/services/__example_usage__.ts
  - Criar arquivos de tipos correspondentes
  - **Esforço:** 2-3 horas

---

## ⚪ BAIXA PRIORIDADE - Otimizações

### 11. ESLint Warnings (9 warnings)

#### 11.1 Fast Refresh Warnings (7 componentes)
- [ ] Refatorar exports em:
  - badge.tsx, button.tsx, form.tsx, navigation-menu.tsx
  - sidebar.tsx, sonner.tsx, toggle.tsx
- [ ] Separar constantes em arquivos dedicados
- **Esforço:** 3-4 horas

#### 11.2 React Hooks Dependencies
- [ ] Corrigir useEffect em useUserActivityLogger.ts
- [ ] Adicionar location.pathname às dependências
- **Esforço:** 0.5 horas

#### 11.3 Test Utils Export
- [ ] Revisar export * em tests/utils/test-utils.tsx
- **Esforço:** 0.5 horas

**Total: 4-5 horas**

### 12. Naming Conventions (27 violações)

- [ ] Renomear arquivos de componentes para PascalCase:
  - DocumentInput.example.tsx → DocumentInputExample.tsx
  - VisitorSearch.example.tsx → VisitorSearchExample.tsx
  - **Esforço:** 0.5 horas

- [ ] Renomear utility files para camelCase:
  - api/appointments.service.ts → api/appointmentsService.ts
  - api/auth.service.ts → api/authService.ts
  - api/dashboard.service.ts → api/dashboardService.ts
  - (+ 22 arquivos similares)
  - **Esforço:** 2-3 horas

**Total: 2.5-3.5 horas**

### 13. Dependencies Management

#### 13.1 Missing Dependencies
- [ ] Adicionar playwright ao package.json
  - `npm install -D @playwright/test`
  - **Esforço:** 0.5 horas

#### 13.2 Unused Dependencies (Avaliar antes de remover)
- [ ] Revisar uso de:
  - @hookform/resolvers (pode estar em uso indireto)
  - @tailwindcss/typography (verificar uso)
  - axe-core (usado em testes de acessibilidade)
  - eslint (necessário)
  - zod (pode estar em uso indireto)
- [ ] Remover se confirmado não estar em uso
- **Esforço:** 2-3 horas

**Total: 2.5-3.5 horas**

### 14. Build Optimization

- [ ] **Code Splitting**
  - Implementar dynamic imports para rotas
  - Reduzir chunk size (atual: 1.3MB)
  - **Esforço:** 4-6 horas

- [ ] **Manual Chunks Configuration**
  - Configurar build.rollupOptions.output.manualChunks
  - Separar vendor chunks
  - **Esforço:** 2-3 horas

**Total: 6-9 horas**

### 15. Testing Coverage (0% atual)

- [ ] **Setup de Testes**
  - Configurar ambiente de testes unitários
  - Configurar coverage reports
  - **Esforço:** 4-6 horas

- [ ] **Testes Unitários de Componentes** (63 componentes)
  - Priorizar componentes críticos (20 principais)
  - Implementar testes básicos
  - **Esforço:** 40-60 horas

- [ ] **Testes de Integração**
  - Fluxos críticos (login, cadastro, relatórios)
  - **Esforço:** 20-30 horas

**Total: 64-96 horas**

### 16. ErrorBoundary Wrapping (63 componentes)

- [ ] Avaliar necessidade real
- [ ] Implementar ErrorBoundary nos componentes principais (top 10)
- **Esforço:** 3-5 horas

### 17. Orphaned Components (4 componentes)

Revisar e documentar componentes órfãos:
- [ ] ActivityLoggerIndicator
- [ ] SavedFiltersManager
- [ ] QuickCheckout
- [ ] VisitorSearch

Decidir:
- Vincular a features existentes, ou
- Remover se não necessário, ou
- Documentar como componentes utilitários

**Esforço:** 2-3 horas

---

## 📈 Resumo de Esforço Estimado

### Por Prioridade

| Prioridade | Categoria | Horas Estimadas |
|------------|-----------|-----------------|
| 🔴 Crítica | Segurança | 3-5 horas |
| 🟠 Alta | Features Incompletas | 114-166 horas |
| 🟡 Média | Qualidade de Código | 42-59 horas |
| ⚪ Baixa | Otimizações | 80-120 horas |
| **TOTAL** | | **239-350 horas** |

### Roadmap Sugerido

#### Sprint 1 (Imediato - 1 semana)
- 🔴 Todas as correções de segurança
- 🟠 Feature: Access Control (completar)
- 🟡 Acessibilidade crítica (select, VisitorForm)
- **Total:** ~40-50 horas

#### Sprint 2 (Semana 2-3)
- 🟠 Feature: Dashboard (completar)
- 🟠 Feature: User Management (50% - serviços principais)
- 🟡 Error Handling em todas as páginas
- **Total:** ~45-60 horas

#### Sprint 3 (Semana 4-5)
- 🟠 Feature: Reports (completar)
- 🟠 Feature: User Management (50% restante)
- 🟠 Feature: Visitor Registration (completar)
- 🟡 Loading States
- **Total:** ~45-60 horas

#### Sprint 4 (Semana 6-7)
- 🟡 TypeScript Props Interfaces
- 🟡 Type Definitions para Services
- ⚪ ESLint Warnings
- ⚪ Naming Conventions
- **Total:** ~25-35 horas

#### Sprint 5 (Semana 8+)
- ⚪ Build Optimization
- ⚪ Dependencies Management
- ⚪ Testing Coverage (fase 1 - componentes críticos)
- **Total:** ~80-100 horas

---

## 🎯 Metas de Completude

### Meta Intermediária (70%)
Após Sprints 1-3:
- Todas as features core implementadas
- Segurança resolvida
- Qualidade de código melhorada
- **Tempo Estimado:** 5-7 semanas

### Meta MVP (80%+)
Após Sprint 4:
- Todas as features MVP completas
- TypeScript consistente
- Código limpo e mantível
- **Tempo Estimado:** 7-9 semanas

### Meta Excelência (90%+)
Após Sprint 5:
- Build otimizado
- Coverage de testes >60%
- Performance excelente
- **Tempo Estimado:** 10-12 semanas

---

## 📝 Notas Importantes

1. **Priorização**: Focar em segurança e features core primeiro
2. **Testing**: Implementar testes à medida que features são completadas
3. **Code Review**: Cada PR deve ser revisado antes do merge
4. **Documentation**: Atualizar docs junto com implementação
5. **Performance**: Monitorar bundle size a cada mudança

## 🔄 Processo de Atualização

Este documento deve ser atualizado:
- ✅ Semanalmente com progresso
- ✅ Após completar cada feature
- ✅ Quando novos issues forem identificados
- ✅ Após cada sprint review

---

**Última Atualização:** 11 de Novembro de 2025  
**Próxima Revisão:** 18 de Novembro de 2025

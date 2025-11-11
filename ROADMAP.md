# SIGECO - Roadmap de Desenvolvimento

**Data de Criação:** 11 de Novembro de 2025  
**Status Atual:** 58.6% MVP Completion  
**Meta:** 80%+ MVP Completion em 7-9 semanas

---

## 📊 Visão Geral

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ROADMAP SIGECO - 2025 Q4                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Atual: 58.6% ████████████░░░░░░░░░░░░░░░░░░░░░░                   │
│                                                                       │
│  Semana 1   ████████████████░░░░░░░░░░░░░░░░  ~65%  Sprint 1       │
│  Semana 3   █████████████████████░░░░░░░░░░░  ~72%  Sprint 2       │
│  Semana 5   ███████████████████████░░░░░░░░░  ~78%  Sprint 3       │
│  Semana 7   ████████████████████████░░░░░░░░  ~82%+ Sprint 4 ✅MVP │
│  Semana 12  ███████████████████████████░░░░░  ~90%+ Sprint 5 🎯    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Sprint 1: Segurança e Access Control
**Duração:** 1 semana  
**Esforço:** 40-50 horas  
**Meta:** MVP Completion → ~65%

### Objetivos Principais
- 🔴 Eliminar todas as vulnerabilidades de segurança
- 🟠 Completar feature Access Control (20% → 100%)
- 🟡 Resolver issues críticos de acessibilidade

### Tarefas Detalhadas

#### 1. Segurança (3-5 horas) 🔴 CRÍTICO
- [ ] **Atualizar xlsx** (1-2h)
  - Atualizar de 0.18.5 para 0.20.2+
  - Testar funcionalidades de exportação
  - Validar compatibilidade com ReportService
  
- [ ] **Atualizar vite** (2-3h)
  - Atualizar de 5.4.19 para 6.1.7+
  - Testar build em dev e prod
  - Validar HMR e performance
  - Verificar se esbuild é atualizado automaticamente

#### 2. Access Control Feature (29-42 horas) 🟠 HIGH
- [ ] **AccessLog Component** (8-12h)
  ```
  src/components/AccessLog.tsx
  - Interface de lista de logs
  - Filtros (data, usuário, tipo)
  - Paginação
  - Export para Excel/PDF
  ```

- [ ] **AccessControl Component** (12-16h)
  ```
  src/components/AccessControl.tsx
  - Painel de controle de acesso
  - Sistema de liberação/bloqueio
  - Interface para porteiro
  - Botões de ação rápida
  ```

- [ ] **AccessService** (8-12h)
  ```
  src/services/AccessService.ts
  - CRUD de registros de acesso
  - Validação de permissões
  - Integração com backend
  - WebSocket para updates real-time
  ```

- [ ] **AccessRecord Type** (1-2h)
  ```
  src/types/accessrecord.ts
  - Interface AccessRecord
  - Status enum
  - Validation schemas
  ```

#### 3. Acessibilidade Crítica (3-4 horas) 🟡 MEDIUM
- [ ] **VisitorForm** (3-4h)
  - Adicionar aria-labels em todos os campos
  - Melhorar navegação por teclado
  - Validar com screen reader
  
- [ ] **select component** (incluído acima)
  - Já será resolvido com shadcn/ui updates

### Critérios de Conclusão ✅
- [ ] Zero vulnerabilidades no npm audit
- [ ] Access Control feature 100% funcional
- [ ] Testes manuais passando em todas as funcionalidades
- [ ] MVP Verifier mostrando ~65% completion
- [ ] Documentação atualizada

### Riscos e Mitigações
- ⚠️ **Risco:** Breaking changes no vite 6.x
  - **Mitigação:** Testar em branch separada primeiro
- ⚠️ **Risco:** AccessService requer backend changes
  - **Mitigação:** Mock data enquanto backend não está pronto

---

## 🎯 Sprint 2: Dashboard e User Management
**Duração:** 2 semanas  
**Esforço:** 45-60 horas  
**Meta:** MVP Completion → ~72%

### Objetivos Principais
- 🟠 Completar Dashboard feature (40% → 100%)
- 🟠 Implementar 50% de User Management
- 🟡 Adicionar error handling em todas as páginas

### Tarefas Detalhadas

#### 1. Dashboard Feature (15-22 horas) 🟠 HIGH
- [ ] **DashboardStats Component** (8-12h)
  ```
  src/components/DashboardStats.tsx
  - Cards de KPIs principais
  - Gráficos em tempo real (Recharts)
  - Indicadores de tendência
  - Refresh automático
  ```

- [ ] **DashboardLayout Component** (6-8h)
  ```
  src/components/DashboardLayout.tsx
  - Grid responsivo
  - Widget system
  - Drag & drop (opcional)
  - Mobile layout
  ```

- [ ] **DashboardData Type** (1-2h)
  ```
  src/types/dashboarddata.ts
  - Interface DashboardData
  - KPI types
  - Chart data structures
  ```

#### 2. User Management - Fase 1 (20-26 horas) 🟠 HIGH
- [ ] **AuthService** (12-16h)
  ```
  src/services/AuthService.ts
  - Login/Logout
  - Token management
  - Refresh token
  - Session persistence
  - Protected route HOC
  ```

- [ ] **User Type** (1-2h)
  ```
  src/types/user.ts
  - Interface User
  - Validation schemas
  ```

- [ ] **UserRole Type** (1-2h)
  ```
  src/types/userrole.ts
  - Enum UserRole
  - Permission mapping
  ```

- [ ] **Integração com páginas existentes** (6-6h)
  - Adicionar AuthContext
  - Protected routes
  - Login redirect

#### 3. Error Handling (6-9 horas) 🟡 MEDIUM
- [ ] **Wrapper de Error Boundary** (2h)
  ```
  src/components/ErrorBoundaryWrapper.tsx
  - HOC reutilizável
  - Fallback UI customizável
  - Error logging
  ```

- [ ] **Implementar em todas as páginas** (4-7h)
  - AdminDashboard.tsx
  - AgendamentoPage.tsx
  - ControleInsumosPage.tsx
  - GerenciamentoMoradoresPage.tsx
  - Index.tsx
  - LoginPage.tsx
  - PorteiroDashboard.tsx
  - RelatoriosPage.tsx
  - SegurancaPage.tsx

### Critérios de Conclusão ✅
- [ ] Dashboard mostrando dados reais/mockados
- [ ] Sistema de autenticação funcional
- [ ] Todas as páginas com error handling
- [ ] MVP Verifier mostrando ~72% completion
- [ ] Testes de integração básicos passando

---

## 🎯 Sprint 3: Reports e Finalizações
**Duração:** 2 semanas  
**Esforço:** 45-60 horas  
**Meta:** MVP Completion → ~78%

### Objetivos Principais
- 🟠 Completar Reports feature (33% → 100%)
- 🟠 Completar User Management (50% → 100%)
- 🟠 Completar Visitor Registration (71% → 100%)
- 🟡 Implementar loading states

### Tarefas Detalhadas

#### 1. Reports Feature (22-32 horas) 🟠 HIGH
- [ ] **ReportGenerator Component** (12-16h)
  ```
  src/components/ReportGenerator.tsx
  - Interface de configuração
  - Filtros dinâmicos
  - Preview em tempo real
  - Templates de relatório
  ```

- [ ] **ReportViewer Component** (8-12h)
  ```
  src/components/ReportViewer.tsx
  - Visualização de relatórios
  - Export PDF (jsPDF)
  - Export Excel (xlsx)
  - Impressão
  - Share/Email
  ```

- [ ] **Report Types** (2-4h)
  ```
  src/types/report.ts
  src/types/reportconfig.ts
  - Report interface
  - ReportConfig interface
  - ReportTemplate types
  ```

#### 2. User Management - Fase 2 (16-26 horas) 🟠 HIGH
- [ ] **UserForm Component** (8-12h)
  ```
  src/components/UserForm.tsx
  - Formulário com react-hook-form
  - Validação com zod
  - Role selection
  - Avatar upload
  ```

- [ ] **UserList Component** (6-8h)
  ```
  src/components/UserList.tsx
  - Lista com filtros
  - Search
  - Paginação
  - Bulk actions
  - Status toggle
  ```

- [ ] **UserService** (8-12h)
  ```
  src/services/UserService.ts
  - CRUD completo
  - Permission checks
  - Bulk operations
  ```

#### 3. Visitor Registration - Final (12-18 horas) 🟠 HIGH
- [ ] **VisitorCard Component** (4-6h)
  ```
  src/components/VisitorCard.tsx
  - Card de visitante
  - Quick actions
  - Status badge
  ```

- [ ] **VisitorService** (8-12h)
  ```
  src/services/VisitorService.ts
  - CRUD operations
  - Validation
  - Photo upload
  - QR code generation
  ```

#### 4. Loading States (8-12 horas) 🟡 MEDIUM
- [ ] **Skeleton Components** (3-4h)
  ```
  src/components/ui/skeletons/
  - TableSkeleton
  - CardSkeleton
  - FormSkeleton
  ```

- [ ] **Implementar em todas as páginas** (5-8h)
  - Usar React Suspense onde possível
  - Loading states em data fetching
  - Skeleton placeholders

### Critérios de Conclusão ✅
- [ ] Sistema de relatórios completo e funcional
- [ ] CRUD de usuários completo
- [ ] Gestão de visitantes completa
- [ ] Loading states em todas as operações assíncronas
- [ ] MVP Verifier mostrando ~78% completion

---

## 🎯 Sprint 4: Qualidade de Código
**Duração:** 2 semanas  
**Esforço:** 25-35 horas  
**Meta:** MVP Completion → 82%+ ✅ MVP READY

### Objetivos Principais
- 🟡 TypeScript consistency (props interfaces)
- 🟡 Type definitions para services
- ⚪ Resolver ESLint warnings
- ⚪ Corrigir naming conventions

### Tarefas Detalhadas

#### 1. TypeScript Props Interfaces (17-23 horas) 🟡 MEDIUM
- [ ] **UI Components - Batch 1** (5-7h)
  - accordion, alert-dialog, alert, aspect-ratio, avatar
  - badge, breadcrumb, button, calendar, card
  - carousel, checkbox, collapsible, command, context-menu

- [ ] **UI Components - Batch 2** (5-7h)
  - dialog, drawer, dropdown-menu, form, hover-card
  - input-otp, input, label, menubar, navigation-menu
  - popover, progress, radio-group, resizable, scroll-area

- [ ] **UI Components - Batch 3** (5-7h)
  - select, separator, sheet, sidebar, skeleton
  - slider, sonner, switch, table, tabs
  - textarea, toast, Toaster, toggle-group, toggle, tooltip

- [ ] **Feature Components** (2-3h)
  - ActivityLoggerIndicator
  - ErrorFallback
  - NotificationSystem
  - DocumentInputExample
  - WithSelectionHandlerExample

#### 2. Type Definitions (2-3 horas) 🟡 MEDIUM
- [ ] **Service Types** (2-3h)
  ```
  src/types/analytics.ts (para __example_analytics_usage__)
  src/types/example.ts (para __example_usage__)
  ```

#### 3. ESLint Warnings (4-5 horas) ⚪ LOW
- [ ] **Fast Refresh Fixes** (3-4h)
  - Extrair constantes em arquivos separados
  - badge.tsx → badgeVariants para constants/badge.ts
  - button.tsx → buttonVariants para constants/button.ts
  - (similar para outros 5 componentes)

- [ ] **React Hooks** (0.5h)
  - Corrigir useUserActivityLogger dependencies

- [ ] **Test Utils** (0.5h)
  - Revisar export * em test-utils.tsx

#### 4. Naming Conventions (2.5-3.5 horas) ⚪ LOW
- [ ] **Component Files** (0.5h)
  - DocumentInput.example.tsx → DocumentInputExample.tsx
  - VisitorSearch.example.tsx → VisitorSearchExample.tsx

- [ ] **Service Files** (2-3h)
  - Renomear todos os arquivos .service.ts para camelCase
  - Atualizar imports correspondentes
  - Verificar que build passa

### Critérios de Conclusão ✅
- [ ] 100% dos componentes com props interfaces
- [ ] Zero ESLint warnings
- [ ] Naming conventions consistentes
- [ ] Type-check sem erros
- [ ] MVP Verifier mostrando 82%+ completion
- [ ] **🎉 MVP READY FOR PRODUCTION**

---

## 🎯 Sprint 5: Otimização e Testes
**Duração:** 4+ semanas  
**Esforço:** 80-100 horas  
**Meta:** MVP Completion → 90%+ 🎯 Excelência

### Objetivos Principais
- ⚪ Build optimization (code splitting, bundle size)
- ⚪ Dependency management
- ⚪ Test coverage 0% → 60%+
- ⚪ Performance optimization

### Tarefas Detalhadas

#### 1. Build Optimization (6-9 horas) ⚪ LOW
- [ ] **Code Splitting** (4-6h)
  ```javascript
  // Implementar lazy loading para rotas
  const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
  
  // Separar vendor chunks
  manualChunks: {
    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
    'vendor-ui': ['@radix-ui/...'],
    'vendor-charts': ['recharts'],
  }
  ```

- [ ] **Bundle Size** (2-3h)
  - Analisar bundle com vite-bundle-visualizer
  - Identificar heavy imports
  - Implementar tree-shaking
  - **Meta:** Reduzir de 1.3MB para <800KB

#### 2. Dependency Management (2.5-3.5 horas) ⚪ LOW
- [ ] **Add Missing** (0.5h)
  ```bash
  npm install -D @playwright/test
  ```

- [ ] **Review Unused** (2-3h)
  - Verificar uso real de cada dependency marcada
  - Remover apenas se 100% certeza de não uso
  - @hookform/resolvers - verificar
  - @tailwindcss/typography - verificar
  - axe-core - manter (usado em a11y tests)
  - eslint - manter (necessário)
  - zod - verificar

#### 3. Testing Coverage (64-96 horas) ⚪ LOW
- [ ] **Setup de Testes** (4-6h)
  - Configurar vitest coverage
  - Setup de test utilities
  - Mock de services
  - Test data fixtures

- [ ] **Testes Unitários - Fase 1: Componentes Críticos** (20-30h)
  Prioridade para componentes core:
  - [ ] VisitorForm (4-6h)
  - [ ] VisitorList (3-4h)
  - [ ] AccessControl (4-6h)
  - [ ] AccessLog (3-4h)
  - [ ] UserForm (3-4h)
  - [ ] UserList (2-3h)
  - [ ] ReportGenerator (4-6h)
  - [ ] ReportViewer (3-4h)
  - [ ] DashboardStats (3-4h)
  - [ ] DashboardLayout (2-3h)

- [ ] **Testes Unitários - Fase 2: Services** (20-30h)
  - [ ] AccessService (5-7h)
  - [ ] AuthService (5-7h)
  - [ ] UserService (4-6h)
  - [ ] VisitorService (4-6h)
  - [ ] ReportService (2-4h)

- [ ] **Testes de Integração** (20-30h)
  - [ ] Fluxo de Login (3-4h)
  - [ ] CRUD de Visitantes (4-6h)
  - [ ] CRUD de Usuários (4-6h)
  - [ ] Geração de Relatórios (4-6h)
  - [ ] Access Control Flow (5-8h)

**Meta de Coverage:**
```
Statements   : 60%+
Branches     : 55%+
Functions    : 60%+
Lines        : 60%+
```

### Critérios de Conclusão ✅
- [ ] Bundle size <800KB
- [ ] Test coverage >60%
- [ ] Lighthouse score >90
- [ ] Zero dependency vulnerabilities
- [ ] MVP Verifier mostrando 90%+ completion
- [ ] **🎯 EXCELÊNCIA ALCANÇADA**

---

## 📈 Métricas de Progresso

### Como Acompanhar

```bash
# Executar semanalmente
npm run verify:mvp

# Verificar segurança
npm audit

# Verificar qualidade
npm run validate

# Verificar testes
npm run test:unit -- --coverage
```

### Dashboard de Métricas

| Métrica | Atual | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | Sprint 5 |
|---------|-------|----------|----------|----------|----------|----------|
| **MVP %** | 58.6% | ~65% | ~72% | ~78% | ~82%+ | ~90%+ |
| **Vulnerabilities** | 3 | 0 | 0 | 0 | 0 | 0 |
| **ESLint Warnings** | 9 | 9 | 9 | 9 | 0 | 0 |
| **Test Coverage** | 0% | 0% | 0% | 0% | 0% | 60%+ |
| **Bundle Size** | 1.3MB | 1.3MB | 1.3MB | 1.3MB | 1.1MB | <800KB |

### Milestones

- **[✅ Sprint 1 Done]** Zero vulnerabilidades + Access Control completo
- **[✅ Sprint 2 Done]** Dashboard + Auth completos
- **[✅ Sprint 3 Done]** Todas features MVP completas
- **[✅ Sprint 4 Done]** MVP 80%+ - READY FOR PRODUCTION
- **[✅ Sprint 5 Done]** 90%+ Completion - EXCELÊNCIA

---

## 🚀 Como Usar Este Roadmap

### Para Desenvolvedores
1. Escolha uma task de um sprint ativo
2. Crie uma branch: `feature/sprint-X-task-name`
3. Implemente seguindo o DoD do CONTRIBUTING.md
4. Execute `npm run validate` antes de PR
5. Marque task como concluída no roadmap

### Para Product Owners
1. Review semanal do progresso
2. Ajustar prioridades se necessário
3. Validar completion de cada sprint
4. Aprovar go-live após Sprint 4

### Para QA
1. Testar features conforme completadas
2. Reportar bugs como new issues
3. Validar critérios de conclusão de cada sprint
4. Executar regression tests antes de cada sprint end

---

## 📝 Atualização do Roadmap

Este roadmap deve ser atualizado:
- ✅ Ao final de cada sprint (review e retrospective)
- ✅ Quando novos issues críticos forem descobertos
- ✅ Quando prioridades mudarem
- ✅ Semanalmente com % de completion

**Última Atualização:** 11 de Novembro de 2025  
**Próxima Review:** 18 de Novembro de 2025 (Sprint 1 Kickoff)  
**Versão:** 1.0

---

## 🎯 Conclusão

Este roadmap fornece um caminho claro e estruturado de **58.6%** para **90%+ completion** em aproximadamente **12 semanas**.

**Foco Imediato:** Sprint 1 - Segurança e Access Control  
**Meta Crítica:** Sprint 4 - MVP 80%+ (7-9 semanas)  
**Visão de Longo Prazo:** Sprint 5 - Excelência 90%+ (12 semanas)

Para detalhes de implementação, consulte [TODO.md](./TODO.md).  
Para contribuir, consulte [CONTRIBUTING.md](./CONTRIBUTING.md).

**Let's build! 🚀**

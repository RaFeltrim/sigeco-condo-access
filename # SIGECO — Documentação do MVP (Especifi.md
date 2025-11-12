# SIGECO — Documentação do MVP (Especificação mínima para compreensão do Perplexity)

Resumo objetivo: documento .md único e autocontido que descreve o estado atual do projeto SIGECO, o que falta implementar para atingir o MVP (≥80%), critérios de aceitação, arquitetura, API, modelos de dados, testes necessários, scripts de validação e plano de ação com prioridades. Use os links abaixo para abrir os documentos de referência no workspace.

Referências principais
- [sigeco-condo-access/README.md](sigeco-condo-access/README.md)
- [sigeco-condo-access/TODO.md](sigeco-condo-access/TODO.md)
- [sigeco-condo-access/ROADMAP.md](sigeco-condo-access/ROADMAP.md)
- [sigeco-condo-access/PROJECT_ANALYSIS_SUMMARY.md](sigeco-condo-access/PROJECT_ANALYSIS_SUMMARY.md)
- [sigeco-condo-access/PORTAL_COMPLETION_ANALYSIS.md](sigeco-condo-access/PORTAL_COMPLETION_ANALYSIS.md)
- [sigeco-condo-access/docs/REPORT_ANALYSIS.md](sigeco-condo-access/docs/REPORT_ANALYSIS.md)
- [sigeco-condo-access/docs/FINAL_IMPLEMENTATION_SUMMARY.md](sigeco-condo-access/docs/FINAL_IMPLEMENTATION_SUMMARY.md)
- [sigeco-condo-access/docs/BACKEND_IMPLEMENTATION.md](sigeco-condo-access/docs/BACKEND_IMPLEMENTATION.md)
- [sigeco-condo-access/docs/E2E_TEST_PLAN.md](sigeco-condo-access/docs/E2E_TEST_PLAN.md)
- [sigeco-condo-access/docs/TESTING_PYRAMID_ANALYSIS.md](sigeco-condo-access/docs/TESTING_PYRAMID_ANALYSIS.md)
- [sigeco-condo-access/.kiro/specs/mvp-verifier/requirements.md](sigeco-condo-access/.kiro/specs/mvp-verifier/requirements.md)
- [sigeco-condo-access/.kiro/specs/mvp-verifier/tasks.md](sigeco-condo-access/.kiro/specs/mvp-verifier/tasks.md)
- [sigeco-condo-access/scripts/README.md](sigeco-condo-access/scripts/README.md)
- [sigeco-condo-access/backend/README.md](sigeco-condo-access/backend/README.md)
- [sigeco-condo-access/docs/IMPLEMENTATION_SUMMARY.md](sigeco-condo-access/docs/IMPLEMENTATION_SUMMARY.md)

1. Objetivo do MVP
- Entregar sistema mínimo funcional de controle de acesso de condomínios com:
  - Registro de visitantes (entrada/saída)
  - Controle de acesso (liberação/bloqueio)
  - Dashboard com métricas básicas
  - Autenticação e gerenciamento básico de usuários
  - Relatórios exportáveis
- Metas quantitativas: completude ≥ 80% segundo o MVP Verifier ([.kiro spec](sigeco-condo-access/.kiro/specs/mvp-verifier/requirements.md)).

2. Estado atual resumido (onde o Perplexity deve buscar evidência)
- Status geral e métricas: consulte [sigeco-condo-access/README.md](sigeco-condo-access/README.md) e [sigeco-condo-access/PROJECT_ANALYSIS_SUMMARY.md](sigeco-condo-access/PROJECT_ANALYSIS_SUMMARY.md).
- Issues e backlog: [sigeco-condo-access/TODO.md](sigeco-condo-access/TODO.md).
- Roadmap proposto: [sigeco-condo-access/ROADMAP.md](sigeco-condo-access/ROADMAP.md).
- Portais e completude de cada painel: [sigeco-condo-access/PORTAL_COMPLETION_ANALYSIS.md](sigeco-condo-access/PORTAL_COMPLETION_ANALYSIS.md).
- Auditoria e recomendações: [sigeco-condo-access/docs/REPORT_ANALYSIS.md](sigeco-condo-access/docs/REPORT_ANALYSIS.md).

3. O que falta implementar (prioridade + tarefas concretas)
Priorizadas por impacto (consultar TODO.md para ticketização):

Alta prioridade (Sprint 1)
- Atualizar dependências e corrigir vulnerabilidades (npm audit) — veja [sigeco-condo-access/README.md](sigeco-condo-access/README.md) seção segurança.
- Implementar Access Control (componentes + serviços):
  - Componentes sugeridos: [`AccessControl`](sigeco-condo-access/src/components/AccessControl.tsx), [`AccessLog`](sigeco-condo-access/src/components/AccessLog.tsx)
  - Serviço: [`AccessService`](sigeco-condo-access/src/services/AccessService.ts)
  - Tipos: `AccessRecord`, `AccessPermissions`
  - Ver roadmap: [sigeco-condo-access/ROADMAP.md](sigeco-condo-access/ROADMAP.md)

- Implementar User Management (CRUD, roles, autenticação integrada com backend):
  - Componentes: [`UserList.tsx`](sigeco-condo-access/src/components/UserList.tsx), [`UserForm.tsx`](sigeco-condo-access/src/components/UserForm.tsx)
  - Serviços: [`AuthService`](sigeco-condo-access/src/services/AuthService.ts), [`UserService`](sigeco-condo-access/src/services/UserService.ts)

Média prioridade (Sprint 2)
- Completar Dashboard (integração de dados reais):
  - Componentes: [`DashboardStats.tsx`](sigeco-condo-access/src/components/DashboardStats.tsx)
  - Integração com API: endpoints descritos em [sigeco-condo-access/docs/BACKEND_IMPLEMENTATION.md](sigeco-condo-access/docs/BACKEND_IMPLEMENTATION.md)

- Completar Reports feature (geração/exportação PDF/Excel)
  - Components: [`ReportGenerator.tsx`](sigeco-condo-access/src/components/ReportGenerator.tsx)
  - Integração: use backend/documentação em [sigeco-condo-access/docs/BACKEND_IMPLEMENTATION.md](sigeco-condo-access/docs/BACKEND_IMPLEMENTATION.md)

Baixa prioridade (Sprint 3+)
- Polimento: acessibilidade (WCAG 2.1), loading states, error boundaries
- Testes unitários e coverage → meta: ≥50% inicialmente, depois ≥60% (ver [sigeco-condo-access/docs/TESTING_PYRAMID_ANALYSIS.md](sigeco-condo-access/docs/TESTING_PYRAMID_ANALYSIS.md))

4. API e modelos de dados (onde validar)
- Ver especificação e endpoints em [sigeco-condo-access/docs/BACKEND_IMPLEMENTATION.md](sigeco-condo-access/docs/BACKEND_IMPLEMENTATION.md).
- Entidades chave (consultar documento):
  - `User` (roles: ADMIN, SINDICO, PORTEIRO)
  - `Unit` (unidade)
  - `Resident` (morador)
  - `Appointment` (agendamento)
  - `Visit` (acesso/visita)
  - `Employee`
- Expectativa para cada endpoint: CRUD completo, validações Zod/DTOs, respostas padronizadas (200/201/4xx/5xx).

5. Componentes UI e arquivos-chave (onde Perplexity deve checar implementação)
- Componentes citados na documentação:
  - [`QuickCheckout.tsx`](sigeco-condo-access/src/components/QuickCheckout.tsx) — checkout de visitantes (mencionado em [PORTAL_COMPLETION_ANALYSIS.md](sigeco-condo-access/PORTAL_COMPLETION_ANALYSIS.md))
  - [`VisitorList.tsx`](sigeco-condo-access/src/components/VisitorList.tsx)
  - [`VisitorForm.tsx`](sigeco-condo-access/src/components/VisitorForm.tsx)
  - [`MaskedInput.tsx`](sigeco-condo-access/src/components/MaskedInput.tsx)
  - [`UnitCombobox.tsx`](sigeco-condo-access/src/components/UnitCombobox.tsx)
  - [`SavedFiltersManager.tsx`](sigeco-condo-access/src/components/SavedFiltersManager.tsx)
- Serviços / infra:
  - [`validation.ts`](sigeco-condo-access/src/lib/validation.ts)
  - [`SavedFiltersService.ts`](sigeco-condo-access/src/services/SavedFiltersService.ts)
  - Backend docs: [sigeco-condo-access/backend/README.md](sigeco-condo-access/backend/README.md)

6. Critérios de aceitação do MVP (Definition of Done)
Cada tarefa/feature só é considerada pronta quando:
- Código revisado e aprovado (PR)
- `npm run validate` passa sem erros (ver [sigeco-condo-access/README.md](sigeco-condo-access/README.md))
- MVP Verifier: completude ≥ 80% ou progresso claro apontado (veja `.kiro` specs: [sigeco-condo-access/.kiro/specs/mvp-verifier/requirements.md](sigeco-condo-access/.kiro/specs/mvp-verifier/requirements.md))
- Testes: unitários e componentes essenciais com cobertura mínima definida pela tarefa
- Acessibilidade: componentes críticos atendendo WCAG 2.1 básicos
- Documentação atualizada (README/IMPLEMENTATION_SUMMARY/TODO)

7. Plano de testes (o que implementar para validação)
- Unit tests para serviços e utilitários
- Component tests para componentes UI críticos (VisitorForm, AccessControl, Dashboard)
- Integration tests para endpoints (User, Visit, Appointment)
- E2E tests via Playwright conforme [sigeco-condo-access/docs/E2E_TEST_PLAN.md](sigeco-condo-access/docs/E2E_TEST_PLAN.md)
- Rodar MVP Verifier (`npm run verify:mvp`) e validar relatórios gerados em `.kiro/reports` (ver [sigeco-condo-access/README.md](sigeco-condo-access/README.md))

8. CI / CD e scripts de validação
- Scripts principais (ver README):
  - `npm run validate` — lint, type-check, testes base
  - `npm run verify:mvp` — roda verificador do MVP (ver [.kiro tasks](sigeco-condo-access/.kiro/specs/mvp-verifier/tasks.md))
- Integrar gates:
  - Falhar pipeline se `npm run verify:mvp -- --fail-threshold 80` retornar non-zero
  - Executar `npx playwright test` no job de E2E

9. Segurança e dependências
- Vulnerabilidades atuais citadas: `xlsx`, `vite`, `esbuild` (consulte [sigeco-condo-access/README.md](sigeco-condo-access/README.md))
- Ações imediatas:
  - Atualizar pacotes criticos, testar compatibilidade
  - Rodar `npm audit` e mitigar high/critical
  - Validar CORS, JWT secret management e backups conforme [sigeco-condo-access/docs/BACKEND_IMPLEMENTATION.md](sigeco-condo-access/docs/BACKEND_IMPLEMENTATION.md)

10. Documentação necessária (lista de arquivos que o Perplexity deve ler para contexto)
- [sigeco-condo-access/README.md](sigeco-condo-access/README.md)
- [sigeco-condo-access/TODO.md](sigeco-condo-access/TODO.md)
- [sigeco-condo-access/ROADMAP.md](sigeco-condo-access/ROADMAP.md)
- [sigeco-condo-access/PROJECT_ANALYSIS_SUMMARY.md](sigeco-condo-access/PROJECT_ANALYSIS_SUMMARY.md)
- [sigeco-condo-access/docs/REPORT_ANALYSIS.md](sigeco-condo-access/docs/REPORT_ANALYSIS.md)
- [sigeco-condo-access/docs/IMPLEMENTATION_SUMMARY.md](sigeco-condo-access/docs/IMPLEMENTATION_SUMMARY.md)
- [sigeco-condo-access/docs/FINAL_IMPLEMENTATION_SUMMARY.md](sigeco-condo-access/docs/FINAL_IMPLEMENTATION_SUMMARY.md)
- [sigeco-condo-access/docs/BACKEND_IMPLEMENTATION.md](sigeco-condo-access/docs/BACKEND_IMPLEMENTATION.md)
- [sigeco-condo-access/docs/E2E_TEST_PLAN.md](sigeco-condo-access/docs/E2E_TEST_PLAN.md)
- [sigeco-condo-access/docs/TESTING_PYRAMID_ANALYSIS.md](sigeco-condo-access/docs/TESTING_PYRAMID_ANALYSIS.md)
- [.kiro specs: sigeco-condo-access/.kiro/specs/mvp-verifier/requirements.md](sigeco-condo-access/.kiro/specs/mvp-verifier/requirements.md)

11. Plano de ação resumido (7-9 semanas estimadas)
- Semana 1: Segurança (atualizações) + Access Control (impl. core) — ver [ROADMAP.md](sigeco-condo-access/ROADMAP.md)
- Semana 2: User Management + Dashboard básico
- Semana 3: Reports + Visitor Registration final
- Semana 4: Qualidade de código (TS types, lint, naming)
- Semana 5: Testes e coverage (unit, integration, E2E)
- Semana 6-9: Polimento, performance, documentação e deploy

12. Como o Perplexity deve avaliar "o que falta"
Para cada feature listada no [TODO.md](sigeco-condo-access/TODO.md):
- Mapear arquivos/Componentes referenciados nesta especificação e verificar existência/estado.
- Verificar endpoints e modelos em [docs/BACKEND_IMPLEMENTATION.md](sigeco-condo-access/docs/BACKEND_IMPLEMENTATION.md).
- Checar se `npm run verify:mvp` produz relatório e porcentagens (ver [.kiro specs](sigeco-condo-access/.kiro/specs/mvp-verifier/requirements.md)).
- Validar se testes E2E descritos em [E2E_TEST_PLAN.md](sigeco-condo-access/docs/E2E_TEST_PLAN.md) estão implementados.

13. Checklist final para cada PR que implementa uma feature do MVP
- [ ] Implementação funcional com testes
- [ ] Tipos TypeScript completos nas props de componentes
- [ ] Lint sem warnings
- [ ] Acessibilidade básica (aria, labels)
- [ ] Atualizar [TODO.md](sigeco-condo-access/TODO.md) e documentação relacionada
- [ ] `npm run validate` OK
- [ ] `npm run verify:mvp` com progresso visível

--- 

Notas finais
- Use este arquivo como ponto central para alinhar o que falta para o MVP. Se necessário, gere tickets detalhados no backlog a partir das tarefas listadas em [sigeco-condo-access/TODO.md](sigeco-condo-access/TODO.md).
- Para implementação backend/infra, siga [sigeco-condo-access/docs/BACKEND_IMPLEMENTATION.md](sigeco-condo-access/docs/BACKEND_IMPLEMENTATION.md).
- Para ver exemplos de componentes e sumário de implementação, consulte [sigeco-condo-access/docs/IMPLEMENTATION_SUMMARY.md](sigeco-condo-access/docs/IMPLEMENTATION_SUMMARY.md) e [sigeco-condo-access/PORTAL_COMPLETION_ANALYSIS.md](sigeco-condo-access/PORTAL_COMPLETION_ANALYSIS.md).
# 🎫 Templates de Issues - SIGECO

Use estes templates para criar issues no GitHub/Jira

---

## 🔴 ISSUE #1 - React Router Future Flags

**Título:** [CRÍTICO] Adicionar React Router v7 future flags

**Labels:** `critical`, `bug`, `compatibility`

**Descrição:**
O console mostra warnings sobre flags futuras do React Router v7 que causarão quebra na próxima versão.

**Warnings Atuais:**
```
⚠️ React Router Future Flag Warning: v7_startTransition
⚠️ React Router Future Flag Warning: v7_relativeSplatPath
```

**Solução Proposta:**
```tsx
// src/App.tsx
<BrowserRouter future={{
  v7_startTransition: true,
  v7_relativeSplatPath: true
}}>
```

**Arquivos Afetados:**
- `src/App.tsx`

**Tempo Estimado:** 15 minutos

**Critérios de Aceitação:**
- [ ] Warnings não aparecem mais no console
- [ ] App funciona normalmente
- [ ] Testes E2E continuam passando

---

## 🔴 ISSUE #2 - Remover Console.log de Produção

**Título:** [CRÍTICO] Remover console.log/error/warn do código de produção

**Labels:** `critical`, `security`, `performance`

**Descrição:**
Existem 35+ ocorrências de `console.log`, `console.error` e `console.warn` no código que podem vazar informações sensíveis e impactar performance.

**Arquivos Afetados:**
- `src/pages/PorteiroDashboard.tsx` (3)
- `src/pages/RelatoriosPage.tsx` (1)
- `src/pages/NotFound.tsx` (1)
- `src/hooks/useVisitorStorage.ts` (4)
- `src/services/SavedFiltersService.ts` (5)
- `src/services/ReportService.ts` (1)
- `src/services/AnalyticsService.ts` (1)
- `src/lib/validation-agents/*.ts` (19+)

**Solução Proposta:**
1. Configurar Vite para remover console.* em produção:
```typescript
// vite.config.ts
export default defineConfig({
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});
```

2. Substituir por LoggingService onde necessário

**Tempo Estimado:** 2 horas

**Critérios de Aceitação:**
- [ ] Build de produção não contém console.*
- [ ] Logs importantes migrados para LoggingService
- [ ] Dev mode continua com logs
- [ ] Testes passando

---

## 🟠 ISSUE #3 - Atualizar Documentação de Testes

**Título:** [ALTA] Atualizar E2E_TEST_RESULTS.md com resultados reais

**Labels:** `documentation`, `high-priority`

**Descrição:**
O arquivo `docs/E2E_TEST_RESULTS.md` contém dados desatualizados:
- Mostra apenas 9.5% de testes passando
- Referencia porta 8080 (já corrigida para 9323)
- 21 testes marcados como "Em Execução"

**Realidade:**
- 42/42 testes passando (100%)
- Porta 9323 configurada
- Todos os testes concluídos

**Tempo Estimado:** 30 minutos

**Critérios de Aceitação:**
- [ ] Arquivo atualizado com dados reais
- [ ] Referências à porta corrigidas
- [ ] Status de todos os testes correto

---

## 🟠 ISSUE #4 - Implementar Tratamento de Erros de Rede

**Título:** [ALTA] Adicionar tratamento robusto de erros de rede

**Labels:** `enhancement`, `high-priority`, `ux`

**Descrição:**
Sistema não trata adequadamente:
- Perda de conexão de internet
- Timeout de requisições
- Falhas de API
- localStorage cheio

**Componentes Afetados:**
- `useVisitorStorage`
- `SavedFiltersService`
- `ReportService`

**Solução Proposta:**
1. Implementar retry logic com exponential backoff
2. Adicionar indicadores visuais de status de conexão
3. Implementar offline mode básico
4. Adicionar toasts informativos

**Tempo Estimado:** 4 horas

**Critérios de Aceitação:**
- [ ] Retry automático em falhas de rede
- [ ] Indicador de status de conexão
- [ ] Toasts informativos para usuário
- [ ] Testes de erro adicionados

---

## 🟠 ISSUE #5 - Adicionar Validação com Zod

**Título:** [ALTA] Implementar validação de dados com Zod schemas

**Labels:** `security`, `high-priority`, `data-integrity`

**Descrição:**
Sistema assume que dados do localStorage/backend estão sempre corretos. Falta:
- Validação de schema
- Sanitização de dados
- Verificação de tipos
- Migração de dados antigos

**Solução Proposta:**
```typescript
// Criar schemas
const visitorSchema = z.object({
  id: z.number(),
  nome: z.string().min(1),
  documento: z.string(),
  // ...
});

// Validar ao carregar
const visitors = visitorSchema.array().parse(data);
```

**Arquivos a Criar:**
- `src/schemas/visitor.schema.ts`
- `src/schemas/filter.schema.ts`
- `src/schemas/report.schema.ts`

**Tempo Estimado:** 6 horas

**Critérios de Aceitação:**
- [ ] Schemas criados para todas entidades
- [ ] Validação ao carregar dados
- [ ] Tratamento de erros de validação
- [ ] Testes de validação

---

## 🟠 ISSUE #6 - Otimizar Performance com Memoização

**Título:** [ALTA] Otimizar re-renders com React.memo e hooks

**Labels:** `performance`, `high-priority`

**Descrição:**
Componentes re-renderizam desnecessariamente:
- `PorteiroDashboard` - Re-renderiza a cada mudança
- `AdminDashboard` - Sem memoização
- Listas grandes sem virtualização

**Solução Proposta:**
1. Adicionar React.memo em componentes pesados
2. Usar useMemo e useCallback
3. Implementar virtualização com react-window
4. Adicionar paginação

**Componentes Prioritários:**
- `PorteiroDashboard`
- `AdminDashboard`
- `VisitorList`
- `GerenciamentoMoradoresPage`

**Tempo Estimado:** 5 horas

**Critérios de Aceitação:**
- [ ] Componentes principais memoizados
- [ ] Callbacks estáveis
- [ ] Virtualização em listas grandes
- [ ] Performance melhorada (medida)

---

## 🟠 ISSUE #7 - Criar Testes Unitários

**Título:** [ALTA] Implementar testes unitários (meta: 60% cobertura)

**Labels:** `testing`, `high-priority`, `quality`

**Descrição:**
Projeto tem apenas testes E2E. Faltam:
- Testes unitários de componentes
- Testes de hooks
- Testes de serviços
- Testes de utils

**Cobertura Atual:** 0%  
**Meta:** 60%

**Prioridade de Testes:**
1. Hooks críticos (useVisitorStorage)
2. Serviços (ReportService, AnalyticsService)
3. Utils (validation, formatters)
4. Componentes principais

**Tempo Estimado:** 16 horas

**Critérios de Aceitação:**
- [ ] 60%+ cobertura de código
- [ ] Hooks testados
- [ ] Serviços testados
- [ ] Utils testados
- [ ] CI rodando testes

---

## 🟡 ISSUE #8 - Refatorar Código Duplicado

**Título:** [MÉDIA] Criar hook useFormValidation reutilizável

**Labels:** `refactor`, `medium-priority`

**Descrição:**
Validação de campos obrigatórios duplicada em múltiplas páginas.

**Arquivos com Duplicação:**
- `GerenciamentoMoradoresPage.tsx`
- `ControleInsumosPage.tsx`
- `AgendamentoPage.tsx`

**Solução:**
```typescript
// src/hooks/useFormValidation.ts
export function useFormValidation(schema) {
  // lógica reutilizável
}
```

**Tempo Estimado:** 2 horas

---

## 🟡 ISSUE #9 - Implementar Rate Limiting

**Título:** [MÉDIA] Adicionar debounce/throttle em formulários

**Labels:** `security`, `medium-priority`

**Descrição:**
Usuário pode submeter formulários infinitamente sem controle.

**Solução:**
- Debounce em buscas (300ms)
- Throttle em submits (1s)
- Desabilitar botão durante processamento

**Tempo Estimado:** 2 horas

---

## 🟡 ISSUE #10 - Adicionar Feedback Visual

**Título:** [MÉDIA] Implementar loading states e skeleton loaders

**Labels:** `ux`, `medium-priority`

**Descrição:**
Ações assíncronas sem feedback visual adequado.

**Componentes Afetados:**
- Salvamento de filtros
- Exclusão de moradores
- Carregamento de dados

**Tempo Estimado:** 3 horas

---

## 🟡 ISSUE #11 - Gerenciar Limite do localStorage

**Título:** [MÉDIA] Implementar limpeza automática de dados antigos

**Labels:** `data-management`, `medium-priority`

**Descrição:**
localStorage tem limite de 5-10MB. Sem controle pode ficar cheio.

**Solução:**
1. Limpeza automática de dados > 30 dias
2. Compressão de dados
3. Migração para IndexedDB se necessário

**Tempo Estimado:** 4 horas

---

## 🟡 ISSUE #12 - Implementar Sistema de Auditoria

**Título:** [MÉDIA] Criar audit log de ações do usuário

**Labels:** `security`, `compliance`, `medium-priority`

**Descrição:**
Sem log de quem fez o quê e quando.

**Dados a Registrar:**
- Usuário
- Ação
- Timestamp
- Dados antes/depois

**Tempo Estimado:** 6 horas

---

## 🟢 ISSUE #13 - Implementar Dark Mode

**Título:** [BAIXA] Completar implementação de dark mode

**Labels:** `ux`, `low-priority`

**Descrição:**
next-themes instalado mas não totalmente implementado.

**Tempo Estimado:** 3 horas

---

## 🟢 ISSUE #14 - Adicionar Atalhos de Teclado

**Título:** [BAIXA] Implementar keyboard shortcuts

**Labels:** `accessibility`, `low-priority`

**Descrição:**
Adicionar atalhos como:
- Ctrl+S para salvar
- Ctrl+F para buscar
- Esc para fechar modais

**Tempo Estimado:** 4 horas

---

## 🔵 ISSUE #15 - Transformar em PWA

**Título:** [MELHORIA] Implementar PWA completo

**Labels:** `enhancement`, `future`

**Descrição:**
Transformar em PWA instalável com:
- Service Worker
- Manifest
- Ícones
- Splash screens
- Modo offline

**Tempo Estimado:** 6 horas

---

## 📊 Resumo de Issues

```
Total: 15 issues criadas

🔴 Críticas:   2 issues (2h 15min)
🟠 Alta:       5 issues (33h)
🟡 Média:      5 issues (17h)
🟢 Baixa:      2 issues (7h)
🔵 Melhoria:   1 issue  (6h)
```

---

## 🏷️ Labels Sugeridas

```
Prioridade:
- critical
- high-priority
- medium-priority
- low-priority

Tipo:
- bug
- enhancement
- refactor
- documentation

Categoria:
- security
- performance
- ux
- testing
- accessibility
- data-management
- compliance
```

---

**Próxima Ação:** Criar estas issues no sistema de tracking  
**Responsável:** Tech Lead  
**Prazo:** Hoje

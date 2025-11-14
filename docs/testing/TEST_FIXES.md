# 🔧 Correções de Testes E2E

## ✅ Correções Aplicadas

### 1. Cards de Estatísticas (T1.1)
**Problema:** Seletor CSS complexo não encontrava os cards  
**Solução:** Adicionado `data-testid` em cada card

**Antes:**
```typescript
const cards = page.locator('.shadow-lg.border-0.bg-card\\/95');
```

**Depois:**
```typescript
const cards = page.locator('[data-testid^="stat-card-"]');
```

**Arquivos Modificados:**
- `src/pages/AdminDashboard.tsx` - Adicionado data-testid nos cards
- `tests/e2e/admin-dashboard.spec.ts` - Atualizado seletor

---

### 2. Botão Novo Morador (T2.1)
**Problema:** Seletor por texto não era confiável  
**Solução:** Adicionado `data-testid="btn-novo-morador"`

**Antes:**
```typescript
await page.click('button:has-text("Novo Morador")');
```

**Depois:**
```typescript
await page.click('[data-testid="btn-novo-morador"]');
```

**Arquivos Modificados:**
- `src/pages/GerenciamentoMoradoresPage.tsx` - Adicionado data-testid
- `tests/e2e/admin-dashboard.spec.ts` - Atualizado seletor

---

## 📋 Próximas Correções Necessárias

### Prioridade Alta

#### 1. Adicionar data-testid em todos os botões principais

**Gerenciamento de Moradores:**
```tsx
// Botão Cadastrar Morador
<Button data-testid="btn-cadastrar-morador">Cadastrar Morador</Button>

// Botão Excluir
<Button data-testid="btn-excluir-morador">
  <Trash2 />
</Button>

// Input de busca
<Input data-testid="input-busca-morador" placeholder="Buscar..." />

// Tab Unidades
<TabsTrigger data-testid="tab-unidades" value="unidades">Unidades</TabsTrigger>
```

**Agendamento:**
```tsx
// Botão Novo Agendamento
<Button data-testid="btn-novo-agendamento">Novo Agendamento</Button>

// Botão Agendar Visita
<Button data-testid="btn-agendar-visita">Agendar Visita</Button>

// Calendário
<Calendar data-testid="calendario-agendamento" />
```

**Relatórios:**
```tsx
// Botões de exportação
<Button data-testid="btn-exportar-pdf">PDF</Button>
<Button data-testid="btn-exportar-excel">Excel</Button>

// Botão Salvar Filtro
<Button data-testid="btn-salvar-filtro">Salvar Filtro</Button>

// Botão Filtros Salvos
<Button data-testid="btn-filtros-salvos">Filtros Salvos</Button>

// Botão Limpar Filtros
<Button data-testid="btn-limpar-filtros">Limpar Filtros</Button>
```

**Controle de Insumos:**
```tsx
// Botão Cadastrar Funcionário
<Button data-testid="btn-cadastrar-funcionario">Cadastrar Funcionário</Button>

// Tab Prestadores
<TabsTrigger data-testid="tab-prestadores" value="prestadores">Prestadores</TabsTrigger>

// Inputs do formulário
<Input data-testid="input-nome-funcionario" />
<Input data-testid="input-documento-funcionario" />
<Select data-testid="select-funcao">...</Select>
```

**Backup e Segurança:**
```tsx
// Toggles
<Switch data-testid="toggle-backup-automatico" />
<Switch data-testid="toggle-backup-nuvem" />
<Switch data-testid="toggle-criptografia" />

// Botões
<Button data-testid="btn-backup-manual">Iniciar Backup Manual</Button>
<Button data-testid="btn-restaurar-backup">Restaurar Backup</Button>
```

**Suporte Avançado:**
```tsx
// Tabs
<TabsTrigger data-testid="tab-treinamento" value="treinamento">Treinamento</TabsTrigger>
<TabsTrigger data-testid="tab-atualizacoes" value="atualizacoes">Atualizações</TabsTrigger>
<TabsTrigger data-testid="tab-suporte" value="suporte">Suporte</TabsTrigger>
<TabsTrigger data-testid="tab-documentacao" value="documentacao">Documentação</TabsTrigger>
```

---

### Prioridade Média

#### 2. Atualizar todos os testes para usar data-testid

**Padrão de Atualização:**
```typescript
// ANTES (❌ Evitar)
await page.click('button:has-text("Texto")');
await page.locator('.classe-complexa').click();

// DEPOIS (✅ Recomendado)
await page.click('[data-testid="identificador-unico"]');
await page.locator('[data-testid="identificador-unico"]').click();
```

#### 3. Adicionar waits explícitos onde necessário

```typescript
// Aguardar modal abrir
await page.click('[data-testid="btn-novo-morador"]');
await page.waitForSelector('[data-testid="modal-cadastro-morador"]', { state: 'visible' });

// Aguardar toast aparecer
await page.click('[data-testid="btn-salvar"]');
await page.waitForSelector('text=sucesso', { timeout: 5000 });
```

---

## 🎯 Guia de Boas Práticas

### Nomenclatura de data-testid

**Padrão:** `{tipo}-{ação}-{contexto}`

**Exemplos:**
- `btn-novo-morador` - Botão para criar novo morador
- `input-busca-morador` - Input de busca de moradores
- `modal-cadastro-morador` - Modal de cadastro
- `tab-unidades` - Tab de unidades
- `table-moradores` - Tabela de moradores
- `form-cadastro-funcionario` - Formulário de cadastro

### Onde Adicionar data-testid

✅ **SEMPRE adicionar em:**
- Botões de ação (salvar, excluir, criar, etc.)
- Inputs de formulário
- Modais e dialogs
- Tabs e navegação
- Tabelas e listas
- Elementos interativos

❌ **NÃO adicionar em:**
- Elementos puramente visuais (divs de layout)
- Ícones decorativos
- Textos estáticos sem interação

---

## 🔄 Script de Atualização em Massa

Para facilitar, aqui está um script que pode ser usado para adicionar data-testid em lote:

```bash
# Encontrar todos os botões sem data-testid
grep -r "<Button" src/pages --include="*.tsx" | grep -v "data-testid"

# Encontrar todos os inputs sem data-testid
grep -r "<Input" src/pages --include="*.tsx" | grep -v "data-testid"

# Encontrar todos os selects sem data-testid
grep -r "<Select" src/pages --include="*.tsx" | grep -v "data-testid"
```

---

## 📊 Status das Correções

| Componente | data-testid Adicionados | Testes Atualizados | Status |
|------------|------------------------|-------------------|--------|
| Visão Geral | ✅ Parcial (cards) | ✅ T1.1 | 🟡 Em Progresso |
| Gerenciamento de Moradores | ✅ Parcial (botão) | ✅ T2.1 | 🟡 Em Progresso |
| Agendamento | ❌ Pendente | ❌ Pendente | 🔴 Não Iniciado |
| Relatórios | ❌ Pendente | ❌ Pendente | 🔴 Não Iniciado |
| Controle de Insumos | ❌ Pendente | ❌ Pendente | 🔴 Não Iniciado |
| Backup e Segurança | ❌ Pendente | ❌ Pendente | 🔴 Não Iniciado |
| Suporte Avançado | ❌ Pendente | ❌ Pendente | 🔴 Não Iniciado |

---

## 🚀 Próximos Passos

1. ✅ Adicionar data-testid em cards de estatísticas
2. ✅ Adicionar data-testid em botão Novo Morador
3. ⏳ Adicionar data-testid em todos os botões principais
4. ⏳ Atualizar todos os testes para usar data-testid
5. ⏳ Re-executar suite de testes
6. ⏳ Validar 100% de sucesso

---

**Última Atualização:** Novembro 2024  
**Responsável:** Equipe de QA SIGECO

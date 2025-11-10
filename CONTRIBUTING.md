# Guia de Contribuição - SIGECO

## Definition of Done (DoD)

Toda tarefa implementada no SIGECO deve atender aos seguintes critérios antes de ser considerada completa:

### ✅ Checklist de Definition of Done

- [ ] **Código implementado e revisado**
  - Código segue os padrões do projeto
  - Código é legível e bem estruturado
  - Não há código comentado ou debug statements

- [ ] **Validação de tipos e lint**
  - TypeScript compila sem erros: `npm run type-check`
  - ESLint passa sem erros: `npm run lint`
  - Script de validação completo passa: `npm run validate`

- [ ] **Console do navegador limpo**
  - Zero erros críticos no console
  - Zero warnings de CORS
  - Zero warnings críticos relacionados à funcionalidade
  - Testado em Chrome/Edge com DevTools aberto

- [ ] **Testes funcionais**
  - Funcionalidade testada manualmente em navegador
  - Todos os fluxos principais funcionam corretamente
  - Edge cases considerados e testados
  - Testado em diferentes resoluções (desktop/tablet)

- [ ] **Testes automatizados (quando aplicável)**
  - Testes unitários escritos para lógica de negócio
  - Testes de integração para fluxos críticos
  - Todos os testes passam: `npm run test` (quando implementado)

- [ ] **Documentação atualizada**
  - README atualizado se necessário
  - Comentários JSDoc em funções públicas
  - CHANGELOG atualizado com mudanças significativas

- [ ] **Code review aprovado**
  - Pull request criado e revisado
  - Feedback de revisão endereçado
  - Aprovação de pelo menos um revisor

- [ ] **Merged para branch principal**
  - Conflitos resolvidos
  - CI/CD pipeline passou (quando configurado)
  - Branch de feature deletada após merge

## Processo de Validação

### 1. Validação Automática

Execute o script de validação completo antes de criar um PR:

```bash
npm run validate
```

Este comando executa:
- Type checking do TypeScript
- Linting com ESLint
- Build de produção para verificar erros de compilação

### 2. Validação do Console

**Processo obrigatório antes de marcar tarefa como completa:**

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Abra o navegador em `http://localhost:5173`

3. Abra o DevTools (F12 ou Ctrl+Shift+I)

4. Navegue para a aba "Console"

5. Execute os seguintes testes:

#### Checklist de Validação do Console

- [ ] **Carregamento inicial**
  - Recarregue a página (Ctrl+R)
  - Verifique que não há erros vermelhos
  - Verifique que não há warnings de CORS
  - Verifique que não há warnings críticos

- [ ] **Navegação entre páginas**
  - Navegue para Dashboard do Porteiro
  - Navegue para Relatórios
  - Navegue para outras páginas relevantes
  - Verifique console após cada navegação

- [ ] **Funcionalidade implementada**
  - Execute a funcionalidade que você implementou
  - Verifique que não gera erros no console
  - Verifique que não gera warnings críticos
  - Teste casos de erro esperados

- [ ] **Teste com Network throttling**
  - Ative "Slow 3G" na aba Network
  - Recarregue a página
  - Verifique que não há erros de timeout
  - Verifique que loading states funcionam

#### Erros Aceitáveis

Os seguintes warnings podem ser ignorados:
- Warnings de desenvolvimento do React (apenas em modo dev)
- Warnings de extensões do navegador
- Warnings informativos de bibliotecas de terceiros

#### Erros NÃO Aceitáveis

Os seguintes erros bloqueiam o DoD:
- ❌ Erros de CORS
- ❌ Erros de React (incluindo #418)
- ❌ Erros de JavaScript não tratados
- ❌ Erros de TypeScript em runtime
- ❌ Erros de recursos não encontrados (404)
- ❌ Warnings de segurança

### 3. Testes Funcionais

Execute os seguintes testes manuais conforme aplicável:

#### Fluxo de Autenticação
```
1. Acesse a página de login
2. Tente login com credenciais inválidas
3. Verifique mensagem de erro apropriada
4. Faça login com credenciais válidas
5. Verifique redirecionamento para dashboard
```

#### Fluxo de Registro de Visitante
```
1. Acesse Dashboard do Porteiro
2. Clique em "Novo Visitante"
3. Preencha formulário com dados válidos
4. Submeta o formulário
5. Verifique que visitante aparece na lista
6. Verifique que não há erros no console
```

#### Fluxo de Geração de Relatórios
```
1. Acesse página de Relatórios
2. Selecione filtros (período, tipo, etc)
3. Clique em "Gerar PDF"
4. Verifique que arquivo é baixado
5. Abra o PDF e verifique conteúdo
6. Repita para "Gerar Excel"
7. Verifique que não há erros no console
```

#### Fluxo de Tratamento de Erros
```
1. Simule um erro (ex: desconecte internet)
2. Tente executar uma ação
3. Verifique que Error Boundary captura o erro
4. Verifique que UI de fallback é exibida
5. Clique em "Tentar Novamente"
6. Verifique que aplicação se recupera
```

## Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run build:dev    # Build de desenvolvimento
npm run preview      # Preview do build de produção
```

### Validação
```bash
npm run validate     # Executa type-check + lint + build
npm run type-check   # Verifica tipos TypeScript
npm run lint         # Executa ESLint
npm run lint:fix     # Corrige problemas de lint automaticamente
```

### Testes (quando implementado)
```bash
npm run test         # Executa todos os testes
npm run test:watch   # Executa testes em modo watch
npm run test:coverage # Gera relatório de cobertura
```

## Processo de Pull Request

### Antes de Criar o PR

1. ✅ Execute `npm run validate` e corrija todos os erros
2. ✅ Valide o console conforme processo acima
3. ✅ Execute testes funcionais relevantes
4. ✅ Atualize documentação se necessário
5. ✅ Commit com mensagem descritiva

### Template de PR

```markdown
## Descrição
[Descreva o que foi implementado]

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Checklist de DoD
- [ ] Código implementado e revisado
- [ ] `npm run validate` passa sem erros
- [ ] Console do navegador limpo (sem erros críticos)
- [ ] Testes funcionais executados
- [ ] Documentação atualizada

## Validação do Console
- [ ] Testado em Chrome/Edge
- [ ] Sem erros de CORS
- [ ] Sem erros de React
- [ ] Sem erros JavaScript não tratados

## Testes Executados
[Liste os testes funcionais que você executou]

## Screenshots (se aplicável)
[Adicione screenshots da funcionalidade]

## Notas Adicionais
[Qualquer informação adicional relevante]
```

### Durante a Revisão

- Responda a todos os comentários
- Faça commits adicionais para endereçar feedback
- Re-execute validações após mudanças
- Solicite re-revisão após mudanças significativas

### Após Aprovação

- Faça squash de commits se necessário
- Merge para branch principal
- Delete branch de feature
- Verifique que CI/CD passou (quando configurado)

## Padrões de Código

### TypeScript
- Use tipos explícitos sempre que possível
- Evite `any` - use `unknown` se necessário
- Use interfaces para objetos públicos
- Use types para unions e intersections

### React
- Use functional components com hooks
- Extraia lógica complexa para custom hooks
- Use memo/useMemo/useCallback com moderação
- Mantenha componentes pequenos e focados

### Naming Conventions
- Componentes: PascalCase (ex: `ErrorBoundary`)
- Hooks: camelCase com prefixo "use" (ex: `useAuth`)
- Utilitários: camelCase (ex: `formatDate`)
- Constantes: UPPER_SNAKE_CASE (ex: `MAX_RETRIES`)
- Arquivos: kebab-case ou PascalCase para componentes

### Estrutura de Arquivos
```
src/
├── components/     # Componentes reutilizáveis
├── pages/          # Páginas/rotas
├── services/       # Lógica de negócio e APIs
├── hooks/          # Custom hooks
├── lib/            # Utilitários e helpers
└── types/          # Definições de tipos TypeScript
```

## Troubleshooting

### Erro: "Type check failed"
```bash
# Limpe cache e reinstale dependências
rm -rf node_modules package-lock.json
npm install
npm run type-check
```

### Erro: "ESLint failed"
```bash
# Tente corrigir automaticamente
npm run lint:fix

# Se persistir, revise os erros manualmente
npm run lint
```

### Erro: "Build failed"
```bash
# Verifique erros de importação
# Verifique tipos TypeScript
# Verifique configuração do Vite
npm run build:dev  # Build com mais detalhes
```

### Console com muitos erros
```bash
# Limpe localStorage e cookies
# Recarregue a página com cache limpo (Ctrl+Shift+R)
# Verifique se extensões do navegador não estão interferindo
# Teste em modo anônimo
```

## Recursos Adicionais

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Contato

Para dúvidas sobre o processo de contribuição, entre em contato com a equipe de desenvolvimento.

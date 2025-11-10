# Console Validation Checklist

Este documento descreve o processo obrigatório de validação do console do navegador antes de marcar qualquer tarefa como completa ou criar um Pull Request.

## Por que validar o console?

O SIGECO teve problemas críticos de estabilidade relacionados a:
- Erros React não tratados (#418)
- Erros de CORS bloqueando recursos
- Erros JavaScript causando crashes
- Warnings críticos ignorados

A validação do console garante que esses problemas não sejam reintroduzidos.

## Processo de Validação

### 1. Preparação

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

Abra o navegador em `http://localhost:5173`

### 2. Abrir DevTools

- **Chrome/Edge**: Pressione `F12` ou `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- **Firefox**: Pressione `F12` ou `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)

Navegue para a aba **Console**

### 3. Limpar Console

Clique no ícone 🚫 (Clear console) ou pressione `Ctrl+L`

### 4. Checklist de Validação

#### ✅ Carregamento Inicial

- [ ] Recarregue a página (`Ctrl+R` ou `F5`)
- [ ] Aguarde carregamento completo (spinner desaparece)
- [ ] Verifique que não há erros vermelhos
- [ ] Verifique que não há warnings amarelos de CORS
- [ ] Verifique que não há erros de recursos (404)

**Exemplo de console limpo:**
```
[Vite] connected.
[React Query] DevTools initialized
```

**Exemplo de console com problemas:**
```
❌ Error: Minified React error #418
❌ Access to font at 'https://fonts.googleapis.com/...' blocked by CORS
❌ Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
```

#### ✅ Navegação Entre Páginas

Para cada página principal do sistema:

- [ ] **Dashboard do Porteiro** (`/porteiro`)
  - Navegue para a página
  - Aguarde carregamento completo
  - Verifique console (sem erros)
  
- [ ] **Relatórios** (`/relatorios`)
  - Navegue para a página
  - Aguarde carregamento completo
  - Verifique console (sem erros)
  
- [ ] **Outras páginas relevantes**
  - Liste as páginas que você modificou
  - Navegue para cada uma
  - Verifique console após cada navegação

#### ✅ Funcionalidade Implementada

Execute a funcionalidade que você implementou:

- [ ] Execute a ação principal
- [ ] Verifique que não gera erros no console
- [ ] Teste casos de sucesso
- [ ] Teste casos de erro esperados
- [ ] Verifique que erros são tratados graciosamente

**Exemplo - Geração de Relatório:**
```
1. Acesse /relatorios
2. Selecione filtros
3. Clique em "Gerar PDF"
4. Verifique console durante geração
5. Verifique que arquivo é baixado
6. Verifique que não há erros
```

#### ✅ Error Boundaries

Se você modificou componentes críticos:

- [ ] Simule um erro (ex: desconecte internet)
- [ ] Verifique que Error Boundary captura o erro
- [ ] Verifique que UI de fallback é exibida
- [ ] Verifique que erro é logado no console (esperado)
- [ ] Clique em "Tentar Novamente"
- [ ] Verifique que aplicação se recupera

#### ✅ Network Throttling

Teste com conexão lenta:

- [ ] Abra aba **Network** no DevTools
- [ ] Selecione **Slow 3G** no dropdown de throttling
- [ ] Recarregue a página
- [ ] Verifique que loading states aparecem
- [ ] Verifique que não há erros de timeout
- [ ] Verifique que aplicação carrega completamente
- [ ] Retorne para **No throttling**

#### ✅ Teste com Adblocker

Se você trabalhou com analytics:

- [ ] Ative um adblocker (uBlock Origin, AdBlock, etc)
- [ ] Recarregue a página
- [ ] Verifique que aplicação funciona normalmente
- [ ] Verifique que não há erros de analytics no console
- [ ] Verifique que eventos são enfileirados localmente

### 5. Categorias de Erros

#### ❌ Erros CRÍTICOS (Bloqueiam DoD)

Estes erros **NÃO** são aceitáveis:

```javascript
// Erros de CORS
Access to ... blocked by CORS policy

// Erros de React
Uncaught Error: Minified React error #418
Uncaught Error: Maximum update depth exceeded

// Erros JavaScript não tratados
Uncaught TypeError: Cannot read property 'x' of undefined
Uncaught ReferenceError: x is not defined

// Erros de recursos
Failed to load resource: the server responded with a status of 404
Failed to load resource: net::ERR_BLOCKED_BY_CLIENT

// Erros de segurança
Mixed Content: The page at '...' was loaded over HTTPS
```

#### ⚠️ Warnings CRÍTICOS (Bloqueiam DoD)

Estes warnings **NÃO** são aceitáveis:

```javascript
// CORS warnings
Cross-Origin Request Blocked

// React warnings críticos
Warning: Can't perform a React state update on an unmounted component
Warning: Each child in a list should have a unique "key" prop

// Deprecation warnings de APIs que você usa
[Deprecation] ... is deprecated and will be removed
```

#### ✅ Warnings ACEITÁVEIS (Não bloqueiam DoD)

Estes warnings podem ser ignorados:

```javascript
// Warnings de desenvolvimento do React (apenas em dev mode)
Download the React DevTools for a better development experience

// Warnings de extensões do navegador
[Extension] ...

// Warnings informativos de bibliotecas
[TanStack Query] ...
[Vite] ...

// Warnings de features experimentais que não usamos
[Experimental] ...
```

### 6. Documentação de Resultados

Ao criar um PR, documente os resultados da validação:

```markdown
## Validação do Console

### Ambiente
- Navegador: Chrome 120.0.6099.109
- Sistema: Windows 11
- Data: 2024-01-15

### Resultados

#### ✅ Carregamento Inicial
- Sem erros críticos
- Sem warnings de CORS
- Tempo de carregamento: ~1.2s

#### ✅ Navegação
- Dashboard do Porteiro: OK
- Relatórios: OK
- Outras páginas: OK

#### ✅ Funcionalidade
- Geração de PDF: OK (arquivo baixado com sucesso)
- Geração de Excel: OK (arquivo baixado com sucesso)
- Filtros aplicados corretamente

#### ✅ Error Boundaries
- Erro simulado capturado corretamente
- UI de fallback exibida
- Recuperação funcionou

#### ✅ Network Throttling
- Testado com Slow 3G
- Loading states funcionaram
- Sem erros de timeout

#### ✅ Adblocker
- Testado com uBlock Origin
- Aplicação funcionou normalmente
- Analytics enfileirados localmente

### Screenshots
[Adicione screenshot do console limpo]
```

## Ferramentas Úteis

### Console Filters

Use filtros do console para focar em tipos específicos de mensagens:

- **Errors only**: Clique no ícone de filtro e selecione "Errors"
- **Hide extension messages**: Digite `-[Extension]` no campo de filtro
- **Show only CORS**: Digite `CORS` no campo de filtro

### Console Settings

Configure o console para melhor visibilidade:

1. Clique no ícone de engrenagem (⚙️) no console
2. Ative:
   - ✅ Show timestamps
   - ✅ Preserve log upon navigation
   - ✅ Show CORS errors in console
3. Desative:
   - ❌ Hide network messages (queremos ver erros de rede)

### Preserve Log

Ative "Preserve log" para manter mensagens durante navegação:

- Clique com botão direito no console
- Selecione "Preserve log"
- Ou use o checkbox na barra de ferramentas do console

## Troubleshooting

### "Muitos erros de extensões"

Se você vê muitos erros de extensões do navegador:

1. Teste em modo anônimo (Ctrl+Shift+N)
2. Ou desative extensões temporariamente
3. Ou use filtros: `-[Extension]`

### "Console limpa ao navegar"

Se o console limpa ao navegar entre páginas:

1. Ative "Preserve log" (checkbox no console)
2. Ou use o atalho: Ctrl+Shift+P → "Preserve log"

### "Não consigo reproduzir o erro"

Se você não consegue reproduzir um erro:

1. Limpe cache: Ctrl+Shift+Delete
2. Recarregue com cache limpo: Ctrl+Shift+R
3. Teste em modo anônimo
4. Teste em outro navegador
5. Verifique se há erros intermitentes

### "Erro só aparece em produção"

Se um erro só aparece no build de produção:

```bash
# Build de produção
npm run build

# Preview do build
npm run preview

# Abra http://localhost:4173 e valide console
```

## Automação Futura

Estamos trabalhando em automação para validação do console:

- [ ] Puppeteer script para capturar erros do console
- [ ] CI/CD integration para validação automática
- [ ] Dashboard de métricas de qualidade
- [ ] Alertas automáticos para regressões

Por enquanto, a validação manual é obrigatória.

## Recursos Adicionais

- [Chrome DevTools Console Reference](https://developer.chrome.com/docs/devtools/console/)
- [Firefox Web Console](https://firefox-source-docs.mozilla.org/devtools-user/web_console/)
- [Debugging JavaScript in Chrome](https://developer.chrome.com/docs/devtools/javascript/)

## Contato

Dúvidas sobre o processo de validação? Entre em contato com a equipe de desenvolvimento.

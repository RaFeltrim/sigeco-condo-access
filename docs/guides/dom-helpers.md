# DOMHelpers - Utilitários DOM Seguros

Módulo de utilitários para manipulação segura do DOM com validação, timeouts e logging automático.

## Funções Disponíveis

### `waitForElement(selector, options?)`

Aguarda até que um elemento apareça no DOM.

**Parâmetros:**
- `selector` (string): Seletor CSS do elemento
- `options` (WaitOptions, opcional):
  - `timeout` (number): Tempo máximo de espera em ms (padrão: 10000)
  - `interval` (number): Intervalo entre verificações em ms (padrão: 100)
  - `errorMessage` (string): Mensagem de erro customizada

**Retorna:** Promise<Element>

**Exemplo:**
```typescript
import { waitForElement } from '@/lib/domHelpers';

// Aguardar elemento com timeout padrão (10s)
const button = await waitForElement('#submit-button');

// Aguardar com timeout customizado
const modal = await waitForElement('.modal', { timeout: 5000 });

// Com mensagem de erro customizada
const form = await waitForElement('#login-form', {
  timeout: 3000,
  errorMessage: 'Formulário de login não encontrado'
});
```

---

### `elementExists(selector)`

Verifica se um elemento existe no DOM.

**Parâmetros:**
- `selector` (string): Seletor CSS do elemento

**Retorna:** boolean

**Exemplo:**
```typescript
import { elementExists } from '@/lib/domHelpers';

if (elementExists('#user-menu')) {
  console.log('Menu do usuário está presente');
}

// Validar antes de manipular
if (!elementExists('.error-message')) {
  // Seguro para prosseguir
}
```

---

### `safeQuerySelector<T>(selector)`

Busca um elemento no DOM de forma segura, retornando null em vez de lançar exceção.

**Parâmetros:**
- `selector` (string): Seletor CSS do elemento

**Retorna:** T | null

**Exemplo:**
```typescript
import { safeQuerySelector } from '@/lib/domHelpers';

// Retorna null se não encontrar, sem lançar exceção
const input = safeQuerySelector<HTMLInputElement>('#email-input');

if (input) {
  input.value = 'user@example.com';
}

// Com tipagem específica
const button = safeQuerySelector<HTMLButtonElement>('.submit-btn');
button?.click();
```

---

### `waitForPageLoad(additionalDelay?)`

Aguarda o carregamento completo da página com delay adicional.

**Parâmetros:**
- `additionalDelay` (number, opcional): Delay adicional em ms após o load (padrão: 1000)

**Retorna:** Promise<void>

**Exemplo:**
```typescript
import { waitForPageLoad } from '@/lib/domHelpers';

// Aguardar carregamento completo + 1s
await waitForPageLoad();

// Aguardar com delay customizado
await waitForPageLoad(2000); // 2 segundos de delay adicional

// Uso em inicialização
async function initializeApp() {
  await waitForPageLoad();
  // Agora é seguro manipular o DOM
  setupEventListeners();
}
```

---

### `safeQuerySelectorAll<T>(selector)`

Busca múltiplos elementos no DOM de forma segura.

**Parâmetros:**
- `selector` (string): Seletor CSS dos elementos

**Retorna:** T[]

**Exemplo:**
```typescript
import { safeQuerySelectorAll } from '@/lib/domHelpers';

// Retorna array vazio se não encontrar, sem lançar exceção
const buttons = safeQuerySelectorAll<HTMLButtonElement>('.action-button');

buttons.forEach(button => {
  button.addEventListener('click', handleClick);
});

// Com tipagem específica
const inputs = safeQuerySelectorAll<HTMLInputElement>('input[type="text"]');
```

---

### `waitForElementToDisappear(selector, options?)`

Aguarda até que um elemento desapareça do DOM.

**Parâmetros:**
- `selector` (string): Seletor CSS do elemento
- `options` (WaitOptions, opcional): Mesmas opções de `waitForElement`

**Retorna:** Promise<void>

**Exemplo:**
```typescript
import { waitForElementToDisappear } from '@/lib/domHelpers';

// Aguardar loader desaparecer
await waitForElementToDisappear('.loading-spinner');

// Aguardar modal fechar
await waitForElementToDisappear('.modal-overlay', { timeout: 5000 });
```

---

### `isElementVisible(element)`

Valida se um elemento está visível no viewport.

**Parâmetros:**
- `element` (Element): Elemento a ser verificado

**Retorna:** boolean

**Exemplo:**
```typescript
import { isElementVisible, safeQuerySelector } from '@/lib/domHelpers';

const banner = safeQuerySelector('.promo-banner');

if (banner && isElementVisible(banner)) {
  console.log('Banner está visível no viewport');
}
```

---

### `waitForElementVisible(selector, options?)`

Aguarda até que um elemento esteja visível no viewport.

**Parâmetros:**
- `selector` (string): Seletor CSS do elemento
- `options` (WaitOptions, opcional): Mesmas opções de `waitForElement`

**Retorna:** Promise<Element>

**Exemplo:**
```typescript
import { waitForElementVisible } from '@/lib/domHelpers';

// Aguardar elemento aparecer e estar visível
const section = await waitForElementVisible('#content-section');

// Útil para scroll automático
await waitForElementVisible('.target-element', { timeout: 3000 });
```

---

## Integração com Logging

Todas as funções integram automaticamente com o `LoggingService`:

- **Sucessos**: Registrados como `info` com tempo decorrido
- **Falhas**: Registradas como `error` com contexto completo
- **Timeouts**: Registrados com detalhes do seletor e tempo

Isso permite debugging eficiente através dos logs exportáveis.

---

## Boas Práticas

### ✅ Fazer

```typescript
// Sempre validar existência antes de manipular
if (elementExists('#form')) {
  const form = safeQuerySelector<HTMLFormElement>('#form');
  form?.submit();
}

// Usar await para operações assíncronas
await waitForElement('.modal');
const modal = safeQuerySelector('.modal');

// Especificar timeouts apropriados
await waitForElement('.slow-component', { timeout: 15000 });
```

### ❌ Evitar

```typescript
// Não usar querySelector diretamente sem validação
const element = document.querySelector('#risky'); // Pode ser null!
element.click(); // Erro se element for null

// Não ignorar erros de timeout
waitForElement('.may-not-exist'); // Sem try/catch

// Não usar timeouts muito longos sem necessidade
await waitForElement('.button', { timeout: 60000 }); // 60s é excessivo
```

---

## Casos de Uso Comuns

### Inicialização de Página

```typescript
import { waitForPageLoad, waitForElement } from '@/lib/domHelpers';

async function initializeDashboard() {
  // Aguardar página carregar completamente
  await waitForPageLoad();
  
  // Aguardar elementos críticos
  await waitForElement('#dashboard-container');
  
  // Agora é seguro inicializar
  setupCharts();
  loadUserData();
}
```

### Manipulação de Modals

```typescript
import { waitForElement, waitForElementToDisappear } from '@/lib/domHelpers';

async function showConfirmationModal() {
  // Abrir modal
  openModal();
  
  // Aguardar modal aparecer
  await waitForElement('.confirmation-modal');
  
  // Aguardar usuário fechar
  await waitForElementToDisappear('.confirmation-modal');
  
  // Continuar após modal fechar
  processNextStep();
}
```

### Validação de Formulários

```typescript
import { elementExists, safeQuerySelector } from '@/lib/domHelpers';

function validateForm() {
  const requiredFields = ['#name', '#email', '#phone'];
  
  for (const selector of requiredFields) {
    if (!elementExists(selector)) {
      console.error(`Campo obrigatório não encontrado: ${selector}`);
      return false;
    }
    
    const input = safeQuerySelector<HTMLInputElement>(selector);
    if (!input?.value) {
      console.error(`Campo vazio: ${selector}`);
      return false;
    }
  }
  
  return true;
}
```

---

## Requisitos Atendidos

Este módulo atende aos seguintes requisitos do SIGECO:

- **6.1**: Verificação de existência de campos antes de inserção
- **6.2**: Esperas inteligentes com timeout de 10 segundos
- **6.3**: Delay de 1 segundo após carregamento de página
- **6.4**: Logging de erros quando elementos não existem
- **6.5**: Validação de existência para todos os elementos DOM

---

## Suporte

Para dúvidas ou problemas, consulte os logs através do `LoggingService.getLogs()` ou exporte com `LoggingService.downloadLogs()`.

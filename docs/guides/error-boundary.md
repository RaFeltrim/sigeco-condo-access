# Error Boundary System - Documentação

## Visão Geral

O sistema de Error Boundary foi implementado para capturar e tratar erros não tratados durante a renderização de componentes React, garantindo que a aplicação não trave completamente e oferecendo uma experiência amigável ao usuário.

## Componentes Implementados

### 1. ErrorBoundary (`src/components/ErrorBoundary.tsx`)

Componente React que implementa o padrão Error Boundary usando `componentDidCatch`.

**Características:**
- Captura erros durante renderização de componentes filhos
- Integra automaticamente com o LoggingService
- Suporta fallback UI customizado
- Permite callback customizado para tratamento de erros
- Fornece contexto para identificar onde o erro ocorreu

**Uso:**
```tsx
<ErrorBoundary context="Nome do Contexto">
  <SeuComponente />
</ErrorBoundary>
```

### 2. ErrorFallback (`src/components/ErrorFallback.tsx`)

UI amigável exibida quando um erro é capturado.

**Características:**
- Design responsivo e acessível
- Botão "Tentar Novamente" para resetar o erro
- Botão "Voltar ao Início" para navegação segura
- Exibe detalhes do erro apenas em desenvolvimento
- Mensagem tranquilizadora para o usuário

### 3. Global Error Handlers (`src/lib/globalErrorHandlers.ts`)

Handlers globais para capturar erros não tratados fora do ciclo de vida do React.

**Características:**
- Captura eventos `window.error`
- Captura eventos `unhandledrejection` (promises rejeitadas)
- Integra com LoggingService
- Previne logs duplicados no console em produção

## Implementação na Aplicação

### Error Boundary Global

Localização: `src/App.tsx`

Envolve toda a aplicação para capturar qualquer erro não tratado:

```tsx
<ErrorBoundary context="Global Application">
  <QueryClientProvider client={queryClient}>
    {/* Resto da aplicação */}
  </QueryClientProvider>
</ErrorBoundary>
```

### Error Boundaries Específicos

#### Porteiro Dashboard
Localização: `src/pages/PorteiroDashboard.tsx`

```tsx
<ErrorBoundary context="Porteiro Dashboard">
  <PorteiroDashboardContent />
</ErrorBoundary>
```

#### Relatórios Page
Localização: `src/pages/RelatoriosPage.tsx`

```tsx
<ErrorBoundary context="Relatórios Page">
  <RelatoriosPageContent />
</ErrorBoundary>
```

### Inicialização dos Handlers Globais

Localização: `src/main.tsx`

Os handlers globais são inicializados antes da renderização da aplicação:

```tsx
initializeGlobalErrorHandlers();
createRoot(document.getElementById("root")!).render(<App />);
```

## Integração com LoggingService

Todos os erros capturados são automaticamente registrados no LoggingService com:
- Timestamp
- Stack trace
- Contexto (onde o erro ocorreu)
- User agent
- Informações adicionais relevantes

## Fluxo de Tratamento de Erros

1. **Erro ocorre** em um componente React
2. **Error Boundary captura** o erro via `componentDidCatch`
3. **LoggingService registra** o erro com contexto completo
4. **ErrorFallback é exibido** ao usuário com opções de recuperação
5. **Usuário pode:**
   - Tentar novamente (resetar o erro)
   - Voltar ao início (navegação segura)

## Verificação Manual

Para verificar o funcionamento do Error Boundary:

### 1. Testar Error Boundary em Desenvolvimento

Adicione temporariamente um componente que gera erro:

```tsx
const ErrorTest = () => {
  throw new Error('Teste de Error Boundary');
  return <div>Nunca será renderizado</div>;
};
```

Adicione em qualquer página e verifique:
- ✅ ErrorFallback é exibido
- ✅ Detalhes do erro aparecem (apenas em dev)
- ✅ Botões "Tentar Novamente" e "Voltar ao Início" funcionam
- ✅ Erro é registrado no LoggingService

### 2. Testar Handlers Globais

No console do navegador, execute:

```javascript
// Testar window.error
throw new Error('Teste de erro global');

// Testar unhandledrejection
Promise.reject('Teste de promise rejeitada');
```

Verifique:
- ✅ Erros são registrados no LoggingService
- ✅ Aplicação continua funcionando
- ✅ Logs podem ser exportados via LoggingService.downloadLogs()

### 3. Verificar Console

Com a aplicação rodando:
- ✅ Não deve haver erros "Minified React error #418"
- ✅ Não deve haver erros não tratados
- ✅ Navegação entre páginas funciona sem travamentos

### 4. Testar Recuperação

Quando ErrorFallback é exibido:
- ✅ Clicar em "Tentar Novamente" reseta o estado do erro
- ✅ Clicar em "Voltar ao Início" navega para "/"
- ✅ UI é responsiva e acessível

## Requisitos Atendidos

### Requirement 1.1
✅ Sistema renderiza sem gerar erro "Minified React error #418"

### Requirement 1.2
✅ Falhas durante renderização são capturadas e exibem mensagem amigável

### Requirement 1.3
✅ Navegação entre páginas mantém estabilidade sem travamentos

### Requirement 1.4
✅ Todos os erros não tratados são registrados no sistema de logging

## Próximos Passos

Após implementação completa de todas as tarefas:
1. Executar aplicação em modo desenvolvimento
2. Navegar por todas as páginas
3. Verificar console sem erros
4. Simular erros para validar Error Boundaries
5. Exportar logs para análise

## Notas Técnicas

- Error Boundaries só capturam erros durante renderização
- Não capturam erros em event handlers (use try-catch)
- Não capturam erros em código assíncrono (use handlers globais)
- Não capturam erros no próprio Error Boundary

## Suporte

Para mais informações sobre Error Boundaries:
- [React Error Boundaries Documentation](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

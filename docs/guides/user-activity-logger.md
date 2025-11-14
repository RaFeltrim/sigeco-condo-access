# UserActivityLogger - Sistema de Registro de Atividades do Usuário

## Visão Geral

O `UserActivityLogger` é um sistema de registro de atividades do usuário projetado para testes de usabilidade e debugging. Ele captura todos os clicks, inputs, navegações, erros e eventos de sistema durante uma sessão de desenvolvimento, gerando um relatório detalhado em formato markdown.

## Características Principais

- ✅ **Registro de Clicks**: Captura todos os clicks com informações detalhadas do elemento
- ✅ **Registro de Inputs**: Rastreia mudanças em campos de formulário (com sanitização de dados sensíveis)
- ✅ **Registro de Navegação**: Monitora mudanças de rota no SPA
- ✅ **Registro de Erros**: Captura erros e rejeitações de promises
- ✅ **Relatório Markdown**: Gera relatório detalhado para análise
- ✅ **Ativo Apenas em DEV**: Funciona apenas em modo desenvolvimento
- ✅ **Indicador Visual**: Badge mostrando status de gravação
- ✅ **Atalho de Teclado**: Ctrl+Shift+L para baixar relatório

## Como Usar

### 1. Iniciar Aplicação em Modo Desenvolvimento

```bash
npm run dev
```

O logger será iniciado automaticamente quando a aplicação estiver rodando em modo desenvolvimento.

### 2. Realizar Testes

Navegue pela aplicação normalmente:
- Clique em botões, links e outros elementos
- Preencha formulários
- Navegue entre páginas
- Interaja com componentes

Todas as ações serão registradas automaticamente.

### 3. Visualizar Status

Um badge vermelho no canto inferior direito da tela indica que o logging está ativo e mostra o número de atividades registradas.

### 4. Baixar Relatório

Existem duas formas de baixar o relatório:

**Opção 1: Atalho de Teclado**
- Pressione `Ctrl+Shift+L`

**Opção 2: Botão no Indicador**
- Clique no botão de download no badge de status

O relatório será baixado como um arquivo `.md` com timestamp no nome.

## Formato do Relatório

O relatório gerado contém:

### 1. Informações da Sessão
```markdown
## Informações da Sessão

- **Início**: 10/11/2025, 11:30:15
- **Fim**: 10/11/2025, 11:45:32
- **Duração**: 15m 17s
- **User Agent**: Mozilla/5.0...
- **Resolução**: 1920x1080
- **Total de Atividades**: 47
```

### 2. Estatísticas
```markdown
## Estatísticas

- **Clicks**: 23
- **Inputs**: 12
- **Navegações**: 5
- **Erros**: 0
- **Eventos de Sistema**: 7
```

### 3. Linha do Tempo Detalhada

Para cada atividade, o relatório inclui:

#### Exemplo de Click:
```markdown
### 1. Clique em button "Cadastrar Visitante"

- **Tipo**: click
- **Horário**: 11:30:45.123
- **Elemento**:
  - Tag: `BUTTON`
  - ID: `btn-cadastrar`
  - Classes: `btn btn-primary`
  - Texto: "Cadastrar Visitante"
  - XPath: `/html/body/div[1]/main/div/button`
```

#### Exemplo de Input:
```markdown
### 2. Input em campo "Nome do Visitante"

- **Tipo**: input
- **Horário**: 11:31:02.456
- **Elemento**:
  - Tag: `INPUT`
  - ID: `nome-visitante`
  - XPath: `/html/body/div[1]/form/div[1]/input`
- **Campo**:
  - Nome: `Nome do Visitante`
  - Tipo: `text`
  - Valor: `João Silva`
```

#### Exemplo de Navegação:
```markdown
### 3. Navegação de "/" para "/porteiro-dashboard"

- **Tipo**: navigation
- **Horário**: 11:32:15.789
- **Navegação**:
  - De: `/`
  - Para: `/porteiro-dashboard`
```

## Privacidade e Segurança

### Sanitização Automática

O logger automaticamente oculta valores de campos sensíveis:
- Senhas (`password`, `senha`)
- Tokens
- CPF/RG/Documentos
- Qualquer campo com nome contendo palavras sensíveis

Esses valores aparecem como `[VALOR OCULTO]` no relatório.

### Exemplo:
```typescript
// Campo de senha
Input em campo "Senha"
- Valor: [VALOR OCULTO]

// Campo de CPF
Input em campo "CPF"
- Valor: [VALOR OCULTO]
```

## Integração no Código

### App.tsx

O logger é integrado automaticamente através do hook `useUserActivityLogger`:

```typescript
import { useUserActivityLogger } from "@/hooks/useUserActivityLogger";
import { ActivityLoggerIndicator } from "@/components/ActivityLoggerIndicator";

const AppContent = () => {
  // Inicializar logger
  useUserActivityLogger();

  return (
    <>
      <Routes>
        {/* rotas */}
      </Routes>
      <ActivityLoggerIndicator />
    </>
  );
};
```

### Uso Programático

Você também pode usar o logger programaticamente:

```typescript
import { UserActivityLogger } from '@/services/UserActivityLogger';

// Registrar evento customizado
UserActivityLogger.logSystem('Relatório gerado', {
  formato: 'PDF',
  registros: 150
});

// Registrar erro customizado
UserActivityLogger.logError(
  new Error('Falha na validação'),
  'FormularioVisitante'
);

// Verificar status
if (UserActivityLogger.isLogging()) {
  console.log('Logger está ativo');
}

// Baixar relatório programaticamente
UserActivityLogger.downloadReport();
```

## Casos de Uso

### 1. Testes de Usabilidade

Use o logger para entender como usuários reais interagem com o sistema:
- Quais botões são mais clicados?
- Onde os usuários ficam travados?
- Quais campos causam confusão?

### 2. Debugging de Problemas

Quando um usuário reportar um bug:
1. Peça para reproduzir o problema com o logger ativo
2. Baixe o relatório
3. Analise a sequência de ações que levou ao erro

### 3. Análise de Fluxo

Entenda os caminhos que usuários tomam:
- Quais páginas são visitadas em sequência?
- Onde há desvios do fluxo esperado?
- Quais funcionalidades são sub-utilizadas?

### 4. Documentação de Testes

Gere documentação automática de testes:
- Execute um cenário de teste
- Baixe o relatório
- Use como documentação do teste realizado

## Exemplo de Sessão de Teste

### Cenário: Cadastro de Visitante

1. **Iniciar aplicação**: `npm run dev`
2. **Fazer login** como porteiro
3. **Navegar** para dashboard
4. **Clicar** em "Novo Visitante"
5. **Preencher** formulário:
   - Nome: João Silva
   - Documento: 123.456.789-00
   - Destino: Apartamento 101
6. **Clicar** em "Cadastrar"
7. **Verificar** mensagem de sucesso
8. **Baixar relatório**: Ctrl+Shift+L

### Relatório Gerado

O relatório conterá todos os passos acima com:
- Timestamps precisos
- Elementos clicados com XPaths
- Valores inseridos (documento sanitizado)
- Navegações entre páginas
- Qualquer erro ocorrido

## Limitações

- ✗ Não registra movimentos do mouse (apenas clicks)
- ✗ Não captura scroll
- ✗ Não registra hover events
- ✗ Funciona apenas em modo desenvolvimento
- ✗ Valores de campos sensíveis são ocultados

## Desativação

O logger está **ativo automaticamente em desenvolvimento**. Para desativá-lo temporariamente:

```typescript
import { UserActivityLogger } from '@/services/UserActivityLogger';

// Parar logging
UserActivityLogger.stop();

// Reiniciar logging
UserActivityLogger.start();
```

## Limpeza de Logs

Para limpar logs acumulados:

```typescript
import { UserActivityLogger } from '@/services/UserActivityLogger';

// Limpar todos os logs
UserActivityLogger.clearLogs();
```

## Troubleshooting

### Relatório não está sendo gerado

1. Verifique se está em modo desenvolvimento:
```bash
echo $NODE_ENV
# deve retornar "development"
```

2. Verifique o console do navegador:
```javascript
// Deve ver: [UserActivityLogger] Registro de atividades iniciado
```

3. Verifique se o badge está visível no canto da tela

### Clicks não estão sendo registrados

- O listener está em modo "capture" (terceiro parâmetro `true`)
- Verifique se não há erros no console
- Teste com elementos simples primeiro (botões, links)

### Valores sensíveis aparecem no relatório

Adicione o nome do campo à lista de sanitização em `UserActivityLogger.ts`:

```typescript
private sanitizeValue(fieldName: string, value: string): string {
  const sensitiveFields = [
    'password',
    'senha',
    'token',
    'cpf',
    'rg',
    'documento',
    'seu-campo-aqui', // adicionar aqui
  ];
  // ...
}
```

## Próximos Passos

Possíveis melhorias futuras:

1. ✨ Adicionar captura de screenshots em erros
2. ✨ Exportar também em JSON para análise automatizada
3. ✨ Integrar com ferramentas de analytics
4. ✨ Adicionar replay de sessão
5. ✨ Heatmap de clicks
6. ✨ Dashboard de visualização em tempo real

## Suporte

Para problemas ou sugestões, consulte a documentação do projeto ou abra uma issue no repositório.

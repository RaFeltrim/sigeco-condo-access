# 📊 Guia Rápido: Sistema de Registro de Atividades do Usuário

## 🎯 O que é?

Um sistema que registra **automaticamente** todas as suas interações com a aplicação durante o desenvolvimento:
- 🖱️ Clicks
- ⌨️ Inputs em campos
- 🧭 Navegação entre páginas
- ❌ Erros
- 🔧 Eventos de sistema

## 🚀 Como Usar

### Passo 1: Iniciar o Sistema
```bash
npm run dev
```

Pronto! O logger já está ativo automaticamente. 

### Passo 2: Identificar que está Gravando

Você verá um **badge vermelho** no canto inferior direito:

```
🔴 Registrando atividades (X)  [📥]
```

O número (X) aumenta conforme você interage com a aplicação.

### Passo 3: Usar a Aplicação Normalmente

Faça o que precisa testar:
- Faça login
- Navegue pelas páginas
- Preencha formulários
- Clique em botões
- Teste funcionalidades

**Tudo é registrado automaticamente!**

### Passo 4: Baixar o Relatório

Quando terminar seu teste, baixe o relatório:

**Opção 1:** Pressione `Ctrl + Shift + L`  
**Opção 2:** Clique no botão 📥 no badge vermelho

Um arquivo `.md` será baixado com nome tipo:
```
user-activity-report-2025-11-10T11-11-56-305Z.md
```

## 📄 O que o Relatório Contém?

### Informações da Sessão
- Horário de início
- Duração total
- Navegador usado
- Resolução da tela
- Total de atividades

### Estatísticas
- Número de clicks
- Número de inputs
- Número de navegações
- Número de erros

### Linha do Tempo Detalhada

Para cada ação, você terá:

**Para Clicks:**
```markdown
### 5. Clique em button "Cadastrar Visitante"
- Tipo: click
- Horário: 11:30:45,123
- Elemento:
  - Tag: BUTTON
  - ID: btn-cadastrar
  - Classes: btn btn-primary
  - Texto: "Cadastrar Visitante"
  - XPath: /html/body/div[1]/main/div/button
```

**Para Inputs:**
```markdown
### 6. Input em campo "Nome do Visitante"
- Tipo: input
- Horário: 11:31:02,456
- Campo:
  - Nome: Nome do Visitante
  - Tipo: text
  - Valor: João Silva
```

**Para Navegação:**
```markdown
### 7. Navegação de "/login" para "/dashboard"
- Tipo: navigation
- Horário: 11:32:15,789
```

## 🔐 Segurança

O sistema **automaticamente protege** dados sensíveis!

Se você digitar em campos de:
- Senha
- CPF
- Token
- Documento

O valor aparecerá como `[VALOR OCULTO]` no relatório.

**Exemplo:**
```markdown
Input em campo "Senha"
- Valor: [VALOR OCULTO]  ← Protegido!
```

## 💡 Casos de Uso Práticos

### 1. Reportar um Bug
```
1. Inicie npm run dev
2. Reproduza o bug passo a passo
3. Baixe o relatório (Ctrl+Shift+L)
4. Envie o arquivo .md junto com o report do bug
```

Agora você tem documentação exata de como o bug aconteceu!

### 2. Documentar um Teste
```
1. Inicie npm run dev
2. Execute seu cenário de teste
3. Baixe o relatório
4. Use como documentação do teste executado
```

### 3. Entender Comportamento do Usuário
```
1. Peça para alguém usar o sistema
2. Observe (sem interferir)
3. Baixe o relatório
4. Analise onde houve dificuldades
```

### 4. Validar um Fluxo
```
1. Defina o fluxo esperado
2. Execute-o na aplicação
3. Baixe o relatório
4. Compare: o que aconteceu vs o esperado
```

## 🎓 Exemplo Real

### Cenário: Testar Cadastro de Visitante

1. **Iniciar:** `npm run dev`
2. **Fazer login** como porteiro
3. **Navegar** para "Novo Visitante"
4. **Preencher** formulário:
   - Nome: João Silva
   - CPF: 123.456.789-00
   - Destino: Apto 101
5. **Clicar** em "Cadastrar"
6. **Verificar** mensagem de sucesso
7. **Baixar relatório:** `Ctrl+Shift+L`

### Resultado

O relatório terá **exatamente 7+ atividades** listando:
- Login (click + navegação)
- Click em "Novo Visitante"
- 3 inputs (nome, CPF, destino)
- Click em "Cadastrar"
- Navegação de volta
- Qualquer erro que tenha ocorrido

Com **timestamps precisos** e **XPaths** para encontrar cada elemento no código!

## ⚙️ Configuração Avançada

### Desativar Temporariamente

No console do navegador:
```javascript
import { UserActivityLogger } from './services/UserActivityLogger';
UserActivityLogger.stop();
```

### Reativar
```javascript
UserActivityLogger.start();
```

### Limpar Logs Atuais
```javascript
UserActivityLogger.clearLogs();
```

### Ver Logs no Console
```javascript
console.log(UserActivityLogger.getLogs());
```

## ❓ Perguntas Frequentes

### P: Funciona em produção?
**R:** Não! Só funciona em desenvolvimento. Em produção, o código nem existe.

### P: Afeta a performance?
**R:** Não significativamente. Os listeners são otimizados e só em dev.

### P: Posso ver o relatório em tempo real?
**R:** O badge mostra o contador ao vivo. Para ver detalhes, baixe o relatório.

### P: Os relatórios ficam salvos?
**R:** Não. Cada download é um novo arquivo. Guarde os que precisar!

### P: Captura movimentos do mouse?
**R:** Não, apenas clicks. Scroll e hover não são capturados.

### P: E se eu fechar o navegador?
**R:** Os logs se perdem. Baixe o relatório antes de fechar!

## 🐛 Problemas Comuns

### Badge não aparece
- ✅ Verifique que está em modo dev (`npm run dev`)
- ✅ Verifique o console por erros
- ✅ Recarregue a página

### Relatório não baixa
- ✅ Verifique permissões de download do navegador
- ✅ Tente com Ctrl+Shift+L
- ✅ Verifique se há logs (número no badge > 0)

### Valores sensíveis aparecem
- ✅ Adicione o campo à lista em `UserActivityLogger.ts`
- ✅ Procure por `sensitiveFields` no código

## 📚 Mais Informações

Para documentação técnica completa, veja:
- `src/services/README_UserActivityLogger.md`

## 🎉 Pronto!

Agora você pode testar a aplicação e ter **documentação automática** de tudo que aconteceu!

**Dica Final:** Baixe relatórios frequentemente durante testes longos para não perder dados!

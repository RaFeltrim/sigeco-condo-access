# Task 15 - Checklist de Validação Final

## ✅ Testes Automatizados
- [x] Validação de CPF com CPFs válidos e inválidos
- [x] Validação de RG e detecção automática de tipo
- [x] Formatação de máscaras (CPF e RG)
- [x] Validação de nome (aceita apenas letras e espaços)
- [x] Capitalização e normalização de nomes
- [x] Cálculo de duração entre entrada e saída
- [x] Formatação de mensagens de duração
- [x] URL do WhatsApp com mensagem correta

**Resultado:** 36/36 testes passaram ✅

---

## 🌐 Testes Manuais no Navegador

### 1. Validação de Documento (CPF/RG)

#### CPF
- [ ] Digitar CPF válido: `111.444.777-35`
  - [ ] Máscara é aplicada automaticamente durante digitação
  - [ ] Campo aceita o CPF válido sem erro
  
- [ ] Digitar CPF inválido: `111.111.111-11`
  - [ ] Mensagem de erro "CPF inválido" aparece
  - [ ] Campo fica com borda vermelha
  
- [ ] Digitar CPF parcial e sair do campo
  - [ ] Mensagem de erro apropriada aparece

#### RG
- [ ] Digitar RG válido: `12.345.678-9`
  - [ ] Máscara é aplicada automaticamente
  - [ ] Campo aceita o RG válido sem erro
  
- [ ] Digitar RG com menos de 9 dígitos
  - [ ] Mensagem de erro aparece

### 2. Campo "Destino da Visita" (Select)

- [ ] Clicar no campo "Destino da Visita"
  - [ ] Dropdown abre com lista de opções
  - [ ] Opções incluem apartamentos (Apto 101-304)
  - [ ] Opções incluem áreas comuns (Administração, Salão de Festas, etc.)
  
- [ ] Digitar no campo de busca
  - [ ] Lista filtra em tempo real
  - [ ] Exemplo: digitar "101" mostra apenas "Apto 101"
  
- [ ] Selecionar uma opção
  - [ ] Valor selecionado aparece no campo
  - [ ] Dropdown fecha automaticamente
  
- [ ] Tentar submeter formulário sem selecionar destino
  - [ ] Mensagem de erro "Destino é obrigatório" aparece

### 3. Z-index do Painel de Notificações

- [ ] Clicar no ícone de sino (notificações)
  - [ ] Painel de notificações abre
  - [ ] Painel aparece ACIMA de todos os elementos (cards, forms, selects)
  
- [ ] Com painel aberto, verificar sobreposição
  - [ ] Painel está acima dos cards de estatísticas
  - [ ] Painel está acima do formulário
  - [ ] Painel está acima de dropdowns abertos
  
- [ ] Clicar fora do painel
  - [ ] Painel fecha automaticamente

### 4. Busca de Visitantes

- [ ] Registrar alguns visitantes primeiro (pelo menos 3)
  
- [ ] Buscar por nome
  - [ ] Digitar nome parcial (ex: "João")
  - [ ] Resultados aparecem em tempo real
  - [ ] Resultados mostram nome, documento e última visita
  
- [ ] Buscar por documento
  - [ ] Digitar CPF ou RG
  - [ ] Resultado exato aparece
  
- [ ] Buscar por destino
  - [ ] Digitar destino (ex: "Apto 101")
  - [ ] Visitantes que foram para esse destino aparecem
  
- [ ] Buscar termo inexistente
  - [ ] Mensagem "Nenhum visitante encontrado" aparece
  
- [ ] Clicar em um resultado
  - [ ] Detalhes do visitante são exibidos
  - [ ] Histórico de visitas é mostrado

### 5. Toast de Saída com Duração

- [ ] Registrar entrada de um visitante
  - [ ] Toast "Entrada registrada com sucesso" aparece
  
- [ ] Aguardar alguns minutos (ou ajustar horário manualmente no código)
  
- [ ] Clicar em "Saída" para o visitante
  - [ ] Toast aparece com título: "Saída de [Nome] registrada com sucesso"
  - [ ] Toast mostra descrição com duração: "Permaneceu X horas e Y minutos" ou "Permaneceu X minutos"
  - [ ] Toast tem estilo verde (success)
  - [ ] Toast desaparece após 5 segundos

### 6. Integração WhatsApp

- [ ] Clicar no botão "Contatar" (seção de suporte)
  - [ ] Nova aba/janela abre
  - [ ] WhatsApp Web ou app nativo abre
  - [ ] Número correto: +55 19 99777-5596
  - [ ] Mensagem pré-preenchida: "Olá, preciso de suporte técnico com o SIGECO"
  - [ ] Página atual permanece aberta (não navega)

### 7. Validação de Nome

- [ ] Digitar nome válido: "João Silva"
  - [ ] Nome é aceito
  - [ ] Primeira letra de cada palavra é capitalizada automaticamente
  
- [ ] Digitar nome com números: "João123"
  - [ ] Números não são aceitos/digitados
  - [ ] Mensagem de erro aparece
  
- [ ] Digitar nome com símbolos: "João@Silva"
  - [ ] Símbolos não são aceitos
  - [ ] Mensagem de erro aparece
  
- [ ] Digitar nome muito curto: "Jo"
  - [ ] Mensagem de erro "Nome deve ter no mínimo 3 caracteres" aparece
  
- [ ] Digitar nome com espaços extras: "João  Silva"
  - [ ] Espaços extras são normalizados automaticamente

### 8. Persistência de Dados (localStorage)

- [ ] Registrar 2-3 visitantes
  - [ ] Visitantes aparecem na lista "Entradas Recentes"
  
- [ ] Recarregar a página (F5)
  - [ ] Visitantes continuam na lista
  - [ ] Dados persistem corretamente
  
- [ ] Registrar saída de um visitante
  - [ ] Status muda para "Saiu"
  - [ ] Recarregar página
  - [ ] Status "Saiu" persiste
  
- [ ] Abrir DevTools > Application > Local Storage
  - [ ] Verificar chave `sigeco_visitors`
  - [ ] Dados estão salvos em formato JSON

### 9. Atualização da Lista de Entradas Recentes

- [ ] Registrar entrada de visitante
  - [ ] Visitante aparece no topo da lista
  - [ ] Badge "Ativo" (verde) é exibido
  - [ ] Botão "Saída" está disponível
  
- [ ] Clicar em "Saída"
  - [ ] Lista atualiza IMEDIATAMENTE
  - [ ] Badge muda de "Ativo" (verde) para "Saiu" (cinza)
  - [ ] Botão "Saída" é substituído por horário de saída
  - [ ] Visitante move para o final da lista (abaixo dos ativos)
  
- [ ] Verificar ordenação
  - [ ] Visitantes ativos aparecem no topo
  - [ ] Visitantes que saíram aparecem embaixo
  - [ ] Dentro de cada grupo, mais recentes aparecem primeiro

### 10. Validação Completa do Formulário

- [ ] Tentar submeter formulário vazio
  - [ ] Mensagens de erro aparecem em todos os campos obrigatórios
  - [ ] Foco vai para o primeiro campo inválido
  - [ ] Formulário NÃO é submetido
  
- [ ] Preencher apenas nome
  - [ ] Tentar submeter
  - [ ] Erros aparecem em documento e destino
  
- [ ] Preencher todos os campos corretamente
  - [ ] Formulário é submetido com sucesso
  - [ ] Toast de sucesso aparece
  - [ ] Campos são limpos
  - [ ] Visitante aparece na lista

### 11. Acessibilidade

- [ ] Navegação por teclado
  - [ ] Pressionar Tab navega pelos campos na ordem lógica
  - [ ] Todos os campos são acessíveis via teclado
  - [ ] Botões podem ser ativados com Enter ou Space
  
- [ ] ARIA labels
  - [ ] Inspecionar elementos no DevTools
  - [ ] Verificar presença de aria-label, aria-describedby
  - [ ] Campos inválidos têm aria-invalid="true"
  
- [ ] Screen reader (se disponível)
  - [ ] Erros são anunciados
  - [ ] Toasts são anunciados
  - [ ] Labels são lidos corretamente

### 12. Console do Navegador

- [ ] Abrir DevTools > Console
  - [ ] Verificar que NÃO há erros no console
  - [ ] Verificar que NÃO há warnings críticos
  - [ ] Logs de debug (se houver) são apropriados

---

## 📊 Resultado Final

### Testes Automatizados
- **Total:** 36 testes
- **Passou:** 36 ✅
- **Falhou:** 0

### Testes Manuais
- **Total:** [ ] itens
- **Completos:** [ ] itens
- **Pendentes:** [ ] itens

---

## 🎯 Critérios de Aceitação

Para considerar a Task 15 completa, TODOS os seguintes critérios devem ser atendidos:

1. ✅ Todos os testes automatizados passam (36/36)
2. [ ] Todos os testes manuais passam
3. [ ] Console do navegador está limpo (sem erros)
4. [ ] Aplicação funciona corretamente em navegador moderno
5. [ ] Dados persistem após reload da página
6. [ ] Todas as validações funcionam corretamente
7. [ ] Acessibilidade básica está implementada

---

## 📝 Notas

- Servidor de desenvolvimento rodando em: http://localhost:8080/
- Para executar testes automatizados: `npx tsx scripts/test-porteiro-dashboard-task15.ts`
- Para validação de tipos e lint: `npm run validate`

---

## ✅ Conclusão

Após completar todos os testes manuais acima, a Task 15 estará validada e pronta para produção.

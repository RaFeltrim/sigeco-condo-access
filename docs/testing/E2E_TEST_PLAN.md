# 🧪 Plano de Testes E2E - Admin Dashboard SIGECO

## 📋 Informações de Acesso

**URL:** http://localhost:8080  
**Usuário:** admin  
**Senha:** a

---

## 🎯 Componentes a Testar

### 1. ✅ Visão Geral (Overview)

**Objetivo:** Verificar dashboard principal com estatísticas

#### Testes:
- [ ] **T1.1** - Verificar se 4 cards de estatísticas são exibidos
  - Acessos Hoje
  - Visitantes Ativos
  - Total Semanal
  - Sistema Online
  
- [ ] **T1.2** - Verificar gráfico de fluxo de visitas
  - Deve mostrar 7 dias da semana
  - Barras devem ter valores visíveis
  
- [ ] **T1.3** - Verificar lista de atividade recente
  - Deve mostrar últimas entradas
  - Cada item deve ter nome, destino e status
  
**Status Esperado:** ✅ Todos os elementos visuais funcionando

---

### 2. 👥 Gerenciamento de Moradores

**Objetivo:** Testar CRUD de moradores e unidades

#### Testes de Cadastro:
- [ ] **T2.1** - Abrir modal "Novo Morador"
  - Clicar no botão "Novo Morador"
  - Modal deve abrir
  
- [ ] **T2.2** - Validar campos obrigatórios
  - Tentar salvar sem preencher campos
  - Deve mostrar erros de validação
  
- [ ] **T2.3** - Validar máscara de telefone
  - Digitar números no campo telefone
  - Deve formatar automaticamente: (99) 99999-9999
  
- [ ] **T2.4** - Validar máscara de documento
  - Digitar CPF
  - Deve formatar automaticamente: 999.999.999-99
  
- [ ] **T2.5** - Validar CPF inválido
  - Digitar CPF inválido (ex: 111.111.111-11)
  - Deve mostrar erro "CPF inválido"
  
- [ ] **T2.6** - Testar busca de unidade (Typeahead)
  - Clicar no campo "Unidade"
  - Digitar número de unidade
  - Deve filtrar e mostrar resultados
  
- [ ] **T2.7** - Cadastrar morador com sucesso
  - Preencher todos os campos corretamente
  - Clicar em "Cadastrar Morador"
  - Deve mostrar toast de sucesso

#### Testes de Listagem:
- [ ] **T2.8** - Verificar tabela de moradores
  - Deve mostrar lista de moradores
  - Colunas: Morador, Unidade, Contato, Tipo, Status, Ações
  
- [ ] **T2.9** - Testar busca de moradores
  - Digitar nome no campo de busca
  - Lista deve filtrar em tempo real
  
- [ ] **T2.10** - Testar botão de exclusão
  - Clicar no ícone de lixeira
  - Deve abrir modal de confirmação
  - Modal deve mostrar nome do morador
  
- [ ] **T2.11** - Confirmar exclusão
  - No modal de confirmação, clicar "Confirmar Exclusão"
  - Deve mostrar toast de sucesso
  
- [ ] **T2.12** - Cancelar exclusão
  - No modal de confirmação, clicar "Cancelar"
  - Modal deve fechar sem excluir

#### Testes de Unidades:
- [ ] **T2.13** - Alternar para aba "Unidades"
  - Clicar na aba "Unidades"
  - Deve mostrar grid de unidades
  
- [ ] **T2.14** - Filtrar unidades por status
  - Selecionar "Ocupadas" no filtro
  - Deve mostrar apenas unidades ocupadas
  
- [ ] **T2.15** - Verificar cards de unidades
  - Cada card deve mostrar: número, bloco, tipo, status

**Status Esperado:** ✅ CRUD completo funcionando com validações

---

### 3. 📅 Agendamento de Visitas

**Objetivo:** Testar sistema de agendamento

#### Testes de Agendamento:
- [ ] **T3.1** - Abrir modal "Novo Agendamento"
  - Clicar no botão "Novo Agendamento"
  - Modal deve abrir
  
- [ ] **T3.2** - Validar campos obrigatórios
  - Tentar salvar sem preencher
  - Deve mostrar erros
  
- [ ] **T3.3** - Selecionar data futura
  - Campo data não deve permitir datas passadas
  
- [ ] **T3.4** - Criar agendamento
  - Preencher todos os campos
  - Clicar em "Agendar Visita"
  - Deve mostrar toast de sucesso

#### Testes de Visualização:
- [ ] **T3.5** - Verificar calendário
  - Calendário deve estar visível
  - Deve permitir seleção de data
  
- [ ] **T3.6** - Verificar "Agendamentos Hoje"
  - Card deve mostrar agendamentos do dia
  - Cada item deve ter nome, destino, horário, status
  
- [ ] **T3.7** - Verificar "Próximos Agendamentos"
  - Card deve mostrar agendamentos futuros
  - Botões de confirmar/cancelar devem estar visíveis
  
- [ ] **T3.8** - Confirmar agendamento
  - Clicar no botão de check (confirmar)
  - Status deve mudar para "Confirmado"
  
- [ ] **T3.9** - Cancelar agendamento
  - Clicar no botão X (cancelar)
  - Status deve mudar para "Cancelado"

#### Testes de Lista Completa:
- [ ] **T3.10** - Verificar lista completa
  - Scroll até "Todos os Agendamentos"
  - Deve mostrar todos os agendamentos em cards expandidos

**Status Esperado:** ✅ Sistema de agendamento funcionando

---

### 4. 📊 Relatórios

**Objetivo:** Testar geração e exportação de relatórios

#### Testes de Filtros:
- [ ] **T4.1** - Aplicar filtro de período
  - Selecionar "Esta semana"
  - Contador de registros deve atualizar
  
- [ ] **T4.2** - Aplicar filtro de tipo
  - Selecionar "Visita Familiar"
  - Lista deve filtrar
  
- [ ] **T4.3** - Aplicar filtro de status
  - Selecionar "Concluída"
  - Lista deve filtrar
  
- [ ] **T4.4** - Aplicar filtro de destino
  - Digitar "Apto 101"
  - Lista deve filtrar
  
- [ ] **T4.5** - Limpar filtros
  - Clicar em "Limpar Filtros"
  - Todos os filtros devem resetar

#### Testes de Filtros Salvos:
- [ ] **T4.6** - Salvar filtro atual
  - Aplicar alguns filtros
  - Clicar em "Salvar Filtro"
  - Digitar nome do filtro
  - Clicar em "Salvar"
  - Deve mostrar toast de sucesso
  
- [ ] **T4.7** - Ver filtros salvos
  - Clicar em "Filtros Salvos"
  - Deve abrir modal com lista de filtros
  
- [ ] **T4.8** - Aplicar filtro salvo
  - No modal de filtros salvos
  - Clicar em "Aplicar" em um filtro
  - Filtros devem ser aplicados automaticamente
  
- [ ] **T4.9** - Excluir filtro salvo
  - No modal de filtros salvos
  - Clicar no ícone de lixeira
  - Deve abrir confirmação
  - Confirmar exclusão
  - Filtro deve ser removido

#### Testes de Exportação:
- [ ] **T4.10** - Exportar PDF
  - Clicar no botão "PDF"
  - Deve mostrar loading
  - Arquivo PDF deve ser baixado
  - Abrir PDF e verificar conteúdo
  
- [ ] **T4.11** - Exportar Excel
  - Clicar no botão "Excel"
  - Deve mostrar loading
  - Arquivo XLSX deve ser baixado
  - Abrir Excel e verificar 3 abas: Dados, Estatísticas, Metadados
  
- [ ] **T4.12** - Verificar conteúdo do relatório
  - Relatório deve incluir:
    - Estatísticas gerais
    - Filtros aplicados
    - Tabela de registros
    - Data de geração

#### Testes de Visualização:
- [ ] **T4.13** - Verificar tabela de registros
  - Deve mostrar todos os registros filtrados
  - Colunas: Data/Hora, Visitante, Documento, Destino, Motivo, Duração, Status
  
- [ ] **T4.14** - Verificar gráficos
  - Gráfico de distribuição por tipo
  - Gráfico de horários de pico

**Status Esperado:** ✅ Geração de relatórios funcionando (BUG CORRIGIDO)

---

### 5. 📦 Controle de Insumos

**Objetivo:** Testar gestão de funcionários e prestadores

#### Testes de Funcionários:
- [ ] **T5.1** - Verificar aba "Funcionários"
  - Deve estar selecionada por padrão
  - Formulário de cadastro à esquerda
  - Lista de funcionários à direita
  
- [ ] **T5.2** - Validar campos obrigatórios
  - Tentar cadastrar sem preencher
  - Deve mostrar erros: "Nome é obrigatório", "Documento é obrigatório", "Função é obrigatória"
  
- [ ] **T5.3** - Validar campo Função vazio
  - Deixar campo Função sem selecionar
  - Tentar salvar
  - Deve mostrar erro "Função é obrigatória"
  
- [ ] **T5.4** - Cadastrar funcionário
  - Preencher Nome, Documento, Função
  - Clicar em "Cadastrar Funcionário"
  - Deve mostrar toast de sucesso
  
- [ ] **T5.5** - Buscar funcionário
  - Digitar nome no campo de busca
  - Lista deve filtrar

#### Testes de Prestadores:
- [ ] **T5.6** - Alternar para aba "Prestadores"
  - Clicar na aba "Prestadores"
  - Formulário de cadastro deve mudar
  
- [ ] **T5.7** - Validar campos obrigatórios
  - Tentar cadastrar sem preencher
  - Deve mostrar erros
  
- [ ] **T5.8** - Cadastrar prestador
  - Preencher Responsável, Empresa, Tipo de Serviço
  - Clicar em "Cadastrar Prestador"
  - Deve mostrar toast de sucesso
  
- [ ] **T5.9** - Verificar lista de prestadores
  - Deve mostrar prestadores cadastrados
  - Colunas: Empresa, Serviço, Contato, Próxima Visita, Status

**Status Esperado:** ✅ Validações implementadas

---

### 6. 🔒 Backup e Segurança

**Objetivo:** Testar configurações de backup e segurança

#### Testes de Status:
- [ ] **T6.1** - Verificar cards de status
  - Status do Sistema: "Seguro"
  - Último Backup: data/hora
  - Espaço Utilizado: tamanho
  
- [ ] **T6.2** - Verificar barra de progresso
  - Progresso do Backup Atual deve estar visível
  - Deve mostrar 100% se concluído

#### Testes de Configurações:
- [ ] **T6.3** - Testar toggle "Backup Automático"
  - Clicar no switch
  - Deve alternar entre ligado/desligado
  - Deve mostrar toast de confirmação
  
- [ ] **T6.4** - Testar toggle "Backup na Nuvem"
  - Clicar no switch
  - Deve alternar
  - Deve mostrar toast
  
- [ ] **T6.5** - Testar toggle "Criptografia Avançada"
  - Clicar no switch
  - Deve alternar
  - Deve mostrar toast

#### Testes de Ações:
- [ ] **T6.6** - Iniciar Backup Manual
  - Clicar em "Iniciar Backup Manual"
  - Deve mostrar toast "Backup iniciado"
  
- [ ] **T6.7** - Restaurar Backup
  - Clicar em "Restaurar Backup"
  - Deve mostrar toast ou abrir seletor de arquivo

#### Testes de Logs:
- [ ] **T6.8** - Verificar logs de segurança
  - Card "Logs de Segurança" deve estar visível
  - Deve mostrar últimas atividades
  - Cada log deve ter: tipo, usuário/sistema, status, horário

**Status Esperado:** ✅ Configurações funcionando

---

### 7. 📞 Suporte Avançado

**Objetivo:** Testar sistema de suporte e treinamento

#### Testes de Status:
- [ ] **T7.1** - Verificar cards de status
  - Versão Atual
  - Sistema: Online
  - Atualizações: quantidade disponível
  - Suporte: 24/7
  
- [ ] **T7.2** - Verificar tabs
  - 4 tabs devem estar visíveis:
    - Treinamento
    - Atualizações
    - Suporte
    - Documentação

#### Testes de Treinamento:
- [ ] **T7.3** - Verificar materiais de treinamento
  - Deve mostrar lista de treinamentos
  - Cada item deve ter: tipo (Vídeo/Guia), título, duração, progresso
  
- [ ] **T7.4** - Iniciar treinamento
  - Clicar em "Iniciar" em um treinamento
  - Deve mostrar toast

#### Testes de Atualizações:
- [ ] **T7.5** - Alternar para aba "Atualizações"
  - Deve mostrar lista de versões
  - Versão atual deve estar marcada como "Instalado"
  
- [ ] **T7.6** - Instalar atualização
  - Clicar em "Instalar Atualização"
  - Deve mostrar toast

#### Testes de Suporte:
- [ ] **T7.7** - Alternar para aba "Suporte"
  - Deve mostrar 3 cards:
    - Suporte Técnico
    - Suporte Treinamento
    - Suporte Comercial
  
- [ ] **T7.8** - Contatar suporte
  - Clicar em "Contatar" em qualquer card
  - Deve mostrar toast

#### Testes de Documentação:
- [ ] **T7.9** - Alternar para aba "Documentação"
  - Deve mostrar grid de documentos
  - Cada card deve ter: título, descrição, tipo, páginas
  
- [ ] **T7.10** - Baixar documentação
  - Clicar em "Baixar" em um documento
  - Deve iniciar download ou mostrar toast

**Status Esperado:** ✅ Interface funcionando

---

## 🐛 Bugs Encontrados e Corrigidos

### ❌ Bug 1: Erro na geração de relatórios
**Erro:** `TypeError: format is not a function`  
**Causa:** Conflito de nome de parâmetro com função importada  
**Correção:** ✅ Renomeado parâmetro `format` para `fileFormat` em `generateFilename()`  
**Arquivo:** `src/services/ReportService.ts:450`  
**Status:** ✅ CORRIGIDO

---

## 📊 Resumo de Testes

| Componente | Total de Testes | Status |
|------------|----------------|--------|
| Visão Geral | 3 | ⏳ Pendente |
| Gerenciamento de Moradores | 15 | ⏳ Pendente |
| Agendamento de Visitas | 10 | ⏳ Pendente |
| Relatórios | 14 | ⏳ Pendente |
| Controle de Insumos | 9 | ⏳ Pendente |
| Backup e Segurança | 8 | ⏳ Pendente |
| Suporte Avançado | 10 | ⏳ Pendente |
| **TOTAL** | **69** | **0% Completo** |

---

## 🎯 Próximos Passos

1. ✅ Corrigir bug de geração de relatórios (CONCLUÍDO)
2. ⏳ Executar testes E2E manualmente
3. ⏳ Documentar resultados
4. ⏳ Corrigir bugs encontrados
5. ⏳ Implementar testes automatizados

---

**Última Atualização:** Novembro 2024  
**Responsável:** Equipe de QA SIGECO

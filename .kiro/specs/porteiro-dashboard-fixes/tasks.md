# Implementation Plan - Correções Dashboard do Porteiro

- [x] 1. Criar sistema de validação e formatação de documentos





  - Implementar validador de CPF com algoritmo oficial de verificação de dígitos
  - Implementar validador de RG com formato básico
  - Criar função de detecção automática de tipo de documento (CPF vs RG)
  - Implementar formatadores de máscara para CPF (000.000.000-00) e RG (00.000.000-0)
  - Criar custom hook useDocumentInput que integra validação e formatação em tempo real
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Implementar validação e formatação de nome





  - Criar validador que aceita apenas letras, espaços e caracteres acentuados
  - Implementar função de capitalização automática (primeira letra de cada palavra)
  - Criar função de normalização que remove espaços extras
  - Adicionar validação de tamanho mínimo (3) e máximo (100 caracteres)
  - Integrar validação no campo "Nome do Visitante" com feedback visual de erros
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 3. Converter campo "Destino da Visita" para componente Select





  - Criar array de destinos com apartamentos (Apto 101-304) e áreas comuns
  - Implementar Select do shadcn/ui com busca/filtro em tempo real
  - Agrupar opções por categoria (apartamentos, áreas comuns, administração)
  - Marcar campo como obrigatório e adicionar validação
  - Estilizar select para manter consistência visual com outros campos
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 4. Corrigir z-index do painel de notificações





  - Alterar z-index do NotificationSystem de z-50 para z-9999
  - Mudar position de absolute para fixed para garantir posicionamento correto
  - Adicionar hierarquia de z-index consistente (content: 10, dropdowns: 40, modals: 50, toasts: 100, notifications: 9999)
  - Testar que notificações aparecem acima de todos os elementos (cards, forms, selects)
  - Garantir que clique fora do painel fecha as notificações
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5. Implementar funcionalidade de busca de visitantes





  - Criar hook useVisitorSearch com algoritmo de busca em múltiplos campos
  - Implementar busca por nome (fuzzy match), documento (exact) e destino (partial)
  - Adicionar cálculo de relevância e ordenação de resultados
  - Criar componente VisitorSearch que exibe resultados em tempo real
  - Implementar visualização de detalhes e histórico ao clicar em resultado
  - Adicionar mensagem "Nenhum visitante encontrado" quando não há resultados
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 6. Adicionar toast de saída com cálculo de duração





  - Criar função calculateDuration que calcula diferença entre entrada e saída
  - Implementar formatação de duração ("X horas e Y minutos" ou "X minutos")
  - Modificar handleRegistrarSaida para calcular duração ao registrar saída
  - Exibir toast com título "Saída de [Nome] registrada com sucesso" e duração na descrição
  - Configurar toast com duração de 5 segundos e estilo success (verde)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 7. Integrar botão de contato com WhatsApp





  - Criar função openWhatsAppSupport que gera URL do WhatsApp
  - Usar número +55 19 99777-5596 e mensagem pré-definida "Olá, preciso de suporte técnico com o SIGECO"
  - Implementar abertura em nova aba com atributos de segurança (noopener, noreferrer)
  - Modificar botão "Contatar" para chamar função de abertura do WhatsApp
  - Testar que abre WhatsApp Web ou app nativo corretamente
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_



- [x] 8. Implementar persistência de dados com localStorage



  - Criar módulo visitorStorage com funções save, load, update e prune
  - Implementar hook useVisitorStorage que gerencia estado e localStorage
  - Configurar limite máximo de 100 registros com estratégia FIFO
  - Adicionar tratamento de erros e fallback para array vazio
  - Carregar visitantes do localStorage ao inicializar dashboard
  - Salvar automaticamente ao adicionar ou atualizar visitante
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 9. Atualizar lista de entradas recentes com novo comportamento





  - Modificar lista para atualizar imediatamente após check-out
  - Alterar badge de "Ativo" (verde) para "Saiu" (cinza) após saída
  - Substituir botão "Saída" por horário de saída quando status muda
  - Implementar ordenação que mantém ativos no topo e saídos embaixo
  - Manter ordem cronológica (mais recentes primeiro) dentro de cada grupo
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 10. Implementar validação completa do formulário






  - Adicionar validação de todos os campos obrigatórios antes de submissão
  - Exibir mensagens de erro inline com borda vermelha e texto de erro
  - Prevenir submissão se validação falhar e focar no primeiro campo inválido
  - Validar: nome (obrigatório, apenas letras), documento (obrigatório, CPF/RG válido), destino (obrigatório, selecionado)
  - Exibir toast de sucesso "Entrada registrada com sucesso" quando validação passar
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 11. Criar tipos TypeScript e interfaces






  - Definir interface Visitor com todos os campos necessários
  - Criar tipos para DocumentValidation, NameValidation e SearchResult
  - Definir interfaces para form state (VisitorFormData, VisitorFormErrors, VisitorFormState)
  - Criar type guards para validação de tipos em runtime
  - Exportar todos os tipos de arquivo centralizado types/visitor.ts
  - _Requirements: Todos (suporte)_

- [x] 12. Refatorar PorteiroDashboard para usar novos componentes





  - Extrair formulário para componente VisitorForm isolado
  - Extrair busca para componente VisitorSearch isolado
  - Extrair lista para componente VisitorList isolado
  - Integrar useVisitorStorage no componente principal
  - Conectar todos os componentes com props e callbacks apropriados
  - Manter estatísticas e layout geral no componente principal
  - _Requirements: Todos (integração)_

- [x] 13. Adicionar tratamento de erros e feedback visual





  - Implementar mensagens de erro padronizadas para cada tipo de validação
  - Adicionar estados de loading durante operações assíncronas
  - Criar feedback visual para campos inválidos (borda vermelha, ícone de erro)
  - Implementar toast de erro quando operações falharem
  - Adicionar try-catch em operações de localStorage com fallback
  - _Requirements: 9.2, 9.3, 10.4_

- [x] 14. Implementar acessibilidade (ARIA e navegação por teclado)





  - Adicionar aria-label, aria-describedby e aria-invalid em todos os inputs
  - Implementar navegação por teclado (Tab, Enter, Escape, Arrow keys)
  - Garantir ordem de tab lógica no formulário
  - Adicionar suporte a screen readers com anúncios de erros e sucessos
  - Testar com leitor de tela e navegação apenas por teclado
  - _Requirements: Todos (acessibilidade)_
-

- [x] 15. Realizar testes e validação final





  - Testar validação de CPF com CPFs válidos e inválidos
  - Testar validação de RG e detecção automática de tipo
  - Testar select de destino com busca e seleção
  - Verificar que notificações aparecem acima de todos os elementos
  - Testar busca de visitantes por nome, documento e destino
  - Verificar cálculo correto de duração e exibição no toast
  - Testar abertura do WhatsApp com mensagem correta
  - Verificar persistência de dados após reload da página
  - Executar npm run validate para garantir que não há erros de tipo ou lint
  - Testar no navegador com DevTools aberto verificando console limpo
  - _Requirements: Todos (validação)_

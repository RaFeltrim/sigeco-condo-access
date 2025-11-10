# Requirements Document - Correções Dashboard do Porteiro

## Introduction

Este documento define os requisitos para correção de bugs e melhorias de UX no Dashboard do Porteiro do SIGECO. As correções incluem validação de campos, melhorias de usabilidade, funcionalidade de busca, notificações, e integração com WhatsApp para suporte.

## Glossary

- **Dashboard do Porteiro**: Interface principal utilizada pelo porteiro para registrar e gerenciar visitantes
- **CPF**: Cadastro de Pessoa Física - documento brasileiro com 11 dígitos (formato: 000.000.000-00)
- **RG**: Registro Geral - documento de identidade brasileiro com 9 dígitos (formato: 00.000.000-0)
- **Toast**: Notificação temporária exibida na tela para feedback ao usuário
- **Select Component**: Componente de seleção dropdown que permite escolher uma opção de uma lista
- **Input Mask**: Máscara de entrada que formata automaticamente o texto digitado
- **Z-index**: Propriedade CSS que controla a ordem de empilhamento de elementos
- **WhatsApp API**: Interface para abrir conversas do WhatsApp via URL
- **Visitor Search**: Funcionalidade de busca e consulta de visitantes registrados
- **Check-out**: Processo de registrar a saída de um visitante
- **Duration Calculation**: Cálculo do tempo de permanência do visitante

## Requirements

### Requirement 1

**User Story:** Como porteiro, eu quero que o campo de documento valide e formate automaticamente CPF ou RG, para que eu possa inserir documentos de forma correta e padronizada

#### Acceptance Criteria

1. WHEN the Porteiro types numbers in the Documento field, THE Dashboard SHALL automatically detect if the input matches CPF pattern (11 digits) or RG pattern (9 digits)
2. WHEN the Porteiro types a CPF, THE Dashboard SHALL apply CPF mask formatting (000.000.000-00) in real-time
3. WHEN the Porteiro types an RG, THE Dashboard SHALL apply RG mask formatting (00.000.000-0) in real-time
4. WHEN the Porteiro submits the form with invalid CPF, THE Dashboard SHALL display error message "CPF inválido" below the field
5. THE Dashboard SHALL validate CPF using the official validation algorithm with digit verification

### Requirement 2

**User Story:** Como porteiro, eu quero que o campo "Destino da Visita" seja um seletor ao invés de campo livre, para que eu possa escolher apartamentos/locais válidos rapidamente

#### Acceptance Criteria

1. WHEN the Porteiro clicks on "Destino da Visita" field, THE Dashboard SHALL display a dropdown list with all available apartments and locations
2. THE Dashboard SHALL populate the dropdown with options including apartment numbers (Apto 101, Apto 102, etc.) and common areas (Administração, Salão de Festas, Academia, etc.)
3. WHEN the Porteiro types in the select field, THE Dashboard SHALL filter options in real-time based on typed text
4. WHEN the Porteiro selects a destination, THE Dashboard SHALL display the selected value in the field
5. THE Dashboard SHALL mark "Destino da Visita" as required field and prevent form submission if not selected

### Requirement 3

**User Story:** Como porteiro, eu quero que o painel de notificações apareça acima de todos os elementos, para que eu possa visualizar e interagir com as notificações corretamente

#### Acceptance Criteria

1. WHEN the Porteiro clicks on the notification bell icon, THE Dashboard SHALL display the notification panel with z-index higher than all other elements
2. THE Dashboard SHALL render the notification panel above dashboard cards, forms, and other UI elements
3. WHEN the notification panel is open, THE Dashboard SHALL allow clicking on individual notifications to view details
4. WHEN the Porteiro clicks outside the notification panel, THE Dashboard SHALL close the panel
5. THE Dashboard SHALL apply proper z-index hierarchy ensuring notifications (z-index: 50) appear above content (z-index: 10)

### Requirement 4

**User Story:** Como porteiro, eu quero que o campo "Consultar Visitante" funcione e busque visitantes, para que eu possa encontrar rapidamente informações de visitantes registrados

#### Acceptance Criteria

1. WHEN the Porteiro types a name in "Consultar Visitante" field, THE Dashboard SHALL search for matching visitors in real-time
2. WHEN search results are found, THE Dashboard SHALL display a list of matching visitors with name, document, and last visit date
3. WHEN the Porteiro clicks on a search result, THE Dashboard SHALL display detailed visitor information including visit history
4. WHEN no results are found, THE Dashboard SHALL display message "Nenhum visitante encontrado"
5. THE Dashboard SHALL search by visitor name, document number, or destination with case-insensitive matching

### Requirement 5

**User Story:** Como porteiro, eu quero que ao registrar a saída de um visitante apareça uma notificação com o tempo de permanência, para que eu tenha feedback claro da ação realizada

#### Acceptance Criteria

1. WHEN the Porteiro clicks "Saída" button for an active visitor, THE Dashboard SHALL calculate the duration between entry and exit times
2. WHEN check-out is completed, THE Dashboard SHALL display a toast notification with message "Saída de [Nome] registrada com sucesso"
3. THE Dashboard SHALL include in the toast the calculated duration in format "Permaneceu X horas e Y minutos" or "Permaneceu X minutos" if less than 1 hour
4. THE Dashboard SHALL display the toast for 5 seconds with success styling (green background)
5. WHEN check-out fails, THE Dashboard SHALL display error toast with message "Erro ao registrar saída. Tente novamente"

### Requirement 6

**User Story:** Como porteiro, eu quero que o botão "Contatar" abra uma conversa no WhatsApp com o suporte, para que eu possa obter ajuda rapidamente quando necessário

#### Acceptance Criteria

1. WHEN the Porteiro clicks the "Contatar" button, THE Dashboard SHALL open WhatsApp Web or WhatsApp app with pre-filled message
2. THE Dashboard SHALL use WhatsApp API URL format: https://wa.me/5519997775596?text=[encoded_message]
3. THE Dashboard SHALL include pre-filled message: "Olá, preciso de suporte técnico com o SIGECO"
4. WHEN WhatsApp opens, THE Dashboard SHALL maintain the current page state without navigation
5. THE Dashboard SHALL open WhatsApp in a new browser tab or window

### Requirement 7

**User Story:** Como porteiro, eu quero que o campo "Nome do Visitante" aceite apenas letras e espaços, para que os nomes sejam inseridos de forma padronizada

#### Acceptance Criteria

1. WHEN the Porteiro types in "Nome do Visitante" field, THE Dashboard SHALL accept only letters (a-z, A-Z), spaces, and accented characters (á, é, í, ó, ú, ã, õ, ç)
2. WHEN the Porteiro types numbers or special characters, THE Dashboard SHALL prevent the input from being entered
3. THE Dashboard SHALL automatically capitalize the first letter of each word in the name
4. THE Dashboard SHALL trim extra spaces between words and at the beginning/end
5. THE Dashboard SHALL require minimum 3 characters and maximum 100 characters for the name field

### Requirement 8

**User Story:** Como porteiro, eu quero que a lista de "Entradas Recentes" atualize automaticamente após registrar saída, para que eu veja o status atualizado imediatamente

#### Acceptance Criteria

1. WHEN the Porteiro registers a visitor check-out, THE Dashboard SHALL update the "Entradas Recentes" list immediately
2. THE Dashboard SHALL change the visitor status from "Ativo" (green badge) to "Saiu" (gray badge)
3. THE Dashboard SHALL replace the "Saída" button with the exit time display
4. THE Dashboard SHALL move checked-out visitors to the bottom of the list while keeping active visitors at the top
5. THE Dashboard SHALL maintain the list order with most recent entries first within each status group

### Requirement 9

**User Story:** Como desenvolvedor, eu quero validação completa do formulário antes do envio, para que dados inválidos não sejam submetidos

#### Acceptance Criteria

1. WHEN the Porteiro clicks "Confirmar Entrada", THE Dashboard SHALL validate all required fields before submission
2. THE Dashboard SHALL display inline error messages for each invalid field with red border and error text
3. THE Dashboard SHALL prevent form submission if any validation fails and focus on the first invalid field
4. THE Dashboard SHALL validate: nome (required, letters only), documento (required, valid CPF/RG), destino (required, selected from list)
5. WHEN all validations pass, THE Dashboard SHALL submit the form and display success toast "Entrada registrada com sucesso"

### Requirement 10

**User Story:** Como porteiro, eu quero que o sistema persista os dados de visitantes localmente, para que eu possa consultar histórico mesmo sem conexão

#### Acceptance Criteria

1. WHEN a visitor entry is registered, THE Dashboard SHALL save the data to localStorage with timestamp
2. THE Dashboard SHALL store visitor data including: name, document, destination, entry time, exit time, and status
3. WHEN the Dashboard loads, THE Dashboard SHALL retrieve and display all stored visitors from localStorage
4. THE Dashboard SHALL maintain a maximum of 100 most recent visitor records in localStorage
5. WHEN localStorage limit is reached, THE Dashboard SHALL remove oldest records automatically

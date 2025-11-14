/**
 * E2E Test: Edit Resident (Editar Morador)
 * 
 * Validates that the edit resident feature works with actual state management.
 */

describe('Moradores - Edit Resident', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.get('input[type="text"]').type('admin');
    cy.get('input[type="password"]').type('senha123');
    cy.get('button[type="submit"]').click();
    cy.contains('button', 'Gerenciamento de Moradores').click();
    cy.url().should('include', '/moradores');
  });

  it('should edit an existing resident and update the table', () => {
    // Find and click edit button for first resident (Ana Silva Costa)
    cy.contains('tr', 'Ana Silva Costa').within(() => {
      cy.get('button[aria-label*="Editar"]').click();
    });

    // Verify edit dialog opened
    cy.contains('Editar Morador').should('be.visible');

    // Update phone number
    cy.get('input[placeholder*="99999-9999"]').clear().type('(11) 91111-2222');

    // Update email
    cy.get('input[type="email"]').clear().type('ana.updated@email.com');

    // Submit the form
    cy.contains('button', 'Salvar Alterações').click();

    // Verify success toast
    cy.contains('Morador atualizado').should('be.visible');
    cy.contains('Ana Silva Costa foi atualizado com sucesso').should('be.visible');

    // Verify changes reflected in table
    cy.contains('tr', 'Ana Silva Costa').within(() => {
      cy.contains('(11) 91111-2222').should('exist');
      cy.contains('ana.updated@email.com').should('exist');
    });
  });

  it('should validate phone format during edit', () => {
    cy.contains('tr', 'Ana Silva Costa').within(() => {
      cy.get('button[aria-label*="Editar"]').click();
    });

    // Enter invalid phone
    cy.get('input[placeholder*="99999-9999"]').clear().type('123');

    // Try to submit
    cy.contains('button', 'Salvar Alterações').click();

    // Should show validation error
    cy.contains('Telefone inválido').should('be.visible');
  });

  it('should validate document format during edit', () => {
    cy.contains('tr', 'Ana Silva Costa').within(() => {
      cy.get('button[aria-label*="Editar"]').click();
    });

    // Clear document (required field)
    cy.get('input[placeholder*="CPF ou RG"]').clear();

    // Try to submit
    cy.contains('button', 'Salvar Alterações').click();

    // Should show validation error
    cy.contains('Documento é obrigatório').should('be.visible');
  });

  it('should cancel edit without saving changes', () => {
    const originalEmail = 'ana.silva@email.com';

    cy.contains('tr', 'Ana Silva Costa').within(() => {
      cy.get('button[aria-label*="Editar"]').click();
    });

    // Make changes
    cy.get('input[type="email"]').clear().type('changed@email.com');

    // Click cancel
    cy.contains('button', 'Cancelar').click();

    // Verify original data unchanged
    cy.contains('tr', 'Ana Silva Costa').within(() => {
      cy.contains(originalEmail).should('exist');
      cy.contains('changed@email.com').should('not.exist');
    });
  });

  it('should update resident type and status', () => {
    cy.contains('tr', 'João Santos Lima').within(() => {
      cy.get('button[aria-label*="Editar"]').click();
    });

    // Change tipo from Locatário to Proprietário
    cy.contains('label', 'Tipo').parent().find('button').click();
    cy.contains('[role="option"]', 'Proprietário').click();

    // Change status to Inativo
    cy.contains('label', 'Status').parent().find('button').click();
    cy.contains('[role="option"]', 'Inativo').click();

    // Save
    cy.contains('button', 'Salvar Alterações').click();

    // Verify changes
    cy.contains('tr', 'João Santos Lima').within(() => {
      cy.contains('Proprietário').should('exist');
      cy.contains('Inativo').should('exist');
    });
  });
});

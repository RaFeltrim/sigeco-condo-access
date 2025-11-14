/**
 * E2E Test: Add New Resident (Novo Morador)
 * 
 * This test validates that the "Add Resident" feature works correctly
 * with actual frontend state management (not mocked data).
 */

describe('Moradores - Add New Resident', () => {
  beforeEach(() => {
    // Login as admin
    cy.visit('http://localhost:5173');
    cy.get('input[type="text"]').type('admin');
    cy.get('input[type="password"]').type('senha123');
    cy.get('button[type="submit"]').click();
    
    // Navigate to Moradores page
    cy.contains('button', 'Gerenciamento de Moradores').click();
    cy.url().should('include', '/moradores');
  });

  it('should add a new resident and display it in the table', () => {
    // Get initial table row count
    cy.get('table tbody tr').then(($rows) => {
      const initialCount = $rows.length;

      // Open the "Novo Morador" dialog
      cy.get('[data-testid="btn-novo-morador"]').click();
      
      // Fill in the form
      cy.get('[data-testid="input-nome-morador"]').type('Eduardo Test Silva');
      cy.get('[data-testid="input-email-morador"]').type('eduardo.test@email.com');
      cy.get('[data-testid="input-telefone-morador"]').type('(11) 98888-7777');
      
      // Select unit - click the combobox trigger
      cy.contains('label', 'Unidade').parent().find('button').click();
      // Select the first available unit (103 - Vago)
      cy.contains('[role="option"]', '103').click();
      
      // Fill in document
      cy.get('input[placeholder="CPF ou RG"]').first().type('123.456.789-01');
      
      // Select type
      cy.contains('label', 'Tipo').parent().find('button').click();
      cy.contains('[role="option"]', 'Proprietário').click();
      
      // Submit the form
      cy.contains('button', 'Cadastrar Morador').click();
      
      // Verify success toast
      cy.contains('Morador cadastrado com sucesso').should('be.visible');
      cy.contains('Eduardo Test Silva foi adicionado').should('be.visible');
      
      // Verify the table now has one more row
      cy.get('table tbody tr').should('have.length', initialCount + 1);
      
      // Verify the new resident appears in the table
      cy.contains('table tbody tr', 'Eduardo Test Silva').should('exist');
      cy.contains('table tbody tr', 'eduardo.test@email.com').should('exist');
      cy.contains('table tbody tr', '(11) 98888-7777').should('exist');
      cy.contains('table tbody tr', '123.456.789-01').should('exist');
    });
  });

  it('should validate required fields before adding', () => {
    // Open the dialog
    cy.get('[data-testid="btn-novo-morador"]').click();
    
    // Try to submit empty form
    cy.contains('button', 'Cadastrar Morador').click();
    
    // Should show validation error
    cy.contains('Campos obrigatórios faltando').should('be.visible');
    
    // Table should remain unchanged
    cy.get('table tbody tr').should('have.length', 4); // Initial 4 residents
  });

  it('should validate phone format', () => {
    // Open dialog
    cy.get('[data-testid="btn-novo-morador"]').click();
    
    // Fill required fields with invalid phone
    cy.get('[data-testid="input-nome-morador"]').type('Test User');
    cy.get('[data-testid="input-email-morador"]').type('test@email.com');
    cy.get('[data-testid="input-telefone-morador"]').type('123'); // Invalid
    
    // Select unit
    cy.contains('label', 'Unidade').parent().find('button').click();
    cy.contains('[role="option"]', '103').click();
    
    // Document
    cy.get('input[placeholder="CPF ou RG"]').first().type('123.456.789-01');
    
    // Type
    cy.contains('label', 'Tipo').parent().find('button').click();
    cy.contains('[role="option"]', 'Proprietário').click();
    
    // Submit
    cy.contains('button', 'Cadastrar Morador').click();
    
    // Should show validation error
    cy.contains('Telefone inválido').should('be.visible');
  });

  it('should persist new resident after page interactions', () => {
    // Add a resident
    cy.get('[data-testid="btn-novo-morador"]').click();
    cy.get('[data-testid="input-nome-morador"]').type('Persistence Test');
    cy.get('[data-testid="input-email-morador"]').type('persist@test.com');
    cy.contains('label', 'Unidade').parent().find('button').click();
    cy.contains('[role="option"]', '103').click();
    cy.get('input[placeholder="CPF ou RG"]').first().type('999.888.777-66');
    cy.contains('label', 'Tipo').parent().find('button').click();
    cy.contains('[role="option"]', 'Locatário').click();
    cy.contains('button', 'Cadastrar Morador').click();
    
    // Switch to Unidades tab and back
    cy.contains('button', 'Unidades').click();
    cy.contains('button', 'Moradores').click();
    
    // Resident should still be there
    cy.contains('table tbody tr', 'Persistence Test').should('exist');
  });
});

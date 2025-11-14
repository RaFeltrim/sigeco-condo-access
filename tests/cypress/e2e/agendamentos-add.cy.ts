/**
 * E2E Test: Add Appointment (Novo Agendamento)
 * 
 * Validates that adding appointments works with actual state management.
 */

describe('Agendamentos - Add Appointment', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.get('input[type="text"]').type('admin');
    cy.get('input[type="password"]').type('senha123');
    cy.get('button[type="submit"]').click();
    cy.contains('button', 'Agendamento').click();
    cy.url().should('include', '/agendamento');
  });

  it('should add a new appointment and display in the list', () => {
    // Get initial count
    cy.get('[data-testid="appointment-card"]').then(($cards) => {
      const initialCount = $cards.length;

      // Open new appointment dialog
      cy.contains('button', 'Novo Agendamento').click();

      // Fill form
      cy.get('input[placeholder*="visitante"]').type('Pedro Eletricista');
      cy.get('input[placeholder*="documento"]').type('111.222.333-44');
      cy.get('input[placeholder*="telefone"]').type('(11) 98765-4321');
      
      // Select destination
      cy.contains('label', 'Unidade de Destino').parent().find('input').type('Apto 303');
      
      // Set future date and time
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];
      
      cy.get('input[type="date"]').type(dateStr);
      cy.get('input[type="time"]').type('10:00');
      
      // Fill motivo
      cy.get('input[placeholder*="motivo"]').type('Manutenção elétrica');
      
      // Submit
      cy.contains('button[type="submit"]', 'Agendar Visita').click();
      
      // Verify success
      cy.contains('Agendamento criado com sucesso').should('be.visible');
      
      // Verify new appointment appears
      cy.contains('Pedro Eletricista').should('exist');
      cy.contains('Apto 303').should('exist');
    });
  });

  it('should validate required fields', () => {
    cy.contains('button', 'Novo Agendamento').click();
    
    // Try to submit empty form
    cy.contains('button[type="submit"]', 'Agendar Visita').click();
    
    // Should show error
    cy.contains('Campos obrigatórios faltando').should('be.visible');
  });

  it('should prevent past date appointments', () => {
    cy.contains('button', 'Novo Agendamento').click();
    
    // Fill with past date
    cy.get('input[placeholder*="visitante"]').type('Test User');
    cy.get('input[placeholder*="documento"]').type('111.222.333-44');
    cy.contains('label', 'Unidade de Destino').parent().find('input').type('Apto 101');
    
    cy.get('input[type="date"]').type('2020-01-01');
    cy.get('input[type="time"]').type('10:00');
    
    cy.get('input[placeholder*="motivo"]').type('Test');
    
    cy.contains('button[type="submit"]', 'Agendar Visita').click();
    
    // Should show error
    cy.contains('Data inválida').should('be.visible');
    cy.contains('Não é possível agendar visitas para datas passadas').should('be.visible');
  });

  it('should detect scheduling conflicts', () => {
    // Add first appointment
    cy.contains('button', 'Novo Agendamento').click();
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    
    cy.get('input[placeholder*="visitante"]').type('First Visitor');
    cy.get('input[placeholder*="documento"]').type('111.111.111-11');
    cy.contains('label', 'Unidade de Destino').parent().find('input').type('Apto 205');
    cy.get('input[type="date"]').type(dateStr);
    cy.get('input[type="time"]').type('14:00');
    cy.get('input[placeholder*="motivo"]').type('Test 1');
    cy.contains('button[type="submit"]', 'Agendar Visita').click();
    cy.contains('Agendamento criado com sucesso').should('be.visible');
    
    // Try to add conflicting appointment (same destination, within 1 hour)
    cy.wait(500);
    cy.contains('button', 'Novo Agendamento').click();
    
    cy.get('input[placeholder*="visitante"]').type('Second Visitor');
    cy.get('input[placeholder*="documento"]').type('222.222.222-22');
    cy.contains('label', 'Unidade de Destino').parent().find('input').type('Apto 205');
    cy.get('input[type="date"]').type(dateStr);
    cy.get('input[type="time"]').type('14:30'); // 30 minutes later
    cy.get('input[placeholder*="motivo"]').type('Test 2');
    cy.contains('button[type="submit"]', 'Agendar Visita').click();
    
    // Should show conflict error
    cy.contains('Conflito de agendamento').should('be.visible');
  });
});

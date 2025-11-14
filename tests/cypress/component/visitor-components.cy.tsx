/// <reference types="cypress" />

import { VisitorForm } from '../../../src/components/visitor/VisitorForm';
import { VisitorList } from '../../../src/components/visitor/VisitorList';

describe('VisitorForm Component', () => {
  it('should render all form fields', () => {
    cy.mount(<VisitorForm onSubmit={() => {}} />);
    
    cy.get('input[name="name"]').should('exist');
    cy.get('input[name="document"]').should('exist');
    cy.get('select[name="destination"]').should('exist');
    cy.get('textarea[name="purpose"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('should validate required fields', () => {
    cy.mount(<VisitorForm onSubmit={() => {}} />);
    
    cy.get('button[type="submit"]').click();
    cy.contains('Nome é obrigatório').should('be.visible');
  });

  it('should call onSubmit with form data', () => {
    const onSubmit = cy.stub();
    cy.mount(<VisitorForm onSubmit={onSubmit} />);
    
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="document"]').type('12345678901');
    cy.get('select[name="destination"]').select('Apto 101');
    cy.get('button[type="submit"]').click();
    
    cy.wrap(onSubmit).should('have.been.calledOnce');
  });

  it('should format document automatically', () => {
    cy.mount(<VisitorForm onSubmit={() => {}} />);
    
    cy.get('input[name="document"]').type('12345678901');
    cy.get('input[name="document"]').should('have.value', '123.456.789-01');
  });

  it('should clear form after submission', () => {
    cy.mount(<VisitorForm onSubmit={() => {}} />);
    
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="document"]').type('12345678901');
    cy.get('button[type="submit"]').click();
    
    cy.get('input[name="name"]').should('have.value', '');
  });
});

describe('VisitorList Component', () => {
  const mockVisitors = [
    {
      id: '1',
      name: 'João Silva',
      document: '123.456.789-01',
      destination: 'Apto 101',
      entryTime: new Date().toISOString(),
      status: 'active',
    },
    {
      id: '2',
      name: 'Maria Santos',
      document: '987.654.321-00',
      destination: 'Apto 102',
      entryTime: new Date(Date.now() - 3600000).toISOString(),
      exitTime: new Date().toISOString(),
      status: 'exited',
    },
  ];

  it('should render visitor list', () => {
    cy.mount(<VisitorList visitors={mockVisitors} onCheckout={() => {}} />);
    
    cy.contains('João Silva').should('be.visible');
    cy.contains('Maria Santos').should('be.visible');
  });

  it('should show status badges', () => {
    cy.mount(<VisitorList visitors={mockVisitors} onCheckout={() => {}} />);
    
    cy.contains('Ativo').should('exist');
    cy.contains('Saiu').should('exist');
  });

  it('should call onCheckout when exit button clicked', () => {
    const onCheckout = cy.stub();
    cy.mount(<VisitorList visitors={mockVisitors} onCheckout={onCheckout} />);
    
    cy.contains('João Silva').parents('tr').find('button').contains('Saída').click();
    cy.wrap(onCheckout).should('have.been.calledWith', '1');
  });

  it('should disable exit button for already exited visitors', () => {
    cy.mount(<VisitorList visitors={mockVisitors} onCheckout={() => {}} />);
    
    cy.contains('Maria Santos').parents('tr').find('button').should('not.exist');
  });

  it('should display empty state when no visitors', () => {
    cy.mount(<VisitorList visitors={[]} onCheckout={() => {}} />);
    
    cy.contains('Nenhum visitante registrado').should('be.visible');
  });

  it('should sort visitors by entry time', () => {
    cy.mount(<VisitorList visitors={mockVisitors} onCheckout={() => {}} />);
    
    cy.get('tbody tr').first().should('contain', 'João Silva');
  });
});

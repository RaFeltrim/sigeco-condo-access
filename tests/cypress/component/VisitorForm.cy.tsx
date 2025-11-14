/// <reference types="cypress" />

import { VisitorForm } from '../../../src/components/visitor/VisitorForm';

describe('VisitorForm Component', () => {
  it('should render form with all fields', () => {
    cy.mount(<VisitorForm onSubmit={() => {}} />);
    
    cy.get('#nome').should('exist');
    cy.get('#documento').should('exist');
    cy.get('#destino').should('exist');
    cy.get('#motivo').should('exist');
  });

  it('should have submit button', () => {
    cy.mount(<VisitorForm onSubmit={() => {}} />);
    cy.get('button[type="submit"]').should('exist');
    cy.contains('Confirmar Entrada').should('be.visible');
  });

  it('should validate required fields', () => {
    cy.mount(<VisitorForm onSubmit={() => {}} />);
    cy.get('button[type="submit"]').click();
    cy.contains('Erro de validação').should('be.visible');
  });

  it('should format document on blur', () => {
    cy.mount(<VisitorForm onSubmit={() => {}} />);
    cy.get('#documento').type('12345678901').blur();
    cy.get('#documento').should('have.value', '123.456.789-01');
  });

  it('should validate name field', () => {
    cy.mount(<VisitorForm onSubmit={() => {}} />);
    cy.get('#nome').type('123').blur();
    cy.contains('Nome deve conter apenas letras').should('be.visible');
  });

  it('should call onSubmit with valid data', () => {
    const onSubmit = cy.stub();
    cy.mount(<VisitorForm onSubmit={onSubmit} />);
    
    cy.get('#nome').type('João Silva');
    cy.get('#documento').type('12345678901');
    cy.get('#destino').click();
    cy.contains('Apto 101').click({ force: true });
    cy.get('#motivo').type('Visita familiar');
    cy.get('button[type="submit"]').click();
    
    cy.wrap(onSubmit).should('have.been.calledOnce');
  });
});

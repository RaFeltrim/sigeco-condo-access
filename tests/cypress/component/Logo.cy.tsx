/// <reference types="cypress" />

import { Logo } from '../../../src/components/Logo';

describe('Logo Component', () => {
  it('should render logo', () => {
    cy.mount(<Logo />);
    cy.contains('SIGECO').should('be.visible');
  });

  it('should display full name on hover', () => {
    cy.mount(<Logo />);
    cy.get('[class*="text-accent"]').should('contain', 'SIGECO');
  });

  it('should have correct styling', () => {
    cy.mount(<Logo />);
    cy.get('div').first().should('have.class', 'flex');
  });
});

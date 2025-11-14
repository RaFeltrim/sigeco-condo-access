/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login
     * @example cy.login('username', 'password')
     */
    login(username: string, password: string): Chainable<void>;
    
    /**
     * Custom command to logout
     * @example cy.logout()
     */
    logout(): Chainable<void>;
    
    /**
     * Custom command to select by data-testid
     * @example cy.getBySel('submit-button')
     */
    getBySel(selector: string, ...args: unknown[]): Chainable<JQuery<HTMLElement>>;
    
    /**
     * Custom command to select by partial data-testid
     * @example cy.getBySelLike('button')
     */
    getBySelLike(selector: string, ...args: unknown[]): Chainable<JQuery<HTMLElement>>;
    
    /**
     * Custom command to visit with coverage tracking
     * @example cy.visitWithCoverage('/dashboard')
     */
    visitWithCoverage(url: string): Chainable<void>;
    
    /**
     * Mount component for testing
     */
    mount: typeof import('cypress/react18')['mount'];
  }
}

interface Window {
  __coverage__?: unknown;
}

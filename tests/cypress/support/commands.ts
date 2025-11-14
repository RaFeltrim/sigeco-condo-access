/// <reference types="cypress" />

// Custom command for data-testid selectors
Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-testid="${selector}"]`, ...args);
});

Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-testid*="${selector}"]`, ...args);
});

// Login command
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/login');
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

// Logout command
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
  cy.visit('/login');
});

// Visit with coverage
Cypress.Commands.add('visitWithCoverage', (url: string) => {
  cy.visit(url);
  cy.window().then((win) => {
    if (Cypress.env('coverage') && (win as Window & { __coverage__?: unknown }).__coverage__) {
      cy.task('log', 'Coverage data collected for: ' + url);
    }
  });
});

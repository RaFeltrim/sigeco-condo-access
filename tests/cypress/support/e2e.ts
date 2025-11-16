/// <reference types="cypress" />

import '@cypress/code-coverage/support';
import './commands';

// Global error handling - must come before other hooks
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing the test on expected errors
  
  // Service Worker errors during testing
  if (err.message.includes('ServiceWorker')) {
    return false;
  }
  
  // Service Worker registration errors
  if (err.message.includes('Failed to get ServiceWorkerRegistration')) {
    return false;
  }
  
  // Invalid state errors related to Service Workers
  if (err.message.includes('The document is in an invalid state')) {
    return false;
  }
  
  // ResizeObserver errors (common in tests)
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  
  return true;
});

// Disable service worker for testing
before(() => {
  cy.window({ log: false }).then((win) => {
    // Unregister all service workers before tests
    if ('serviceWorker' in win.navigator) {
      win.navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      }).catch(() => {
        // Silently ignore errors during unregistration
      });
    }
  });
});

// Custom commands for coverage
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      getBySel(selector: string, ...args: unknown[]): Chainable<JQuery<HTMLElement>>;
      getBySelLike(selector: string, ...args: unknown[]): Chainable<JQuery<HTMLElement>>;
      visitWithCoverage(url: string): Chainable<void>;
    }
  }
}

export {};

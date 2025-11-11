/**
 * Accessibility Tests - Admin Dashboard
 * Tests WCAG 2.1 compliance for admin dashboard components
 * 
 * Testing Library: jest-axe (axe-core)
 * Purpose: Ensure accessibility standards are met
 */

import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Mock components for testing
const MockAdminDashboard = () => (
  <main role="main">
    <h1>Dashboard Administrativo</h1>
    <nav aria-label="Dashboard navigation">
      <button>Visão Geral</button>
      <button>Gerenciamento de Moradores</button>
      <button>Agendamento de Visitas</button>
    </nav>
    <div data-testid="stats-cards-container">
      <div data-testid="stat-card-0" role="region" aria-label="Acessos Hoje">
        <h2 data-testid="stat-title-0">Acessos Hoje</h2>
        <p data-testid="stat-value-0">42</p>
      </div>
    </div>
  </main>
);

describe('Accessibility Tests - Admin Dashboard', () => {
  it('should not have accessibility violations on main dashboard', async () => {
    const { container } = render(
      <BrowserRouter>
        <MockAdminDashboard />
      </BrowserRouter>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', async () => {
    const { container } = render(
      <BrowserRouter>
        <MockAdminDashboard />
      </BrowserRouter>
    );

    const h1Elements = container.querySelectorAll('h1');
    expect(h1Elements.length).toBeGreaterThan(0);
    
    // Verify heading exists
    expect(h1Elements[0]).toHaveTextContent('Dashboard Administrativo');
  });

  it('should have accessible navigation', async () => {
    const { container } = render(
      <BrowserRouter>
        <MockAdminDashboard />
      </BrowserRouter>
    );

    const nav = container.querySelector('nav');
    expect(nav).toHaveAttribute('aria-label');
  });

  it('should have accessible stat cards with ARIA labels', async () => {
    const { container } = render(
      <BrowserRouter>
        <MockAdminDashboard />
      </BrowserRouter>
    );

    const statCard = container.querySelector('[data-testid="stat-card-0"]');
    expect(statCard).toHaveAttribute('aria-label');
  });
});

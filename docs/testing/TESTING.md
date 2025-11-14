# SIGECO - Testing Guide

> **Comprehensive guide to testing the SIGECO application using Vitest, Playwright, Cypress, and Robot Framework**

**Last Updated:** January 13, 2025  
**Version:** 1.0.0

---

## Table of Contents

- [Testing Overview](#testing-overview)
- [Testing Pyramid](#testing-pyramid)
- [Unit Testing (Vitest)](#unit-testing-vitest)
- [Integration Testing](#integration-testing)
- [E2E Testing (Playwright)](#e2e-testing-playwright)
- [E2E Testing (Cypress)](#e2e-testing-cypress)
- [Component Testing](#component-testing)
- [Accessibility Testing](#accessibility-testing)
- [Visual Regression Testing](#visual-regression-testing)
- [Performance Testing](#performance-testing)
- [Running All Tests](#running-all-tests)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

---

## Testing Overview

SIGECO employs a comprehensive testing strategy using multiple frameworks:

| Test Type | Framework | Coverage Target | Purpose |
|-----------|-----------|----------------|---------|
| **Unit** | Vitest | 60%+ | Test individual functions/components |
| **Integration** | Vitest + MSW | 25%+ | Test module interactions |
| **E2E** | Playwright | 15%+ | Test complete user flows |
| **E2E (Alt)** | Cypress | Supplementary | Component + E2E testing |
| **Accessibility** | jest-axe | All pages | WCAG 2.1 compliance |
| **Visual** | Playwright | Key pages | Visual regression |
| **Performance** | Playwright | Critical paths | Load time metrics |

---

## Testing Pyramid

```
        /\
       /E2E\      Playwright, Cypress (slow, expensive)
      /------\     
     /        \    
    /Integration\  Vitest + MSW (medium speed)
   /------------\  
  /              \ 
 /     Unit      \ Vitest (fast, cheap)
/________________\
```

**Testing Philosophy:**
- **Most tests at the unit level** - Fast feedback, isolated testing
- **Fewer integration tests** - Verify module collaboration
- **Minimal E2E tests** - Cover critical user journeys only

---

## Unit Testing (Vitest)

### Overview

Unit tests verify individual functions, components, and hooks in isolation.

### Running Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:unit

# Run specific test file
npm run test -- src/utils/validators.test.ts

# Run tests matching a pattern
npm run test -- --grep="validation"
```

### Project Structure

```
tests/unit/
├── api/              # API client tests
├── hooks/            # Custom hooks tests
├── services/         # Service layer tests
├── utils/            # Utility function tests
└── setup.test.ts     # Global test setup
```

### Writing Unit Tests

#### **Example: Testing a Utility Function**

**File:** `src/lib/utils.ts`
```typescript
export function formatCPF(cpf: string): string {
  const clean = cpf.replace(/\D/g, '');
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
```

**Test:** `tests/unit/utils/formatters.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { formatCPF } from '@/lib/utils';

describe('formatCPF', () => {
  it('formats a valid CPF correctly', () => {
    expect(formatCPF('12345678900')).toBe('123.456.789-00');
  });

  it('handles CPF with existing formatting', () => {
    expect(formatCPF('123.456.789-00')).toBe('123.456.789-00');
  });

  it('handles invalid input gracefully', () => {
    expect(formatCPF('abc')).toBe('');
  });
});
```

#### **Example: Testing a React Component**

**Component:** `src/components/visitor/VisitorCard.tsx`

**Test:** `tests/unit/components/VisitorCard.test.tsx`
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VisitorCard } from '@/components/visitor/VisitorCard';

describe('VisitorCard', () => {
  const mockVisitor = {
    id: '1',
    name: 'João Silva',
    document: '123.456.789-00',
    entryTime: new Date('2025-01-13T10:00:00'),
  };

  it('renders visitor information', () => {
    render(<VisitorCard visitor={mockVisitor} />);
    
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
  });

  it('displays entry time formatted correctly', () => {
    render(<VisitorCard visitor={mockVisitor} />);
    
    expect(screen.getByText(/10:00/)).toBeInTheDocument();
  });
});
```

#### **Example: Testing a Custom Hook**

**Hook:** `src/hooks/useVisitorSearch.ts`

**Test:** `tests/unit/hooks/useVisitorSearch.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useVisitorSearch } from '@/hooks/useVisitorSearch';

describe('useVisitorSearch', () => {
  it('debounces search input', async () => {
    const { result } = renderHook(() => useVisitorSearch());
    
    result.current.setSearchTerm('João');
    result.current.setSearchTerm('João Silva');
    
    await waitFor(() => {
      expect(result.current.debouncedTerm).toBe('João Silva');
    });
  });
});
```

### Test Utilities

**File:** `tests/utils/test-utils.tsx`

Custom render function with all providers:

```typescript
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: AllProviders, ...options });
}
```

**Usage:**
```typescript
import { renderWithProviders } from 'tests/utils/test-utils';

it('renders with providers', () => {
  renderWithProviders(<MyComponent />);
});
```

---

## Integration Testing

### Overview

Integration tests verify that multiple modules work together correctly.

### Running Integration Tests

```bash
# Run integration tests
npm run test:integration
```

### API Integration Tests with MSW

**Example:** Testing a service with mocked API

**File:** `tests/integration/api/visitorService.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from 'tests/mocks/server';
import { VisitorService } from '@/services/VisitorService';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('VisitorService Integration', () => {
  it('fetches visitors from API', async () => {
    const visitors = await VisitorService.getAll();
    
    expect(visitors).toHaveLength(10);
    expect(visitors[0]).toHaveProperty('name');
  });

  it('creates a new visitor', async () => {
    const newVisitor = {
      name: 'Test Visitor',
      document: '123.456.789-00',
    };
    
    const created = await VisitorService.create(newVisitor);
    
    expect(created.id).toBeDefined();
    expect(created.name).toBe('Test Visitor');
  });
});
```

### MSW Handlers

**File:** `tests/mocks/handlers.ts`

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Get all visitors
  http.get('/api/visitors', () => {
    return HttpResponse.json([
      { id: '1', name: 'João Silva', document: '123.456.789-00' },
      // ... more visitors
    ]);
  }),

  // Create visitor
  http.post('/api/visitors', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: 'new-id',
      ...body,
    }, { status: 201 });
  }),
];
```

---

## E2E Testing (Playwright)

### Overview

Playwright tests simulate real user interactions in a browser environment.

### Running Playwright Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/admin-dashboard.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in a specific browser
npx playwright test --project=chromium
```

### Project Configuration

**File:** `playwright.config.ts`

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  baseURL: 'http://localhost:9323',
  workers: 1, // Run tests sequentially
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:9323',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
```

### Writing E2E Tests

#### **Example: Login Flow**

**File:** `tests/e2e/authentication.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can log in successfully', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill in credentials
    await page.fill('[name="email"]', 'admin@sigeco.com');
    await page.fill('[name="password"]', 'admin123');

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('/admin-dashboard');

    // Verify dashboard loaded
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('shows error with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'wrong@example.com');
    await page.fill('[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    // Verify error message appears
    await expect(page.locator('.error-message')).toBeVisible();
  });
});
```

#### **Example: Complete Visitor Registration Flow**

**File:** `tests/e2e/visitor-registration.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Visitor Registration', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as doorman
    await page.goto('/login');
    await page.fill('[name="email"]', 'porteiro@sigeco.com');
    await page.fill('[name="password"]', 'porteiro123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/porteiro-dashboard');
  });

  test('registers a new visitor', async ({ page }) => {
    // Click "New Visitor" button
    await page.click('text=Novo Visitante');

    // Fill out visitor form
    await page.fill('[name="name"]', 'João Silva');
    await page.fill('[name="document"]', '123.456.789-00');
    await page.fill('[name="destination"]', 'Apto 101');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for success message
    await expect(page.locator('.toast')).toContainText('Visitante registrado');

    // Verify visitor appears in list
    await expect(page.locator('text=João Silva')).toBeVisible();
  });
});
```

---

## E2E Testing (Cypress)

### Overview

Cypress provides an alternative E2E testing framework with excellent developer experience.

### Running Cypress Tests

```bash
# Open Cypress Test Runner (interactive UI)
npm run test:cypress

# Run E2E tests in headless mode
npm run test:cypress:e2e:run

# Run component tests
npm run test:cypress:component:run

# Run in CI mode
npm run test:cypress:ci
```

### Writing Cypress Tests

#### **Example: Doorman Dashboard Test**

**File:** `tests/cypress/e2e/porteiro-dashboard.cy.ts`

```typescript
describe('Porteiro Dashboard', () => {
  beforeEach(() => {
    // Login
    cy.visit('/login');
    cy.get('[name="email"]').type('porteiro@sigeco.com');
    cy.get('[name="password"]').type('porteiro123');
    cy.get('button[type="submit"]').click();
    
    // Wait for dashboard
    cy.url().should('include', '/porteiro-dashboard');
  });

  it('displays visitor statistics', () => {
    cy.get('[data-testid="total-visitors"]').should('be.visible');
    cy.get('[data-testid="active-visitors"]').should('be.visible');
  });

  it('allows visitor checkout', () => {
    // Find a visitor in the list
    cy.get('[data-testid="visitor-list"]')
      .contains('João Silva')
      .parent()
      .find('[data-testid="checkout-btn"]')
      .click();

    // Confirm checkout
    cy.get('[data-testid="confirm-checkout"]').click();

    // Verify success
    cy.get('.toast').should('contain', 'Saída registrada');
  });
});
```

---

## Component Testing

### Cypress Component Testing

Test components in isolation with Cypress.

**File:** `tests/cypress/component/VisitorCard.cy.tsx`

```typescript
import { VisitorCard } from '@/components/visitor/VisitorCard';

describe('VisitorCard Component', () => {
  const mockVisitor = {
    id: '1',
    name: 'João Silva',
    document: '123.456.789-00',
    entryTime: new Date(),
  };

  it('renders visitor details', () => {
    cy.mount(<VisitorCard visitor={mockVisitor} />);
    
    cy.contains('João Silva').should('be.visible');
    cy.contains('123.456.789-00').should('be.visible');
  });

  it('emits checkout event on button click', () => {
    const onCheckout = cy.stub().as('checkoutHandler');
    
    cy.mount(<VisitorCard visitor={mockVisitor} onCheckout={onCheckout} />);
    
    cy.get('[data-testid="checkout-btn"]').click();
    cy.get('@checkoutHandler').should('have.been.calledOnce');
  });
});
```

---

## Accessibility Testing

### Running Accessibility Tests

```bash
# Run accessibility tests
npm run test:a11y
```

### Writing Accessibility Tests

**File:** `tests/accessibility/admin-dashboard.a11y.test.tsx`

```typescript
import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AdminDashboard } from '@/pages/AdminDashboard';

expect.extend(toHaveNoViolations);

describe('AdminDashboard Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<AdminDashboard />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });
});
```

### Manual Accessibility Testing

1. **Keyboard Navigation:**
   - Tab through all interactive elements
   - Ensure logical tab order
   - Verify focus indicators are visible

2. **Screen Reader Testing:**
   - Use NVDA (Windows) or VoiceOver (Mac)
   - Ensure all content is announced correctly
   - Verify ARIA labels are present

3. **Color Contrast:**
   - Use browser DevTools to check contrast ratios
   - Ensure text meets WCAG 2.1 AA standards (4.5:1)

---

## Visual Regression Testing

### Running Visual Tests

```bash
# Run visual regression tests
npm run test:visual

# Update baseline screenshots
npx playwright test --update-snapshots
```

### Writing Visual Tests

**File:** `tests/visual/dashboard.visual.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('dashboard appearance matches baseline', async ({ page }) => {
    await page.goto('/admin-dashboard');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('admin-dashboard.png');
  });

  test('porteiro dashboard appearance', async ({ page }) => {
    await page.goto('/porteiro-dashboard');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('porteiro-dashboard.png');
  });
});
```

---

## Performance Testing

### Running Performance Tests

```bash
# Run performance tests
npx playwright test tests/performance
```

### Writing Performance Tests

**File:** `tests/performance/api-load.perf.test.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('dashboard loads within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/admin-dashboard');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
  });

  test('visitor list renders quickly', async ({ page }) => {
    await page.goto('/porteiro-dashboard');
    
    const startTime = Date.now();
    await page.waitForSelector('[data-testid="visitor-list"]');
    const renderTime = Date.now() - startTime;
    
    expect(renderTime).toBeLessThan(500);
  });
});
```

---

## Running All Tests

### Sequential Test Execution

```bash
# Run all test suites sequentially
npm run test:all
```

This runs:
1. Unit tests (Vitest)
2. Integration tests
3. E2E tests (Playwright)
4. Cypress tests
5. Robot Framework tests (if applicable)

### Parallel Test Execution

```bash
# Run unit and integration tests in parallel
npm run test & npm run test:integration

# Run E2E tests in parallel (use with caution)
npm run test:e2e -- --workers=4
```

---

## CI/CD Integration

### GitHub Actions Example

**File:** `.github/workflows/test.yml`

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Best Practices

### General Testing Guidelines

1. **Test Behavior, Not Implementation**
   - Focus on user interactions and outcomes
   - Avoid testing internal component state directly

2. **Keep Tests Independent**
   - Each test should run in isolation
   - No shared state between tests

3. **Use Descriptive Test Names**
   ```typescript
   // Good
   it('displays error message when login fails')
   
   // Bad
   it('test1')
   ```

4. **Follow AAA Pattern**
   - **Arrange:** Set up test data
   - **Act:** Perform the action
   - **Assert:** Verify the outcome

5. **Avoid Test Duplication**
   - Don't test the same thing at multiple levels
   - E2E tests should cover user flows, not individual components

### Performance Tips

1. **Use Test Fixtures**
   - Reuse common test data
   - Reduces boilerplate

2. **Mock External Dependencies**
   - Use MSW for API mocking
   - Faster tests, no network dependency

3. **Run Tests in Parallel (where safe)**
   - Unit tests: parallel by default
   - E2E tests: be cautious with database state

4. **Skip Slow Tests in Watch Mode**
   ```typescript
   it.skip('slow test', () => {
     // ...
   });
   ```

---

## Troubleshooting

### Common Issues

#### **Tests fail randomly**
- **Cause:** Race conditions, async timing issues
- **Solution:** Use `waitFor`, `waitForElementToBeRemoved` properly

#### **Playwright browser not starting**
- **Cause:** Browsers not installed
- **Solution:** `npx playwright install`

#### **Cypress timeout errors**
- **Cause:** Element not found within default timeout
- **Solution:** Increase timeout or use `cy.wait()`

#### **MSW handlers not working**
- **Cause:** Server not started in tests
- **Solution:** Ensure `beforeAll(() => server.listen())` is called

---

## Further Reading

- **[Vitest Documentation](https://vitest.dev/)**
- **[Playwright Documentation](https://playwright.dev/)**
- **[Cypress Documentation](https://docs.cypress.io/)**
- **[Testing Library](https://testing-library.com/)**
- **[MSW Documentation](https://mswjs.io/)**

---

<div align="center">

**Happy Testing! 🧪**

[← Back to README](../README.md) | [Development Guide →](./DEVELOPMENT.md)

</div>

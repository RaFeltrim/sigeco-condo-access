# Design Document - Sistema de QA Automatizado

## Overview

O Sistema de QA Automatizado é uma solução abrangente de testes para o SIGECO, cobrindo testes unitários de componentes, testes de integração, testes E2E, validação de acessibilidade, performance e regressão visual. O sistema utiliza Vitest como test runner, React Testing Library para testes de componentes, e Playwright para testes E2E.

## Architecture

### Testing Stack
- **Test Runner**: Vitest (rápido, compatível com Vite)
- **Component Testing**: @testing-library/react + @testing-library/user-event
- **E2E Testing**: Playwright
- **Accessibility Testing**: axe-core + jest-axe
- **Visual Regression**: Playwright screenshots + pixelmatch
- **Coverage**: Vitest coverage (c8/istanbul)
- **Mocking**: Vitest mocks + MSW (Mock Service Worker)

### Test Organization
```
tests/
├── unit/
│   ├── components/        # Testes de componentes UI
│   ├── hooks/            # Testes de custom hooks
│   └── services/         # Testes de serviços
├── integration/
│   ├── pages/            # Testes de páginas completas
│   └── flows/            # Testes de fluxos integrados
├── e2e/
│   ├── porteiro/         # Fluxos do porteiro
│   ├── admin/            # Fluxos do admin
│   └── auth/             # Fluxos de autenticação
├── accessibility/
│   └── a11y.spec.ts      # Testes de acessibilidade
├── performance/
│   └── perf.spec.ts      # Testes de performance
├── visual/
│   └── screenshots/      # Testes de regressão visual
├── fixtures/             # Dados de teste
├── mocks/               # Mocks de APIs e serviços
└── utils/               # Utilitários de teste
```

## Components and Interfaces

### Test Utilities

```typescript
// tests/utils/test-utils.tsx
interface RenderOptions {
  initialRoute?: string;
  user?: User;
  preloadedState?: Partial<AppState>;
}

function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions
): RenderResult;

function createMockUser(role: 'porteiro' | 'admin'): User;
function createMockVisitor(overrides?: Partial<Visitor>): Visitor;
```

### Mock Service Worker Setup

```typescript
// tests/mocks/handlers.ts
export const handlers = [
  // Auth handlers
  http.post('/api/auth/login', loginHandler),
  http.post('/api/auth/logout', logoutHandler),
  
  // Visitor handlers
  http.get('/api/visitors', getVisitorsHandler),
  http.post('/api/visitors', createVisitorHandler),
  
  // Analytics handlers
  http.get('/api/analytics', getAnalyticsHandler),
];
```

### Component Test Pattern

```typescript
// tests/unit/components/Button.test.tsx
describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('supports all variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'];
    variants.forEach(variant => {
      const { container } = render(<Button variant={variant}>Test</Button>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
```

### Integration Test Pattern

```typescript
// tests/integration/pages/PorteiroDashboard.test.tsx
describe('PorteiroDashboard Integration', () => {
  beforeEach(() => {
    server.use(...handlers);
  });

  it('loads and displays visitor data', async () => {
    renderWithProviders(<PorteiroDashboard />, {
      user: createMockUser('porteiro')
    });

    await waitFor(() => {
      expect(screen.getByText(/visitantes ativos/i)).toBeInTheDocument();
    });
  });

  it('handles visitor check-in flow', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PorteiroDashboard />);

    await user.click(screen.getByRole('button', { name: /novo visitante/i }));
    await user.type(screen.getByLabelText(/nome/i), 'João Silva');
    await user.click(screen.getByRole('button', { name: /registrar/i }));

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });
  });
});
```

### E2E Test Pattern

```typescript
// tests/e2e/porteiro/visitor-flow.spec.ts
test.describe('Visitor Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="username"]', 'porteiro');
    await page.fill('[name="password"]', 'senha123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/porteiro');
  });

  test('complete visitor check-in and check-out', async ({ page }) => {
    // Check-in
    await page.click('text=Novo Visitante');
    await page.fill('[name="nome"]', 'Maria Santos');
    await page.fill('[name="documento"]', '123.456.789-00');
    await page.click('button:has-text("Registrar")');
    
    await expect(page.locator('text=Maria Santos')).toBeVisible();

    // Check-out
    await page.click('text=Maria Santos');
    await page.click('button:has-text("Check-out")');
    
    await expect(page.locator('text=Check-out realizado')).toBeVisible();
  });
});
```

### Accessibility Test Pattern

```typescript
// tests/accessibility/a11y.spec.ts
describe('Accessibility Tests', () => {
  const pages = [
    { name: 'Login', path: '/' },
    { name: 'Porteiro Dashboard', path: '/porteiro' },
    { name: 'Admin Dashboard', path: '/admin' },
  ];

  pages.forEach(({ name, path }) => {
    it(`${name} page should have no accessibility violations`, async () => {
      const { container } = renderWithProviders(<App />, {
        initialRoute: path
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  it('all interactive elements should be keyboard accessible', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PorteiroDashboard />);

    await user.tab();
    expect(document.activeElement).toHaveAttribute('role', 'button');
  });
});
```

## Data Models

### Test Fixtures

```typescript
// tests/fixtures/visitors.ts
export const mockVisitors: Visitor[] = [
  {
    id: '1',
    nome: 'João Silva',
    documento: '123.456.789-00',
    foto: '/photos/joao.jpg',
    status: 'ativo',
    checkIn: new Date('2024-01-15T10:00:00'),
    checkOut: null,
    unidadeDestino: 'Apto 101',
  },
];

// tests/fixtures/users.ts
export const mockUsers: Record<string, User> = {
  porteiro: {
    id: '1',
    username: 'porteiro',
    role: 'porteiro',
    nome: 'José Porteiro',
  },
  admin: {
    id: '2',
    username: 'admin',
    role: 'admin',
    nome: 'Admin Sistema',
  },
};
```

## Error Handling

### Test Error Scenarios

```typescript
describe('Error Handling', () => {
  it('displays error message when API fails', async () => {
    server.use(
      http.get('/api/visitors', () => {
        return HttpResponse.json(
          { error: 'Erro ao carregar visitantes' },
          { status: 500 }
        );
      })
    );

    renderWithProviders(<PorteiroDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/erro ao carregar/i)).toBeInTheDocument();
    });
  });

  it('ErrorBoundary catches component errors', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    renderWithProviders(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/algo deu errado/i)).toBeInTheDocument();
  });
});
```

## Testing Strategy

### Coverage Goals
- **Unit Tests**: 80%+ coverage for components, hooks, and services
- **Integration Tests**: All pages and critical user flows
- **E2E Tests**: Main user journeys for porteiro and admin
- **Accessibility**: 100% of pages tested for WCAG 2.1 AA
- **Performance**: Key pages and interactions monitored

### Test Execution Strategy
1. **Local Development**: Run unit tests in watch mode
2. **Pre-commit**: Run unit tests + linting
3. **CI/CD**: Run full test suite (unit + integration + E2E + a11y)
4. **Nightly**: Run visual regression tests + extended performance tests

### Performance Benchmarks
- Initial page load: < 3s
- Component render: < 100ms
- Form submission: < 500ms
- API response handling: < 200ms

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: QA Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
      - run: npm run test:a11y
      - uses: actions/upload-artifact@v3
        with:
          name: coverage
          path: coverage/
```

### Test Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run --coverage",
    "test:integration": "vitest run tests/integration",
    "test:e2e": "playwright test",
    "test:a11y": "vitest run tests/accessibility",
    "test:visual": "playwright test tests/visual",
    "test:ci": "npm run test:unit && npm run test:integration && npm run test:e2e"
  }
}
```

## Visual Regression Testing

### Screenshot Strategy
- Capture screenshots of all pages in different states
- Store baseline images in `tests/visual/baselines/`
- Compare against current screenshots using pixelmatch
- Threshold: 0.1% pixel difference tolerance

```typescript
// tests/visual/pages.spec.ts
test('PorteiroDashboard visual regression', async ({ page }) => {
  await page.goto('/porteiro');
  await page.waitForLoadState('networkidle');
  
  await expect(page).toHaveScreenshot('porteiro-dashboard.png', {
    maxDiffPixels: 100,
  });
});
```

## Reporting

### Coverage Reports
- Generate HTML coverage reports with c8/istanbul
- Track coverage trends over time
- Enforce minimum coverage thresholds in CI

### Test Reports
- JUnit XML for CI integration
- HTML reports for detailed analysis
- JSON reports for custom tooling
- Screenshots and videos for failed E2E tests

### Metrics to Track
- Test pass rate
- Test execution time
- Code coverage percentage
- Flaky test detection
- Performance metrics trends

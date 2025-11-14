# Testing Infrastructure

This directory contains all automated tests for the SIGECO application.

## Directory Structure

```
tests/
├── unit/              # Unit tests for components, hooks, and services
├── integration/       # Integration tests for pages and flows
├── e2e/              # End-to-end tests with Playwright
├── accessibility/    # Accessibility (a11y) tests
├── visual/           # Visual regression tests
├── fixtures/         # Mock data and test fixtures
├── mocks/            # API mocks (MSW handlers)
├── utils/            # Test utilities and helpers
└── setup.ts          # Global test setup
```

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm run test:unit

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test tests/unit/components/Button.test.tsx
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run specific browser
npx playwright test --project=chromium
```

### Accessibility Tests
```bash
npm run test:a11y
```

### Visual Regression Tests
```bash
npm run test:visual
```

### All Tests (CI)
```bash
npm run test:ci
```

## Test Configuration

### Vitest Configuration
- **Config File**: `vitest.config.ts`
- **Environment**: jsdom (browser-like environment)
- **Coverage**: v8 provider with 80% threshold
- **Setup**: `tests/setup.ts` runs before all tests

### Playwright Configuration
- **Config File**: `playwright.config.ts`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Base URL**: http://localhost:5173
- **Reports**: HTML, JSON, JUnit XML

## Writing Tests

### Component Test Example
```typescript
import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen, userEvent } from '../utils/test-utils';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    renderWithProviders(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test';

test('visitor check-in flow', async ({ page }) => {
  await page.goto('/porteiro');
  await page.click('text=Novo Visitante');
  await page.fill('[name="nome"]', 'João Silva');
  await page.click('button:has-text("Registrar")');
  await expect(page.locator('text=João Silva')).toBeVisible();
});
```

## Test Utilities

### renderWithProviders
Custom render function that wraps components with necessary providers (Router, QueryClient, etc.)

```typescript
import { renderWithProviders } from '../utils/test-utils';

renderWithProviders(<MyComponent />, {
  initialRoute: '/porteiro',
});
```

### Mock Service Worker (MSW)
API mocking is configured in `tests/mocks/handlers.ts`. The MSW server is automatically started in `tests/setup.ts`.

## Coverage Reports

Coverage reports are generated in the `coverage/` directory:
- **HTML Report**: `coverage/index.html`
- **JSON Report**: `coverage/coverage-final.json`
- **LCOV Report**: `coverage/lcov.info`

## CI/CD Integration

Tests run automatically on:
- Push to any branch
- Pull requests
- GitHub Actions workflow: `.github/workflows/qa-tests.yml`

## Troubleshooting

### Tests are slow
- Use `test.concurrent` for independent tests
- Mock heavy dependencies
- Use `--no-coverage` flag during development

### MSW handlers not working
- Check that handlers are defined in `tests/mocks/handlers.ts`
- Verify the server is started in `tests/setup.ts`
- Use `server.use()` to override handlers in specific tests

### Playwright tests failing
- Ensure dev server is running (`npm run dev`)
- Check browser installation: `npx playwright install`
- Use `--headed` flag to see browser: `npx playwright test --headed`

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Descriptive Names**: Use clear, descriptive test names
3. **Arrange-Act-Assert**: Structure tests with clear setup, action, and verification
4. **Mock External Dependencies**: Use MSW for API calls
5. **Avoid Implementation Details**: Test behavior, not implementation
6. **Keep Tests Fast**: Mock heavy operations, use concurrent execution
7. **Clean Up**: Use `afterEach` to clean up side effects

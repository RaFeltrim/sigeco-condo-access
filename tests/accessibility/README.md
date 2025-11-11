# Accessibility Tests

This directory contains accessibility tests to ensure WCAG 2.1 compliance.

## Overview

Accessibility tests use `jest-axe` (built on `axe-core`) to automatically detect accessibility issues in components.

## Running Tests

```bash
# Run all accessibility tests
npm run test:a11y

# Run specific test file
npm test tests/accessibility/admin-dashboard.a11y.test.tsx

# Watch mode
npm run test:watch tests/accessibility/
```

## Writing New Tests

Example test structure:

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect } from 'vitest';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests - Component Name', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<YourComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## What is Tested

- **Color Contrast:** Ensures sufficient contrast ratios (WCAG AA/AAA)
- **Keyboard Navigation:** All interactive elements are keyboard accessible
- **ARIA Labels:** Proper use of ARIA attributes
- **Semantic HTML:** Correct use of HTML5 semantic elements
- **Form Labels:** All form inputs have associated labels
- **Heading Hierarchy:** Proper h1-h6 structure
- **Alt Text:** Images have descriptive alt attributes
- **Focus Management:** Visible focus indicators

## WCAG Levels

- **Level A:** Basic accessibility (required)
- **Level AA:** Recommended target (our standard)
- **Level AAA:** Enhanced accessibility (nice to have)

## Common Issues and Fixes

### Missing ARIA Labels

```tsx
// ❌ Bad
<button>×</button>

// ✅ Good
<button aria-label="Close dialog">×</button>
```

### Poor Color Contrast

```css
/* ❌ Bad - insufficient contrast */
color: #999; /* on white background */

/* ✅ Good - sufficient contrast */
color: #666; /* on white background */
```

### Missing Form Labels

```tsx
// ❌ Bad
<input type="text" />

// ✅ Good
<label htmlFor="name">Name</label>
<input type="text" id="name" />
```

## Tools and Resources

- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension for manual testing
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Coverage Goals

- All pages: 100% axe-core compliance
- All forms: Keyboard navigable and screen-reader friendly
- All interactive components: Properly labeled and accessible

## CI/CD Integration

Accessibility tests run automatically in the CI pipeline. Pull requests failing accessibility tests will not be merged.

## Getting Help

If you encounter accessibility issues or need help writing tests:
1. Check the [axe-core documentation](https://github.com/dequelabs/axe-core)
2. Review existing test files in this directory
3. Consult with the team's accessibility champion
4. Use browser DevTools accessibility audit

---

**Last Updated:** 2025-11-11  
**Maintainer:** Development Team

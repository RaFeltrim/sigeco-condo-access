/**
 * React Testing Library helpers
 */

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Custom render function that includes common providers
 */
export function renderWithRouter(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
    ...options,
  });
}

/**
 * Simulates user typing with realistic delays
 */
export async function userType(element: HTMLElement, text: string) {
  const { userEvent } = await import('@testing-library/user-event');
  const user = userEvent.setup();
  await user.type(element, text);
}

/**
 * Simulates user clicking with realistic behavior
 */
export async function userClick(element: HTMLElement) {
  const { userEvent } = await import('@testing-library/user-event');
  const user = userEvent.setup();
  await user.click(element);
}

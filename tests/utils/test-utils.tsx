import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';

/**
 * User authentication state for testing
 */
export interface MockUser {
  id: string;
  username: string;
  role: 'porteiro' | 'admin' | 'morador';
  nome: string;
  email?: string;
}

/**
 * Preloaded state for testing
 */
export interface PreloadedState {
  user?: MockUser | null;
  [key: string]: unknown;
}

/**
 * Custom render options with authentication and routing support
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
  user?: MockUser | null;
  preloadedState?: PreloadedState;
  useMemoryRouter?: boolean;
}

/**
 * Custom render function that wraps components with necessary providers
 * Includes Router, QueryClient, TooltipProvider, and optional user authentication
 * 
 * @param ui - React element to render
 * @param options - Render options including initialRoute, user, and preloadedState
 * @returns Render result with additional utilities
 * 
 * @example
 * ```tsx
 * renderWithProviders(<MyComponent />, {
 *   initialRoute: '/porteiro-dashboard',
 *   user: createMockUser('porteiro')
 * });
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { 
    initialRoute = '/', 
    user = null,
    preloadedState = {},
    useMemoryRouter = true,
    ...renderOptions 
  } = options || {};

  // Create a new QueryClient for each test to ensure isolation
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  // Store user in sessionStorage if provided (simulating authentication)
  if (user) {
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('token', 'mock-jwt-token');
  } else {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  }

  // Store any additional preloaded state
  Object.entries(preloadedState).forEach(([key, value]) => {
    if (key !== 'user' && value !== undefined) {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  });

  function Wrapper({ children }: { children: ReactNode }) {
    const RouterComponent = useMemoryRouter ? MemoryRouter : BrowserRouter;
    const routerProps = useMemoryRouter 
      ? { initialEntries: [initialRoute] }
      : {};

    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RouterComponent {...routerProps}>
            {children}
          </RouterComponent>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  const renderResult = render(ui, { wrapper: Wrapper, ...renderOptions });

  return {
    ...renderResult,
    user,
    queryClient,
  };
}

/**
 * Cleanup function to clear all test state
 */
export function cleanupTestState() {
  sessionStorage.clear();
  localStorage.clear();
}

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

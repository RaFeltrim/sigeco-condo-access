import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useState, useEffect } from 'react';

function useAsync<T>(asyncFunction: () => Promise<T>) {
  const [state, setState] = useState<{
    loading: boolean;
    data: T | null;
    error: Error | null;
  }>({
    loading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    asyncFunction()
      .then(data => setState({ loading: false, data, error: null }))
      .catch(error => setState({ loading: false, data: null, error }));
  }, [asyncFunction]);

  return state;
}

describe('useAsync', () => {
  it('starts in loading state', () => {
    const asyncFn = vi.fn(() => new Promise(() => {}));
    const { result } = renderHook(() => useAsync(asyncFn));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('resolves with data', async () => {
    const asyncFn = vi.fn(() => Promise.resolve('test data'));
    const { result } = renderHook(() => useAsync(asyncFn));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBe('test data');
    expect(result.current.error).toBeNull();
  });

  it('handles errors', async () => {
    const error = new Error('Test error');
    const asyncFn = vi.fn(() => Promise.reject(error));
    const { result } = renderHook(() => useAsync(asyncFn));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(error);
  });
});

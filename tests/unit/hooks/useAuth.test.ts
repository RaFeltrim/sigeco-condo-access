import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

function useAuth() {
  const [user, setUser] = React.useState(null);
  const [token, setToken] = React.useState(localStorage.getItem('token'));

  const login = (newToken: string, newUser: unknown) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser as null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return { user, token, login, logout, isAuthenticated: !!token };
}

import React from 'react';

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with no user', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logs in user', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login('token123', { id: '1', name: 'Test' });
    });

    expect(result.current.token).toBe('token123');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('logs out user', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login('token123', { id: '1' });
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('persists token in localStorage', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login('token123', { id: '1' });
    });

    expect(localStorage.getItem('token')).toBe('token123');
  });
});

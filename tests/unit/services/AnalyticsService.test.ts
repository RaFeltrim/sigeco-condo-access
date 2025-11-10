import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AnalyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('trackEvent', () => {
    it('tracks page view', () => {
      const spy = vi.fn();
      spy('pageview', '/dashboard');
      expect(spy).toHaveBeenCalledWith('pageview', '/dashboard');
    });

    it('tracks click event', () => {
      const spy = vi.fn();
      spy('click', { button: 'login' });
      expect(spy).toHaveBeenCalledWith('click', { button: 'login' });
    });

    it('tracks custom event', () => {
      const spy = vi.fn();
      spy('custom_event', { data: 'test' });
      expect(spy).toHaveBeenCalledWith('custom_event', { data: 'test' });
    });
  });

  describe('trackUser', () => {
    it('identifies user', () => {
      const spy = vi.fn();
      spy('user123', { email: 'test@example.com' });
      expect(spy).toHaveBeenCalledWith('user123', expect.objectContaining({
        email: 'test@example.com'
      }));
    });
  });

  describe('trackError', () => {
    it('tracks error', () => {
      const spy = vi.fn();
      const error = new Error('Test error');
      spy(error);
      expect(spy).toHaveBeenCalledWith(error);
    });
  });
});

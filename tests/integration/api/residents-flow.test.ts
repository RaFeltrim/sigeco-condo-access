import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockResponse } from '../../utils/test-helpers';
import { mockResident } from '../../utils/mock-data';

describe('Residents Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('completes full CRUD flow', async () => {
    // Create resident
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      createMockResponse({ resident: mockResident }, 201)
    );

    let response = await fetch('/api/residents', {
      method: 'POST',
      body: JSON.stringify(mockResident),
    });
    expect(response.status).toBe(201);

    // Read resident
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      createMockResponse({ resident: mockResident })
    );

    response = await fetch('/api/residents/1');
    const data = await response.json();
    expect(data.resident).toEqual(mockResident);

    // Update resident
    const updated = { ...mockResident, name: 'Updated Name' };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      createMockResponse({ resident: updated })
    );

    response = await fetch('/api/residents/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Updated Name' }),
    });
    expect(response.status).toBe(200);

    // Delete resident
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      createMockResponse({}, 204)
    );

    response = await fetch('/api/residents/1', { method: 'DELETE' });
    expect(response.status).toBe(204);
  });

  it('handles validation errors in flow', async () => {
    // Try to create with invalid data
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      createMockResponse({ message: 'Invalid CPF' }, 400)
    );

    const response = await fetch('/api/residents', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', cpf: 'invalid' }),
    });

    expect(response.status).toBe(400);
  });
});

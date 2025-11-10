import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockResponse } from '../../utils/test-helpers';
import { mockAppointment, mockVisit } from '../../utils/mock-data';

describe('Appointments Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('completes appointment to visit flow', async () => {
    // Create appointment
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      createMockResponse({ appointment: mockAppointment }, 201)
    );

    let response = await fetch('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(mockAppointment),
    });
    expect(response.status).toBe(201);

    // Confirm appointment
    const confirmed = { ...mockAppointment, status: 'CONFIRMADO' };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      createMockResponse({ appointment: confirmed })
    );

    response = await fetch('/api/appointments/1', {
      method: 'PUT',
      body: JSON.stringify({ status: 'CONFIRMADO' }),
    });
    expect(response.status).toBe(200);

    // Check in visitor
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      createMockResponse({ visit: mockVisit }, 201)
    );

    response = await fetch('/api/visits/checkin', {
      method: 'POST',
      body: JSON.stringify({ appointmentId: '1' }),
    });
    expect(response.status).toBe(201);

    // Check out visitor
    const checkedOut = { ...mockVisit, checkOut: new Date() };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      createMockResponse({ visit: checkedOut })
    );

    response = await fetch('/api/visits/1/checkout', { method: 'POST' });
    expect(response.status).toBe(200);
  });
});

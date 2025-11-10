/**
 * Mock data generators for tests
 */

export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'ADMIN' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockResident = {
  id: '1',
  name: 'João Silva',
  cpf: '12345678900',
  email: 'joao@example.com',
  phone: '11999999999',
  unitId: 'unit-1',
  status: 'ATIVO' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockAppointment = {
  id: '1',
  residentId: '1',
  visitorName: 'Maria Santos',
  visitorCpf: '98765432100',
  date: new Date('2024-12-01'),
  status: 'PENDENTE' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockVisit = {
  id: '1',
  appointmentId: '1',
  checkIn: new Date('2024-12-01T10:00:00'),
  checkOut: null,
  status: 'EM_ANDAMENTO' as const,
  createdAt: new Date('2024-01-01'),
};

export function generateMockResidents(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    ...mockResident,
    id: `resident-${i + 1}`,
    name: `Resident ${i + 1}`,
    cpf: `${String(i + 1).padStart(11, '0')}`,
    email: `resident${i + 1}@example.com`,
  }));
}

export function generateMockAppointments(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    ...mockAppointment,
    id: `appointment-${i + 1}`,
    visitorName: `Visitor ${i + 1}`,
    visitorCpf: `${String(i + 1).padStart(11, '0')}`,
  }));
}

export const mockDashboardStats = {
  totalResidents: 150,
  activeVisits: 8,
  todayAppointments: 25,
  pendingAppointments: 12,
};

export const mockAuthResponse = {
  token: 'mock-jwt-token',
  user: mockUser,
};

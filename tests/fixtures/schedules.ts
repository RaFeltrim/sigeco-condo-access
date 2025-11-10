/**
 * Mock Schedule Fixtures
 * Factory functions for generating test schedule/appointment data
 */

export interface Schedule {
  id: number;
  visitante: string;
  documento: string;
  unidadeDestino: string;
  dataAgendamento: Date;
  horaInicio: string;
  horaFim: string;
  motivo: string;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'concluido';
  observacoes?: string;
  criadoPor: string;
  criadoEm: Date;
}

/**
 * Base mock schedules for testing
 */
export const mockSchedules: Schedule[] = [
  {
    id: 1,
    visitante: 'João Silva',
    documento: '123.456.789-00',
    unidadeDestino: 'Apto 101',
    dataAgendamento: new Date('2024-01-20T10:00:00'),
    horaInicio: '10:00',
    horaFim: '12:00',
    motivo: 'Manutenção preventiva',
    status: 'agendado',
    observacoes: 'Trazer ferramentas',
    criadoPor: 'Admin Sistema',
    criadoEm: new Date('2024-01-15T09:00:00'),
  },
  {
    id: 2,
    visitante: 'Maria Santos',
    documento: '987.654.321-00',
    unidadeDestino: 'Apto 202',
    dataAgendamento: new Date('2024-01-21T14:00:00'),
    horaInicio: '14:00',
    horaFim: '15:00',
    motivo: 'Entrega de móveis',
    status: 'confirmado',
    criadoPor: 'José Porteiro',
    criadoEm: new Date('2024-01-16T10:30:00'),
  },
  {
    id: 3,
    visitante: 'Pedro Oliveira',
    documento: '111.222.333-44',
    unidadeDestino: 'Apto 303',
    dataAgendamento: new Date('2024-01-18T09:00:00'),
    horaInicio: '09:00',
    horaFim: '11:00',
    motivo: 'Instalação de internet',
    status: 'concluido',
    criadoPor: 'Admin Sistema',
    criadoEm: new Date('2024-01-10T15:00:00'),
  },
];

/**
 * Factory function to create a mock schedule with custom properties
 * 
 * @param overrides - Optional properties to override defaults
 * @returns Mock schedule object
 */
export function createMockSchedule(overrides?: Partial<Schedule>): Schedule {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  return {
    id: Math.floor(Math.random() * 10000),
    visitante: 'Visitante Agendado',
    documento: '000.000.000-00',
    unidadeDestino: 'Apto 100',
    dataAgendamento: tomorrow,
    horaInicio: '10:00',
    horaFim: '12:00',
    motivo: 'Visita agendada',
    status: 'agendado',
    criadoPor: 'Sistema',
    criadoEm: new Date(),
    ...overrides,
  };
}

/**
 * Create multiple mock schedules
 * 
 * @param count - Number of schedules to create
 * @param status - Status for all schedules (optional)
 * @returns Array of mock schedules
 */
export function createMockSchedules(
  count: number,
  status?: Schedule['status']
): Schedule[] {
  const names = [
    'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa',
    'Carlos Souza', 'Juliana Lima', 'Roberto Alves', 'Fernanda Rocha',
  ];

  const motivos = [
    'Manutenção preventiva', 'Entrega de móveis', 'Instalação de internet',
    'Visita técnica', 'Mudança', 'Reforma', 'Limpeza', 'Outros serviços',
  ];

  return Array.from({ length: count }, (_, index) => {
    const dataAgendamento = new Date();
    dataAgendamento.setDate(dataAgendamento.getDate() + index);
    dataAgendamento.setHours(9 + (index % 8), 0, 0, 0);

    const horaInicio = `${String(9 + (index % 8)).padStart(2, '0')}:00`;
    const horaFim = `${String(11 + (index % 8)).padStart(2, '0')}:00`;

    return createMockSchedule({
      id: index + 1,
      visitante: names[index % names.length],
      documento: `${String(index + 100).padStart(3, '0')}.${String(index + 200).padStart(3, '0')}.${String(index + 300).padStart(3, '0')}-${String(index % 100).padStart(2, '0')}`,
      unidadeDestino: `Apto ${(index % 4 + 1)}0${index % 3 + 1}`,
      dataAgendamento,
      horaInicio,
      horaFim,
      motivo: motivos[index % motivos.length],
      status: status || (['agendado', 'confirmado', 'cancelado', 'concluido'][index % 4] as Schedule['status']),
    });
  });
}

/**
 * Get schedules by status
 */
export function getSchedulesByStatus(status: Schedule['status']): Schedule[] {
  return mockSchedules.filter(s => s.status === status);
}

/**
 * Get upcoming schedules (future dates)
 */
export function getUpcomingSchedules(): Schedule[] {
  const now = new Date();
  return mockSchedules.filter(s => s.dataAgendamento > now);
}

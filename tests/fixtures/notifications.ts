/**
 * Mock Notification Fixtures
 * Factory functions for generating test notification data
 */

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  userId?: string;
  actionUrl?: string;
}

/**
 * Base mock notifications for testing
 */
export const mockNotifications: Notification[] = [
  {
    id: '1',
    message: 'Novo visitante registrado: João Silva',
    type: 'info',
    timestamp: new Date('2024-01-15T10:00:00'),
    read: false,
  },
  {
    id: '2',
    message: 'Check-out realizado com sucesso',
    type: 'success',
    timestamp: new Date('2024-01-15T12:00:00'),
    read: true,
  },
  {
    id: '3',
    message: 'Visitante aguardando há mais de 3 horas',
    type: 'warning',
    timestamp: new Date('2024-01-15T14:00:00'),
    read: false,
    actionUrl: '/porteiro-dashboard',
  },
  {
    id: '4',
    message: 'Erro ao processar registro',
    type: 'error',
    timestamp: new Date('2024-01-15T15:30:00'),
    read: false,
  },
];

/**
 * Factory function to create a mock notification with custom properties
 * 
 * @param overrides - Optional properties to override defaults
 * @returns Mock notification object
 */
export function createMockNotification(
  overrides?: Partial<Notification>
): Notification {
  return {
    id: `notif-${Math.random().toString(36).substr(2, 9)}`,
    message: 'Notificação de teste',
    type: 'info',
    timestamp: new Date(),
    read: false,
    ...overrides,
  };
}

/**
 * Create multiple mock notifications
 * 
 * @param count - Number of notifications to create
 * @param type - Type for all notifications (optional)
 * @returns Array of mock notifications
 */
export function createMockNotifications(
  count: number,
  type?: Notification['type']
): Notification[] {
  const messages = {
    info: [
      'Novo visitante registrado',
      'Agendamento criado',
      'Morador cadastrado',
      'Sistema atualizado',
    ],
    success: [
      'Check-out realizado com sucesso',
      'Registro salvo',
      'Operação concluída',
      'Dados sincronizados',
    ],
    warning: [
      'Visitante aguardando há muito tempo',
      'Documento próximo ao vencimento',
      'Capacidade quase atingida',
      'Atenção necessária',
    ],
    error: [
      'Erro ao processar registro',
      'Falha na conexão',
      'Operação não permitida',
      'Erro desconhecido',
    ],
  };

  return Array.from({ length: count }, (_, index) => {
    const notifType = type || (['info', 'success', 'warning', 'error'][index % 4] as Notification['type']);
    const typeMessages = messages[notifType];
    
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() - index * 10);

    return createMockNotification({
      id: `notif-${index + 1}`,
      message: typeMessages[index % typeMessages.length],
      type: notifType,
      timestamp,
      read: index % 3 === 0,
      userId: `user-${(index % 3) + 1}`,
    });
  });
}

/**
 * Get unread notifications
 */
export function getUnreadNotifications(): Notification[] {
  return mockNotifications.filter(n => !n.read);
}

/**
 * Get notifications by type
 */
export function getNotificationsByType(
  type: Notification['type']
): Notification[] {
  return mockNotifications.filter(n => n.type === type);
}

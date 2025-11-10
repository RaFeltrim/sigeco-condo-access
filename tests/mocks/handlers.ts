import { http, HttpResponse, delay } from 'msw';
import { 
  mockVisitors, 
  mockResidents, 
  mockSchedules, 
  mockInventoryItems,
  mockAnalyticsData,
  mockNotifications,
} from '../fixtures';
import { mockUsers } from '../fixtures/users';

/**
 * Mock API Handlers for MSW
 * Provides comprehensive API mocking for all endpoints
 */

// In-memory storage for stateful testing
let visitors = [...mockVisitors];
let residents = [...mockResidents];
let schedules = [...mockSchedules];
let inventory = [...mockInventoryItems];
let notifications = [...mockNotifications];

/**
 * Reset all mock data to initial state
 * Useful for test isolation
 */
export function resetMockData() {
  visitors = [...mockVisitors];
  residents = [...mockResidents];
  schedules = [...mockSchedules];
  inventory = [...mockInventoryItems];
  notifications = [...mockNotifications];
}

/**
 * Main API handlers
 */
export const handlers = [
  // ============================================
  // Auth Handlers
  // ============================================
  
  http.post('/api/auth/login', async ({ request }) => {
    await delay(100); // Simulate network delay
    
    const body = await request.json() as { username: string; password: string };
    const { username, password } = body;

    // Simulate authentication logic
    if (password === 'senha123' || password === 'admin123') {
      const user = Object.values(mockUsers).find(u => u.username === username);
      
      if (user) {
        return HttpResponse.json({
          user,
          token: 'mock-jwt-token',
        });
      }
    }

    return HttpResponse.json(
      { error: 'Credenciais inválidas' },
      { status: 401 }
    );
  }),

  http.post('/api/auth/logout', async () => {
    await delay(50);
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/auth/me', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    return HttpResponse.json({ user: mockUsers.porteiro });
  }),

  // ============================================
  // Visitor Handlers
  // ============================================
  
  http.get('/api/visitors', async ({ request }) => {
    await delay(100);
    
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    
    let filteredVisitors = visitors;
    if (status) {
      filteredVisitors = visitors.filter(v => 
        v.status.toLowerCase() === status.toLowerCase()
      );
    }

    return HttpResponse.json(filteredVisitors);
  }),

  http.get('/api/visitors/:id', async ({ params }) => {
    await delay(50);
    
    const visitor = visitors.find(v => v.id === Number(params.id));
    
    if (!visitor) {
      return HttpResponse.json(
        { error: 'Visitante não encontrado' },
        { status: 404 }
      );
    }

    return HttpResponse.json(visitor);
  }),

  http.post('/api/visitors', async ({ request }) => {
    await delay(150);
    
    const body = await request.json() as Record<string, unknown>;
    const newVisitor = {
      id: visitors.length + 1,
      ...body,
      entrada: new Date(),
      status: 'Ativo' as const,
      hora: new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };

    visitors.push(newVisitor as typeof visitors[0]);
    
    return HttpResponse.json(newVisitor, { status: 201 });
  }),

  http.patch('/api/visitors/:id', async ({ params, request }) => {
    await delay(100);
    
    const body = await request.json() as Record<string, unknown>;
    const visitorIndex = visitors.findIndex(v => v.id === Number(params.id));
    
    if (visitorIndex === -1) {
      return HttpResponse.json(
        { error: 'Visitante não encontrado' },
        { status: 404 }
      );
    }

    visitors[visitorIndex] = { ...visitors[visitorIndex], ...body } as typeof visitors[0];
    
    return HttpResponse.json(visitors[visitorIndex]);
  }),

  http.delete('/api/visitors/:id', async ({ params }) => {
    await delay(100);
    
    const visitorIndex = visitors.findIndex(v => v.id === Number(params.id));
    
    if (visitorIndex === -1) {
      return HttpResponse.json(
        { error: 'Visitante não encontrado' },
        { status: 404 }
      );
    }

    visitors.splice(visitorIndex, 1);
    
    return HttpResponse.json({ success: true });
  }),

  // ============================================
  // Resident Handlers
  // ============================================
  
  http.get('/api/residents', async () => {
    await delay(100);
    return HttpResponse.json(residents);
  }),

  http.get('/api/residents/:id', async ({ params }) => {
    await delay(50);
    
    const resident = residents.find(r => r.id === Number(params.id));
    
    if (!resident) {
      return HttpResponse.json(
        { error: 'Morador não encontrado' },
        { status: 404 }
      );
    }

    return HttpResponse.json(resident);
  }),

  http.post('/api/residents', async ({ request }) => {
    await delay(150);
    
    const body = await request.json() as Record<string, unknown>;
    const newResident = {
      id: residents.length + 1,
      ...body,
      dataEntrada: new Date(),
      ativo: true,
    };

    residents.push(newResident as typeof residents[0]);
    
    return HttpResponse.json(newResident, { status: 201 });
  }),

  http.patch('/api/residents/:id', async ({ params, request }) => {
    await delay(100);
    
    const body = await request.json() as Record<string, unknown>;
    const residentIndex = residents.findIndex(r => r.id === Number(params.id));
    
    if (residentIndex === -1) {
      return HttpResponse.json(
        { error: 'Morador não encontrado' },
        { status: 404 }
      );
    }

    residents[residentIndex] = { ...residents[residentIndex], ...body } as typeof residents[0];
    
    return HttpResponse.json(residents[residentIndex]);
  }),

  http.delete('/api/residents/:id', async ({ params }) => {
    await delay(100);
    
    const residentIndex = residents.findIndex(r => r.id === Number(params.id));
    
    if (residentIndex === -1) {
      return HttpResponse.json(
        { error: 'Morador não encontrado' },
        { status: 404 }
      );
    }

    residents.splice(residentIndex, 1);
    
    return HttpResponse.json({ success: true });
  }),

  // ============================================
  // Schedule Handlers
  // ============================================
  
  http.get('/api/schedules', async ({ request }) => {
    await delay(100);
    
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    
    let filteredSchedules = schedules;
    if (status) {
      filteredSchedules = schedules.filter(s => s.status === status);
    }

    return HttpResponse.json(filteredSchedules);
  }),

  http.post('/api/schedules', async ({ request }) => {
    await delay(150);
    
    const body = await request.json() as Record<string, unknown>;
    const newSchedule = {
      id: schedules.length + 1,
      ...body,
      criadoEm: new Date(),
      status: 'agendado',
    };

    schedules.push(newSchedule as typeof schedules[0]);
    
    return HttpResponse.json(newSchedule, { status: 201 });
  }),

  http.patch('/api/schedules/:id', async ({ params, request }) => {
    await delay(100);
    
    const body = await request.json() as Record<string, unknown>;
    const scheduleIndex = schedules.findIndex(s => s.id === Number(params.id));
    
    if (scheduleIndex === -1) {
      return HttpResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      );
    }

    schedules[scheduleIndex] = { ...schedules[scheduleIndex], ...body } as typeof schedules[0];
    
    return HttpResponse.json(schedules[scheduleIndex]);
  }),

  // ============================================
  // Inventory Handlers
  // ============================================
  
  http.get('/api/inventory', async ({ request }) => {
    await delay(100);
    
    const url = new URL(request.url);
    const categoria = url.searchParams.get('categoria');
    
    let filteredInventory = inventory;
    if (categoria) {
      filteredInventory = inventory.filter(i => i.categoria === categoria);
    }

    return HttpResponse.json(filteredInventory);
  }),

  http.post('/api/inventory', async ({ request }) => {
    await delay(150);
    
    const body = await request.json() as Record<string, unknown>;
    const newItem = {
      id: inventory.length + 1,
      ...body,
      dataEntrada: new Date(),
      status: 'disponivel',
    };

    inventory.push(newItem as typeof inventory[0]);
    
    return HttpResponse.json(newItem, { status: 201 });
  }),

  // ============================================
  // Analytics Handlers
  // ============================================
  
  http.get('/api/analytics', async () => {
    await delay(100);
    return HttpResponse.json(mockAnalyticsData);
  }),

  http.get('/api/analytics/visitors', async ({ request }) => {
    await delay(100);
    
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'today';
    
    // Return different data based on period
    return HttpResponse.json({
      period,
      data: visitors.slice(0, 10),
      total: visitors.length,
    });
  }),

  // ============================================
  // Notification Handlers
  // ============================================
  
  http.get('/api/notifications', async ({ request }) => {
    await delay(100);
    
    const url = new URL(request.url);
    const unreadOnly = url.searchParams.get('unread') === 'true';
    
    let filteredNotifications = notifications;
    if (unreadOnly) {
      filteredNotifications = notifications.filter(n => !n.read);
    }

    return HttpResponse.json(filteredNotifications);
  }),

  http.patch('/api/notifications/:id/read', async ({ params }) => {
    await delay(50);
    
    const notificationIndex = notifications.findIndex(n => n.id === params.id);
    
    if (notificationIndex === -1) {
      return HttpResponse.json(
        { error: 'Notificação não encontrada' },
        { status: 404 }
      );
    }

    notifications[notificationIndex].read = true;
    
    return HttpResponse.json(notifications[notificationIndex]);
  }),

  // ============================================
  // Report Handlers
  // ============================================
  
  http.post('/api/reports/generate', async ({ request }) => {
    await delay(500); // Simulate longer processing time
    
    const body = await request.json() as Record<string, unknown>;
    
    return HttpResponse.json({
      reportId: 'report-123',
      status: 'completed',
      filters: body,
      generatedAt: new Date().toISOString(),
      data: {
        registros: visitors.slice(0, 5),
        estatisticas: {
          totalAcessos: visitors.length,
          tempoMedio: '2h 30min',
          horarioPico: '14:00',
        },
      },
    });
  }),
];

/**
 * Error scenario handlers
 * Use these to test error handling in your application
 */
export const errorHandlers = {
  // Network error
  networkError: http.get('/api/visitors', () => {
    return HttpResponse.error();
  }),

  // Server error
  serverError: http.get('/api/visitors', () => {
    return HttpResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }),

  // Unauthorized
  unauthorized: http.get('/api/visitors', () => {
    return HttpResponse.json(
      { error: 'Não autorizado' },
      { status: 401 }
    );
  }),

  // Timeout (very long delay)
  timeout: http.get('/api/visitors', async () => {
    await delay(30000);
    return HttpResponse.json([]);
  }),

  // Validation error
  validationError: http.post('/api/visitors', () => {
    return HttpResponse.json(
      { 
        error: 'Erro de validação',
        details: {
          nome: 'Nome é obrigatório',
          documento: 'Documento inválido',
        },
      },
      { status: 422 }
    );
  }),
};

/**
 * Test Utilities Verification
 * Tests to ensure all test utilities and fixtures work correctly
 */

import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../utils/test-utils';
import { 
  createMockUser, 
  createMockVisitor, 
  createMockResident,
  createMockSchedule,
  createMockInventoryItem,
  createMockNotification,
  mockVisitors,
  mockUsers,
} from '../fixtures';

// Simple test component
function TestComponent({ message }: { message: string }) {
  return <div>{message}</div>;
}

describe('Test Utilities', () => {
  describe('renderWithProviders', () => {
    it('renders component with default providers', () => {
      renderWithProviders(<TestComponent message="Hello Test" />);
      expect(screen.getByText('Hello Test')).toBeInTheDocument();
    });

    it('renders component with initial route', () => {
      renderWithProviders(<TestComponent message="Test Route" />, {
        initialRoute: '/porteiro-dashboard',
      });
      expect(screen.getByText('Test Route')).toBeInTheDocument();
    });

    it('renders component with mock user', () => {
      const user = createMockUser('porteiro');
      const result = renderWithProviders(<TestComponent message="Test User" />, {
        user,
      });
      
      expect(result.user).toEqual(user);
      expect(sessionStorage.getItem('user')).toBeTruthy();
    });

    it('renders component without user (unauthenticated)', () => {
      renderWithProviders(<TestComponent message="No User" />, {
        user: null,
      });
      
      expect(sessionStorage.getItem('user')).toBeNull();
    });
  });

  describe('Mock User Fixtures', () => {
    it('creates mock porteiro user', () => {
      const user = createMockUser('porteiro');
      expect(user.role).toBe('porteiro');
      expect(user.username).toBe('porteiro');
      expect(user.nome).toBeTruthy();
    });

    it('creates mock admin user', () => {
      const user = createMockUser('admin');
      expect(user.role).toBe('admin');
      expect(user.username).toBe('admin');
    });

    it('creates mock user with overrides', () => {
      const user = createMockUser('porteiro', { nome: 'Custom Name' });
      expect(user.nome).toBe('Custom Name');
      expect(user.role).toBe('porteiro');
    });

    it('provides base mock users', () => {
      expect(mockUsers.porteiro).toBeDefined();
      expect(mockUsers.admin).toBeDefined();
      expect(mockUsers.morador).toBeDefined();
    });
  });

  describe('Mock Visitor Fixtures', () => {
    it('creates mock visitor with defaults', () => {
      const visitor = createMockVisitor();
      expect(visitor.id).toBeDefined();
      expect(visitor.nome).toBeTruthy();
      expect(visitor.documento).toBeTruthy();
      expect(visitor.status).toBe('Ativo');
    });

    it('creates mock visitor with overrides', () => {
      const visitor = createMockVisitor({ 
        nome: 'Test Visitor',
        destino: 'Apto 999',
      });
      expect(visitor.nome).toBe('Test Visitor');
      expect(visitor.destino).toBe('Apto 999');
    });

    it('provides base mock visitors array', () => {
      expect(Array.isArray(mockVisitors)).toBe(true);
      expect(mockVisitors.length).toBeGreaterThan(0);
    });
  });

  describe('Mock Resident Fixtures', () => {
    it('creates mock resident with defaults', () => {
      const resident = createMockResident();
      expect(resident.id).toBeDefined();
      expect(resident.nome).toBeTruthy();
      expect(resident.unidade).toBeTruthy();
      expect(resident.ativo).toBe(true);
    });

    it('creates mock resident with overrides', () => {
      const resident = createMockResident({ 
        nome: 'Test Resident',
        unidade: 'Apto 888',
      });
      expect(resident.nome).toBe('Test Resident');
      expect(resident.unidade).toBe('Apto 888');
    });
  });

  describe('Mock Schedule Fixtures', () => {
    it('creates mock schedule with defaults', () => {
      const schedule = createMockSchedule();
      expect(schedule.id).toBeDefined();
      expect(schedule.visitante).toBeTruthy();
      expect(schedule.status).toBe('agendado');
    });

    it('creates mock schedule with overrides', () => {
      const schedule = createMockSchedule({ 
        visitante: 'Test Schedule',
        status: 'confirmado',
      });
      expect(schedule.visitante).toBe('Test Schedule');
      expect(schedule.status).toBe('confirmado');
    });
  });

  describe('Mock Inventory Fixtures', () => {
    it('creates mock inventory item with defaults', () => {
      const item = createMockInventoryItem();
      expect(item.id).toBeDefined();
      expect(item.nome).toBeTruthy();
      expect(item.status).toBe('disponivel');
    });

    it('creates mock inventory item with overrides', () => {
      const item = createMockInventoryItem({ 
        nome: 'Test Item',
        categoria: 'chaves',
      });
      expect(item.nome).toBe('Test Item');
      expect(item.categoria).toBe('chaves');
    });
  });

  describe('Mock Notification Fixtures', () => {
    it('creates mock notification with defaults', () => {
      const notification = createMockNotification();
      expect(notification.id).toBeDefined();
      expect(notification.message).toBeTruthy();
      expect(notification.type).toBe('info');
      expect(notification.read).toBe(false);
    });

    it('creates mock notification with overrides', () => {
      const notification = createMockNotification({ 
        message: 'Test Notification',
        type: 'success',
        read: true,
      });
      expect(notification.message).toBe('Test Notification');
      expect(notification.type).toBe('success');
      expect(notification.read).toBe(true);
    });
  });
});

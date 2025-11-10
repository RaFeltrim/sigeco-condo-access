/**
 * Test Fixtures Index
 * Central export point for all test fixtures
 */

// User fixtures
export {
  mockUsers,
  createMockUser,
  createMockUsers,
} from './users';

// Visitor fixtures
export {
  mockVisitors,
  createMockVisitor,
  createMockVisitors,
  createMockVisitorFormData,
  getActiveVisitors,
  getExitedVisitors,
} from './visitors';

// Resident fixtures
export {
  mockResidents,
  createMockResident,
  createMockResidents,
} from './residents';

// Schedule fixtures
export {
  mockSchedules,
  createMockSchedule,
  createMockSchedules,
  getSchedulesByStatus,
  getUpcomingSchedules,
} from './schedules';

// Inventory fixtures
export {
  mockInventoryItems,
  createMockInventoryItem,
  createMockInventoryItems,
  getInventoryByCategory,
  getInventoryByStatus,
  getAvailableInventory,
} from './inventory';

// Analytics fixtures
export {
  mockAnalyticsData,
  createMockAnalyticsData,
  createMockAnalyticsEvent,
  createMockAnalyticsEvents,
} from './analytics';

// Notification fixtures
export {
  mockNotifications,
  createMockNotification,
  createMockNotifications,
  getUnreadNotifications,
  getNotificationsByType,
} from './notifications';

// Re-export types
export type { MockUser } from '../utils/test-utils';
export type { Visitor, VisitorFormData } from '@/types/visitor';
export type { Resident } from './residents';
export type { Schedule } from './schedules';
export type { InventoryItem } from './inventory';
export type { AnalyticsData, AnalyticsEvent } from './analytics';
export type { Notification } from './notifications';

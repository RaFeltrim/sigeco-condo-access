/**
 * Mock Analytics Fixtures
 * Factory functions for generating test analytics data
 */

export interface AnalyticsData {
  totalVisitors: number;
  activeVisitors: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  averageStayTime: string;
  peakHours: string[];
  topDestinations: Array<{ unidade: string; count: number }>;
}

export interface AnalyticsEvent {
  id: string;
  name: string;
  timestamp: Date;
  properties?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
}

/**
 * Base mock analytics data
 */
export const mockAnalyticsData: AnalyticsData = {
  totalVisitors: 150,
  activeVisitors: 12,
  todayCheckIns: 25,
  todayCheckOuts: 13,
  averageStayTime: '2h 30min',
  peakHours: ['10:00', '14:00', '18:00'],
  topDestinations: [
    { unidade: 'Apto 101', count: 15 },
    { unidade: 'Apto 202', count: 12 },
    { unidade: 'Apto 303', count: 10 },
  ],
};

/**
 * Factory function to create mock analytics data
 * 
 * @param overrides - Optional properties to override defaults
 * @returns Mock analytics data object
 */
export function createMockAnalyticsData(
  overrides?: Partial<AnalyticsData>
): AnalyticsData {
  return {
    ...mockAnalyticsData,
    ...overrides,
  };
}

/**
 * Factory function to create a mock analytics event
 * 
 * @param overrides - Optional properties to override defaults
 * @returns Mock analytics event object
 */
export function createMockAnalyticsEvent(
  overrides?: Partial<AnalyticsEvent>
): AnalyticsEvent {
  return {
    id: `event-${Math.random().toString(36).substr(2, 9)}`,
    name: 'test_event',
    timestamp: new Date(),
    properties: {},
    ...overrides,
  };
}

/**
 * Create multiple mock analytics events
 * 
 * @param count - Number of events to create
 * @returns Array of mock analytics events
 */
export function createMockAnalyticsEvents(count: number): AnalyticsEvent[] {
  const eventNames = [
    'visitor_checkin',
    'visitor_checkout',
    'page_view',
    'button_click',
    'form_submit',
    'search_performed',
  ];

  return Array.from({ length: count }, (_, index) => {
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() - index * 5);

    return createMockAnalyticsEvent({
      id: `event-${index + 1}`,
      name: eventNames[index % eventNames.length],
      timestamp,
      properties: {
        index,
        testData: true,
      },
      userId: `user-${(index % 3) + 1}`,
      sessionId: `session-${Math.floor(index / 5) + 1}`,
    });
  });
}

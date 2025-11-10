/**
 * AnalyticsService - Sistema resiliente de analytics para SIGECO
 * 
 * Implementa coleta de eventos com queue local, múltiplos providers,
 * retry logic com exponential backoff e armazenamento local quando
 * todos os providers falham.
 */

import { LoggingService } from '@/lib/logging';

// Types and Interfaces
export interface AnalyticsEvent {
  id: string;
  name: string;
  properties?: Record<string, unknown>;
  timestamp: Date;
  sent: boolean;
  retryCount: number;
  providers: string[];
}

export interface AnalyticsProvider {
  name: string;
  track(event: AnalyticsEvent): Promise<boolean>;
  isBlocked(): boolean;
}

interface QueuedEvent {
  event: AnalyticsEvent;
  nextRetry: Date;
}

interface AnalyticsStats {
  totalEvents: number;
  sentEvents: number;
  failedEvents: number;
  successRate: number;
}

// Constants
const STORAGE_KEY_QUEUE = 'sigeco_analytics_queue';
const STORAGE_KEY_STATS = 'sigeco_analytics_stats';
const MAX_QUEUE_SIZE = 100;
const MAX_RETRY_COUNT = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 30000; // 30 seconds

/**
 * Base Analytics Provider - Abstract implementation
 */
export abstract class BaseAnalyticsProvider implements AnalyticsProvider {
  abstract name: string;

  abstract track(event: AnalyticsEvent): Promise<boolean>;

  /**
   * Checks if provider is blocked by adblockers
   */
  isBlocked(): boolean {
    // Default implementation - can be overridden
    return false;
  }

  /**
   * Helper to safely call external analytics APIs
   */
  protected async safeTrack(
    trackFn: () => Promise<void>,
    timeout: number = 3000
  ): Promise<boolean> {
    try {
      await Promise.race([
        trackFn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeout)
        ),
      ]);
      return true;
    } catch (error) {
      LoggingService.warning(`${this.name} tracking failed`, {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }
}

/**
 * Console Analytics Provider - For development/testing
 */
export class ConsoleAnalyticsProvider extends BaseAnalyticsProvider {
  name = 'Console';

  async track(event: AnalyticsEvent): Promise<boolean> {
    return this.safeTrack(async () => {
      console.log('[Analytics]', event.name, event.properties);
    });
  }

  isBlocked(): boolean {
    return false;
  }
}

/**
 * LocalStorage Analytics Provider - Fallback when all providers fail
 */
export class LocalStorageAnalyticsProvider extends BaseAnalyticsProvider {
  name = 'LocalStorage';
  private readonly STORAGE_KEY = 'sigeco_analytics_events';
  private readonly MAX_EVENTS = 500;

  async track(event: AnalyticsEvent): Promise<boolean> {
    return this.safeTrack(async () => {
      const stored = this.getStoredEvents();
      stored.push({
        name: event.name,
        properties: event.properties,
        timestamp: event.timestamp.toISOString(),
      });

      // Keep only last MAX_EVENTS
      const trimmed = stored.slice(-this.MAX_EVENTS);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmed));
    });
  }

  isBlocked(): boolean {
    return false;
  }

  private getStoredEvents(): Array<Record<string, unknown>> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) as Array<Record<string, unknown>> : [];
    } catch {
      return [];
    }
  }

  /**
   * Export stored events for analysis
   */
  exportEvents(): string {
    const events = this.getStoredEvents();
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        totalEvents: events.length,
        events,
      },
      null,
      2
    );
  }

  /**
   * Clear stored events
   */
  clearEvents(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

/**
 * Custom Analytics Provider - Placeholder for custom implementation
 */
export class CustomAnalyticsProvider extends BaseAnalyticsProvider {
  name = 'Custom';

  async track(event: AnalyticsEvent): Promise<boolean> {
    // Placeholder for custom analytics implementation
    // Could be replaced with actual API calls to custom backend
    return this.safeTrack(async () => {
      // Example: await fetch('/api/analytics', { method: 'POST', body: JSON.stringify(event) });
      LoggingService.info('Custom analytics event tracked', {
        event: event.name,
      });
    });
  }

  isBlocked(): boolean {
    // Check if custom endpoint is accessible
    return false;
  }
}

/**
 * Main Analytics Service
 */
class AnalyticsServiceClass {
  private providers: AnalyticsProvider[] = [];
  private queue: QueuedEvent[] = [];
  private stats: AnalyticsStats = {
    totalEvents: 0,
    sentEvents: 0,
    failedEvents: 0,
    successRate: 0,
  };
  private processingQueue = false;
  private fallbackProvider: LocalStorageAnalyticsProvider;

  constructor() {
    this.fallbackProvider = new LocalStorageAnalyticsProvider();
    this.loadQueue();
    this.loadStats();
    this.startQueueProcessor();
  }

  /**
   * Register an analytics provider
   */
  registerProvider(provider: AnalyticsProvider): void {
    if (this.providers.length >= 3) {
      LoggingService.warning('Maximum of 3 providers allowed', {
        attempted: provider.name,
      });
      return;
    }

    this.providers.push(provider);
    LoggingService.info('Analytics provider registered', {
      provider: provider.name,
      totalProviders: this.providers.length,
    });
  }

  /**
   * Track an analytics event
   */
  track(eventName: string, properties?: Record<string, unknown>): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      name: eventName,
      properties: this.sanitizeProperties(properties),
      timestamp: new Date(),
      sent: false,
      retryCount: 0,
      providers: [],
    };

    this.stats.totalEvents++;
    this.addToQueue(event);
    this.saveStats();

    LoggingService.info('Analytics event tracked', {
      event: eventName,
      queueSize: this.queue.length,
    });
  }

  /**
   * Get success rate of analytics tracking
   */
  getSuccessRate(): number {
    if (this.stats.totalEvents === 0) return 0;
    return (this.stats.sentEvents / this.stats.totalEvents) * 100;
  }

  /**
   * Get analytics statistics
   */
  getStats(): AnalyticsStats {
    return { ...this.stats };
  }

  /**
   * Get current queue size
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Clear all queued events
   */
  clearQueue(): void {
    this.queue = [];
    this.saveQueue();
    LoggingService.info('Analytics queue cleared');
  }

  /**
   * Export analytics data for analysis
   */
  exportData(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        stats: this.stats,
        queue: this.queue.map((q) => ({
          ...q.event,
          timestamp: q.event.timestamp.toISOString(),
          nextRetry: q.nextRetry.toISOString(),
        })),
        providers: this.providers.map((p) => ({
          name: p.name,
          blocked: p.isBlocked(),
        })),
        fallbackEvents: this.fallbackProvider.exportEvents(),
      },
      null,
      2
    );
  }

  /**
   * Add event to queue
   */
  private addToQueue(event: AnalyticsEvent): void {
    this.queue.push({
      event,
      nextRetry: new Date(),
    });

    // Limit queue size
    if (this.queue.length > MAX_QUEUE_SIZE) {
      const removed = this.queue.shift();
      if (removed) {
        this.stats.failedEvents++;
        LoggingService.warning('Analytics queue full, event dropped', {
          event: removed.event.name,
        });
      }
    }

    this.saveQueue();
  }

  /**
   * Process queue with retry logic
   */
  private async processQueue(): Promise<void> {
    if (this.processingQueue || this.queue.length === 0) {
      return;
    }

    this.processingQueue = true;

    try {
      const now = new Date();
      const readyEvents = this.queue.filter((q) => q.nextRetry <= now);

      for (const queuedEvent of readyEvents) {
        await this.sendEvent(queuedEvent);
      }

      // Remove sent events from queue
      this.queue = this.queue.filter((q) => !q.event.sent);
      this.saveQueue();
    } finally {
      this.processingQueue = false;
    }
  }

  /**
   * Send event to providers with retry logic
   */
  private async sendEvent(queuedEvent: QueuedEvent): Promise<void> {
    const { event } = queuedEvent;

    // Get active (non-blocked) providers
    const activeProviders = this.providers.filter((p) => !p.isBlocked());

    if (activeProviders.length === 0) {
      // All providers blocked, use fallback
      const success = await this.fallbackProvider.track(event);
      if (success) {
        event.sent = true;
        event.providers.push(this.fallbackProvider.name);
        this.stats.sentEvents++;
        this.saveStats();
      }
      return;
    }

    // Try each provider
    let sentToAny = false;
    for (const provider of activeProviders) {
      try {
        const success = await provider.track(event);
        if (success) {
          sentToAny = true;
          event.providers.push(provider.name);
        }
      } catch (error) {
        LoggingService.warning('Provider tracking error', {
          provider: provider.name,
          event: event.name,
          error: error instanceof Error ? error.message : 'Unknown',
        });
      }
    }

    if (sentToAny) {
      event.sent = true;
      this.stats.sentEvents++;
      this.saveStats();
    } else {
      // Retry logic with exponential backoff
      event.retryCount++;

      if (event.retryCount >= MAX_RETRY_COUNT) {
        // Max retries reached, use fallback
        const fallbackSuccess = await this.fallbackProvider.track(event);
        if (fallbackSuccess) {
          event.sent = true;
          event.providers.push(this.fallbackProvider.name);
          this.stats.sentEvents++;
        } else {
          this.stats.failedEvents++;
        }
        this.saveStats();
      } else {
        // Schedule retry with exponential backoff
        const delay = Math.min(
          INITIAL_RETRY_DELAY * Math.pow(2, event.retryCount - 1),
          MAX_RETRY_DELAY
        );
        queuedEvent.nextRetry = new Date(Date.now() + delay);

        LoggingService.info('Analytics event scheduled for retry', {
          event: event.name,
          retryCount: event.retryCount,
          nextRetry: queuedEvent.nextRetry.toISOString(),
        });
      }
    }
  }

  /**
   * Start background queue processor
   */
  private startQueueProcessor(): void {
    // Process queue every 5 seconds
    setInterval(() => {
      this.processQueue();
    }, 5000);

    // Initial process
    setTimeout(() => {
      this.processQueue();
    }, 1000);
  }

  /**
   * Load queue from localStorage
   */
  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_QUEUE);
      if (stored) {
        const parsed = JSON.parse(stored) as Array<{
          event: Omit<AnalyticsEvent, 'timestamp'> & { timestamp: string };
          nextRetry: string;
        }>;
        this.queue = parsed.map((q) => ({
          event: {
            ...q.event,
            timestamp: new Date(q.event.timestamp),
          },
          nextRetry: new Date(q.nextRetry),
        }));
      }
    } catch (error) {
      LoggingService.error('Failed to load analytics queue', error as Error);
      this.queue = [];
    }
  }

  /**
   * Save queue to localStorage
   */
  private saveQueue(): void {
    try {
      const serialized = this.queue.map((q) => ({
        event: {
          ...q.event,
          timestamp: q.event.timestamp.toISOString(),
        },
        nextRetry: q.nextRetry.toISOString(),
      }));
      localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(serialized));
    } catch (error) {
      LoggingService.error('Failed to save analytics queue', error as Error);
    }
  }

  /**
   * Load stats from localStorage
   */
  private loadStats(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_STATS);
      if (stored) {
        this.stats = JSON.parse(stored);
      }
    } catch (error) {
      LoggingService.error('Failed to load analytics stats', error as Error);
    }
  }

  /**
   * Save stats to localStorage
   */
  private saveStats(): void {
    try {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(this.stats));
    } catch (error) {
      LoggingService.error('Failed to save analytics stats', error as Error);
    }
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sanitize event properties (remove sensitive data)
   */
  private sanitizeProperties(
    properties?: Record<string, unknown>
  ): Record<string, unknown> | undefined {
    if (!properties) return undefined;

    const sanitized = { ...properties };
    const sensitiveKeys = [
      'password',
      'senha',
      'token',
      'cpf',
      'rg',
      'documento',
      'email',
    ];

    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}

// Export singleton instance
export const AnalyticsService = new AnalyticsServiceClass();

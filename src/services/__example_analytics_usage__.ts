/**
 * Example Usage of AnalyticsService
 * 
 * This file demonstrates how to use the AnalyticsService in different scenarios.
 * DO NOT import this file in production code - it's for reference only.
 */

import { 
  AnalyticsService, 
  ConsoleAnalyticsProvider,
  CustomAnalyticsProvider,
  LocalStorageAnalyticsProvider,
  BaseAnalyticsProvider,
  type AnalyticsEvent
} from './AnalyticsService';

// ============================================================================
// 1. INITIALIZATION (in App.tsx or main.tsx)
// ============================================================================

function initializeAnalytics() {
  // Register providers (maximum 3)
  if (import.meta.env.DEV) {
    AnalyticsService.registerProvider(new ConsoleAnalyticsProvider());
  }
  
  AnalyticsService.registerProvider(new CustomAnalyticsProvider());
  
  // Track app initialization
  AnalyticsService.track('app_initialized', {
    environment: import.meta.env.MODE,
    timestamp: new Date().toISOString()
  });
}

// ============================================================================
// 2. TRACKING USER EVENTS
// ============================================================================

// Login event
function trackLogin(userType: string) {
  AnalyticsService.track('user_login', {
    userType,
    timestamp: new Date().toISOString()
  });
}

// Failed login
function trackLoginFailed(reason: string) {
  AnalyticsService.track('login_failed', {
    reason,
    timestamp: new Date().toISOString()
  });
}

// Visitor registration
function trackVisitorRegistration(destination: string, hasMotivo: boolean) {
  AnalyticsService.track('visitor_registered', {
    destination,
    hasMotivo,
    timestamp: new Date().toISOString()
  });
}

// Visitor exit
function trackVisitorExit(destination: string, durationMinutes: number) {
  AnalyticsService.track('visitor_exit', {
    destination,
    durationMinutes,
    timestamp: new Date().toISOString()
  });
}

// Report generation
function trackReportGeneration(
  format: 'pdf' | 'excel',
  recordCount: number,
  generationTime: number,
  filters: Record<string, unknown>
) {
  AnalyticsService.track('report_generated', {
    format,
    recordCount,
    generationTime,
    filters,
    timestamp: new Date().toISOString()
  });
}

// Report generation failure
function trackReportGenerationFailed(
  format: 'pdf' | 'excel',
  errorType: string,
  errorMessage: string
) {
  AnalyticsService.track('report_generation_failed', {
    format,
    errorType,
    errorMessage,
    timestamp: new Date().toISOString()
  });
}

// Error tracking
function trackError(component: string, errorType: string, message: string) {
  AnalyticsService.track('error_occurred', {
    component,
    errorType,
    message,
    timestamp: new Date().toISOString()
  });
}

// ============================================================================
// 3. MONITORING AND STATISTICS
// ============================================================================

function monitorAnalytics() {
  // Get success rate
  const successRate = AnalyticsService.getSuccessRate();
  console.log(`Analytics Success Rate: ${successRate.toFixed(2)}%`);
  
  // Get detailed stats
  const stats = AnalyticsService.getStats();
  console.log('Analytics Stats:', stats);
  
  // Get queue size
  const queueSize = AnalyticsService.getQueueSize();
  console.log(`Events in Queue: ${queueSize}`);
  
  // Alert if success rate is low
  if (successRate < 80) {
    console.warn('Analytics success rate is below 80%!');
  }
}

// Periodic monitoring (every minute)
function startPeriodicMonitoring() {
  setInterval(() => {
    monitorAnalytics();
  }, 60000);
}

// ============================================================================
// 4. EXPORTING DATA
// ============================================================================

function exportAnalyticsData() {
  // Export all analytics data
  const data = AnalyticsService.exportData();
  console.log('Exported Analytics Data:', data);
  
  // Save to file (in browser)
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `analytics-export-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

// Export fallback events
function exportFallbackEvents() {
  const fallback = new LocalStorageAnalyticsProvider();
  const events = fallback.exportEvents();
  console.log('Fallback Events:', events);
}

// ============================================================================
// 5. CREATING CUSTOM PROVIDER
// ============================================================================

class GoogleAnalyticsProvider extends BaseAnalyticsProvider {
  name = 'GoogleAnalytics';

  async track(event: AnalyticsEvent): Promise<boolean> {
    return this.safeTrack(async () => {
      // Check if GA is loaded
      if (typeof window !== 'undefined' && (window as { gtag?: (event: string, name: string, properties?: unknown) => void }).gtag) {
        (window as { gtag: (event: string, name: string, properties?: unknown) => void }).gtag('event', event.name, event.properties);
      } else {
        throw new Error('Google Analytics not loaded');
      }
    });
  }

  isBlocked(): boolean {
    // Check if GA is blocked by adblockers
    return typeof window === 'undefined' || typeof (window as { gtag?: unknown }).gtag === 'undefined';
  }
}

// Register custom provider
function registerGoogleAnalytics() {
  AnalyticsService.registerProvider(new GoogleAnalyticsProvider());
}

// ============================================================================
// 6. ADVANCED USAGE - TRACKING WITH TIMING
// ============================================================================

async function trackOperationWithTiming<T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  
  try {
    const result = await operation();
    const duration = (Date.now() - startTime) / 1000;
    
    AnalyticsService.track(`${operationName}_success`, {
      duration,
      timestamp: new Date().toISOString()
    });
    
    return result;
  } catch (error) {
    const duration = (Date.now() - startTime) / 1000;
    
    AnalyticsService.track(`${operationName}_failed`, {
      duration,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    
    throw error;
  }
}

// Example usage
async function generateReportWithTracking() {
  return trackOperationWithTiming('report_generation', async () => {
    // Your report generation logic here
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true };
  });
}

// ============================================================================
// 7. QUEUE MANAGEMENT
// ============================================================================

function manageQueue() {
  // Check queue size
  const queueSize = AnalyticsService.getQueueSize();
  
  if (queueSize > 50) {
    console.warn('Analytics queue is getting large:', queueSize);
  }
  
  // Clear queue if needed (use with caution!)
  if (queueSize > 100) {
    console.warn('Clearing analytics queue due to size');
    AnalyticsService.clearQueue();
  }
}

// ============================================================================
// 8. INTEGRATION WITH ERROR BOUNDARY
// ============================================================================

function trackErrorBoundaryError(error: Error, errorInfo: { componentStack: string }) {
  AnalyticsService.track('react_error_boundary', {
    error: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString()
  });
}

// ============================================================================
// 9. PAGE VIEW TRACKING
// ============================================================================

function trackPageView(pageName: string, path: string) {
  AnalyticsService.track('page_view', {
    pageName,
    path,
    referrer: document.referrer,
    timestamp: new Date().toISOString()
  });
}

// Use with React Router
function setupPageViewTracking() {
  // In your router setup
  // <Route path="/dashboard" element={<Dashboard />} />
  // Call trackPageView('Dashboard', '/dashboard') when component mounts
}

// ============================================================================
// 10. FEATURE USAGE TRACKING
// ============================================================================

function trackFeatureUsage(featureName: string, action: string, metadata?: Record<string, unknown>) {
  AnalyticsService.track('feature_used', {
    feature: featureName,
    action,
    ...metadata,
    timestamp: new Date().toISOString()
  });
}

// Examples
function trackFilterUsage(filterType: string, filterValue: string) {
  trackFeatureUsage('report_filter', 'applied', {
    filterType,
    filterValue
  });
}

function trackSearchUsage(searchTerm: string, resultsCount: number) {
  trackFeatureUsage('search', 'performed', {
    searchTerm: searchTerm.length, // Don't send actual search term for privacy
    resultsCount
  });
}

// ============================================================================
// EXPORT EXAMPLES
// ============================================================================

export {
  initializeAnalytics,
  trackLogin,
  trackLoginFailed,
  trackVisitorRegistration,
  trackVisitorExit,
  trackReportGeneration,
  trackReportGenerationFailed,
  trackError,
  monitorAnalytics,
  startPeriodicMonitoring,
  exportAnalyticsData,
  exportFallbackEvents,
  GoogleAnalyticsProvider,
  registerGoogleAnalytics,
  trackOperationWithTiming,
  generateReportWithTracking,
  manageQueue,
  trackErrorBoundaryError,
  trackPageView,
  setupPageViewTracking,
  trackFeatureUsage,
  trackFilterUsage,
  trackSearchUsage
};

import { LucideIcon } from "lucide-react";

/**
 * Dashboard Data Types
 * 
 * Type definitions for dashboard components, KPIs, and metrics
 */

export interface DashboardKPI {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color?: string;
  description?: string;
}

export interface DashboardMetric {
  label: string;
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
}

export interface DashboardChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface DashboardTimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface DashboardStats {
  visitors: {
    today: number;
    week: number;
    month: number;
    active: number;
  };
  occupancy: {
    current: number;
    average: number;
    peak: number;
  };
  access: {
    total: number;
    approved: number;
    denied: number;
    pending: number;
  };
}

export interface DashboardFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  period?: 'today' | 'week' | 'month' | 'year' | 'custom';
  status?: string[];
  type?: string[];
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  type: 'stat' | 'chart' | 'table' | 'custom';
  span?: 'full' | 'half' | 'third' | 'two-thirds';
  refreshInterval?: number;
  enabled: boolean;
}

export interface DashboardData {
  kpis: DashboardKPI[];
  stats: DashboardStats;
  chartData: DashboardChartDataPoint[];
  timeSeriesData: DashboardTimeSeriesData[];
  filters?: DashboardFilters;
  lastUpdated: Date;
}

export interface DashboardConfig {
  refreshInterval: number;
  defaultPeriod: 'today' | 'week' | 'month';
  widgets: DashboardWidgetConfig[];
  autoRefresh: boolean;
}

// Helper type for real-time updates
export interface DashboardUpdate {
  type: 'visitor' | 'access' | 'occupancy' | 'alert';
  data: unknown;
  timestamp: Date;
}

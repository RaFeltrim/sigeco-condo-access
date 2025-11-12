/**
 * Report Types
 * 
 * Type definitions for report generation and management
 */

export type ReportType = 'visitors' | 'access' | 'occupancy' | 'residents' | 'custom';
export type ReportFormat = 'pdf' | 'excel' | 'csv';
export type ReportStatus = 'draft' | 'generating' | 'completed' | 'failed';
export type ReportPeriod = 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  createdAt: Date;
  completedAt?: Date;
  createdBy: string;
  fileUrl?: string;
  fileSize?: number;
  recordCount: number;
  description?: string;
  tags?: string[];
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  defaultFormat: ReportFormat;
  fields: string[];
  filters?: ReportFilters;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportFilters {
  period?: ReportPeriod;
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string[];
  type?: string[];
  destination?: string[];
  customFilters?: Record<string, any>;
}

export interface ReportSchedule {
  id: string;
  reportTemplateId: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // HH:mm format
  recipients: string[];
  format: ReportFormat;
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

export interface ReportExportOptions {
  format: ReportFormat;
  includeCharts?: boolean;
  includeMetadata?: boolean;
  pageSize?: 'A4' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
  customTitle?: string;
}

export interface ReportStatistics {
  totalReports: number;
  reportsThisMonth: number;
  mostUsedType: ReportType;
  averageGenerationTime: number; // in seconds
  totalDownloads: number;
}

/**
 * Report Configuration Types
 * 
 * Type definitions for report configuration and customization
 */

import type { ReportType, ReportFormat, ReportPeriod } from './report';

export interface ReportConfig {
  id: string;
  name: string;
  description?: string;
  type: ReportType;
  format: ReportFormat;
  period: ReportPeriod;
  options: ReportConfigOptions;
  filters: ReportConfigFilters;
  layout: ReportConfigLayout;
  createdAt: Date;
  updatedAt: Date;
  isTemplate: boolean;
}

export interface ReportConfigOptions {
  // General Options
  title?: string;
  subtitle?: string;
  includeHeader: boolean;
  includeFooter: boolean;
  includeLogo: boolean;
  includePageNumbers: boolean;
  
  // Content Options
  includeStatistics: boolean;
  includeCharts: boolean;
  includeDetailedData: boolean;
  includeMetadata: boolean;
  includeSummary: boolean;
  
  // Export Options
  compression?: 'none' | 'low' | 'medium' | 'high';
  quality?: 'draft' | 'normal' | 'high';
  colorMode?: 'color' | 'grayscale';
}

export interface ReportConfigFilters {
  // Date Filters
  startDate?: Date;
  endDate?: Date;
  
  // Category Filters
  status?: string[];
  type?: string[];
  destination?: string[];
  
  // Numeric Filters
  minDuration?: number;
  maxDuration?: number;
  minValue?: number;
  maxValue?: number;
  
  // Text Filters
  searchTerm?: string;
  tags?: string[];
  
  // Custom Filters
  customFields?: Record<string, unknown>;
}

export interface ReportConfigLayout {
  // Page Settings
  pageSize: 'A4' | 'Letter' | 'Legal' | 'A3';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  // Typography
  fontSize: 'small' | 'normal' | 'large';
  fontFamily?: string;
  
  // Colors
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  
  // Sections
  sections: ReportSection[];
}

export interface ReportSection {
  id: string;
  type: 'header' | 'statistics' | 'chart' | 'table' | 'text' | 'image' | 'footer';
  title?: string;
  order: number;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export interface ReportConfigPreset {
  id: string;
  name: string;
  description: string;
  icon?: string;
  config: Partial<ReportConfig>;
  category: 'standard' | 'custom' | 'enterprise';
  isPublic: boolean;
}

// Default configurations
export const DEFAULT_REPORT_CONFIG: Partial<ReportConfig> = {
  options: {
    includeHeader: true,
    includeFooter: true,
    includeLogo: true,
    includePageNumbers: true,
    includeStatistics: true,
    includeCharts: true,
    includeDetailedData: true,
    includeMetadata: true,
    includeSummary: true,
    quality: 'normal',
    colorMode: 'color',
  },
  layout: {
    pageSize: 'A4',
    orientation: 'portrait',
    margins: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
    fontSize: 'normal',
    sections: [],
  },
};

export const REPORT_CONFIG_PRESETS: ReportConfigPreset[] = [
  {
    id: 'simple',
    name: 'Relatório Simples',
    description: 'Relatório básico com dados essenciais',
    category: 'standard',
    isPublic: true,
    config: {
      options: {
        includeHeader: true,
        includeFooter: false,
        includeLogo: false,
        includePageNumbers: false,
        includeStatistics: true,
        includeCharts: false,
        includeDetailedData: true,
        includeMetadata: false,
        includeSummary: false,
        quality: 'draft',
        colorMode: 'grayscale',
      },
    },
  },
  {
    id: 'detailed',
    name: 'Relatório Detalhado',
    description: 'Relatório completo com gráficos e estatísticas',
    category: 'standard',
    isPublic: true,
    config: {
      options: {
        includeHeader: true,
        includeFooter: true,
        includeLogo: true,
        includePageNumbers: true,
        includeStatistics: true,
        includeCharts: true,
        includeDetailedData: true,
        includeMetadata: true,
        includeSummary: true,
        quality: 'high',
        colorMode: 'color',
      },
    },
  },
  {
    id: 'executive',
    name: 'Relatório Executivo',
    description: 'Resumo executivo com métricas-chave',
    category: 'enterprise',
    isPublic: true,
    config: {
      options: {
        includeHeader: true,
        includeFooter: true,
        includeLogo: true,
        includePageNumbers: true,
        includeStatistics: true,
        includeCharts: true,
        includeDetailedData: false,
        includeMetadata: false,
        includeSummary: true,
        quality: 'high',
        colorMode: 'color',
      },
    },
  },
];

/**
 * Core types for the MVP Verifier system
 */

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export type EstimatedEffort = 'low' | 'medium' | 'high';

/**
 * Represents a gap or issue found during verification
 */
export interface Gap {
  id: string;
  severity: SeverityLevel;
  category: string;
  description: string;
  recommendation: string;
  affectedFiles?: string[];
  estimatedEffort?: EstimatedEffort;
}

/**
 * Result from a single analyzer execution
 */
export interface AnalyzerResult {
  analyzerName: string;
  score: number; // 0-100
  executionTime: number; // milliseconds
  gaps: Gap[];
  metadata: Record<string, unknown>;
}

/**
 * Summary statistics for the verification report
 */
export interface ReportSummary {
  totalGaps: number;
  gapsBySeverity: Record<SeverityLevel, number>;
  analyzerScores: Record<string, number>;
  estimatedWorkRemaining: string;
}

/**
 * Complete verification report containing all analysis results
 */
export interface VerificationReport {
  timestamp: string;
  projectPath: string;
  overallScore: number; // 0-100
  analyzerResults: Record<string, AnalyzerResult>;
  summary: ReportSummary;
  recommendations: string[];
}

/**
 * Base interface that all analyzers must implement
 */
export interface Analyzer {
  name: string;
  analyze(): Promise<AnalyzerResult>;
}

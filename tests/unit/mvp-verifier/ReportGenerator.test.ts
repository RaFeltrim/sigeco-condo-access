/**
 * Unit tests for ReportGenerator
 */

import { describe, it, expect } from 'vitest';
import { ReportGenerator } from '../../../src/lib/mvp-verifier/ReportGenerator';
import type { VerificationReport } from '../../../src/types/mvp-verifier';

describe('ReportGenerator', () => {
  const mockReport: VerificationReport = {
    timestamp: '2024-01-15T10:30:00.000Z',
    projectPath: '/test/project',
    overallScore: 75.5,
    analyzerResults: {
      ComponentAnalyzer: {
        analyzerName: 'ComponentAnalyzer',
        score: 80,
        executionTime: 150,
        gaps: [
          {
            id: 'comp-1',
            severity: 'high',
            category: 'component',
            description: 'Missing prop validation',
            recommendation: 'Add PropTypes or TypeScript interface',
            affectedFiles: ['src/components/Button.tsx'],
            estimatedEffort: 'low',
          },
        ],
        metadata: { componentsAnalyzed: 10 },
      },
      StructureAnalyzer: {
        analyzerName: 'StructureAnalyzer',
        score: 90,
        executionTime: 50,
        gaps: [],
        metadata: { directoriesChecked: 6 },
      },
    },
    summary: {
      totalGaps: 1,
      gapsBySeverity: {
        critical: 0,
        high: 1,
        medium: 0,
        low: 0,
      },
      analyzerScores: {
        ComponentAnalyzer: 80,
        StructureAnalyzer: 90,
      },
      estimatedWorkRemaining: '1-2 days',
    },
    recommendations: [
      '⚠️  Resolve 1 high-priority issue(s) for MVP completion',
      '✅ MVP is 75.5% complete - address remaining gaps for production readiness',
    ],
  };

  describe('generateJSON', () => {
    it('should generate valid JSON string', () => {
      const generator = new ReportGenerator();
      const json = generator.generateJSON(mockReport);

      expect(() => JSON.parse(json)).not.toThrow();
      const parsed = JSON.parse(json);
      expect(parsed.overallScore).toBe(75.5);
      expect(parsed.projectPath).toBe('/test/project');
    });

    it('should include all report sections', () => {
      const generator = new ReportGenerator();
      const json = generator.generateJSON(mockReport);
      const parsed = JSON.parse(json);

      expect(parsed).toHaveProperty('timestamp');
      expect(parsed).toHaveProperty('projectPath');
      expect(parsed).toHaveProperty('overallScore');
      expect(parsed).toHaveProperty('analyzerResults');
      expect(parsed).toHaveProperty('summary');
      expect(parsed).toHaveProperty('recommendations');
    });
  });

  describe('generateMarkdown', () => {
    it('should generate markdown report with header', () => {
      const generator = new ReportGenerator();
      const markdown = generator.generateMarkdown(mockReport);

      expect(markdown).toContain('# MVP Verification Report');
      expect(markdown).toContain('**Project Path:**');
      expect(markdown).toContain('/test/project');
    });

    it('should include executive summary with overall score', () => {
      const generator = new ReportGenerator();
      const markdown = generator.generateMarkdown(mockReport);

      expect(markdown).toContain('## Executive Summary');
      expect(markdown).toContain('Overall MVP Completion');
      expect(markdown).toContain('75.5%');
    });

    it('should include analyzer scores table', () => {
      const generator = new ReportGenerator();
      const markdown = generator.generateMarkdown(mockReport);

      expect(markdown).toContain('## Analyzer Scores');
      expect(markdown).toContain('ComponentAnalyzer');
      expect(markdown).toContain('StructureAnalyzer');
      expect(markdown).toContain('80.0%');
      expect(markdown).toContain('90.0%');
    });

    it('should format gaps by category with severity badges', () => {
      const generator = new ReportGenerator();
      const markdown = generator.generateMarkdown(mockReport);

      expect(markdown).toContain('## Issues by Category');
      expect(markdown).toContain('🟠 HIGH');
      expect(markdown).toContain('Missing prop validation');
      expect(markdown).toContain('Add PropTypes or TypeScript interface');
    });

    it('should include affected files for gaps', () => {
      const generator = new ReportGenerator();
      const markdown = generator.generateMarkdown(mockReport);

      expect(markdown).toContain('**Affected Files:**');
      expect(markdown).toContain('src/components/Button.tsx');
    });

    it('should include recommendations section', () => {
      const generator = new ReportGenerator();
      const markdown = generator.generateMarkdown(mockReport);

      expect(markdown).toContain('## Recommendations');
      expect(markdown).toContain('Resolve 1 high-priority issue');
      expect(markdown).toContain('75.5% complete');
    });

    it('should include metadata from analyzers', () => {
      const generator = new ReportGenerator();
      const markdown = generator.generateMarkdown(mockReport);

      expect(markdown).toContain('**Metadata:**');
      expect(markdown).toContain('componentsAnalyzed');
    });

    it('should show appropriate status for different scores', () => {
      const generator = new ReportGenerator();
      
      const lowScoreReport = { ...mockReport, overallScore: 45 };
      const lowMarkdown = generator.generateMarkdown(lowScoreReport);
      expect(lowMarkdown).toContain('Significant Work Required');

      const highScoreReport = { ...mockReport, overallScore: 85 };
      const highMarkdown = generator.generateMarkdown(highScoreReport);
      expect(highMarkdown).toContain('MVP Ready');
    });
  });
});

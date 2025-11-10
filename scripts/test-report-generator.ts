/**
 * Test script to demonstrate ReportGenerator functionality
 * This creates a sample verification report and generates both JSON and Markdown outputs
 */

import { ReportGenerator } from '../src/lib/mvp-verifier/ReportGenerator';
import type { VerificationReport } from '../src/types/mvp-verifier';

// Create a sample verification report
const sampleReport: VerificationReport = {
  timestamp: new Date().toISOString(),
  projectPath: process.cwd(),
  overallScore: 72.5,
  analyzerResults: {
    ComponentAnalyzer: {
      analyzerName: 'ComponentAnalyzer',
      score: 75,
      executionTime: 245,
      gaps: [
        {
          id: 'comp-1',
          severity: 'critical',
          category: 'component',
          description: 'Component missing error boundary',
          recommendation: 'Wrap component with ErrorBoundary or add try-catch blocks',
          affectedFiles: ['src/components/VisitorForm.tsx'],
          estimatedEffort: 'medium',
        },
        {
          id: 'comp-2',
          severity: 'high',
          category: 'component',
          description: 'Missing accessibility attributes',
          recommendation: 'Add aria-label and role attributes to interactive elements',
          affectedFiles: ['src/components/AccessControl.tsx', 'src/components/DashboardStats.tsx'],
          estimatedEffort: 'low',
        },
      ],
      metadata: {
        componentsAnalyzed: 15,
        componentsWithIssues: 2,
      },
    },
    StructureAnalyzer: {
      analyzerName: 'StructureAnalyzer',
      score: 85,
      executionTime: 120,
      gaps: [
        {
          id: 'struct-1',
          severity: 'medium',
          category: 'structure',
          description: 'Missing route configuration for page',
          recommendation: 'Add route entry in App.tsx for RelatoriosPage',
          affectedFiles: ['src/pages/RelatoriosPage.tsx'],
          estimatedEffort: 'low',
        },
      ],
      metadata: {
        directoriesChecked: 6,
        configFilesValidated: 4,
      },
    },
    FeatureAnalyzer: {
      analyzerName: 'FeatureAnalyzer',
      score: 60,
      executionTime: 180,
      gaps: [
        {
          id: 'feat-1',
          severity: 'high',
          category: 'feature',
          description: 'Reports feature incomplete (55% complete)',
          recommendation: 'Implement missing ReportGenerator and ReportViewer components',
          affectedFiles: [],
          estimatedEffort: 'high',
        },
      ],
      metadata: {
        featuresAnalyzed: 5,
        completeFeatures: 3,
        incompleteFeatures: 2,
      },
    },
  },
  summary: {
    totalGaps: 4,
    gapsBySeverity: {
      critical: 1,
      high: 2,
      medium: 1,
      low: 0,
    },
    analyzerScores: {
      ComponentAnalyzer: 75,
      StructureAnalyzer: 85,
      FeatureAnalyzer: 60,
    },
    estimatedWorkRemaining: '3-5 days',
  },
  recommendations: [
    '🚨 Address 1 critical issue(s) immediately - these prevent MVP functionality',
    '  • Wrap component with ErrorBoundary or add try-catch blocks',
    '⚠️  Resolve 2 high-priority issue(s) for MVP completion',
    '📊 FeatureAnalyzer score is low (60%) - review gaps in this category',
    '🎯 Overall MVP completion is 72.5% - focus on critical and high-priority gaps to reach 80%+ threshold',
  ],
};

// Generate reports
const generator = new ReportGenerator();

console.log('='.repeat(80));
console.log('MVP VERIFIER - REPORT GENERATOR TEST');
console.log('='.repeat(80));
console.log();

// Generate and display JSON report
console.log('📄 JSON REPORT');
console.log('-'.repeat(80));
const jsonReport = generator.generateJSON(sampleReport);
console.log(jsonReport);
console.log();

// Generate and display Markdown report
console.log('📝 MARKDOWN REPORT');
console.log('-'.repeat(80));
const markdownReport = generator.generateMarkdown(sampleReport);
console.log(markdownReport);
console.log();

console.log('='.repeat(80));
console.log('✅ Report generation completed successfully!');
console.log('='.repeat(80));

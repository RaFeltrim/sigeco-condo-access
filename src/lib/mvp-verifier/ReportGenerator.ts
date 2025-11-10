/**
 * ReportGenerator - Generates verification reports in multiple formats
 * 
 * This class takes a VerificationReport and generates formatted output
 * in JSON and Markdown formats with executive summaries and recommendations.
 */

import type {
  VerificationReport,
  Gap,
  SeverityLevel,
} from '../../types/mvp-verifier';

export class ReportGenerator {
  /**
   * Generate a JSON report from verification results
   * @param report - The verification report to format
   * @returns JSON string representation of the report
   */
  generateJSON(report: VerificationReport): string {
    // Create a structured JSON report with proper formatting
    return JSON.stringify(report, null, 2);
  }

  /**
   * Generate a human-readable Markdown report
   * @param report - The verification report to format
   * @returns Markdown formatted report string
   */
  generateMarkdown(report: VerificationReport): string {
    const sections: string[] = [];

    // Header with timestamp and project path
    sections.push(this.generateHeader(report));
    
    // Executive summary with overall completion
    sections.push(this.generateExecutiveSummary(report));
    
    // Summary statistics
    sections.push(this.generateSummaryStatistics(report));
    
    // Analyzer results
    sections.push(this.generateAnalyzerResults(report));
    
    // Gaps by category
    sections.push(this.generateGapsByCategory(report));
    
    // Recommendations
    sections.push(this.generateRecommendationsSection(report));

    return sections.join('\n\n');
  }

  /**
   * Generate the report header with metadata
   * @param report - The verification report
   * @returns Markdown header section
   */
  private generateHeader(report: VerificationReport): string {
    const date = new Date(report.timestamp);
    const formattedDate = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return `# MVP Verification Report

**Project Path:** \`${report.projectPath}\`  
**Generated:** ${formattedDate}  
**Report Version:** 1.0`;
  }

  /**
   * Generate executive summary with overall MVP completion percentage
   * @param report - The verification report
   * @returns Markdown executive summary section
   */
  private generateExecutiveSummary(report: VerificationReport): string {
    const { overallScore, summary } = report;
    const { totalGaps, gapsBySeverity } = summary;

    // Determine status emoji and message
    let statusEmoji = '✅';
    let statusMessage = 'MVP Ready';
    
    if (overallScore < 50) {
      statusEmoji = '🔴';
      statusMessage = 'Significant Work Required';
    } else if (overallScore < 70) {
      statusEmoji = '🟡';
      statusMessage = 'Moderate Work Required';
    } else if (overallScore < 80) {
      statusEmoji = '🟢';
      statusMessage = 'Near MVP Completion';
    }

    return `## Executive Summary

${statusEmoji} **Status:** ${statusMessage}  
**Overall MVP Completion:** ${overallScore.toFixed(1)}%

### Key Metrics

- **Total Issues Found:** ${totalGaps}
- **Critical Issues:** ${gapsBySeverity.critical} 🔴
- **High Priority:** ${gapsBySeverity.high} 🟠
- **Medium Priority:** ${gapsBySeverity.medium} 🟡
- **Low Priority:** ${gapsBySeverity.low} ⚪

**Estimated Work Remaining:** ${summary.estimatedWorkRemaining}`;
  }

  /**
   * Generate summary statistics section
   * @param report - The verification report
   * @returns Markdown summary statistics section
   */
  private generateSummaryStatistics(report: VerificationReport): string {
    const { summary } = report;
    const { analyzerScores } = summary;

    const lines: string[] = ['## Analyzer Scores', ''];
    
    // Create a table of analyzer scores
    lines.push('| Analyzer | Score | Status |');
    lines.push('|----------|-------|--------|');

    Object.entries(analyzerScores).forEach(([name, score]) => {
      const statusBar = this.generateScoreBar(score);
      const status = score >= 80 ? '✅' : score >= 50 ? '⚠️' : '❌';
      lines.push(`| ${name} | ${score.toFixed(1)}% | ${status} ${statusBar} |`);
    });

    return lines.join('\n');
  }

  /**
   * Generate a visual score bar
   * @param score - Score from 0-100
   * @returns Visual representation of the score
   */
  private generateScoreBar(score: number): string {
    const filled = Math.round(score / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  /**
   * Generate analyzer results section
   * @param report - The verification report
   * @returns Markdown analyzer results section
   */
  private generateAnalyzerResults(report: VerificationReport): string {
    const lines: string[] = ['## Analyzer Results', ''];

    Object.entries(report.analyzerResults).forEach(([name, result]) => {
      lines.push(`### ${name}`);
      lines.push('');
      lines.push(`**Score:** ${result.score.toFixed(1)}%  `);
      lines.push(`**Execution Time:** ${result.executionTime}ms  `);
      lines.push(`**Issues Found:** ${result.gaps.length}`);
      
      // Include metadata if present
      if (Object.keys(result.metadata).length > 0 && !result.metadata.failed) {
        lines.push('');
        lines.push('**Metadata:**');
        Object.entries(result.metadata).forEach(([key, value]) => {
          lines.push(`- ${key}: ${JSON.stringify(value)}`);
        });
      }
      
      lines.push('');
    });

    return lines.join('\n');
  }

  /**
   * Generate gaps organized by category with severity badges
   * @param report - The verification report
   * @returns Markdown gaps by category section
   */
  private generateGapsByCategory(report: VerificationReport): string {
    const lines: string[] = ['## Issues by Category', ''];

    // Collect all gaps from all analyzers
    const allGaps: Gap[] = [];
    Object.values(report.analyzerResults).forEach(result => {
      allGaps.push(...result.gaps);
    });

    if (allGaps.length === 0) {
      lines.push('🎉 **No issues found!** Your MVP is in great shape.');
      return lines.join('\n');
    }

    // Group gaps by category
    const gapsByCategory = this.groupGapsByCategory(allGaps);

    // Sort categories by severity (most severe first)
    const sortedCategories = Object.entries(gapsByCategory).sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const maxSeverityA = Math.min(...a[1].map(g => severityOrder[g.severity]));
      const maxSeverityB = Math.min(...b[1].map(g => severityOrder[g.severity]));
      return maxSeverityA - maxSeverityB;
    });

    sortedCategories.forEach(([category, gaps]) => {
      lines.push(`### ${this.formatCategoryName(category)}`);
      lines.push('');
      lines.push(`**Total Issues:** ${gaps.length}`);
      lines.push('');

      // Sort gaps by severity within category
      const sortedGaps = this.sortGapsBySeverity(gaps);

      sortedGaps.forEach(gap => {
        const badge = this.getSeverityBadge(gap.severity);
        lines.push(`#### ${badge} ${gap.description}`);
        lines.push('');
        lines.push(`**Recommendation:** ${gap.recommendation}`);
        
        if (gap.affectedFiles && gap.affectedFiles.length > 0) {
          lines.push('');
          lines.push('**Affected Files:**');
          gap.affectedFiles.slice(0, 5).forEach(file => {
            lines.push(`- \`${file}\``);
          });
          if (gap.affectedFiles.length > 5) {
            lines.push(`- *...and ${gap.affectedFiles.length - 5} more*`);
          }
        }
        
        if (gap.estimatedEffort) {
          lines.push('');
          lines.push(`**Estimated Effort:** ${gap.estimatedEffort}`);
        }
        
        lines.push('');
      });
    });

    return lines.join('\n');
  }

  /**
   * Generate recommendations section
   * @param report - The verification report
   * @returns Markdown recommendations section
   */
  private generateRecommendationsSection(report: VerificationReport): string {
    const lines: string[] = ['## Recommendations', ''];

    if (report.recommendations.length === 0) {
      lines.push('No specific recommendations at this time.');
      return lines.join('\n');
    }

    report.recommendations.forEach(recommendation => {
      lines.push(`${recommendation}`);
      lines.push('');
    });

    return lines.join('\n');
  }

  /**
   * Group gaps by category
   * @param gaps - Array of gaps to group
   * @returns Object mapping category to gaps
   */
  private groupGapsByCategory(gaps: Gap[]): Record<string, Gap[]> {
    const grouped: Record<string, Gap[]> = {};

    gaps.forEach(gap => {
      if (!grouped[gap.category]) {
        grouped[gap.category] = [];
      }
      grouped[gap.category].push(gap);
    });

    return grouped;
  }

  /**
   * Sort gaps by severity (critical first)
   * @param gaps - Array of gaps to sort
   * @returns Sorted array of gaps
   */
  private sortGapsBySeverity(gaps: Gap[]): Gap[] {
    const severityOrder: Record<SeverityLevel, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };

    return [...gaps].sort((a, b) => {
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  /**
   * Get severity badge for markdown
   * @param severity - The severity level
   * @returns Emoji badge for the severity
   */
  private getSeverityBadge(severity: SeverityLevel): string {
    const badges: Record<SeverityLevel, string> = {
      critical: '🔴 CRITICAL',
      high: '🟠 HIGH',
      medium: '🟡 MEDIUM',
      low: '⚪ LOW',
    };

    return badges[severity];
  }

  /**
   * Format category name for display
   * @param category - The category string
   * @returns Formatted category name
   */
  private formatCategoryName(category: string): string {
    // Convert kebab-case or snake_case to Title Case
    return category
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

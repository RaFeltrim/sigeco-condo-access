/**
 * VerificationEngine - Orchestrates all analyzers and aggregates results
 * 
 * This class manages the execution of multiple analyzers in parallel,
 * handles errors gracefully, and generates a comprehensive verification report.
 */

import type {
  Analyzer,
  AnalyzerResult,
  VerificationReport,
  ReportSummary,
  SeverityLevel,
} from '../../types/mvp-verifier';

export class VerificationEngine {
  private analyzers: Analyzer[] = [];
  private projectPath: string;

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
  }

  /**
   * Register an analyzer to be executed during verification
   * @param analyzer - The analyzer instance to register
   */
  registerAnalyzer(analyzer: Analyzer): void {
    if (!analyzer || !analyzer.name || typeof analyzer.analyze !== 'function') {
      throw new Error('Invalid analyzer: must have name and analyze() method');
    }
    
    // Prevent duplicate analyzers with the same name
    if (this.analyzers.some(a => a.name === analyzer.name)) {
      throw new Error(`Analyzer with name "${analyzer.name}" is already registered`);
    }
    
    this.analyzers.push(analyzer);
  }

  /**
   * Execute all registered analyzers in parallel and generate a verification report
   * Continues execution even if individual analyzers fail
   * @returns Complete verification report with all analysis results
   */
  async analyze(): Promise<VerificationReport> {
    if (this.analyzers.length === 0) {
      throw new Error('No analyzers registered. Register at least one analyzer before calling analyze()');
    }

    const timestamp = new Date().toISOString();
    const analyzerResults: Record<string, AnalyzerResult> = {};

    // Execute all analyzers in parallel with error handling
    const results = await Promise.allSettled(
      this.analyzers.map(analyzer => this.executeAnalyzer(analyzer))
    );

    // Process results and handle failures gracefully
    results.forEach((result, index) => {
      const analyzer = this.analyzers[index];
      
      if (result.status === 'fulfilled') {
        analyzerResults[analyzer.name] = result.value;
      } else {
        // Log the error but continue with other analyzers
        console.error(`Analyzer "${analyzer.name}" failed:`, result.reason);
        
        // Create a failed result entry
        analyzerResults[analyzer.name] = {
          analyzerName: analyzer.name,
          score: 0,
          executionTime: 0,
          gaps: [
            {
              id: `${analyzer.name.toLowerCase()}-failure`,
              severity: 'critical',
              category: 'analyzer-error',
              description: `Analyzer "${analyzer.name}" failed to execute`,
              recommendation: `Check the analyzer implementation and logs for details: ${result.reason.message}`,
            },
          ],
          metadata: {
            error: result.reason.message,
            failed: true,
          },
        };
      }
    });

    // Calculate overall score and generate summary
    const overallScore = this.getCompletionScore(analyzerResults);
    const summary = this.generateSummary(analyzerResults);
    const recommendations = this.generateRecommendations(analyzerResults);

    return {
      timestamp,
      projectPath: this.projectPath,
      overallScore,
      analyzerResults,
      summary,
      recommendations,
    };
  }

  /**
   * Execute a single analyzer with timing
   * @param analyzer - The analyzer to execute
   * @returns The analyzer result
   */
  private async executeAnalyzer(analyzer: Analyzer): Promise<AnalyzerResult> {
    const startTime = Date.now();
    const result = await analyzer.analyze();
    const executionTime = Date.now() - startTime;
    
    // Ensure the result has the correct execution time
    return {
      ...result,
      executionTime,
    };
  }

  /**
   * Calculate overall completion score from all analyzer results
   * @param analyzerResults - Results from all analyzers
   * @returns Overall score (0-100)
   */
  getCompletionScore(analyzerResults?: Record<string, AnalyzerResult>): number {
    const results = analyzerResults || {};
    const scores = Object.values(results)
      .filter(result => !result.metadata.failed) // Exclude failed analyzers
      .map(result => result.score);

    if (scores.length === 0) {
      return 0;
    }

    // Calculate average score across all successful analyzers
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const averageScore = totalScore / scores.length;

    // Round to 2 decimal places
    return Math.round(averageScore * 100) / 100;
  }

  /**
   * Generate summary statistics from analyzer results
   * @param analyzerResults - Results from all analyzers
   * @returns Report summary with gap statistics
   */
  private generateSummary(analyzerResults: Record<string, AnalyzerResult>): ReportSummary {
    const allGaps = Object.values(analyzerResults).flatMap(result => result.gaps);
    
    const gapsBySeverity: Record<SeverityLevel, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    allGaps.forEach(gap => {
      gapsBySeverity[gap.severity]++;
    });

    const analyzerScores: Record<string, number> = {};
    Object.entries(analyzerResults).forEach(([name, result]) => {
      analyzerScores[name] = result.score;
    });

    // Estimate work remaining based on gap severity
    const estimatedWorkRemaining = this.estimateWorkRemaining(gapsBySeverity);

    return {
      totalGaps: allGaps.length,
      gapsBySeverity,
      analyzerScores,
      estimatedWorkRemaining,
    };
  }

  /**
   * Estimate remaining work based on gap severity distribution
   * @param gapsBySeverity - Count of gaps by severity level
   * @returns Human-readable estimate
   */
  private estimateWorkRemaining(gapsBySeverity: Record<SeverityLevel, number>): string {
    const { critical, high, medium, low } = gapsBySeverity;
    
    // Weighted calculation: critical=4, high=2, medium=1, low=0.5
    const totalWeight = (critical * 4) + (high * 2) + (medium * 1) + (low * 0.5);
    
    if (totalWeight === 0) return 'No work remaining';
    if (totalWeight < 5) return '1-2 days';
    if (totalWeight < 15) return '3-5 days';
    if (totalWeight < 30) return '1-2 weeks';
    if (totalWeight < 60) return '2-4 weeks';
    return '1+ months';
  }

  /**
   * Generate actionable recommendations based on analyzer results
   * @param analyzerResults - Results from all analyzers
   * @returns Array of recommendation strings
   */
  private generateRecommendations(analyzerResults: Record<string, AnalyzerResult>): string[] {
    const recommendations: string[] = [];
    const allGaps = Object.values(analyzerResults).flatMap(result => result.gaps);

    // Group gaps by severity
    const criticalGaps = allGaps.filter(g => g.severity === 'critical');
    const highGaps = allGaps.filter(g => g.severity === 'high');

    // Priority recommendations for critical issues
    if (criticalGaps.length > 0) {
      recommendations.push(
        `🚨 Address ${criticalGaps.length} critical issue(s) immediately - these prevent MVP functionality`
      );
      
      // Add specific critical recommendations
      criticalGaps.slice(0, 3).forEach(gap => {
        recommendations.push(`  • ${gap.recommendation}`);
      });
    }

    // High priority recommendations
    if (highGaps.length > 0) {
      recommendations.push(
        `⚠️  Resolve ${highGaps.length} high-priority issue(s) for MVP completion`
      );
    }

    // Analyzer-specific recommendations
    Object.values(analyzerResults).forEach(result => {
      if (result.score < 50 && !result.metadata.failed) {
        recommendations.push(
          `📊 ${result.analyzerName} score is low (${result.score}%) - review gaps in this category`
        );
      }
    });

    // Overall progress recommendation
    const overallScore = this.getCompletionScore(analyzerResults);
    if (overallScore < 80) {
      recommendations.push(
        `🎯 Overall MVP completion is ${overallScore}% - focus on critical and high-priority gaps to reach 80%+ threshold`
      );
    } else {
      recommendations.push(
        `✅ MVP is ${overallScore}% complete - address remaining gaps for production readiness`
      );
    }

    return recommendations;
  }

  /**
   * Get the list of registered analyzers
   * @returns Array of registered analyzer names
   */
  getRegisteredAnalyzers(): string[] {
    return this.analyzers.map(a => a.name);
  }

  /**
   * Clear all registered analyzers
   */
  clearAnalyzers(): void {
    this.analyzers = [];
  }
}

#!/usr/bin/env tsx
/**
 * MVP Verifier CLI
 * 
 * Command-line interface for running the MVP verification system.
 * Analyzes the SIGECO project structure, components, features, quality, and dependencies.
 * 
 * Usage:
 *   npm run verify:mvp
 *   npm run verify:mvp -- --output-dir ./reports
 *   npm run verify:mvp -- --format json --fail-threshold 90
 *   npm run verify:mvp -- --verbose
 */

import * as fs from 'fs';
import * as path from 'path';
import { VerificationEngine } from '../src/lib/mvp-verifier/VerificationEngine';
import { ReportGenerator } from '../src/lib/mvp-verifier/ReportGenerator';
import { ComponentAnalyzer } from '../src/lib/mvp-verifier/analyzers/ComponentAnalyzer';
import { StructureAnalyzer } from '../src/lib/mvp-verifier/analyzers/StructureAnalyzer';
import { FeatureAnalyzer } from '../src/lib/mvp-verifier/analyzers/FeatureAnalyzer';
import { QualityAnalyzer } from '../src/lib/mvp-verifier/analyzers/QualityAnalyzer';
import { DependencyAnalyzer } from '../src/lib/mvp-verifier/analyzers/DependencyAnalyzer';
import type { VerificationReport } from '../src/types/mvp-verifier';

interface CLIOptions {
  outputDir: string;
  format: 'json' | 'markdown' | 'both';
  verbose: boolean;
  failThreshold: number;
}

class MVPVerifierCLI {
  private options: CLIOptions;
  private projectPath: string;

  constructor(options: CLIOptions) {
    this.options = options;
    this.projectPath = process.cwd();
  }

  /**
   * Main entry point for the CLI
   * @returns Exit code (0 for success, 1 for failure)
   */
  async run(): Promise<number> {
    try {
      console.log('🔍 MVP Verifier - Starting Analysis...\n');
      
      if (this.options.verbose) {
        console.log(`Project Path: ${this.projectPath}`);
        console.log(`Output Directory: ${this.options.outputDir}`);
        console.log(`Format: ${this.options.format}`);
        console.log(`Fail Threshold: ${this.options.failThreshold}%\n`);
      }

      // Step 1: Initialize Verification Engine
      const engine = new VerificationEngine(this.projectPath);

      // Step 2: Register all analyzers
      this.registerAnalyzers(engine);

      // Step 3: Run analysis with progress indicators
      const report = await this.runAnalysisWithProgress(engine);

      // Step 4: Generate and save reports
      await this.generateReports(report);

      // Step 5: Display summary
      this.displaySummary(report);

      // Step 6: Determine exit code based on threshold
      const exitCode = this.determineExitCode(report);

      if (exitCode === 0) {
        console.log(`\n✅ MVP verification passed! (${report.overallScore.toFixed(1)}% >= ${this.options.failThreshold}%)`);
      } else {
        console.log(`\n❌ MVP verification failed. (${report.overallScore.toFixed(1)}% < ${this.options.failThreshold}%)`);
      }

      return exitCode;

    } catch (error) {
      this.handleError(error);
      return 1;
    }
  }

  /**
   * Register all available analyzers with the engine
   */
  private registerAnalyzers(engine: VerificationEngine): void {
    if (this.options.verbose) {
      console.log('📋 Registering analyzers...');
    }

    const analyzers = [
      new ComponentAnalyzer(this.projectPath),
      new StructureAnalyzer(this.projectPath),
      new FeatureAnalyzer(this.projectPath),
      new QualityAnalyzer(this.projectPath),
      new DependencyAnalyzer(this.projectPath),
    ];

    analyzers.forEach(analyzer => {
      engine.registerAnalyzer(analyzer);
      if (this.options.verbose) {
        console.log(`  ✓ ${analyzer.name}`);
      }
    });

    console.log(`\n✓ Registered ${analyzers.length} analyzers\n`);
  }

  /**
   * Run analysis with progress indicators
   */
  private async runAnalysisWithProgress(engine: VerificationEngine): Promise<VerificationReport> {
    const analyzers = engine.getRegisteredAnalyzers();
    const totalAnalyzers = analyzers.length;

    console.log('🔄 Running analysis...\n');

    // Create a promise that tracks progress
    const analysisPromise = engine.analyze();

    // Show progress for each analyzer
    let completed = 0;
    const progressInterval = setInterval(() => {
      if (completed < totalAnalyzers) {
        const progress = Math.min(((completed + 0.5) / totalAnalyzers) * 100, 99);
        this.displayProgress('Analysis', progress);
      }
    }, 500);

    try {
      const report = await analysisPromise;
      completed = totalAnalyzers;
      clearInterval(progressInterval);
      this.displayProgress('Analysis', 100);
      console.log('\n');
      
      return report;
    } catch (error) {
      clearInterval(progressInterval);
      throw error;
    }
  }

  /**
   * Display progress indicator
   */
  private displayProgress(label: string, progress: number): void {
    const barLength = 30;
    const filled = Math.round((progress / 100) * barLength);
    const empty = barLength - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    
    process.stdout.write(`\r${label}: [${bar}] ${progress.toFixed(0)}%`);
  }

  /**
   * Generate and save reports in requested formats
   */
  private async generateReports(report: VerificationReport): Promise<void> {
    console.log('📝 Generating reports...\n');

    // Ensure output directory exists
    const outputDir = path.resolve(this.projectPath, this.options.outputDir);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      if (this.options.verbose) {
        console.log(`  Created output directory: ${outputDir}`);
      }
    }

    const generator = new ReportGenerator();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];

    // Generate JSON report
    if (this.options.format === 'json' || this.options.format === 'both') {
      const jsonPath = path.join(outputDir, `mvp-verification-${timestamp}.json`);
      const jsonContent = generator.generateJSON(report);
      fs.writeFileSync(jsonPath, jsonContent, 'utf-8');
      console.log(`  ✓ JSON report: ${jsonPath}`);

      // Create symlink for latest
      const latestJsonPath = path.join(outputDir, 'mvp-verification-latest.json');
      this.createSymlink(jsonPath, latestJsonPath);
    }

    // Generate Markdown report
    if (this.options.format === 'markdown' || this.options.format === 'both') {
      const mdPath = path.join(outputDir, `mvp-verification-${timestamp}.md`);
      const mdContent = generator.generateMarkdown(report);
      fs.writeFileSync(mdPath, mdContent, 'utf-8');
      console.log(`  ✓ Markdown report: ${mdPath}`);

      // Create symlink for latest
      const latestMdPath = path.join(outputDir, 'mvp-verification-latest.md');
      this.createSymlink(mdPath, latestMdPath);
    }

    console.log('');
  }

  /**
   * Create a symlink (or copy on Windows if symlink fails)
   */
  private createSymlink(target: string, linkPath: string): void {
    try {
      // Remove existing symlink/file if it exists
      if (fs.existsSync(linkPath)) {
        fs.unlinkSync(linkPath);
      }

      // Try to create symlink
      fs.symlinkSync(path.basename(target), linkPath);
      
      if (this.options.verbose) {
        console.log(`    → Created symlink: ${linkPath}`);
      }
    } catch (error) {
      // On Windows, symlinks may require admin privileges, so fall back to copy
      try {
        fs.copyFileSync(target, linkPath);
        if (this.options.verbose) {
          console.log(`    → Created copy (symlink unavailable): ${linkPath}`);
        }
      } catch (copyError) {
        if (this.options.verbose) {
          console.warn(`    ⚠ Could not create symlink or copy: ${linkPath}`);
        }
      }
    }
  }

  /**
   * Display summary table with key metrics
   */
  private displaySummary(report: VerificationReport): void {
    console.log('📊 Summary\n');
    console.log('═'.repeat(60));
    
    // Overall score
    const scoreEmoji = report.overallScore >= 80 ? '✅' : report.overallScore >= 50 ? '⚠️' : '❌';
    console.log(`${scoreEmoji} Overall MVP Completion: ${report.overallScore.toFixed(1)}%`);
    console.log('═'.repeat(60));
    
    // Analyzer scores
    console.log('\nAnalyzer Scores:');
    console.log('─'.repeat(60));
    Object.entries(report.summary.analyzerScores).forEach(([name, score]) => {
      const status = score >= 80 ? '✅' : score >= 50 ? '⚠️' : '❌';
      const bar = this.generateScoreBar(score);
      console.log(`${status} ${name.padEnd(25)} ${score.toFixed(1).padStart(5)}% ${bar}`);
    });
    
    // Gap summary
    console.log('\n' + '─'.repeat(60));
    console.log('Issues Found:');
    console.log('─'.repeat(60));
    const { gapsBySeverity, totalGaps } = report.summary;
    console.log(`🔴 Critical: ${gapsBySeverity.critical.toString().padStart(3)}`);
    console.log(`🟠 High:     ${gapsBySeverity.high.toString().padStart(3)}`);
    console.log(`🟡 Medium:   ${gapsBySeverity.medium.toString().padStart(3)}`);
    console.log(`⚪ Low:      ${gapsBySeverity.low.toString().padStart(3)}`);
    console.log('─'.repeat(60));
    console.log(`Total Issues: ${totalGaps}`);
    
    // Estimated work
    console.log('\n' + '─'.repeat(60));
    console.log(`⏱️  Estimated Work Remaining: ${report.summary.estimatedWorkRemaining}`);
    console.log('═'.repeat(60));

    // Top recommendations
    if (report.recommendations.length > 0) {
      console.log('\n💡 Top Recommendations:\n');
      report.recommendations.slice(0, 5).forEach(rec => {
        console.log(`   ${rec}`);
      });
    }
  }

  /**
   * Generate a visual score bar
   */
  private generateScoreBar(score: number): string {
    const barLength = 10;
    const filled = Math.round((score / 100) * barLength);
    const empty = barLength - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  /**
   * Determine exit code based on completion threshold
   */
  private determineExitCode(report: VerificationReport): number {
    return report.overallScore >= this.options.failThreshold ? 0 : 1;
  }

  /**
   * Handle errors gracefully with user-friendly messages
   */
  private handleError(error: unknown): void {
    console.error('\n❌ Error during MVP verification:\n');
    
    if (error instanceof Error) {
      console.error(`   ${error.message}\n`);
      
      if (this.options.verbose && error.stack) {
        console.error('Stack trace:');
        console.error(error.stack);
      }
    } else {
      console.error(`   ${String(error)}\n`);
    }

    console.error('Please check the error message above and try again.');
    console.error('Use --verbose flag for more detailed error information.\n');
  }
}

/**
 * Parse command line arguments
 */
function parseArguments(): CLIOptions {
  const args = process.argv.slice(2);
  
  const options: CLIOptions = {
    outputDir: '.kiro/reports',
    format: 'both',
    verbose: false,
    failThreshold: 80,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--output-dir':
        options.outputDir = args[++i];
        break;
      case '--format': {
        const format = args[++i];
        if (format === 'json' || format === 'markdown' || format === 'both') {
          options.format = format;
        } else {
          console.error(`Invalid format: ${format}. Must be 'json', 'markdown', or 'both'.`);
          process.exit(1);
        }
        break;
      }
      case '--verbose':
        options.verbose = true;
        break;
      case '--fail-threshold': {
        const threshold = parseInt(args[++i], 10);
        if (isNaN(threshold) || threshold < 0 || threshold > 100) {
          console.error(`Invalid fail-threshold: ${args[i]}. Must be a number between 0 and 100.`);
          process.exit(1);
        }
        options.failThreshold = threshold;
        break;
      }
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      default:
        console.error(`Unknown argument: ${arg}`);
        console.error('Use --help for usage information.');
        process.exit(1);
    }
  }

  return options;
}

/**
 * Print help message
 */
function printHelp(): void {
  console.log(`
MVP Verifier CLI

Usage:
  npm run verify:mvp [options]

Options:
  --output-dir <path>       Output directory for reports (default: .kiro/reports)
  --format <format>         Report format: json, markdown, or both (default: both)
  --verbose                 Enable verbose output
  --fail-threshold <number> Minimum completion percentage to pass (default: 80)
  --help, -h                Show this help message

Examples:
  npm run verify:mvp
  npm run verify:mvp -- --output-dir ./reports
  npm run verify:mvp -- --format json --fail-threshold 90
  npm run verify:mvp -- --verbose
  `);
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  const options = parseArguments();
  const cli = new MVPVerifierCLI(options);
  const exitCode = await cli.run();
  process.exit(exitCode);
}

// Run the CLI
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

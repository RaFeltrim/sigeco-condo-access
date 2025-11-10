/**
 * QualityAnalyzer - Analyzes code quality and conformance to standards
 * 
 * This analyzer verifies:
 * - TypeScript type errors
 * - Naming conventions (PascalCase for components, camelCase for utilities)
 * - Error handling in page components
 * - Loading states in page components
 * - Accessibility attributes in interactive components
 * - Test coverage
 */

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import type { Analyzer, AnalyzerResult, Gap } from '../../../types/mvp-verifier';

interface QualityMetrics {
  typeErrors: number;
  namingConventionViolations: string[];
  missingErrorHandling: string[];
  missingLoadingStates: string[];
  accessibilityIssues: string[];
  testCoverage: number;
  componentsWithTests: number;
  totalComponents: number;
}

export class QualityAnalyzer implements Analyzer {
  name = 'QualityAnalyzer';
  private projectPath: string;
  private program: ts.Program | null = null;

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
  }

  /**
   * Main analysis method - checks code quality
   */
  async analyze(): Promise<AnalyzerResult> {
    const gaps: Gap[] = [];
    const metrics: QualityMetrics = {
      typeErrors: 0,
      namingConventionViolations: [],
      missingErrorHandling: [],
      missingLoadingStates: [],
      accessibilityIssues: [],
      testCoverage: 0,
      componentsWithTests: 0,
      totalComponents: 0,
    };

    try {
      // Step 1: Check TypeScript type errors
      metrics.typeErrors = await this.checkTypeErrors();
      this.generateTypeErrorGaps(metrics.typeErrors, gaps);

      // Step 2: Validate naming conventions
      metrics.namingConventionViolations = await this.validateNamingConventions();
      this.generateNamingConventionGaps(metrics.namingConventionViolations, gaps);

      // Step 3: Check error handling in pages
      metrics.missingErrorHandling = await this.checkErrorHandling();
      this.generateErrorHandlingGaps(metrics.missingErrorHandling, gaps);

      // Step 4: Check loading states in pages
      metrics.missingLoadingStates = await this.checkLoadingStates();
      this.generateLoadingStateGaps(metrics.missingLoadingStates, gaps);

      // Step 5: Check accessibility in interactive components
      metrics.accessibilityIssues = await this.checkAccessibility();
      this.generateAccessibilityGaps(metrics.accessibilityIssues, gaps);

      // Step 6: Calculate test coverage
      const testCoverageResult = await this.calculateTestCoverage();
      metrics.testCoverage = testCoverageResult.coverage;
      metrics.componentsWithTests = testCoverageResult.componentsWithTests;
      metrics.totalComponents = testCoverageResult.totalComponents;
      this.generateTestCoverageGaps(metrics.testCoverage, testCoverageResult.componentsWithoutTests, gaps);

      // Calculate overall score
      const score = this.calculateScore(metrics);

      return {
        analyzerName: this.name,
        score,
        executionTime: 0, // Will be set by VerificationEngine
        gaps,
        metadata: {
          typeErrors: metrics.typeErrors,
          namingConventionViolations: metrics.namingConventionViolations.length,
          missingErrorHandling: metrics.missingErrorHandling.length,
          missingLoadingStates: metrics.missingLoadingStates.length,
          accessibilityIssues: metrics.accessibilityIssues.length,
          testCoverage: metrics.testCoverage,
          componentsWithTests: metrics.componentsWithTests,
          totalComponents: metrics.totalComponents,
        },
      };
    } catch (error) {
      throw new Error(`QualityAnalyzer failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Check for TypeScript type errors using the TypeScript Compiler API
   */
  private async checkTypeErrors(): Promise<number> {
    try {
      // Find tsconfig.json
      const tsconfigPath = ts.findConfigFile(
        this.projectPath,
        ts.sys.fileExists,
        'tsconfig.json'
      );

      if (!tsconfigPath) {
        console.warn('tsconfig.json not found, skipping type error check');
        return 0;
      }

      // Read and parse tsconfig.json
      const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
      if (configFile.error) {
        console.warn('Error reading tsconfig.json:', configFile.error.messageText);
        return 0;
      }

      const parsedConfig = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        path.dirname(tsconfigPath)
      );

      // Create TypeScript program
      this.program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);

      // Get pre-emit diagnostics (type errors, etc.)
      const diagnostics = ts.getPreEmitDiagnostics(this.program);

      // Filter out diagnostics from node_modules
      const relevantDiagnostics = diagnostics.filter(diagnostic => {
        if (diagnostic.file) {
          const fileName = diagnostic.file.fileName;
          return !fileName.includes('node_modules');
        }
        return true;
      });

      return relevantDiagnostics.length;
    } catch (error) {
      console.error('Error checking type errors:', error);
      return 0;
    }
  }

  /**
   * Validate naming conventions across the codebase
   * - Components should be PascalCase
   * - Utilities should be camelCase
   */
  private async validateNamingConventions(): Promise<string[]> {
    const violations: string[] = [];

    // Check component files
    const componentsDir = path.join(this.projectPath, 'src', 'components');
    if (fs.existsSync(componentsDir)) {
      const componentViolations = this.checkNamingInDirectory(
        componentsDir,
        'component',
        /^[A-Z][a-zA-Z0-9]*\.tsx?$/
      );
      violations.push(...componentViolations);
    }

    // Check utility files (lib, utils)
    const libDir = path.join(this.projectPath, 'src', 'lib');
    if (fs.existsSync(libDir)) {
      const libViolations = this.checkNamingInDirectory(
        libDir,
        'utility',
        /^[a-z][a-zA-Z0-9]*\.ts$/
      );
      violations.push(...libViolations);
    }

    const utilsDir = path.join(this.projectPath, 'src', 'utils');
    if (fs.existsSync(utilsDir)) {
      const utilsViolations = this.checkNamingInDirectory(
        utilsDir,
        'utility',
        /^[a-z][a-zA-Z0-9]*\.ts$/
      );
      violations.push(...utilsViolations);
    }

    return violations;
  }

  /**
   * Check naming conventions in a directory
   */
  private checkNamingInDirectory(
    dir: string,
    type: 'component' | 'utility',
    pattern: RegExp
  ): string[] {
    const violations: string[] = [];

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Skip test directories and node_modules
          if (entry.name === '__tests__' || entry.name === 'node_modules' || entry.name === 'ui') {
            continue;
          }
          // Recursively check subdirectories
          violations.push(...this.checkNamingInDirectory(fullPath, type, pattern));
        } else if (entry.isFile()) {
          // Check if file matches the expected pattern
          const isTypeScriptFile = entry.name.endsWith('.ts') || entry.name.endsWith('.tsx');
          
          if (isTypeScriptFile && !pattern.test(entry.name)) {
            // Exclude index files and test files
            if (!entry.name.startsWith('index.') && !entry.name.includes('.test.') && !entry.name.includes('.spec.')) {
              const relativePath = path.relative(this.projectPath, fullPath);
              violations.push(`${relativePath} (${type} should follow ${type === 'component' ? 'PascalCase' : 'camelCase'})`);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error checking naming in ${dir}:`, error);
    }

    return violations;
  }

  /**
   * Check that all page components have proper error handling
   * Looks for try-catch blocks or ErrorBoundary usage
   */
  private async checkErrorHandling(): Promise<string[]> {
    const pagesDir = path.join(this.projectPath, 'src', 'pages');
    const missingErrorHandling: string[] = [];

    if (!fs.existsSync(pagesDir)) {
      return missingErrorHandling;
    }

    const pageFiles = this.findFiles(pagesDir, /\.(tsx|jsx)$/);

    for (const filePath of pageFiles) {
      const hasErrorHandling = this.checkFileForErrorHandling(filePath);
      
      if (!hasErrorHandling) {
        const relativePath = path.relative(this.projectPath, filePath);
        missingErrorHandling.push(relativePath);
      }
    }

    return missingErrorHandling;
  }

  /**
   * Check if a file has error handling (try-catch or ErrorBoundary)
   */
  private checkFileForErrorHandling(filePath: string): boolean {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Check for try-catch blocks
      const hasTryCatch = /try\s*{[\s\S]*?}\s*catch/.test(content);

      // Check for ErrorBoundary usage
      const hasErrorBoundary = content.includes('ErrorBoundary') ||
                               content.includes('componentDidCatch') ||
                               content.includes('getDerivedStateFromError');

      // Check for error handling in hooks (useEffect with error handling)
      const hasErrorHandlingInHooks = /catch\s*\(.*error.*\)/i.test(content);

      return hasTryCatch || hasErrorBoundary || hasErrorHandlingInHooks;
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return false;
    }
  }

  /**
   * Check that all page components have loading states
   * Looks for loading state variables and conditional rendering
   */
  private async checkLoadingStates(): Promise<string[]> {
    const pagesDir = path.join(this.projectPath, 'src', 'pages');
    const missingLoadingStates: string[] = [];

    if (!fs.existsSync(pagesDir)) {
      return missingLoadingStates;
    }

    const pageFiles = this.findFiles(pagesDir, /\.(tsx|jsx)$/);

    for (const filePath of pageFiles) {
      const hasLoadingState = this.checkFileForLoadingState(filePath);
      
      if (!hasLoadingState) {
        const relativePath = path.relative(this.projectPath, filePath);
        missingLoadingStates.push(relativePath);
      }
    }

    return missingLoadingStates;
  }

  /**
   * Check if a file has loading state implementation
   */
  private checkFileForLoadingState(filePath: string): boolean {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Check for loading state variables
      const hasLoadingState = /(?:const|let|var)\s*\[?\s*\w*[Ll]oading\w*\s*[,\]]/.test(content) ||
                             /(?:const|let|var)\s+\w*[Ll]oading\w*\s*=/.test(content) ||
                             /isLoading|loading|isPending/.test(content);

      // Check for loading conditional rendering
      const hasLoadingRender = /{?\s*(?:isLoading|loading|isPending)\s*&&/.test(content) ||
                              /if\s*\(\s*(?:isLoading|loading|isPending)\s*\)/.test(content) ||
                              /\?\s*<.*[Ll]oading/.test(content);

      // Check for Suspense usage (React 18 loading pattern)
      const hasSuspense = content.includes('Suspense');

      return (hasLoadingState && hasLoadingRender) || hasSuspense;
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return false;
    }
  }

  /**
   * Recursively find files matching a pattern
   */
  private findFiles(dir: string, pattern: RegExp): string[] {
    const files: string[] = [];

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Skip test directories and node_modules
          if (entry.name === '__tests__' || entry.name === 'node_modules') {
            continue;
          }
          files.push(...this.findFiles(fullPath, pattern));
        } else if (entry.isFile() && pattern.test(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dir}:`, error);
    }

    return files;
  }

  /**
   * Generate gaps for type errors
   */
  private generateTypeErrorGaps(typeErrors: number, gaps: Gap[]): void {
    if (typeErrors > 0) {
      const severity: 'critical' | 'high' | 'medium' = 
        typeErrors > 50 ? 'critical' : typeErrors > 20 ? 'high' : 'medium';

      gaps.push({
        id: 'quality-type-errors',
        severity,
        category: 'quality',
        description: `Found ${typeErrors} TypeScript type error(s) in the codebase`,
        recommendation: 'Run "npm run type-check" or "tsc --noEmit" to see detailed type errors and fix them',
        affectedFiles: [],
        estimatedEffort: typeErrors > 50 ? 'high' : typeErrors > 20 ? 'medium' : 'low',
      });
    }
  }

  /**
   * Generate gaps for naming convention violations
   */
  private generateNamingConventionGaps(violations: string[], gaps: Gap[]): void {
    if (violations.length > 0) {
      gaps.push({
        id: 'quality-naming-conventions',
        severity: 'low',
        category: 'quality',
        description: `Found ${violations.length} naming convention violation(s)`,
        recommendation: 'Rename files to follow conventions: PascalCase for components, camelCase for utilities',
        affectedFiles: violations,
        estimatedEffort: 'low',
      });
    }
  }

  /**
   * Generate gaps for missing error handling
   */
  private generateErrorHandlingGaps(missingErrorHandling: string[], gaps: Gap[]): void {
    if (missingErrorHandling.length > 0) {
      gaps.push({
        id: 'quality-missing-error-handling',
        severity: 'high',
        category: 'quality',
        description: `${missingErrorHandling.length} page component(s) lack proper error handling`,
        recommendation: 'Add try-catch blocks or wrap components with ErrorBoundary to handle errors gracefully',
        affectedFiles: missingErrorHandling,
        estimatedEffort: 'medium',
      });
    }
  }

  /**
   * Generate gaps for missing loading states
   */
  private generateLoadingStateGaps(missingLoadingStates: string[], gaps: Gap[]): void {
    if (missingLoadingStates.length > 0) {
      gaps.push({
        id: 'quality-missing-loading-states',
        severity: 'medium',
        category: 'quality',
        description: `${missingLoadingStates.length} page component(s) lack loading states`,
        recommendation: 'Add loading state variables and conditional rendering to improve user experience during data fetching',
        affectedFiles: missingLoadingStates,
        estimatedEffort: 'medium',
      });
    }
  }

  /**
   * Check accessibility in interactive components
   * Scans components for required accessibility attributes
   */
  private async checkAccessibility(): Promise<string[]> {
    const componentsDir = path.join(this.projectPath, 'src', 'components');
    const accessibilityIssues: string[] = [];

    if (!fs.existsSync(componentsDir)) {
      return accessibilityIssues;
    }

    const componentFiles = this.findFiles(componentsDir, /\.(tsx|jsx)$/);

    for (const filePath of componentFiles) {
      const issues = this.checkFileForAccessibilityIssues(filePath);
      
      if (issues.length > 0) {
        const relativePath = path.relative(this.projectPath, filePath);
        accessibilityIssues.push(`${relativePath}: ${issues.join(', ')}`);
      }
    }

    return accessibilityIssues;
  }

  /**
   * Check a file for accessibility issues
   */
  private checkFileForAccessibilityIssues(filePath: string): string[] {
    const issues: string[] = [];

    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Check for buttons without accessible labels
      const buttonMatches = content.match(/<button[^>]*>/gi);
      if (buttonMatches) {
        for (const match of buttonMatches) {
          const hasAriaLabel = /aria-label=/.test(match);
          const hasAriaLabelledBy = /aria-labelledby=/.test(match);
          const hasTextContent = match.includes('>') && !match.includes('/>');
          
          if (!hasAriaLabel && !hasAriaLabelledBy && !hasTextContent) {
            issues.push('button without accessible label');
          }
        }
      }

      // Check for inputs without labels
      const inputMatches = content.match(/<input[^>]*>/gi);
      if (inputMatches) {
        for (const match of inputMatches) {
          const hasAriaLabel = /aria-label=/.test(match);
          const hasAriaLabelledBy = /aria-labelledby=/.test(match);
          const hasId = /id=/.test(match);
          
          if (!hasAriaLabel && !hasAriaLabelledBy && !hasId) {
            issues.push('input without label or aria-label');
          }
        }
      }

      // Check for images without alt text
      const imgMatches = content.match(/<img[^>]*>/gi);
      if (imgMatches) {
        for (const match of imgMatches) {
          if (!match.includes('alt=')) {
            issues.push('img without alt text');
          }
        }
      }

      // Check for clickable divs/spans without proper accessibility
      const clickableDivs = content.match(/<(div|span)[^>]*onClick[^>]*>/gi);
      if (clickableDivs) {
        for (const match of clickableDivs) {
          const hasRole = /role=["']button["']/.test(match);
          const hasTabIndex = /tabIndex=/.test(match);
          
          if (!hasRole || !hasTabIndex) {
            issues.push('clickable div/span without role="button" and tabIndex');
          }
        }
      }

      // Check for interactive elements with aria-hidden
      const ariaHiddenInteractive = content.match(/<(button|input|select|textarea|a)[^>]*aria-hidden=["']true["'][^>]*>/gi);
      if (ariaHiddenInteractive && ariaHiddenInteractive.length > 0) {
        issues.push('interactive elements with aria-hidden="true"');
      }

      // Check for missing form labels
      const hasInputs = /<input/i.test(content);
      const hasLabels = /<Label[^>]*htmlFor=/i.test(content) || /<label[^>]*for=/i.test(content);
      
      if (hasInputs && !hasLabels) {
        const inputCount = (content.match(/<input/gi) || []).length;
        const labelCount = (content.match(/<Label[^>]*htmlFor=|<label[^>]*for=/gi) || []).length;
        
        if (inputCount > labelCount) {
          issues.push('inputs without corresponding labels');
        }
      }
    } catch (error) {
      console.error(`Error checking accessibility in ${filePath}:`, error);
    }

    return issues;
  }

  /**
   * Calculate test coverage - percentage of components with tests
   */
  private async calculateTestCoverage(): Promise<{
    coverage: number;
    componentsWithTests: number;
    totalComponents: number;
    componentsWithoutTests: string[];
  }> {
    const componentsDir = path.join(this.projectPath, 'src', 'components');
    const testsDir = path.join(this.projectPath, 'tests');

    if (!fs.existsSync(componentsDir)) {
      return { coverage: 0, componentsWithTests: 0, totalComponents: 0, componentsWithoutTests: [] };
    }

    // Get all component files
    const componentFiles = this.findFiles(componentsDir, /\.(tsx|jsx)$/);
    const totalComponents = componentFiles.length;

    if (totalComponents === 0) {
      return { coverage: 100, componentsWithTests: 0, totalComponents: 0, componentsWithoutTests: [] };
    }

    // Get all test files
    const testFiles = fs.existsSync(testsDir) 
      ? this.findFiles(testsDir, /\.(test|spec)\.(tsx?|jsx?)$/)
      : [];

    // Extract component names from test files
    const testedComponents = new Set<string>();
    for (const testFile of testFiles) {
      const testFileName = path.basename(testFile);
      // Extract component name from test file name
      // e.g., "VisitorForm.test.tsx" -> "VisitorForm"
      const componentName = testFileName
        .replace(/\.(test|spec)\.(tsx?|jsx?)$/, '')
        .replace(/\.tsx?$/, '')
        .replace(/\.jsx?$/, '');
      
      testedComponents.add(componentName);
    }

    // Check which components have tests
    let componentsWithTests = 0;
    const componentsWithoutTests: string[] = [];

    for (const componentFile of componentFiles) {
      const componentFileName = path.basename(componentFile, path.extname(componentFile));
      
      if (testedComponents.has(componentFileName)) {
        componentsWithTests++;
      } else {
        const relativePath = path.relative(this.projectPath, componentFile);
        componentsWithoutTests.push(relativePath);
      }
    }

    const coverage = (componentsWithTests / totalComponents) * 100;

    return {
      coverage: Math.round(coverage),
      componentsWithTests,
      totalComponents,
      componentsWithoutTests,
    };
  }

  /**
   * Generate gaps for accessibility issues
   */
  private generateAccessibilityGaps(accessibilityIssues: string[], gaps: Gap[]): void {
    if (accessibilityIssues.length > 0) {
      gaps.push({
        id: 'quality-accessibility-issues',
        severity: 'high',
        category: 'quality',
        description: `Found accessibility issues in ${accessibilityIssues.length} component(s)`,
        recommendation: 'Add proper aria-labels, alt text for images, and ensure interactive elements are keyboard accessible',
        affectedFiles: accessibilityIssues.map(issue => issue.split(':')[0]),
        estimatedEffort: 'medium',
      });
    }
  }

  /**
   * Generate gaps for test coverage
   */
  private generateTestCoverageGaps(
    coverage: number,
    componentsWithoutTests: string[],
    gaps: Gap[]
  ): void {
    if (coverage < 80 && componentsWithoutTests.length > 0) {
      const severity: 'high' | 'medium' | 'low' = 
        coverage < 30 ? 'high' : coverage < 60 ? 'medium' : 'low';

      gaps.push({
        id: 'quality-low-test-coverage',
        severity,
        category: 'quality',
        description: `Test coverage is ${coverage}%. ${componentsWithoutTests.length} component(s) lack tests`,
        recommendation: 'Create test files in tests/ directory for components without tests',
        affectedFiles: componentsWithoutTests.slice(0, 10), // Limit to first 10 to avoid overwhelming
        estimatedEffort: componentsWithoutTests.length > 20 ? 'high' : componentsWithoutTests.length > 10 ? 'medium' : 'low',
      });
    }
  }

  /**
   * Calculate overall quality score
   */
  private calculateScore(metrics: QualityMetrics): number {
    let score = 100;

    // Deduct points for type errors (critical)
    if (metrics.typeErrors > 0) {
      const typeErrorPenalty = Math.min(40, metrics.typeErrors * 0.5);
      score -= typeErrorPenalty;
    }

    // Deduct points for naming convention violations (minor)
    score -= Math.min(10, metrics.namingConventionViolations.length * 0.5);

    // Deduct points for missing error handling (important)
    score -= Math.min(25, metrics.missingErrorHandling.length * 5);

    // Deduct points for missing loading states (moderate)
    score -= Math.min(15, metrics.missingLoadingStates.length * 3);

    // Deduct points for accessibility issues (important)
    score -= Math.min(10, metrics.accessibilityIssues.length * 2);

    // Deduct points for low test coverage
    const testCoveragePenalty = (100 - metrics.testCoverage) * 0.1;
    score -= Math.min(10, testCoveragePenalty);

    return Math.max(0, Math.round(score));
  }
}

/**
 * ComponentAnalyzer - Analyzes React components for completeness and quality
 * 
 * This analyzer scans all React component files in src/components/ and checks:
 * - Props interfaces and validation
 * - Error boundary usage
 * - Import validation
 * - Accessibility attributes
 * - Component completeness score
 */

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import type { Analyzer, AnalyzerResult, Gap } from '../../../types/mvp-verifier';

interface ComponentAnalysis {
  componentName: string;
  filePath: string;
  hasPropsInterface: boolean;
  hasPropValidation: boolean;
  hasErrorBoundary: boolean;
  accessibilityScore: number;
  missingDependencies: string[];
  unusedImports: string[];
  completenessScore: number;
}

export class ComponentAnalyzer implements Analyzer {
  name = 'ComponentAnalyzer';
  private projectPath: string;
  private componentsPath: string;
  private componentFiles: string[] = [];
  private allComponentNames: Set<string> = new Set();

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
    this.componentsPath = path.join(projectPath, 'src', 'components');
  }

  /**
   * Main analysis method - scans all components and generates report
   */
  async analyze(): Promise<AnalyzerResult> {
    const gaps: Gap[] = [];
    const componentAnalyses: ComponentAnalysis[] = [];

    try {
      // Step 1: Find all React component files
      this.componentFiles = this.findComponentFiles(this.componentsPath);
      
      // Step 2: Build a set of all component names for import validation
      this.buildComponentNameSet();

      // Step 3: Analyze each component
      for (const filePath of this.componentFiles) {
        try {
          const analysis = await this.analyzeComponent(filePath);
          componentAnalyses.push(analysis);
          
          // Generate gaps based on analysis
          this.generateGapsForComponent(analysis, gaps);
        } catch (error) {
          // Log error but continue with other components
          console.error(`Failed to analyze component ${filePath}:`, error);
          gaps.push({
            id: `component-parse-error-${path.basename(filePath)}`,
            severity: 'medium',
            category: 'component',
            description: `Failed to parse component file: ${path.relative(this.projectPath, filePath)}`,
            recommendation: 'Check for syntax errors in the component file',
            affectedFiles: [path.relative(this.projectPath, filePath)],
          });
        }
      }

      // Calculate overall score
      const score = this.calculateOverallScore(componentAnalyses);

      return {
        analyzerName: this.name,
        score,
        executionTime: 0, // Will be set by VerificationEngine
        gaps,
        metadata: {
          totalComponents: componentAnalyses.length,
          averageCompleteness: score,
          componentsAnalyzed: componentAnalyses.map(c => ({
            name: c.componentName,
            score: c.completenessScore,
          })),
        },
      };
    } catch (error) {
      throw new Error(`ComponentAnalyzer failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Recursively find all React component files (.tsx, .jsx)
   */
  private findComponentFiles(dir: string): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) {
      return files;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip test directories and node_modules
        if (entry.name === '__tests__' || entry.name === 'node_modules') {
          continue;
        }
        files.push(...this.findComponentFiles(fullPath));
      } else if (entry.isFile()) {
        // Include .tsx and .jsx files
        if (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) {
          files.push(fullPath);
        }
      }
    }

    return files;
  }

  /**
   * Build a set of all component names for import validation
   */
  private buildComponentNameSet(): void {
    for (const filePath of this.componentFiles) {
      const fileName = path.basename(filePath, path.extname(filePath));
      
      // Extract component names from file
      const sourceCode = fs.readFileSync(filePath, 'utf-8');
      const componentNames = this.extractComponentNames(sourceCode);
      
      componentNames.forEach(name => this.allComponentNames.add(name));
    }
  }

  /**
   * Extract component names from source code using regex
   */
  private extractComponentNames(sourceCode: string): string[] {
    const names: string[] = [];
    
    // Match: export function ComponentName, export const ComponentName, export class ComponentName
    const exportRegex = /export\s+(?:function|const|class)\s+([A-Z][a-zA-Z0-9]*)/g;
    let match;
    
    while ((match = exportRegex.exec(sourceCode)) !== null) {
      names.push(match[1]);
    }
    
    return names;
  }

  /**
   * Analyze a single component file
   */
  private async analyzeComponent(filePath: string): Promise<ComponentAnalysis> {
    const sourceCode = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    );

    const componentName = this.extractPrimaryComponentName(sourceFile, filePath);
    const hasPropsInterface = this.checkPropsInterface(sourceFile);
    const hasPropValidation = this.checkPropValidation(sourceFile);
    const hasErrorBoundary = this.checkErrorBoundaryUsage(sourceCode);
    const accessibilityScore = this.calculateAccessibilityScore(sourceCode);
    const { missingDependencies, unusedImports } = this.validateImports(sourceFile, sourceCode);

    // Calculate completeness score based on criteria
    const completenessScore = this.calculateCompletenessScore({
      hasPropsInterface,
      hasPropValidation,
      hasErrorBoundary,
      accessibilityScore,
      missingDependencies: missingDependencies.length,
      unusedImports: unusedImports.length,
    });

    return {
      componentName,
      filePath,
      hasPropsInterface,
      hasPropValidation,
      hasErrorBoundary,
      accessibilityScore,
      missingDependencies,
      unusedImports,
      completenessScore,
    };
  }

  /**
   * Extract the primary component name from the file
   */
  private extractPrimaryComponentName(sourceFile: ts.SourceFile, filePath: string): string {
    let componentName = path.basename(filePath, path.extname(filePath));

    // Try to find exported function/const/class component
    const visit = (node: ts.Node) => {
      if (ts.isFunctionDeclaration(node) && node.name) {
        if (node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
          const name = node.name.text;
          if (name[0] === name[0].toUpperCase()) {
            componentName = name;
          }
        }
      } else if (ts.isVariableStatement(node)) {
        if (node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
          node.declarationList.declarations.forEach(decl => {
            if (ts.isIdentifier(decl.name)) {
              const name = decl.name.text;
              if (name[0] === name[0].toUpperCase()) {
                componentName = name;
              }
            }
          });
        }
      } else if (ts.isClassDeclaration(node) && node.name) {
        if (node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
          componentName = node.name.text;
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return componentName;
  }

  /**
   * Check if component has a props interface defined
   */
  private checkPropsInterface(sourceFile: ts.SourceFile): boolean {
    let hasPropsInterface = false;

    const visit = (node: ts.Node) => {
      // Check for interface declarations ending with "Props"
      if (ts.isInterfaceDeclaration(node)) {
        if (node.name.text.endsWith('Props')) {
          hasPropsInterface = true;
        }
      }
      
      // Check for type alias declarations ending with "Props"
      if (ts.isTypeAliasDeclaration(node)) {
        if (node.name.text.endsWith('Props')) {
          hasPropsInterface = true;
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return hasPropsInterface;
  }

  /**
   * Check if component has prop validation (TypeScript types or PropTypes)
   */
  private checkPropValidation(sourceFile: ts.SourceFile): boolean {
    // For TypeScript, having a props interface/type is sufficient validation
    return this.checkPropsInterface(sourceFile);
  }

  /**
   * Check if component uses ErrorBoundary
   */
  private checkErrorBoundaryUsage(sourceCode: string): boolean {
    // Check if ErrorBoundary is imported and used
    return sourceCode.includes('ErrorBoundary') || 
           sourceCode.includes('componentDidCatch') ||
           sourceCode.includes('getDerivedStateFromError');
  }

  /**
   * Calculate accessibility score based on ARIA attributes and semantic HTML
   */
  private calculateAccessibilityScore(sourceCode: string): number {
    let score = 100;
    const issues: string[] = [];

    // Check for interactive elements without proper accessibility attributes
    const interactiveElements = [
      { 
        pattern: /<button[^>]*>/gi, 
        name: 'button',
        requiredAttrs: ['aria-label', 'aria-labelledby', 'children'],
        penalty: 3
      },
      { 
        pattern: /<input[^>]*>/gi, 
        name: 'input',
        requiredAttrs: ['aria-label', 'aria-labelledby', 'id'],
        penalty: 5
      },
      { 
        pattern: /<select[^>]*>/gi, 
        name: 'select',
        requiredAttrs: ['aria-label', 'aria-labelledby', 'id'],
        penalty: 5
      },
      { 
        pattern: /<textarea[^>]*>/gi, 
        name: 'textarea',
        requiredAttrs: ['aria-label', 'aria-labelledby', 'id'],
        penalty: 5
      },
    ];

    for (const element of interactiveElements) {
      const matches = sourceCode.match(element.pattern);
      if (matches) {
        for (const match of matches) {
          // Check if element has any of the required accessibility attributes
          const hasAriaLabel = /aria-label=/.test(match);
          const hasAriaLabelledBy = /aria-labelledby=/.test(match);
          const hasId = /id=/.test(match);
          
          // For buttons, check if they have text content (children)
          const isButton = element.name === 'button';
          const hasTextContent = isButton && (
            match.includes('>') && !match.includes('/>')
          );
          
          // Element needs at least one accessibility attribute
          const hasAccessibility = hasAriaLabel || hasAriaLabelledBy || (hasId && element.name !== 'button') || hasTextContent;
          
          if (!hasAccessibility) {
            score -= element.penalty;
            issues.push(`${element.name} without accessibility attributes`);
          }
        }
      }
    }

    // Check for images without alt text
    const imgMatches = sourceCode.match(/<img[^>]*>/gi);
    if (imgMatches) {
      for (const match of imgMatches) {
        if (!match.includes('alt=')) {
          score -= 5;
          issues.push('img without alt text');
        }
      }
    }

    // Check for clickable divs/spans (should use button instead)
    const clickableDivs = sourceCode.match(/<(div|span)[^>]*onClick[^>]*>/gi);
    if (clickableDivs && clickableDivs.length > 0) {
      // Check if they have role="button" and proper keyboard handling
      for (const match of clickableDivs) {
        const hasRole = /role=["']button["']/.test(match);
        const hasKeyboard = /onKeyDown|onKeyPress|onKeyUp/.test(match);
        
        if (!hasRole || !hasKeyboard) {
          score -= 4;
          issues.push('clickable div/span without proper accessibility');
        }
      }
    }

    // Check for proper heading hierarchy (h1, h2, h3, etc.)
    const headings = sourceCode.match(/<h[1-6][^>]*>/gi);
    if (headings && headings.length > 0) {
      // Bonus points for using semantic headings
      score += Math.min(5, headings.length);
    }

    // Check for aria-hidden on interactive elements (anti-pattern)
    const ariaHiddenInteractive = sourceCode.match(/<(button|input|select|textarea|a)[^>]*aria-hidden=["']true["'][^>]*>/gi);
    if (ariaHiddenInteractive && ariaHiddenInteractive.length > 0) {
      score -= 10 * ariaHiddenInteractive.length;
      issues.push('interactive elements with aria-hidden');
    }

    // Check for proper form labels
    const labelMatches = sourceCode.match(/<Label[^>]*htmlFor=/gi);
    if (labelMatches && labelMatches.length > 0) {
      // Bonus points for using proper labels
      score += Math.min(5, labelMatches.length);
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Validate imports - check for missing dependencies and unused imports
   */
  private validateImports(sourceFile: ts.SourceFile, sourceCode: string): {
    missingDependencies: string[];
    unusedImports: string[];
  } {
    const missingDependencies: string[] = [];
    const unusedImports: string[] = [];
    const importedComponents: Map<string, { module: string; isDefault: boolean }> = new Map();
    const allImports: Map<string, { module: string; isDefault: boolean }> = new Map();

    // Extract all imports
    const visit = (node: ts.Node) => {
      if (ts.isImportDeclaration(node)) {
        const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;
        
        // Handle named imports
        if (node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings)) {
          node.importClause.namedBindings.elements.forEach(element => {
            const importName = element.name.text;
            allImports.set(importName, { module: moduleSpecifier, isDefault: false });
            
            // Check if importing from components directory
            if (moduleSpecifier.includes('/components/') || moduleSpecifier.startsWith('@/components/')) {
              importedComponents.set(importName, { module: moduleSpecifier, isDefault: false });
              
              // Validate that imported component exists
              if (!this.allComponentNames.has(importName)) {
                // Exclude UI components (shadcn/ui) and known external components
                if (!moduleSpecifier.includes('/ui/') && 
                    !moduleSpecifier.includes('lucide-react') &&
                    !moduleSpecifier.includes('react-hook-form') &&
                    !moduleSpecifier.includes('@radix-ui')) {
                  
                  // Check if the file exists
                  const componentPath = this.resolveImportPath(moduleSpecifier, path.dirname(sourceFile.fileName));
                  if (!this.fileExists(componentPath)) {
                    missingDependencies.push(importName);
                  }
                }
              }
            }
          });
        }
        
        // Handle default imports
        if (node.importClause?.name) {
          const importName = node.importClause.name.text;
          allImports.set(importName, { module: moduleSpecifier, isDefault: true });
          
          if (moduleSpecifier.includes('/components/') || moduleSpecifier.startsWith('@/components/')) {
            importedComponents.set(importName, { module: moduleSpecifier, isDefault: true });
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    // Check for unused imports
    for (const [importName, importInfo] of allImports.entries()) {
      // Skip checking React and common hooks as they might be used implicitly
      if (importName === 'React' || importName === 'useState' || importName === 'useEffect' || 
          importName === 'useCallback' || importName === 'useMemo' || importName === 'useRef') {
        continue;
      }
      
      // Create a regex that matches the import name as a whole word
      // Exclude the import statement itself
      const importStatementRegex = new RegExp(`import\\s+.*${importName}.*from`, 'g');
      const codeWithoutImports = sourceCode.replace(importStatementRegex, '');
      
      // Check if the import is used in the code
      const usageRegex = new RegExp(`\\b${importName}\\b`, 'g');
      const matches = codeWithoutImports.match(usageRegex);
      
      // If not found or found very few times, it might be unused
      if (!matches || matches.length === 0) {
        // Only report component imports as unused
        if (importedComponents.has(importName)) {
          unusedImports.push(importName);
        }
      }
    }

    return { missingDependencies, unusedImports };
  }

  /**
   * Resolve import path to absolute file path
   */
  private resolveImportPath(moduleSpecifier: string, fromDir: string): string {
    // Handle @ alias (maps to src/)
    if (moduleSpecifier.startsWith('@/')) {
      moduleSpecifier = moduleSpecifier.replace('@/', 'src/');
    }
    
    // Handle relative imports
    const resolvedPath = path.resolve(fromDir, moduleSpecifier);
    
    // Try different extensions
    const extensions = ['.tsx', '.ts', '.jsx', '.js'];
    for (const ext of extensions) {
      const pathWithExt = resolvedPath + ext;
      if (fs.existsSync(pathWithExt)) {
        return pathWithExt;
      }
    }
    
    // Try index files
    for (const ext of extensions) {
      const indexPath = path.join(resolvedPath, `index${ext}`);
      if (fs.existsSync(indexPath)) {
        return indexPath;
      }
    }
    
    return resolvedPath;
  }

  /**
   * Check if a file exists
   */
  private fileExists(filePath: string): boolean {
    try {
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  }

  /**
   * Calculate component completeness score (0-100)
   */
  private calculateCompletenessScore(criteria: {
    hasPropsInterface: boolean;
    hasPropValidation: boolean;
    hasErrorBoundary: boolean;
    accessibilityScore: number;
    missingDependencies: number;
    unusedImports: number;
  }): number {
    let score = 0;

    // Props interface: 25 points
    if (criteria.hasPropsInterface) score += 25;

    // Prop validation: 20 points
    if (criteria.hasPropValidation) score += 20;

    // Error boundary: 15 points
    if (criteria.hasErrorBoundary) score += 15;

    // Accessibility: 30 points (scaled from 0-100)
    score += (criteria.accessibilityScore / 100) * 30;

    // No missing dependencies: 5 points
    if (criteria.missingDependencies === 0) score += 5;

    // No unused imports: 5 points
    if (criteria.unusedImports === 0) score += 5;

    return Math.round(score);
  }

  /**
   * Generate gaps for a component based on its analysis
   */
  private generateGapsForComponent(analysis: ComponentAnalysis, gaps: Gap[]): void {
    const relativeFilePath = path.relative(this.projectPath, analysis.filePath);

    // Missing props interface
    if (!analysis.hasPropsInterface) {
      gaps.push({
        id: `component-no-props-${analysis.componentName}`,
        severity: 'medium',
        category: 'component',
        description: `Component "${analysis.componentName}" does not have a props interface defined`,
        recommendation: `Define a TypeScript interface for props (e.g., ${analysis.componentName}Props)`,
        affectedFiles: [relativeFilePath],
        estimatedEffort: 'low',
      });
    }

    // Missing error boundary
    if (!analysis.hasErrorBoundary) {
      gaps.push({
        id: `component-no-error-boundary-${analysis.componentName}`,
        severity: 'low',
        category: 'component',
        description: `Component "${analysis.componentName}" does not use ErrorBoundary`,
        recommendation: 'Wrap component with ErrorBoundary for better error handling',
        affectedFiles: [relativeFilePath],
        estimatedEffort: 'low',
      });
    }

    // Low accessibility score
    if (analysis.accessibilityScore < 70) {
      gaps.push({
        id: `component-low-accessibility-${analysis.componentName}`,
        severity: 'high',
        category: 'component',
        description: `Component "${analysis.componentName}" has low accessibility score (${analysis.accessibilityScore}%)`,
        recommendation: 'Add aria-label, aria-labelledby, or proper semantic HTML to interactive elements',
        affectedFiles: [relativeFilePath],
        estimatedEffort: 'medium',
      });
    }

    // Missing dependencies
    if (analysis.missingDependencies.length > 0) {
      gaps.push({
        id: `component-missing-deps-${analysis.componentName}`,
        severity: 'critical',
        category: 'component',
        description: `Component "${analysis.componentName}" imports non-existent components: ${analysis.missingDependencies.join(', ')}`,
        recommendation: 'Create the missing components or remove the imports',
        affectedFiles: [relativeFilePath],
        estimatedEffort: 'high',
      });
    }

    // Unused imports
    if (analysis.unusedImports.length > 0) {
      gaps.push({
        id: `component-unused-imports-${analysis.componentName}`,
        severity: 'low',
        category: 'component',
        description: `Component "${analysis.componentName}" has unused imports: ${analysis.unusedImports.join(', ')}`,
        recommendation: 'Remove unused imports to keep the code clean',
        affectedFiles: [relativeFilePath],
        estimatedEffort: 'low',
      });
    }
  }

  /**
   * Calculate overall score from all component analyses
   */
  private calculateOverallScore(analyses: ComponentAnalysis[]): number {
    if (analyses.length === 0) {
      return 0;
    }

    const totalScore = analyses.reduce((sum, analysis) => sum + analysis.completenessScore, 0);
    return Math.round(totalScore / analyses.length);
  }
}

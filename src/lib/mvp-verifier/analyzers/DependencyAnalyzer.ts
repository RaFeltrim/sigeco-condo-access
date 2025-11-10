/**
 * DependencyAnalyzer - Analyzes project dependencies for missing and unused packages
 * 
 * This analyzer:
 * - Parses package.json to extract all dependencies and devDependencies
 * - Scans all TypeScript/JavaScript files to find import statements
 * - Identifies packages imported in code but not declared in package.json
 * - Identifies packages declared in package.json but never imported
 * - Flags critical missing dependencies
 * - Provides list of unused dependencies that could reduce bundle size
 */

import * as fs from 'fs';
import * as path from 'path';
import type { Analyzer, AnalyzerResult, Gap } from '../../../types/mvp-verifier';

interface DependencyAnalysis {
  declaredDependencies: Set<string>;
  declaredDevDependencies: Set<string>;
  importedPackages: Set<string>;
  missingDependencies: string[];
  unusedDependencies: string[];
  criticalMissing: string[];
  potentiallyRemovable: string[];
}

export class DependencyAnalyzer implements Analyzer {
  name = 'DependencyAnalyzer';
  private projectPath: string;
  private packageJsonPath: string;

  // Critical dependencies that would break the application if missing
  private readonly CRITICAL_DEPENDENCIES = [
    'react',
    'react-dom',
    'react-router-dom',
    '@tanstack/react-query',
  ];

  // Packages that are commonly used but not directly imported
  private readonly IMPLICIT_DEPENDENCIES = [
    'typescript',
    'vite',
    'tailwindcss',
    'postcss',
    'autoprefixer',
    '@vitejs/plugin-react-swc',
    '@types/react',
    '@types/react-dom',
    '@types/node',
  ];

  // Node.js built-in modules that don't need to be in package.json
  private readonly BUILTIN_MODULES = [
    'fs',
    'path',
    'os',
    'util',
    'events',
    'stream',
    'buffer',
    'crypto',
    'http',
    'https',
    'url',
    'querystring',
    'zlib',
    'child_process',
    'cluster',
    'net',
    'dns',
    'tls',
    'readline',
    'repl',
    'vm',
    'assert',
    'constants',
    'module',
    'process',
    'timers',
    'string_decoder',
    'punycode',
    'domain',
    'tty',
    'dgram',
    'v8',
    'perf_hooks',
    'async_hooks',
    'worker_threads',
  ];

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
    this.packageJsonPath = path.join(projectPath, 'package.json');
  }

  /**
   * Main analysis method - analyzes dependencies and generates report
   */
  async analyze(): Promise<AnalyzerResult> {
    const startTime = Date.now();
    const gaps: Gap[] = [];

    try {
      // Step 1: Parse package.json
      const { dependencies, devDependencies } = this.parsePackageJson();

      // Step 2: Scan all source files for imports
      const importedPackages = await this.scanImports();

      // Step 3: Identify missing dependencies
      const missingDependencies = this.identifyMissingDependencies(
        dependencies,
        devDependencies,
        importedPackages
      );

      // Step 4: Identify unused dependencies
      const unusedDependencies = this.identifyUnusedDependencies(
        dependencies,
        devDependencies,
        importedPackages
      );

      // Step 5: Identify critical missing dependencies
      const criticalMissing = this.identifyCritical(missingDependencies);

      // Step 6: Identify potentially removable dependencies
      const potentiallyRemovable = this.identifyPotentiallyRemovable(unusedDependencies);

      // Generate gaps
      this.generateGaps(
        gaps,
        missingDependencies,
        unusedDependencies,
        criticalMissing,
        potentiallyRemovable
      );

      // Calculate score
      const score = this.calculateScore(
        missingDependencies.length,
        unusedDependencies.length,
        criticalMissing.length
      );

      const executionTime = Date.now() - startTime;

      return {
        analyzerName: this.name,
        score,
        executionTime,
        gaps,
        metadata: {
          totalDeclaredDependencies: dependencies.size + devDependencies.size,
          totalImportedPackages: importedPackages.size,
          missingDependencies: Array.from(missingDependencies),
          unusedDependencies: Array.from(unusedDependencies),
          criticalMissing: Array.from(criticalMissing),
          potentiallyRemovable: Array.from(potentiallyRemovable),
        },
      };
    } catch (error) {
      throw new Error(`DependencyAnalyzer failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Parse package.json to extract dependencies and devDependencies
   */
  private parsePackageJson(): {
    dependencies: Set<string>;
    devDependencies: Set<string>;
  } {
    if (!fs.existsSync(this.packageJsonPath)) {
      throw new Error('package.json not found');
    }

    const packageJsonContent = fs.readFileSync(this.packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);

    const dependencies = new Set<string>(
      Object.keys(packageJson.dependencies || {})
    );

    const devDependencies = new Set<string>(
      Object.keys(packageJson.devDependencies || {})
    );

    return { dependencies, devDependencies };
  }

  /**
   * Scan all TypeScript/JavaScript files to find import statements
   */
  private async scanImports(): Promise<Set<string>> {
    const importedPackages = new Set<string>();
    const srcPath = path.join(this.projectPath, 'src');
    const scriptsPath = path.join(this.projectPath, 'scripts');

    // Scan src directory
    if (fs.existsSync(srcPath)) {
      this.scanDirectoryForImports(srcPath, importedPackages);
    }

    // Scan scripts directory
    if (fs.existsSync(scriptsPath)) {
      this.scanDirectoryForImports(scriptsPath, importedPackages);
    }

    // Scan root config files
    this.scanRootConfigFiles(importedPackages);

    return importedPackages;
  }

  /**
   * Recursively scan directory for import statements
   */
  private scanDirectoryForImports(dir: string, importedPackages: Set<string>): void {
    if (!fs.existsSync(dir)) {
      return;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules, dist, coverage, and test directories
        if (
          entry.name === 'node_modules' ||
          entry.name === 'dist' ||
          entry.name === 'coverage' ||
          entry.name === '.git'
        ) {
          continue;
        }
        this.scanDirectoryForImports(fullPath, importedPackages);
      } else if (entry.isFile()) {
        // Process TypeScript, JavaScript, and JSX files
        if (
          entry.name.endsWith('.ts') ||
          entry.name.endsWith('.tsx') ||
          entry.name.endsWith('.js') ||
          entry.name.endsWith('.jsx')
        ) {
          this.extractImportsFromFile(fullPath, importedPackages);
        }
      }
    }
  }

  /**
   * Scan root configuration files for imports
   */
  private scanRootConfigFiles(importedPackages: Set<string>): void {
    const configFiles = [
      'vite.config.ts',
      'vite.config.js',
      'vitest.config.ts',
      'vitest.config.js',
      'tailwind.config.ts',
      'tailwind.config.js',
      'postcss.config.js',
      'eslint.config.js',
      'playwright.config.ts',
    ];

    for (const configFile of configFiles) {
      const configPath = path.join(this.projectPath, configFile);
      if (fs.existsSync(configPath)) {
        this.extractImportsFromFile(configPath, importedPackages);
      }
    }
  }

  /**
   * Extract import statements from a file
   */
  private extractImportsFromFile(filePath: string, importedPackages: Set<string>): void {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Remove comments to avoid false positives
      const contentWithoutComments = content
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*/g, ''); // Remove line comments
      
      // Match ES6 imports: import ... from 'package'
      const es6ImportRegex = /import\s+(?:type\s+)?(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"]([^'"]+)['"]/g;
      
      // Match dynamic imports: import('package')
      const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
      
      // Match require statements: require('package')
      const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

      let match;

      // Extract ES6 imports
      while ((match = es6ImportRegex.exec(contentWithoutComments)) !== null) {
        const packageName = this.extractPackageName(match[1]);
        if (packageName) {
          importedPackages.add(packageName);
        }
      }

      // Extract dynamic imports
      while ((match = dynamicImportRegex.exec(contentWithoutComments)) !== null) {
        const packageName = this.extractPackageName(match[1]);
        if (packageName) {
          importedPackages.add(packageName);
        }
      }

      // Extract require statements
      while ((match = requireRegex.exec(contentWithoutComments)) !== null) {
        const packageName = this.extractPackageName(match[1]);
        if (packageName) {
          importedPackages.add(packageName);
        }
      }
    } catch (error) {
      // Skip files that can't be read
      console.error(`Failed to read file ${filePath}:`, error);
    }
  }

  /**
   * Extract package name from import path
   * Examples:
   * - 'react' -> 'react'
   * - 'react-dom/client' -> 'react-dom'
   * - '@radix-ui/react-dialog' -> '@radix-ui/react-dialog'
   * - '@/components/Button' -> null (relative import)
   * - './utils' -> null (relative import)
   */
  private extractPackageName(importPath: string): string | null {
    // Skip relative imports
    if (importPath.startsWith('.') || importPath.startsWith('/')) {
      return null;
    }

    // Skip path aliases
    if (importPath.startsWith('@/')) {
      return null;
    }

    // Handle scoped packages (@scope/package)
    if (importPath.startsWith('@')) {
      const parts = importPath.split('/');
      if (parts.length >= 2) {
        return `${parts[0]}/${parts[1]}`;
      }
      return null;
    }

    // Handle regular packages (package or package/subpath)
    const parts = importPath.split('/');
    return parts[0];
  }

  /**
   * Identify packages imported in code but not declared in package.json
   */
  private identifyMissingDependencies(
    dependencies: Set<string>,
    devDependencies: Set<string>,
    importedPackages: Set<string>
  ): string[] {
    const missing: string[] = [];
    const allDeclared = new Set([...dependencies, ...devDependencies]);

    for (const pkg of importedPackages) {
      // Skip Node.js built-in modules
      if (this.BUILTIN_MODULES.includes(pkg)) {
        continue;
      }

      if (!allDeclared.has(pkg)) {
        missing.push(pkg);
      }
    }

    return missing.sort();
  }

  /**
   * Identify packages declared in package.json but never imported
   */
  private identifyUnusedDependencies(
    dependencies: Set<string>,
    devDependencies: Set<string>,
    importedPackages: Set<string>
  ): string[] {
    const unused: string[] = [];
    const allDeclared = new Set([...dependencies, ...devDependencies]);

    for (const pkg of allDeclared) {
      // Skip implicit dependencies that are used but not directly imported
      if (this.IMPLICIT_DEPENDENCIES.includes(pkg)) {
        continue;
      }

      // Skip packages that are commonly used without direct imports
      if (this.isImplicitlyUsed(pkg)) {
        continue;
      }

      if (!importedPackages.has(pkg)) {
        unused.push(pkg);
      }
    }

    return unused.sort();
  }

  /**
   * Check if a package is implicitly used (e.g., through plugins or configuration)
   */
  private isImplicitlyUsed(packageName: string): boolean {
    // Packages that are used through configuration or plugins
    const implicitPatterns = [
      /^@types\//,           // TypeScript type definitions
      /^eslint-/,            // ESLint plugins and configs
      /^@eslint\//,          // ESLint scoped packages
      /^vite-/,              // Vite plugins
      /^@vitejs\//,          // Vite official plugins
      /^tailwindcss/,        // Tailwind CSS
      /^postcss/,            // PostCSS plugins
      /^autoprefixer/,       // PostCSS autoprefixer
      /^typescript/,         // TypeScript compiler
      /^@playwright\//,      // Playwright testing
      /^@testing-library\//, // Testing library
      /^vitest/,             // Vitest testing
      /^@vitest\//,          // Vitest plugins
      /^jsdom/,              // JSDOM for testing
      /^msw/,                // Mock Service Worker
      /^jest-/,              // Jest utilities
      /^@tanstack\/eslint-/, // TanStack ESLint plugins
    ];

    return implicitPatterns.some(pattern => pattern.test(packageName));
  }

  /**
   * Identify critical missing dependencies
   */
  private identifyCritical(missingDependencies: string[]): string[] {
    return missingDependencies.filter(pkg =>
      this.CRITICAL_DEPENDENCIES.includes(pkg)
    );
  }

  /**
   * Identify potentially removable dependencies
   */
  private identifyPotentiallyRemovable(unusedDependencies: string[]): string[] {
    // Filter out dependencies that might be used indirectly
    return unusedDependencies.filter(pkg => {
      // Keep dependencies that might be peer dependencies or used by other packages
      const keepPatterns = [
        /^@radix-ui\//,  // Radix UI components might be used by shadcn/ui
        /^class-variance-authority/, // Used by shadcn/ui
        /^clsx/,         // Used by shadcn/ui
        /^tailwind-merge/, // Used by shadcn/ui
      ];

      return !keepPatterns.some(pattern => pattern.test(pkg));
    });
  }

  /**
   * Generate gaps based on dependency analysis
   */
  private generateGaps(
    gaps: Gap[],
    missingDependencies: string[],
    unusedDependencies: string[],
    criticalMissing: string[],
    potentiallyRemovable: string[]
  ): void {
    // Critical missing dependencies
    for (const pkg of criticalMissing) {
      gaps.push({
        id: `dependency-critical-missing-${pkg}`,
        severity: 'critical',
        category: 'dependency',
        description: `Critical dependency "${pkg}" is imported in code but not declared in package.json`,
        recommendation: `Run: npm install ${pkg}`,
        estimatedEffort: 'low',
      });
    }

    // Non-critical missing dependencies
    const nonCriticalMissing = missingDependencies.filter(
      pkg => !criticalMissing.includes(pkg)
    );
    for (const pkg of nonCriticalMissing) {
      gaps.push({
        id: `dependency-missing-${pkg}`,
        severity: 'high',
        category: 'dependency',
        description: `Package "${pkg}" is imported in code but not declared in package.json`,
        recommendation: `Run: npm install ${pkg}`,
        estimatedEffort: 'low',
      });
    }

    // Potentially removable unused dependencies
    if (potentiallyRemovable.length > 0) {
      gaps.push({
        id: 'dependency-unused-removable',
        severity: 'low',
        category: 'dependency',
        description: `${potentiallyRemovable.length} unused dependencies could be removed to reduce bundle size`,
        recommendation: `Consider removing: ${potentiallyRemovable.slice(0, 5).join(', ')}${potentiallyRemovable.length > 5 ? '...' : ''}`,
        estimatedEffort: 'low',
      });
    }

    // Summary gap if there are unused dependencies
    const unusedCount = unusedDependencies.length;
    if (unusedCount > 0 && unusedCount !== potentiallyRemovable.length) {
      gaps.push({
        id: 'dependency-unused-summary',
        severity: 'low',
        category: 'dependency',
        description: `${unusedCount} declared dependencies are not directly imported in the codebase`,
        recommendation: 'Review unused dependencies - some may be used indirectly or through configuration',
        estimatedEffort: 'low',
      });
    }
  }

  /**
   * Calculate dependency score (0-100)
   */
  private calculateScore(
    missingCount: number,
    unusedCount: number,
    criticalMissingCount: number
  ): number {
    let score = 100;

    // Critical missing dependencies: -30 points each
    score -= criticalMissingCount * 30;

    // Non-critical missing dependencies: -10 points each
    score -= (missingCount - criticalMissingCount) * 10;

    // Unused dependencies: -2 points each (less severe)
    score -= unusedCount * 2;

    return Math.max(0, Math.min(100, score));
  }
}

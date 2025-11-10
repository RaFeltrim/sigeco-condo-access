/**
 * StructureAnalyzer - Analyzes project structure and file organization
 * 
 * This analyzer verifies:
 * - Required directories exist (components, pages, services, hooks, types, lib)
 * - Required configuration files exist
 * - Route coverage (pages have corresponding routes)
 * - Service files have corresponding type definitions
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import type { Analyzer, AnalyzerResult, Gap } from '../../../types/mvp-verifier';

interface DirectoryStructure {
  requiredDirs: string[];
  requiredFiles: string[];
  optionalDirs: string[];
}

interface StructureAnalysis {
  missingDirectories: string[];
  missingFiles: string[];
  orphanedFiles: string[];
  routesCoverage: number;
  servicesWithoutTypes: string[];
  pagesWithoutRoutes: string[];
  definedRoutes: string[];
}

export class StructureAnalyzer implements Analyzer {
  name = 'StructureAnalyzer';
  private projectPath: string;

  // Define required project structure
  private readonly REQUIRED_STRUCTURE: DirectoryStructure = {
    requiredDirs: [
      'src/components',
      'src/pages',
      'src/services',
      'src/hooks',
      'src/types',
      'src/lib',
    ],
    requiredFiles: [
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'tailwind.config.ts',
    ],
    optionalDirs: [
      'src/utils',
      'src/assets',
      'src/styles',
      'tests',
    ],
  };

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
  }

  /**
   * Main analysis method - checks project structure
   */
  async analyze(): Promise<AnalyzerResult> {
    const gaps: Gap[] = [];
    const analysis: StructureAnalysis = {
      missingDirectories: [],
      missingFiles: [],
      orphanedFiles: [],
      routesCoverage: 0,
      servicesWithoutTypes: [],
      pagesWithoutRoutes: [],
      definedRoutes: [],
    };

    try {
      // Step 1: Check required directories
      analysis.missingDirectories = this.checkDirectories();
      this.generateDirectoryGaps(analysis.missingDirectories, gaps);

      // Step 2: Check required configuration files
      analysis.missingFiles = this.checkConfigFiles();
      this.generateConfigFileGaps(analysis.missingFiles, gaps);

      // Step 3: Validate routes coverage
      const routeValidation = await this.validateRoutes();
      analysis.routesCoverage = routeValidation.coverage;
      analysis.pagesWithoutRoutes = routeValidation.pagesWithoutRoutes;
      analysis.definedRoutes = routeValidation.definedRoutes;
      this.generateRouteCoverageGaps(analysis.routesCoverage, analysis.pagesWithoutRoutes, gaps);

      // Step 4: Check services have corresponding type definitions
      analysis.servicesWithoutTypes = await this.checkServicesTypes();
      this.generateServiceTypeGaps(analysis.servicesWithoutTypes, gaps);

      // Calculate overall score
      const score = this.calculateScore(analysis);

      return {
        analyzerName: this.name,
        score,
        executionTime: 0, // Will be set by VerificationEngine
        gaps,
        metadata: {
          missingDirectories: analysis.missingDirectories,
          missingFiles: analysis.missingFiles,
          routesCoverage: analysis.routesCoverage,
          pagesWithoutRoutes: analysis.pagesWithoutRoutes,
          definedRoutes: analysis.definedRoutes,
          servicesWithoutTypes: analysis.servicesWithoutTypes.length,
          totalDirectoriesChecked: this.REQUIRED_STRUCTURE.requiredDirs.length,
          totalFilesChecked: this.REQUIRED_STRUCTURE.requiredFiles.length,
        },
      };
    } catch (error) {
      throw new Error(`StructureAnalyzer failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Check if all required directories exist
   */
  private checkDirectories(): string[] {
    const missingDirs: string[] = [];

    for (const dir of this.REQUIRED_STRUCTURE.requiredDirs) {
      const fullPath = path.join(this.projectPath, dir);
      if (!fs.existsSync(fullPath)) {
        missingDirs.push(dir);
      }
    }

    return missingDirs;
  }

  /**
   * Check if all required configuration files exist
   */
  private checkConfigFiles(): string[] {
    const missingFiles: string[] = [];

    for (const file of this.REQUIRED_STRUCTURE.requiredFiles) {
      const fullPath = path.join(this.projectPath, file);
      if (!fs.existsSync(fullPath)) {
        missingFiles.push(file);
      }
    }

    return missingFiles;
  }

  /**
   * Validate that pages have corresponding routes in App.tsx
   * Returns detailed route validation information
   */
  private async validateRoutes(): Promise<{
    coverage: number;
    pagesWithoutRoutes: string[];
    definedRoutes: string[];
  }> {
    const pagesDir = path.join(this.projectPath, 'src', 'pages');
    const appTsxPath = path.join(this.projectPath, 'src', 'App.tsx');

    // Check if pages directory exists
    if (!fs.existsSync(pagesDir)) {
      return { coverage: 0, pagesWithoutRoutes: [], definedRoutes: [] };
    }

    // Check if App.tsx exists
    if (!fs.existsSync(appTsxPath)) {
      return { coverage: 0, pagesWithoutRoutes: [], definedRoutes: [] };
    }

    // Get all page files
    const pageFiles = fs.readdirSync(pagesDir)
      .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'))
      .map(file => path.basename(file, path.extname(file)));

    // Exclude special pages that don't need routes
    const excludedPages = ['NotFound', 'Index']; // Index is mapped to "/"
    const pagesNeedingRoutes = pageFiles.filter(page => !excludedPages.includes(page));

    if (pagesNeedingRoutes.length === 0) {
      return { coverage: 100, pagesWithoutRoutes: [], definedRoutes: [] };
    }

    // Parse App.tsx to extract routes
    const appTsxContent = fs.readFileSync(appTsxPath, 'utf-8');
    const definedRoutes = this.extractRoutes(appTsxContent);

    // Check which pages have corresponding routes
    const pagesWithoutRoutes: string[] = [];
    let pagesWithRoutes = 0;

    for (const page of pagesNeedingRoutes) {
      // Check if page is imported and used in routes
      const pageImportRegex = new RegExp(`import\\s+${page}\\s+from`, 'i');
      const pageUsageRegex = new RegExp(`<${page}\\s*/>|element={<${page}`, 'i');
      
      if (pageImportRegex.test(appTsxContent) && pageUsageRegex.test(appTsxContent)) {
        pagesWithRoutes++;
      } else {
        pagesWithoutRoutes.push(page);
      }
    }

    // Calculate coverage percentage
    const coverage = (pagesWithRoutes / pagesNeedingRoutes.length) * 100;
    
    return {
      coverage: Math.round(coverage),
      pagesWithoutRoutes,
      definedRoutes,
    };
  }

  /**
   * Extract route paths from App.tsx content
   * Parses the App.tsx file to find all defined routes
   */
  private extractRoutes(appTsxContent: string): string[] {
    const routes: string[] = [];
    
    // Match <Route path="..." pattern
    const routeRegex = /<Route\s+path=["']([^"']+)["']/g;
    let match;
    
    while ((match = routeRegex.exec(appTsxContent)) !== null) {
      routes.push(match[1]);
    }
    
    return routes;
  }

  /**
   * Check if service files have corresponding TypeScript type definitions
   */
  private async checkServicesTypes(): Promise<string[]> {
    const servicesDir = path.join(this.projectPath, 'src', 'services');
    const typesDir = path.join(this.projectPath, 'src', 'types');

    // Check if directories exist
    if (!fs.existsSync(servicesDir)) {
      return [];
    }

    if (!fs.existsSync(typesDir)) {
      // If types directory doesn't exist, all services are without types
      const serviceFiles = fs.readdirSync(servicesDir)
        .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
        .map(file => path.basename(file, path.extname(file)));
      return serviceFiles;
    }

    // Get all service files
    const serviceFiles = fs.readdirSync(servicesDir)
      .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
      .map(file => path.basename(file, path.extname(file)));

    // Get all type files
    const typeFiles = fs.readdirSync(typesDir)
      .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
      .map(file => path.basename(file, path.extname(file)));

    const servicesWithoutTypes: string[] = [];

    // Check each service for corresponding type definition
    for (const service of serviceFiles) {
      // Look for type file with similar name
      // e.g., VisitorService.ts -> visitor.ts or Visitor.ts
      const serviceName = service.replace('Service', '');
      const hasTypeFile = typeFiles.some(typeFile => {
        const typeFileName = typeFile.toLowerCase();
        const serviceNameLower = serviceName.toLowerCase();
        return typeFileName === serviceNameLower || 
               typeFileName === serviceNameLower + 's' ||
               typeFileName.includes(serviceNameLower);
      });

      // Also check if types are defined inline in the service file
      const serviceFilePath = path.join(servicesDir, `${service}.ts`);
      const hasInlineTypes = this.checkInlineTypes(serviceFilePath);

      if (!hasTypeFile && !hasInlineTypes) {
        servicesWithoutTypes.push(service);
      }
    }

    return servicesWithoutTypes;
  }

  /**
   * Check if a service file has inline type definitions
   */
  private checkInlineTypes(filePath: string): boolean {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check for interface or type declarations
    const hasInterface = /interface\s+\w+/i.test(content);
    const hasType = /type\s+\w+\s*=/i.test(content);
    
    return hasInterface || hasType;
  }

  /**
   * Generate gaps for missing directories
   */
  private generateDirectoryGaps(missingDirs: string[], gaps: Gap[]): void {
    for (const dir of missingDirs) {
      gaps.push({
        id: `structure-missing-dir-${dir.replace(/\//g, '-')}`,
        severity: 'critical',
        category: 'structure',
        description: `Required directory "${dir}" is missing`,
        recommendation: `Create the directory: mkdir -p ${dir}`,
        affectedFiles: [],
        estimatedEffort: 'low',
      });
    }
  }

  /**
   * Generate gaps for missing configuration files
   */
  private generateConfigFileGaps(missingFiles: string[], gaps: Gap[]): void {
    for (const file of missingFiles) {
      gaps.push({
        id: `structure-missing-file-${file.replace(/\./g, '-')}`,
        severity: 'critical',
        category: 'structure',
        description: `Required configuration file "${file}" is missing`,
        recommendation: `Create the configuration file: ${file}`,
        affectedFiles: [],
        estimatedEffort: file === 'package.json' ? 'high' : 'medium',
      });
    }
  }

  /**
   * Generate gaps for route coverage issues
   * Provides detailed information about pages without routes
   */
  private generateRouteCoverageGaps(coverage: number, pagesWithoutRoutes: string[], gaps: Gap[]): void {
    if (coverage < 100 && pagesWithoutRoutes.length > 0) {
      const severity: 'critical' | 'high' | 'medium' = coverage < 50 ? 'critical' : coverage < 80 ? 'high' : 'medium';
      
      gaps.push({
        id: 'structure-incomplete-routes',
        severity,
        category: 'structure',
        description: `Only ${coverage}% of pages have corresponding routes in App.tsx. Pages without routes: ${pagesWithoutRoutes.join(', ')}`,
        recommendation: `Add route definitions in App.tsx for the following pages: ${pagesWithoutRoutes.map(p => `<Route path="/${this.pageNameToPath(p)}" element={<${p} />} />`).join(', ')}`,
        affectedFiles: ['src/App.tsx', ...pagesWithoutRoutes.map(p => `src/pages/${p}.tsx`)],
        estimatedEffort: 'medium',
      });
    }
  }

  /**
   * Convert page name to URL path
   * e.g., "PorteiroDashboard" -> "porteiro-dashboard"
   */
  private pageNameToPath(pageName: string): string {
    // Convert PascalCase to kebab-case
    return pageName
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .toLowerCase()
      .replace(/page$/, ''); // Remove "Page" suffix if present
  }

  /**
   * Generate gaps for services without type definitions
   */
  private generateServiceTypeGaps(servicesWithoutTypes: string[], gaps: Gap[]): void {
    if (servicesWithoutTypes.length > 0) {
      gaps.push({
        id: 'structure-services-without-types',
        severity: 'high',
        category: 'structure',
        description: `${servicesWithoutTypes.length} service(s) do not have corresponding TypeScript type definitions: ${servicesWithoutTypes.join(', ')}`,
        recommendation: 'Create type definition files in src/types/ for each service or add inline type definitions',
        affectedFiles: servicesWithoutTypes.map(s => `src/services/${s}.ts`),
        estimatedEffort: 'medium',
      });
    }
  }

  /**
   * Calculate overall structure score
   */
  private calculateScore(analysis: StructureAnalysis): number {
    let score = 100;

    // Deduct points for missing directories (critical)
    score -= analysis.missingDirectories.length * 15;

    // Deduct points for missing config files (critical)
    score -= analysis.missingFiles.length * 15;

    // Deduct points based on route coverage
    const routeCoverageScore = analysis.routesCoverage;
    score -= (100 - routeCoverageScore) * 0.2; // Max 20 points deduction

    // Deduct points for services without types
    score -= analysis.servicesWithoutTypes.length * 5;

    return Math.max(0, Math.round(score));
  }
}

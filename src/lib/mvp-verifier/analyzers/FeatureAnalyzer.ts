/**
 * FeatureAnalyzer - Analyzes MVP feature completeness
 * 
 * This analyzer verifies:
 * - Core MVP features have required components, services, types, and pages
 * - Feature completion percentage based on required vs found files
 * - Orphaned components not linked to any feature
 * - Overall feature implementation score
 */

import * as fs from 'fs';
import * as path from 'path';
import type { Analyzer, AnalyzerResult, Gap } from '../../../types/mvp-verifier';

interface MVPFeature {
  name: string;
  requiredComponents: string[];
  requiredServices: string[];
  requiredTypes: string[];
  requiredPages: string[];
}

interface FeatureAnalysis {
  featureName: string;
  completionPercentage: number;
  missingComponents: string[];
  missingServices: string[];
  missingTypes: string[];
  missingPages: string[];
  foundComponents: string[];
  foundServices: string[];
  foundTypes: string[];
  foundPages: string[];
  isComplete: boolean; // >= 70%
}

export class FeatureAnalyzer implements Analyzer {
  name = 'FeatureAnalyzer';
  private projectPath: string;

  // Define MVP features with their required files
  private readonly MVP_FEATURES: MVPFeature[] = [
    {
      name: 'Visitor Registration',
      requiredComponents: ['VisitorForm', 'VisitorList', 'VisitorCard'],
      requiredServices: ['VisitorService'],
      requiredTypes: ['Visitor', 'VisitorFormData'],
      requiredPages: ['PorteiroDashboard'],
    },
    {
      name: 'Access Control',
      requiredComponents: ['AccessLog', 'AccessControl'],
      requiredServices: ['AccessService'],
      requiredTypes: ['AccessRecord'],
      requiredPages: ['PorteiroDashboard'],
    },
    {
      name: 'Dashboard',
      requiredComponents: ['DashboardStats', 'DashboardLayout'],
      requiredServices: [],
      requiredTypes: ['DashboardData'],
      requiredPages: ['AdminDashboard', 'PorteiroDashboard'],
    },
    {
      name: 'Reports',
      requiredComponents: ['ReportGenerator', 'ReportViewer'],
      requiredServices: ['ReportService'],
      requiredTypes: ['Report', 'ReportConfig'],
      requiredPages: ['RelatoriosPage'],
    },
    {
      name: 'User Management',
      requiredComponents: ['UserForm', 'UserList'],
      requiredServices: ['AuthService', 'UserService'],
      requiredTypes: ['User', 'UserRole'],
      requiredPages: ['Login', 'AdminDashboard'],
    },
  ];

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
  }

  /**
   * Main analysis method - analyzes all MVP features
   */
  async analyze(): Promise<AnalyzerResult> {
    const gaps: Gap[] = [];
    const featureAnalyses: FeatureAnalysis[] = [];

    try {
      // Analyze each feature
      for (const feature of this.MVP_FEATURES) {
        const analysis = await this.analyzeFeature(feature);
        featureAnalyses.push(analysis);
        
        // Generate gaps for incomplete features
        this.generateFeatureGaps(analysis, gaps);
      }

      // Find orphaned components
      const orphanedComponents = await this.findOrphanedComponents();
      if (orphanedComponents.length > 0) {
        this.generateOrphanedComponentsGap(orphanedComponents, gaps);
      }

      // Calculate overall feature score
      const score = this.calculateOverallScore(featureAnalyses);

      return {
        analyzerName: this.name,
        score,
        executionTime: 0, // Will be set by VerificationEngine
        gaps,
        metadata: {
          totalFeatures: this.MVP_FEATURES.length,
          completeFeatures: featureAnalyses.filter(f => f.isComplete).length,
          incompleteFeatures: featureAnalyses.filter(f => !f.isComplete).length,
          averageCompletion: score,
          orphanedComponents: orphanedComponents.length,
          featureDetails: featureAnalyses.map(f => ({
            name: f.featureName,
            completion: f.completionPercentage,
            isComplete: f.isComplete,
          })),
        },
      };
    } catch (error) {
      throw new Error(`FeatureAnalyzer failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Analyze a single feature to check existence of required files
   */
  private async analyzeFeature(feature: MVPFeature): Promise<FeatureAnalysis> {
    const foundComponents: string[] = [];
    const missingComponents: string[] = [];
    const foundServices: string[] = [];
    const missingServices: string[] = [];
    const foundTypes: string[] = [];
    const missingTypes: string[] = [];
    const foundPages: string[] = [];
    const missingPages: string[] = [];

    // Check components
    for (const component of feature.requiredComponents) {
      if (await this.componentExists(component)) {
        foundComponents.push(component);
      } else {
        missingComponents.push(component);
      }
    }

    // Check services
    for (const service of feature.requiredServices) {
      if (await this.serviceExists(service)) {
        foundServices.push(service);
      } else {
        missingServices.push(service);
      }
    }

    // Check types
    for (const type of feature.requiredTypes) {
      if (await this.typeExists(type)) {
        foundTypes.push(type);
      } else {
        missingTypes.push(type);
      }
    }

    // Check pages
    for (const page of feature.requiredPages) {
      if (await this.pageExists(page)) {
        foundPages.push(page);
      } else {
        missingPages.push(page);
      }
    }

    // Calculate completion percentage
    const totalRequired = 
      feature.requiredComponents.length +
      feature.requiredServices.length +
      feature.requiredTypes.length +
      feature.requiredPages.length;

    const totalFound = 
      foundComponents.length +
      foundServices.length +
      foundTypes.length +
      foundPages.length;

    const completionPercentage = totalRequired > 0 
      ? Math.round((totalFound / totalRequired) * 100)
      : 100;

    return {
      featureName: feature.name,
      completionPercentage,
      missingComponents,
      missingServices,
      missingTypes,
      missingPages,
      foundComponents,
      foundServices,
      foundTypes,
      foundPages,
      isComplete: completionPercentage >= 70,
    };
  }

  /**
   * Check if a component exists in the project
   */
  private async componentExists(componentName: string): Promise<boolean> {
    const componentsDir = path.join(this.projectPath, 'src', 'components');
    
    if (!fs.existsSync(componentsDir)) {
      return false;
    }

    // Search recursively for the component file
    return this.findFileRecursively(componentsDir, componentName, ['.tsx', '.jsx']);
  }

  /**
   * Check if a service exists in the project
   */
  private async serviceExists(serviceName: string): Promise<boolean> {
    const servicesDir = path.join(this.projectPath, 'src', 'services');
    
    if (!fs.existsSync(servicesDir)) {
      return false;
    }

    // Check for exact match or with .ts extension
    const serviceFile = path.join(servicesDir, `${serviceName}.ts`);
    return fs.existsSync(serviceFile);
  }

  /**
   * Check if a type exists in the project
   */
  private async typeExists(typeName: string): Promise<boolean> {
    const typesDir = path.join(this.projectPath, 'src', 'types');
    
    if (!fs.existsSync(typesDir)) {
      return false;
    }

    // Check in all type files
    const typeFiles = fs.readdirSync(typesDir)
      .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));

    for (const file of typeFiles) {
      const filePath = path.join(typesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Check for interface or type declaration
      const interfaceRegex = new RegExp(`interface\\s+${typeName}\\b`, 'i');
      const typeRegex = new RegExp(`type\\s+${typeName}\\s*=`, 'i');
      const exportRegex = new RegExp(`export\\s+(?:interface|type)\\s+${typeName}\\b`, 'i');
      
      if (interfaceRegex.test(content) || typeRegex.test(content) || exportRegex.test(content)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if a page exists in the project
   */
  private async pageExists(pageName: string): Promise<boolean> {
    const pagesDir = path.join(this.projectPath, 'src', 'pages');
    
    if (!fs.existsSync(pagesDir)) {
      return false;
    }

    // Check for exact match with .tsx or .jsx extension
    const pageTsx = path.join(pagesDir, `${pageName}.tsx`);
    const pageJsx = path.join(pagesDir, `${pageName}.jsx`);
    
    return fs.existsSync(pageTsx) || fs.existsSync(pageJsx);
  }

  /**
   * Recursively search for a file in a directory
   */
  private findFileRecursively(dir: string, fileName: string, extensions: string[]): boolean {
    if (!fs.existsSync(dir)) {
      return false;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip test directories and node_modules
        if (entry.name === '__tests__' || entry.name === 'node_modules') {
          continue;
        }
        
        if (this.findFileRecursively(fullPath, fileName, extensions)) {
          return true;
        }
      } else if (entry.isFile()) {
        // Check if file name matches (without extension)
        const baseName = path.basename(entry.name, path.extname(entry.name));
        const hasValidExtension = extensions.some(ext => entry.name.endsWith(ext));
        
        if (baseName === fileName && hasValidExtension) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Find components that are not linked to any feature
   */
  private async findOrphanedComponents(): Promise<string[]> {
    const componentsDir = path.join(this.projectPath, 'src', 'components');
    
    if (!fs.existsSync(componentsDir)) {
      return [];
    }

    // Get all component names from features
    const featureComponents = new Set<string>();
    for (const feature of this.MVP_FEATURES) {
      feature.requiredComponents.forEach(comp => featureComponents.add(comp));
    }

    // Get all actual components in the project
    const allComponents = this.getAllComponents(componentsDir);

    // Filter out UI components (shadcn/ui) and common components
    const excludedComponents = new Set([
      'ErrorBoundary',
      'ErrorFallback',
      'Logo',
      'NotificationSystem',
      // Add common UI components that don't need to be in features
      'Button',
      'Input',
      'Label',
      'Card',
      'Dialog',
      'Select',
      'Checkbox',
      'RadioGroup',
      'Tabs',
      'Toast',
      'Toaster',
      'Form',
      'Table',
      'Badge',
      'Avatar',
      'Separator',
      'ScrollArea',
      'Sheet',
      'Skeleton',
      'Switch',
      'Textarea',
      'Tooltip',
      'Alert',
      'AlertDialog',
      'AspectRatio',
      'Calendar',
      'Collapsible',
      'Command',
      'ContextMenu',
      'DropdownMenu',
      'HoverCard',
      'Menubar',
      'NavigationMenu',
      'Popover',
      'Progress',
      'RadioGroupItem',
      'ResizablePanel',
      'Slider',
      'Sonner',
      'ToggleGroup',
    ]);

    // Find orphaned components
    const orphaned: string[] = [];
    for (const component of allComponents) {
      if (!featureComponents.has(component) && !excludedComponents.has(component)) {
        orphaned.push(component);
      }
    }

    return orphaned;
  }

  /**
   * Get all component names from the components directory
   */
  private getAllComponents(dir: string): string[] {
    const components: string[] = [];

    if (!fs.existsSync(dir)) {
      return components;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip test directories, node_modules, and ui directory
        if (entry.name === '__tests__' || entry.name === 'node_modules' || entry.name === 'ui') {
          continue;
        }
        
        components.push(...this.getAllComponents(fullPath));
      } else if (entry.isFile()) {
        // Include .tsx and .jsx files
        if (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) {
          // Exclude example files
          if (entry.name.includes('.example.')) {
            continue;
          }
          
          const componentName = path.basename(entry.name, path.extname(entry.name));
          components.push(componentName);
        }
      }
    }

    return components;
  }

  /**
   * Generate gaps for incomplete features
   */
  private generateFeatureGaps(analysis: FeatureAnalysis, gaps: Gap[]): void {
    // Flag features with less than 70% completion
    if (!analysis.isComplete) {
      const severity: 'high' | 'medium' = analysis.completionPercentage < 50 ? 'high' : 'medium';
      
      const missingItems: string[] = [];
      if (analysis.missingComponents.length > 0) {
        missingItems.push(`Components: ${analysis.missingComponents.join(', ')}`);
      }
      if (analysis.missingServices.length > 0) {
        missingItems.push(`Services: ${analysis.missingServices.join(', ')}`);
      }
      if (analysis.missingTypes.length > 0) {
        missingItems.push(`Types: ${analysis.missingTypes.join(', ')}`);
      }
      if (analysis.missingPages.length > 0) {
        missingItems.push(`Pages: ${analysis.missingPages.join(', ')}`);
      }

      gaps.push({
        id: `feature-incomplete-${analysis.featureName.toLowerCase().replace(/\s+/g, '-')}`,
        severity,
        category: 'feature',
        description: `Feature "${analysis.featureName}" is only ${analysis.completionPercentage}% complete. Missing: ${missingItems.join('; ')}`,
        recommendation: `Implement the missing components, services, types, and pages for the ${analysis.featureName} feature`,
        affectedFiles: [],
        estimatedEffort: 'high',
      });
    }

    // Generate detailed gaps for missing components
    if (analysis.missingComponents.length > 0) {
      gaps.push({
        id: `feature-missing-components-${analysis.featureName.toLowerCase().replace(/\s+/g, '-')}`,
        severity: 'high',
        category: 'feature',
        description: `Feature "${analysis.featureName}" is missing ${analysis.missingComponents.length} component(s): ${analysis.missingComponents.join(', ')}`,
        recommendation: `Create the following components in src/components/: ${analysis.missingComponents.join(', ')}`,
        affectedFiles: analysis.missingComponents.map(c => `src/components/${c}.tsx`),
        estimatedEffort: 'high',
      });
    }

    // Generate detailed gaps for missing services
    if (analysis.missingServices.length > 0) {
      gaps.push({
        id: `feature-missing-services-${analysis.featureName.toLowerCase().replace(/\s+/g, '-')}`,
        severity: 'high',
        category: 'feature',
        description: `Feature "${analysis.featureName}" is missing ${analysis.missingServices.length} service(s): ${analysis.missingServices.join(', ')}`,
        recommendation: `Create the following services in src/services/: ${analysis.missingServices.join(', ')}`,
        affectedFiles: analysis.missingServices.map(s => `src/services/${s}.ts`),
        estimatedEffort: 'high',
      });
    }

    // Generate detailed gaps for missing types
    if (analysis.missingTypes.length > 0) {
      gaps.push({
        id: `feature-missing-types-${analysis.featureName.toLowerCase().replace(/\s+/g, '-')}`,
        severity: 'medium',
        category: 'feature',
        description: `Feature "${analysis.featureName}" is missing ${analysis.missingTypes.length} type definition(s): ${analysis.missingTypes.join(', ')}`,
        recommendation: `Define the following types in src/types/: ${analysis.missingTypes.join(', ')}`,
        affectedFiles: analysis.missingTypes.map(t => `src/types/${t.toLowerCase()}.ts`),
        estimatedEffort: 'medium',
      });
    }

    // Generate detailed gaps for missing pages
    if (analysis.missingPages.length > 0) {
      gaps.push({
        id: `feature-missing-pages-${analysis.featureName.toLowerCase().replace(/\s+/g, '-')}`,
        severity: 'high',
        category: 'feature',
        description: `Feature "${analysis.featureName}" is missing ${analysis.missingPages.length} page(s): ${analysis.missingPages.join(', ')}`,
        recommendation: `Create the following pages in src/pages/: ${analysis.missingPages.join(', ')}`,
        affectedFiles: analysis.missingPages.map(p => `src/pages/${p}.tsx`),
        estimatedEffort: 'high',
      });
    }
  }

  /**
   * Generate gap for orphaned components
   */
  private generateOrphanedComponentsGap(orphanedComponents: string[], gaps: Gap[]): void {
    gaps.push({
      id: 'feature-orphaned-components',
      severity: 'low',
      category: 'feature',
      description: `Found ${orphanedComponents.length} component(s) not linked to any MVP feature: ${orphanedComponents.join(', ')}`,
      recommendation: 'Review these components and either link them to a feature or remove them if they are not needed',
      affectedFiles: orphanedComponents.map(c => `src/components/${c}.tsx`),
      estimatedEffort: 'low',
    });
  }

  /**
   * Calculate overall feature score based on all feature completion percentages
   */
  private calculateOverallScore(analyses: FeatureAnalysis[]): number {
    if (analyses.length === 0) {
      return 0;
    }

    const totalCompletion = analyses.reduce((sum, analysis) => sum + analysis.completionPercentage, 0);
    return Math.round(totalCompletion / analyses.length);
  }
}

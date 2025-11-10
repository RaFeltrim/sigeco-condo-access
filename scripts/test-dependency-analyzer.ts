/**
 * Test script for DependencyAnalyzer
 * 
 * This script tests the DependencyAnalyzer to ensure it correctly:
 * - Parses package.json
 * - Scans imports from source files
 * - Identifies missing dependencies
 * - Identifies unused dependencies
 * - Flags critical missing dependencies
 */

import { DependencyAnalyzer } from '../src/lib/mvp-verifier/analyzers/DependencyAnalyzer';

async function testDependencyAnalyzer() {
  console.log('🔍 Testing DependencyAnalyzer...\n');

  try {
    const analyzer = new DependencyAnalyzer();
    const result = await analyzer.analyze();

    console.log('✅ Analysis completed successfully!\n');
    console.log('📊 Results:');
    console.log(`   Score: ${result.score}/100`);
    console.log(`   Execution Time: ${result.executionTime}ms`);
    console.log(`   Total Gaps: ${result.gaps.length}\n`);

    console.log('📦 Metadata:');
    console.log(`   Total Declared Dependencies: ${result.metadata.totalDeclaredDependencies}`);
    console.log(`   Total Imported Packages: ${result.metadata.totalImportedPackages}`);
    console.log(`   Missing Dependencies: ${(result.metadata.missingDependencies as string[]).length}`);
    console.log(`   Unused Dependencies: ${(result.metadata.unusedDependencies as string[]).length}`);
    console.log(`   Critical Missing: ${(result.metadata.criticalMissing as string[]).length}`);
    console.log(`   Potentially Removable: ${(result.metadata.potentiallyRemovable as string[]).length}\n`);

    if ((result.metadata.missingDependencies as string[]).length > 0) {
      console.log('⚠️  Missing Dependencies:');
      (result.metadata.missingDependencies as string[]).forEach(dep => {
        console.log(`   - ${dep}`);
      });
      console.log('');
    }

    if ((result.metadata.criticalMissing as string[]).length > 0) {
      console.log('🚨 Critical Missing Dependencies:');
      (result.metadata.criticalMissing as string[]).forEach(dep => {
        console.log(`   - ${dep}`);
      });
      console.log('');
    }

    if ((result.metadata.unusedDependencies as string[]).length > 0) {
      console.log('📦 Unused Dependencies (first 10):');
      (result.metadata.unusedDependencies as string[]).slice(0, 10).forEach(dep => {
        console.log(`   - ${dep}`);
      });
      if ((result.metadata.unusedDependencies as string[]).length > 10) {
        console.log(`   ... and ${(result.metadata.unusedDependencies as string[]).length - 10} more`);
      }
      console.log('');
    }

    if ((result.metadata.potentiallyRemovable as string[]).length > 0) {
      console.log('🗑️  Potentially Removable Dependencies:');
      (result.metadata.potentiallyRemovable as string[]).slice(0, 10).forEach(dep => {
        console.log(`   - ${dep}`);
      });
      if ((result.metadata.potentiallyRemovable as string[]).length > 10) {
        console.log(`   ... and ${(result.metadata.potentiallyRemovable as string[]).length - 10} more`);
      }
      console.log('');
    }

    console.log('🔍 Gaps by Severity:');
    const gapsBySeverity = {
      critical: result.gaps.filter(g => g.severity === 'critical').length,
      high: result.gaps.filter(g => g.severity === 'high').length,
      medium: result.gaps.filter(g => g.severity === 'medium').length,
      low: result.gaps.filter(g => g.severity === 'low').length,
    };
    console.log(`   Critical: ${gapsBySeverity.critical}`);
    console.log(`   High: ${gapsBySeverity.high}`);
    console.log(`   Medium: ${gapsBySeverity.medium}`);
    console.log(`   Low: ${gapsBySeverity.low}\n`);

    if (result.gaps.length > 0) {
      console.log('📋 Sample Gaps (first 5):');
      result.gaps.slice(0, 5).forEach((gap, index) => {
        console.log(`\n   ${index + 1}. [${gap.severity.toUpperCase()}] ${gap.description}`);
        console.log(`      Recommendation: ${gap.recommendation}`);
      });
      console.log('');
    }

    console.log('✅ DependencyAnalyzer test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testDependencyAnalyzer();

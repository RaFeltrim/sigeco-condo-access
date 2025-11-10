/**
 * Test script for QualityAnalyzer
 * Runs the QualityAnalyzer on the current project and displays results
 */

import { QualityAnalyzer } from '../src/lib/mvp-verifier/analyzers/QualityAnalyzer';

async function testQualityAnalyzer() {
  console.log('🔍 Testing QualityAnalyzer...\n');

  try {
    const analyzer = new QualityAnalyzer(process.cwd());
    const result = await analyzer.analyze();

    console.log('✅ QualityAnalyzer executed successfully!\n');
    console.log('📊 Results:');
    console.log(`   Score: ${result.score}/100`);
    console.log(`   Execution Time: ${result.executionTime}ms`);
    console.log(`   Gaps Found: ${result.gaps.length}\n`);

    console.log('📈 Metadata:');
    console.log(`   Type Errors: ${result.metadata.typeErrors}`);
    console.log(`   Naming Convention Violations: ${result.metadata.namingConventionViolations}`);
    console.log(`   Missing Error Handling: ${result.metadata.missingErrorHandling}`);
    console.log(`   Missing Loading States: ${result.metadata.missingLoadingStates}`);
    console.log(`   Accessibility Issues: ${result.metadata.accessibilityIssues}`);
    console.log(`   Test Coverage: ${result.metadata.testCoverage}%`);
    console.log(`   Components with Tests: ${result.metadata.componentsWithTests}/${result.metadata.totalComponents}\n`);

    if (result.gaps.length > 0) {
      console.log('🔴 Gaps by Severity:');
      const gapsBySeverity = result.gaps.reduce((acc, gap) => {
        acc[gap.severity] = (acc[gap.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      Object.entries(gapsBySeverity).forEach(([severity, count]) => {
        console.log(`   ${severity}: ${count}`);
      });

      console.log('\n📋 Sample Gaps (first 5):');
      result.gaps.slice(0, 5).forEach((gap, index) => {
        console.log(`\n   ${index + 1}. [${gap.severity.toUpperCase()}] ${gap.description}`);
        console.log(`      Recommendation: ${gap.recommendation}`);
        if (gap.affectedFiles && gap.affectedFiles.length > 0) {
          console.log(`      Affected Files: ${gap.affectedFiles.slice(0, 3).join(', ')}${gap.affectedFiles.length > 3 ? '...' : ''}`);
        }
      });
    }

    console.log('\n✨ Test completed successfully!');
  } catch (error) {
    console.error('❌ Error testing QualityAnalyzer:', error);
    process.exit(1);
  }
}

testQualityAnalyzer();

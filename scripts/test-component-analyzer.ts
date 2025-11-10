/**
 * Quick test script for ComponentAnalyzer
 * Run with: npx tsx scripts/test-component-analyzer.ts
 */

import { ComponentAnalyzer } from '../src/lib/mvp-verifier/analyzers/ComponentAnalyzer';

async function testComponentAnalyzer() {
  console.log('🔍 Testing ComponentAnalyzer...\n');
  
  const analyzer = new ComponentAnalyzer(process.cwd());
  
  try {
    const result = await analyzer.analyze();
    
    console.log('✅ Analysis completed successfully!\n');
    console.log('📊 Results:');
    console.log(`   - Overall Score: ${result.score}%`);
    console.log(`   - Total Components: ${result.metadata.totalComponents}`);
    console.log(`   - Total Gaps: ${result.gaps.length}`);
    console.log(`   - Execution Time: ${result.executionTime}ms\n`);
    
    // Show gap breakdown by severity
    const gapsBySeverity = result.gaps.reduce((acc, gap) => {
      acc[gap.severity] = (acc[gap.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('📋 Gaps by Severity:');
    Object.entries(gapsBySeverity).forEach(([severity, count]) => {
      console.log(`   - ${severity}: ${count}`);
    });
    
    // Show first 5 gaps as examples
    if (result.gaps.length > 0) {
      console.log('\n🔍 Sample Gaps (first 5):');
      result.gaps.slice(0, 5).forEach((gap, index) => {
        console.log(`\n   ${index + 1}. [${gap.severity.toUpperCase()}] ${gap.description}`);
        console.log(`      Recommendation: ${gap.recommendation}`);
        if (gap.affectedFiles && gap.affectedFiles.length > 0) {
          console.log(`      Files: ${gap.affectedFiles.join(', ')}`);
        }
      });
    }
    
    // Show component scores
    if (result.metadata.componentsAnalyzed) {
      console.log('\n📈 Component Scores (first 10):');
      const components = result.metadata.componentsAnalyzed as Array<{ name: string; score: number }>;
      components.slice(0, 10).forEach(comp => {
        console.log(`   - ${comp.name}: ${comp.score}%`);
      });
    }
    
    console.log('\n✨ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testComponentAnalyzer();

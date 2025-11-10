/**
 * Test all analyzers together with VerificationEngine
 * Run with: npx tsx scripts/test-all-analyzers.ts
 */

import { VerificationEngine } from '../src/lib/mvp-verifier/VerificationEngine';
import { ComponentAnalyzer } from '../src/lib/mvp-verifier/analyzers/ComponentAnalyzer';
import { StructureAnalyzer } from '../src/lib/mvp-verifier/analyzers/StructureAnalyzer';
import { FeatureAnalyzer } from '../src/lib/mvp-verifier/analyzers/FeatureAnalyzer';

async function testAllAnalyzers() {
  console.log('🔍 Testing All Analyzers with VerificationEngine...\n');
  
  const engine = new VerificationEngine(process.cwd());
  
  // Register all analyzers
  engine.registerAnalyzer(new ComponentAnalyzer(process.cwd()));
  engine.registerAnalyzer(new StructureAnalyzer(process.cwd()));
  engine.registerAnalyzer(new FeatureAnalyzer(process.cwd()));
  
  console.log('✅ All analyzers registered\n');
  console.log('📋 Registered Analyzers:');
  engine.getRegisteredAnalyzers().forEach(name => {
    console.log(`   - ${name}`);
  });
  
  try {
    console.log('\n🔄 Running analysis...\n');
    const report = await engine.analyze();
    
    console.log('✅ Analysis completed!\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('                  VERIFICATION REPORT                  ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('📊 Overall Metrics:');
    console.log(`   - Timestamp: ${report.timestamp}`);
    console.log(`   - Overall Score: ${report.overallScore}%`);
    console.log(`   - Project Path: ${report.projectPath}\n`);
    
    console.log('📋 Summary:');
    console.log(`   - Total Gaps: ${report.summary.totalGaps}`);
    console.log(`   - Critical: ${report.summary.gapsBySeverity.critical}`);
    console.log(`   - High: ${report.summary.gapsBySeverity.high}`);
    console.log(`   - Medium: ${report.summary.gapsBySeverity.medium}`);
    console.log(`   - Low: ${report.summary.gapsBySeverity.low}`);
    console.log(`   - Estimated Work: ${report.summary.estimatedWorkRemaining}\n`);
    
    console.log('🎯 Analyzer Scores:');
    Object.entries(report.summary.analyzerScores).forEach(([name, score]) => {
      const emoji = score >= 80 ? '🟢' : score >= 60 ? '🟡' : score >= 40 ? '🟠' : '🔴';
      console.log(`   ${emoji} ${name}: ${score}%`);
    });
    
    console.log('\n💡 Top Recommendations:');
    report.recommendations.slice(0, 5).forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('                    DETAILED RESULTS                    ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Show detailed results for each analyzer
    Object.entries(report.analyzerResults).forEach(([name, result]) => {
      console.log(`\n📊 ${name}:`);
      console.log(`   - Score: ${result.score}%`);
      console.log(`   - Execution Time: ${result.executionTime}ms`);
      console.log(`   - Gaps Found: ${result.gaps.length}`);
      
      // Show some metadata
      if (result.metadata) {
        console.log(`   - Metadata:`);
        Object.entries(result.metadata).forEach(([key, value]) => {
          if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
            console.log(`     • ${key}: ${value}`);
          }
        });
      }
    });
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('                    CRITICAL GAPS                       ');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Show all critical gaps
    const allGaps = Object.values(report.analyzerResults).flatMap(r => r.gaps);
    const criticalGaps = allGaps.filter(g => g.severity === 'critical');
    
    if (criticalGaps.length > 0) {
      criticalGaps.forEach((gap, index) => {
        console.log(`${index + 1}. [CRITICAL] ${gap.description}`);
        console.log(`   Recommendation: ${gap.recommendation}`);
        if (gap.affectedFiles && gap.affectedFiles.length > 0) {
          console.log(`   Files: ${gap.affectedFiles.slice(0, 3).join(', ')}${gap.affectedFiles.length > 3 ? '...' : ''}`);
        }
        console.log('');
      });
    } else {
      console.log('✅ No critical gaps found!\n');
    }
    
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('✨ Test completed successfully!');
    
    // Exit with appropriate code
    if (report.overallScore >= 80) {
      console.log('🎉 MVP is ready! Score >= 80%');
      process.exit(0);
    } else {
      console.log(`⚠️  MVP needs work. Score: ${report.overallScore}% (target: 80%)`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testAllAnalyzers();

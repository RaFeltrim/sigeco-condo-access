/**
 * Test script for StructureAnalyzer
 * Run with: npx tsx scripts/test-structure-analyzer.ts
 */

import { StructureAnalyzer } from '../src/lib/mvp-verifier/analyzers/StructureAnalyzer';

async function testStructureAnalyzer() {
  console.log('🔍 Testing StructureAnalyzer...\n');

  try {
    const analyzer = new StructureAnalyzer(process.cwd());
    const result = await analyzer.analyze();

    console.log('✅ Analysis completed successfully!\n');
    console.log('📊 Results:');
    console.log(`   Score: ${result.score}/100`);
    console.log(`   Execution Time: ${result.executionTime}ms`);
    console.log(`   Total Gaps: ${result.gaps.length}\n`);

    if (result.metadata) {
      console.log('📋 Metadata:');
      console.log(`   Missing Directories: ${result.metadata.missingDirectories}`);
      console.log(`   Missing Files: ${result.metadata.missingFiles}`);
      console.log(`   Routes Coverage: ${result.metadata.routesCoverage}%`);
      console.log(`   Pages Without Routes: ${result.metadata.pagesWithoutRoutes}`);
      console.log(`   Defined Routes: ${result.metadata.definedRoutes}`);
      console.log(`   Services Without Types: ${result.metadata.servicesWithoutTypes}\n`);
    }

    if (result.gaps.length > 0) {
      console.log('⚠️  Gaps Found:');
      result.gaps.forEach((gap, index) => {
        console.log(`\n   ${index + 1}. [${gap.severity.toUpperCase()}] ${gap.description}`);
        console.log(`      Recommendation: ${gap.recommendation}`);
        if (gap.affectedFiles && gap.affectedFiles.length > 0) {
          console.log(`      Affected Files: ${gap.affectedFiles.join(', ')}`);
        }
      });
    } else {
      console.log('✨ No gaps found! Project structure is complete.');
    }

    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testStructureAnalyzer();

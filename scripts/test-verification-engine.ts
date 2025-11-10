/**
 * Test script for VerificationEngine with FeatureAnalyzer
 * Verifies that the FeatureAnalyzer integrates correctly with the engine
 */

import { VerificationEngine } from '../src/lib/mvp-verifier/VerificationEngine';
import { ComponentAnalyzer } from '../src/lib/mvp-verifier/analyzers/ComponentAnalyzer';
import { StructureAnalyzer } from '../src/lib/mvp-verifier/analyzers/StructureAnalyzer';
import { FeatureAnalyzer } from '../src/lib/mvp-verifier/analyzers/FeatureAnalyzer';

async function testVerificationEngine() {
  console.log('Testing VerificationEngine with FeatureAnalyzer...\n');

  try {
    const engine = new VerificationEngine(process.cwd());
    console.log('✓ VerificationEngine instantiated\n');

    // Register analyzers
    console.log('Registering analyzers...');
    engine.registerAnalyzer(new ComponentAnalyzer(process.cwd()));
    console.log('  ✓ ComponentAnalyzer registered');
    
    engine.registerAnalyzer(new StructureAnalyzer(process.cwd()));
    console.log('  ✓ StructureAnalyzer registered');
    
    engine.registerAnalyzer(new FeatureAnalyzer(process.cwd()));
    console.log('  ✓ FeatureAnalyzer registered');

    const registeredAnalyzers = engine.getRegisteredAnalyzers();
    console.log(`\nRegistered analyzers: ${registeredAnalyzers.join(', ')}\n`);

    console.log('Running full verification...');
    const report = await engine.analyze();

    console.log('\n=== Verification Report ===');
    console.log(`Timestamp: ${report.timestamp}`);
    console.log(`Project Path: ${report.projectPath}`);
    console.log(`Overall Score: ${report.overallScore}/100`);

    console.log('\n=== Summary ===');
    console.log(`Total Gaps: ${report.summary.totalGaps}`);
    console.log(`Gaps by Severity:`);
    console.log(`  Critical: ${report.summary.gapsBySeverity.critical}`);
    console.log(`  High: ${report.summary.gapsBySeverity.high}`);
    console.log(`  Medium: ${report.summary.gapsBySeverity.medium}`);
    console.log(`  Low: ${report.summary.gapsBySeverity.low}`);
    console.log(`Estimated Work Remaining: ${report.summary.estimatedWorkRemaining}`);

    console.log('\n=== Analyzer Scores ===');
    Object.entries(report.summary.analyzerScores).forEach(([name, score]) => {
      const bar = '█'.repeat(Math.floor(score / 5)) + '░'.repeat(20 - Math.floor(score / 5));
      console.log(`  ${name.padEnd(20)} ${bar} ${score}%`);
    });

    console.log('\n=== Recommendations ===');
    report.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });

    console.log('\n=== Feature Analyzer Details ===');
    const featureResult = report.analyzerResults['FeatureAnalyzer'];
    if (featureResult) {
      console.log(`Score: ${featureResult.score}/100`);
      console.log(`Execution Time: ${featureResult.executionTime}ms`);
      console.log(`Gaps Found: ${featureResult.gaps.length}`);
      console.log(`\nMetadata:`);
      console.log(`  Total Features: ${featureResult.metadata.totalFeatures}`);
      console.log(`  Complete Features: ${featureResult.metadata.completeFeatures}`);
      console.log(`  Incomplete Features: ${featureResult.metadata.incompleteFeatures}`);
      console.log(`  Orphaned Components: ${featureResult.metadata.orphanedComponents}`);
    }

    console.log('\n✓ VerificationEngine test completed successfully!');
    return 0;
  } catch (error) {
    console.error('\n✗ VerificationEngine test failed:');
    console.error(error);
    return 1;
  }
}

testVerificationEngine()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });

/**
 * Test script for FeatureAnalyzer
 * Verifies that the analyzer can run and produce results
 */

import { FeatureAnalyzer } from '../src/lib/mvp-verifier/analyzers/FeatureAnalyzer';

async function testFeatureAnalyzer() {
  console.log('Testing FeatureAnalyzer...\n');

  try {
    const analyzer = new FeatureAnalyzer(process.cwd());
    console.log(`✓ FeatureAnalyzer instantiated: ${analyzer.name}\n`);

    console.log('Running analysis...');
    const result = await analyzer.analyze();

    console.log('\n=== Analysis Results ===');
    console.log(`Analyzer: ${result.analyzerName}`);
    console.log(`Score: ${result.score}/100`);
    console.log(`Gaps found: ${result.gaps.length}`);
    console.log(`\nMetadata:`);
    console.log(`  Total features: ${result.metadata.totalFeatures}`);
    console.log(`  Complete features: ${result.metadata.completeFeatures}`);
    console.log(`  Incomplete features: ${result.metadata.incompleteFeatures}`);
    console.log(`  Average completion: ${result.metadata.averageCompletion}%`);
    console.log(`  Orphaned components: ${result.metadata.orphanedComponents}`);

    console.log('\n=== Feature Details ===');
    const featureDetails = result.metadata.featureDetails as Array<{
      name: string;
      completion: number;
      isComplete: boolean;
    }>;
    
    featureDetails.forEach((feature) => {
      const status = feature.isComplete ? '✓' : '✗';
      console.log(`  ${status} ${feature.name}: ${feature.completion}%`);
    });

    console.log('\n=== Gaps by Severity ===');
    const gapsBySeverity = {
      critical: result.gaps.filter(g => g.severity === 'critical').length,
      high: result.gaps.filter(g => g.severity === 'high').length,
      medium: result.gaps.filter(g => g.severity === 'medium').length,
      low: result.gaps.filter(g => g.severity === 'low').length,
    };
    console.log(`  Critical: ${gapsBySeverity.critical}`);
    console.log(`  High: ${gapsBySeverity.high}`);
    console.log(`  Medium: ${gapsBySeverity.medium}`);
    console.log(`  Low: ${gapsBySeverity.low}`);

    if (result.gaps.length > 0) {
      console.log('\n=== Sample Gaps (first 3) ===');
      result.gaps.slice(0, 3).forEach((gap, index) => {
        console.log(`\n${index + 1}. [${gap.severity.toUpperCase()}] ${gap.description}`);
        console.log(`   Recommendation: ${gap.recommendation}`);
      });
    }

    console.log('\n✓ FeatureAnalyzer test completed successfully!');
    return 0;
  } catch (error) {
    console.error('\n✗ FeatureAnalyzer test failed:');
    console.error(error);
    return 1;
  }
}

testFeatureAnalyzer()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });

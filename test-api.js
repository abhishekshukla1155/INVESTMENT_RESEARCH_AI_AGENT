import { analyzeInvestment } from './src/ai/investmentAnalyzer.js';

// We import the analyzer module directly and execute it. 
// Since Next.js is running, process.env is populated by .env.local automatically when run via Next,
// but for this direct node script, we can load dotenv or just execute.
// Let's run the actual analyzeInvestment function for each target.

async function runTests() {
  const companies = ['NVIDIA', 'HCL Technologies', 'Mphasis'];

  for (const comp of companies) {
    console.log(`\n========================================`);
    console.log(`RUNNING ANALYSIS FOR: ${comp}`);
    console.log(`========================================`);
    try {
      const result = await analyzeInvestment(comp);
      console.log(JSON.stringify(result, null, 2));
    } catch (err) {
      console.error(`Error analyzing ${comp}:`, err);
    }
  }
}

runTests();

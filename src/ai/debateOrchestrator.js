/**
 * @file debateOrchestrator.js
 * @description Multi-agent debate orchestrator for the INVESTOR AI system.
 *
 * This module coordinates all three debate agents in the correct execution order:
 *   1. Bull Analyst and Bear Analyst run IN PARALLEL (they are independent)
 *   2. CIO Judge runs AFTER both complete (it depends on their reports)
 *
 * INTERVIEW TALKING POINT:
 * The parallel execution of Bull and Bear using Promise.all() is a key performance
 * optimization. If each Gemini call takes ~5 seconds, sequential execution would
 * take 15 seconds total. Parallel execution reduces this to ~10 seconds (5s for
 * the parallel pair + 5s for the CIO). This demonstrates understanding of async
 * concurrency patterns in Node.js.
 *
 * The CIO MUST run sequentially after the parallel pair — it has a hard dependency
 * on both reports. There is no way to parallelize the CIO without compromising
 * the quality of its judgment.
 *
 * Each agent has its OWN try-catch in its own file. If one fails, the others still run.
 * This orchestrator will always return a result — it never throws.
 *
 * INPUT:  sharedResearch { company, searchData, financialData, sources }
 * OUTPUT: { bull, bear, cio }
 */

import { runBullAnalysis } from './agents/bullAnalyst.js';
import { runBearAnalysis } from './agents/bearAnalyst.js';
import { runCIOJudgment } from './agents/cioJudge.js';

/**
 * Orchestrates the full three-agent investment debate.
 * @param {Object} sharedResearch - Pre-collected research context from researchAgent.js
 * @returns {Promise<Object>} Debate result { bull, bear, cio }
 */
export async function runDebate(sharedResearch) {
  console.log('\n=== DEBATE SYSTEM: Starting multi-agent investment debate ===');
  console.log('Company:', sharedResearch.company);

  try {
    // ─── STEP 1: Run Bull and Bear agents IN PARALLEL ──────────────────────
    // Both agents receive the same research context but argue opposite sides.
    // Promise.all() runs them concurrently, cutting latency roughly in half.
    console.log('Debate: Launching Bull and Bear agents in parallel...');

    const [bullReport, bearReport] = await Promise.all([
      runBullAnalysis(sharedResearch),
      runBearAnalysis(sharedResearch),
    ]);

    console.log(`Debate: Bull report ready (confidence: ${bullReport.confidence}%)`);
    console.log(`Debate: Bear report ready (confidence: ${bearReport.confidence}%)`);

    // ─── STEP 2: Run CIO Judge SEQUENTIALLY ───────────────────────────────
    // The CIO must read both reports before deciding. Sequential is correct here.
    console.log('Debate: Handing off to CIO Judge for final arbitration...');

    const cioVerdict = await runCIOJudgment(sharedResearch, bullReport, bearReport);

    console.log(`Debate: CIO verdict — ${cioVerdict.decision} at ${cioVerdict.confidence}% confidence`);
    console.log('=== DEBATE SYSTEM: Debate complete ===\n');

    // ─── STEP 3: Return the assembled debate result ────────────────────────
    return {
      bull: bullReport,
      bear: bearReport,
      cio: cioVerdict,
    };
  } catch (error) {
    // This catch block handles any unexpected orchestration-level errors.
    // Individual agent failures are already caught inside each agent file.
    console.error('Debate Orchestrator: Unexpected error —', error.message);

    // Return a safe, minimal structure so the frontend never crashes
    return {
      bull: {
        points: ['Bull analysis could not be completed at this time.'],
        confidence: 50,
        summary: 'Bull analysis unavailable.',
      },
      bear: {
        points: ['Bear analysis could not be completed at this time.'],
        confidence: 50,
        summary: 'Bear analysis unavailable.',
      },
      cio: {
        decision: 'WATCH',
        confidence: 50,
        reasoning: 'The debate system encountered an error. Defaulting to a neutral WATCH recommendation pending manual review.',
        summary: 'Automated debate system temporarily unavailable.',
      },
    };
  }
}

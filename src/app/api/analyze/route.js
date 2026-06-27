/**
 * @file route.js
 * @description Next.js App Router API Route Handler for `/api/analyze` (POST).
 *
 * DATA FLOW (UPDATED — Phase 2: Multi-Agent Debate Integration):
 *
 * 1. Client POSTs `{ company: "company_name" }` to this endpoint.
 * 2. We validate the input (400 Bad Request if missing).
 * 3. We call collectResearch(company) EXACTLY ONCE and store the result as sharedResearch.
 *    → This is the critical change: research is no longer collected inside analyzeInvestment.
 *    → All 4 AI components (main analyzer + 3 debate agents) share this single context object.
 *    → This prevents duplicate Tavily and Yahoo Finance API calls.
 * 4. We run analyzeInvestment and runDebate IN PARALLEL using Promise.all().
 *    → These are independent — neither needs the other's result.
 *    → Parallel execution saves the execution time of the slower pipeline.
 * 5. We map the debate agent output fields to the user-facing API field names.
 * 6. We merge everything into one final JSON response and return it.
 *
 * INTERVIEW TALKING POINT:
 * This route is the "orchestration layer" of the system. It is the only component
 * that knows about both the main analysis pipeline and the debate system. Keeping
 * orchestration here (rather than inside either sub-system) follows the principle
 * of Separation of Concerns — each module does one job, and this route coordinates them.
 */

import { NextResponse } from 'next/server';
import { collectResearch } from '../../../ai/researchAgent.js';
import { analyzeInvestment } from '../../../ai/investmentAnalyzer.js';
import { runDebate } from '../../../ai/debateOrchestrator.js';

export async function POST(request) {
  try {
    const { company } = await request.json();
    console.log('API received company:', company);

    // ─── Step 1: Validate input ────────────────────────────────────────────
    if (!company || typeof company !== 'string' || !company.trim()) {
      return NextResponse.json(
        { error: 'Company name is required and must be a valid text string.' },
        { status: 400 }
      );
    }

    // ─── Step 2: Collect research ONCE ────────────────────────────────────
    // sharedResearch is passed to BOTH the main analyzer and all debate agents.
    // This ensures Tavily and Yahoo Finance are each called exactly one time
    // regardless of how many AI components consume the data.
    console.log('API: Collecting shared research context...');
    const sharedResearch = await collectResearch(company);
    console.log('API: Shared research ready. Launching analysis and debate in parallel...');

    // ─── Step 3: Run main analysis and debate IN PARALLEL ─────────────────
    // analyzeInvestment receives sharedResearch → skips its internal collectResearch call.
    // runDebate receives sharedResearch → passes it directly to all three agents.
    // Promise.all() runs both pipelines concurrently, minimising total latency.
    const [analysisResult, debateResult] = await Promise.all([
      analyzeInvestment(company, sharedResearch),
      runDebate(sharedResearch),
    ]);

    console.log('API: Analysis and debate both complete. Assembling final response...');

    // ─── Step 4: Map debate output to the required API field names ─────────
    // The debate agents internally use field names like "points" and "cio".
    // We remap them here to the clean, user-facing field names defined in the spec.
    // This keeps the agent files focused on their own logic, not on API contracts.
    const debate = {
      bull: {
        arguments: debateResult.bull.points || [],
        confidence: debateResult.bull.confidence || 0,
        summary: debateResult.bull.summary || '',
      },
      bear: {
        arguments: debateResult.bear.points || [],
        confidence: debateResult.bear.confidence || 0,
        summary: debateResult.bear.summary || '',
      },
      judge: {
        decision: debateResult.cio.decision || 'WATCH',
        confidence: debateResult.cio.confidence || 50,
        explanation: debateResult.cio.reasoning || debateResult.cio.summary || '',
        summary: debateResult.cio.summary || '',
      },
    };

    // ─── Step 5: Merge and return the final unified response ───────────────
    // All existing analysisResult fields are preserved unchanged.
    // The "debate" field is additive — it does not replace or rename anything.
    const finalResponse = {
      ...analysisResult,  // company, decision, score, reasons, risks, overview, financialSummary, sources
      debate,             // NEW: bull, bear, judge
    };

    console.log('API: Final response assembled. Returning 200.');
    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error('API Route Error in POST /api/analyze:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred while performing research on the company.' },
      { status: 500 }
    );
  }
}

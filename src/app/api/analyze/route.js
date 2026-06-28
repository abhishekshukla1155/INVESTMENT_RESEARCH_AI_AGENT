/**
 * @file route.js
 * @description Next.js App Router API Route Handler for `/api/analyze` (POST).
 *
 * UPDATED DATA FLOW (Company Resolution Fix):
 *
 * 1.  Client POSTs { company: "raw user query" }
 * 2.  Input validation (400 if missing/blank)
 * 3.  resolveCompany(rawQuery)
 *     → On success:     { success: true, companyName, ticker, exchange, confidence }
 *     → On ambiguous:   { success: false, ambiguous: true, suggestions: [...] }
 *                        → Return 422 with suggestions list
 *     → On not-found:   { success: false, ambiguous: false, error: "..." }
 *                        → Return 404 with error message
 * 4.  collectResearch(resolvedEntity)   ← passes { companyName, ticker }
 *     Tavily searches `companyName`  (verified)
 *     Yahoo Finance uses `ticker`    (verified)
 *     → No more company mismatch possible
 * 5.  analyzeInvestment + runDebate run in parallel (shared research context)
 * 6.  Merge + return final JSON (same shape as before — backward compatible)
 *
 * INTERVIEW TALKING POINT:
 * The resolver pattern is analogous to "canonicalisation" in NLP pipelines —
 * we convert a fuzzy user signal into an unambiguous canonical entity before
 * any downstream processing begins.
 */

import { NextResponse } from 'next/server';
import { resolveCompany } from '../../../tools/companyResolver.js';
import { collectResearch } from '../../../ai/researchAgent.js';
import { analyzeInvestment } from '../../../ai/investmentAnalyzer.js';
import { runDebate } from '../../../ai/debateOrchestrator.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const rawCompany = body?.company;

    // ── Step 1: Input validation ───────────────────────────────────────────
    if (!rawCompany || typeof rawCompany !== 'string' || !rawCompany.trim()) {
      return NextResponse.json(
        { error: 'Company name is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    const userQuery = rawCompany.trim();
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`[API] New analysis request`);
    console.log(`[API] Raw Query:           "${userQuery}"`);

    // ── Step 2: Company Resolution ────────────────────────────────────────
    // This is the critical new step. We resolve the raw query to a single
    // verified (companyName, ticker) pair before ANY research begins.
    console.log(`[API] Running Company Resolver...`);
    const resolution = await resolveCompany(userQuery);

    if (!resolution.success) {
      if (resolution.ambiguous) {
        // The query matched multiple plausible companies — ask the user to clarify.
        console.warn(`[API] Ambiguous query: "${userQuery}". Returning suggestions.`);
        return NextResponse.json(
          {
            error: `"${userQuery}" is ambiguous. Did you mean one of the following?`,
            ambiguous: true,
            suggestions: resolution.suggestions,
          },
          { status: 422 }
        );
      } else {
        // No matching company found at all.
        console.warn(`[API] Company not found: "${userQuery}". Error: ${resolution.error}`);
        return NextResponse.json(
          { error: resolution.error || `Could not find a publicly listed company matching "${userQuery}".` },
          { status: 404 }
        );
      }
    }

    // Log the resolved entity clearly for debugging
    console.log(`[API] Resolved Company:    "${resolution.companyName}"`);
    console.log(`[API] Ticker:              ${resolution.ticker || 'N/A'}`);
    console.log(`[API] Exchange:            ${resolution.exchange || 'N/A'}`);
    console.log(`[API] Resolution Confidence: ${(resolution.confidence * 100).toFixed(0)}%`);

    // ── Step 3: Collect research ONCE using verified entity ───────────────
    // Both Tavily and Yahoo Finance now receive the SAME verified company.
    console.log(`[API] Collecting shared research context...`);
    const sharedResearch = await collectResearch({
      companyName: resolution.companyName,
      ticker:      resolution.ticker,
    });

    // Log the research / finance source companies for validation
    const finName = sharedResearch.financialData?.name || 'N/A';
    console.log(`[API] Research Company:    "${sharedResearch.company}"`);
    console.log(`[API] Finance Company:     "${finName}"`);

    // Company validation check
    const resFirst  = sharedResearch.company.toLowerCase().split(' ')[0];
    const finFirst  = finName.toLowerCase().split(' ')[0];
    const validated = resFirst === finFirst ||
                      finName.toLowerCase().includes(resFirst) ||
                      sharedResearch.company.toLowerCase().includes(finFirst);
    console.log(`[API] Company Validation:  ${validated ? '✅ PASSED' : '⚠️  WARN (names differ)'}`);
    console.log(`${'─'.repeat(60)}`);

    console.log(`[API] Launching analysis and debate in parallel...`);

    // ── Step 4: Run analysis and debate in parallel ───────────────────────
    const [analysisResult, debateResult] = await Promise.all([
      analyzeInvestment(resolution.companyName, sharedResearch),
      runDebate(sharedResearch),
    ]);

    console.log(`[API] Analysis and debate complete. Assembling response...`);

    // ── Step 5: Map debate output fields ─────────────────────────────────
    const debate = {
      bull: {
        arguments:  debateResult.bull.points    || [],
        confidence: debateResult.bull.confidence || 0,
        summary:    debateResult.bull.summary    || '',
      },
      bear: {
        arguments:  debateResult.bear.points    || [],
        confidence: debateResult.bear.confidence || 0,
        summary:    debateResult.bear.summary    || '',
      },
      judge: {
        decision:    debateResult.cio.decision   || 'WATCH',
        confidence:  debateResult.cio.confidence || 50,
        explanation: debateResult.cio.reasoning  || debateResult.cio.summary || '',
        summary:     debateResult.cio.summary    || '',
      },
    };

    // ── Step 6: Merge and return the final unified response ───────────────
    // Backward compatible: all existing fields (company, decision, score, etc.)
    // are preserved unchanged. `debate` is an additive field.
    const finalResponse = {
      ...analysisResult,
      debate,
      // Surface the resolver metadata so the UI/user can see what was analysed
      resolvedFrom: userQuery !== resolution.companyName ? userQuery : undefined,
    };

    console.log(`[API] Response ready. Returning 200.`);
    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error('[API] Unhandled error in POST /api/analyze:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred while performing research on the company.' },
      { status: 500 }
    );
  }
}

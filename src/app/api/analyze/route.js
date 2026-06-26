/**
 * @file route.js
 * @description Next.js App Router API Route Handler for `/api/analyze` (POST).
 * 
 * DATA FLOW:
 * 1. The client browser POSTs `{ company: "company_name" }` to this endpoint.
 * 2. We validate that a valid string is provided (returning 400 Bad Request if missing).
 * 3. We call the unified `analyzeInvestment(company)` pipeline inside `investmentAnalyzer.js`.
 * 4. The analyzer triggers the `researchAgent`, which scrapes the web and pulls market metrics.
 * 5. Returns the compiled JSON analysis back to the client.
 */

import { NextResponse } from 'next/server';
import { analyzeInvestment } from '../../../ai/investmentAnalyzer.js';

export async function POST(request) {
  try {
    const { company } = await request.json();
    console.log("API received company:", company);

    // Step 1: Validate company input
    if (!company || typeof company !== 'string' || !company.trim()) {
      return NextResponse.json(
        { error: 'Company name is required and must be a valid text string.' },
        { status: 400 } // Bad Request
      );
    }

    // Step 2: Trigger the unified investment analysis pipeline
    // This resolves the web search scrapes, resolves stock quotes, and prompts the LLM
    const analysisResult = await analyzeInvestment(company);

    // Step 3: Return final structured JSON response
    return NextResponse.json(analysisResult);

  } catch (error) {
    console.error('API Route Error in POST /api/analyze:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred while performing research on the company.' },
      { status: 500 } // Internal Server Error
    );
  }
}

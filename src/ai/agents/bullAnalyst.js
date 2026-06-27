/**
 * @file bullAnalyst.js
 * @description Bull Analyst Agent — Agent 1 of the multi-agent debate system.
 *
 * ROLE: A senior Wall Street equity analyst with a permanently bullish mandate.
 * OBJECTIVE: Build the strongest possible BUY case using the shared research context.
 *
 * INTERVIEW TALKING POINT:
 * This is an example of "role-conditioned prompting" — we give the LLM a fixed persona
 * and a one-sided objective. The agent is NOT asked to be balanced. Its job is to argue
 * one side as convincingly as possible. The tension between this agent and the Bear
 * Analyst is where the intelligence emerges.
 *
 * INPUT:  sharedResearch { company, searchData, financialData, sources }
 * OUTPUT: { points: string[], confidence: number, summary: string }
 */

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

/**
 * Runs the Bull Analyst agent against the shared research context.
 * @param {Object} sharedResearch - The pre-collected research from researchAgent.js
 * @returns {Promise<Object>} Bull report { points, confidence, summary }
 */
export async function runBullAnalysis(sharedResearch) {
  console.log('Bull Analyst: Building BUY case...');

  // Resolve API key — accepts either naming convention
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

  // Format the financial data string for the prompt
  const financialContext = sharedResearch.financialData.hasFinance
    ? `Ticker: ${sharedResearch.financialData.symbol}
Name: ${sharedResearch.financialData.name}
Revenue Growth: ${sharedResearch.financialData.revenueGrowth}
Profit Margin: ${sharedResearch.financialData.profitability}
Debt Level: ${sharedResearch.financialData.debtLevel}
Market Cap: ${sharedResearch.financialData.marketCap}
P/E Ratio: ${sharedResearch.financialData.peRatio}`
    : `No ticker resolved. Using qualitative context only.`;

  // Build the bull analyst prompt using plain string interpolation
  // (simpler than PromptTemplate for beginners — no escaping needed)
  const prompt = `You are a senior Wall Street equity analyst with a bullish investment mandate.

Your ONLY job is to build the strongest possible BUY case for this company.

=== WEB RESEARCH & NEWS ===
${sharedResearch.searchData}

=== QUANTITATIVE FINANCIAL DATA ===
${financialContext}

INSTRUCTIONS:
- Identify every positive signal: revenue growth, profitability, competitive moat, market leadership, AI/tech advantages, brand strength, cash flow, long-term expansion potential.
- Be specific — use actual data points from the research above. No generic statements.
- You are allowed to downplay or ignore negative factors for this report.
- Your confidence score reflects how strongly the data supports a BUY thesis (0-100).

Return ONLY a valid JSON object. No markdown, no text outside the JSON:

{
  "points": [
    "Bullish argument 1 with specific data",
    "Bullish argument 2 with specific data",
    "Bullish argument 3 with specific data",
    "Bullish argument 4 with specific data"
  ],
  "confidence": 82,
  "summary": "2-3 sentence bull case thesis paragraph."
}`;

  try {
    if (!apiKey) {
      throw new Error('No Gemini API key available — using fallback.');
    }

    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey,
    });

    const responseText = await model.invoke(prompt);
    let outputText = responseText.content.trim();

    // Strip markdown code fences if Gemini wraps the JSON
    if (outputText.startsWith('```')) {
      outputText = outputText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
    }

    const parsed = JSON.parse(outputText);
    console.log('Bull Analyst: Done. Confidence:', parsed.confidence);
    return {
      points: parsed.points || [],
      confidence: parsed.confidence || 70,
      summary: parsed.summary || '',
    };
  } catch (error) {
    // GRACEFUL FALLBACK — never crash the pipeline
    // Constructs a rule-based bull case from Yahoo Finance metrics
    console.warn('Bull Analyst: Gemini unavailable, using rule-based fallback.', error.message);
    return buildBullFallback(sharedResearch);
  }
}

/**
 * Rule-based bull case generator used when Gemini is unavailable.
 * Uses Yahoo Finance metrics directly to construct factual positive arguments.
 * @param {Object} research - sharedResearch object
 * @returns {Object} fallback bull report
 */
function buildBullFallback(research) {
  const fin = research.financialData;
  const name = fin.hasFinance ? fin.name : research.company;
  const points = [];

  if (fin.hasFinance) {
    points.push(`${name} (${fin.symbol}) has a market capitalisation of ${fin.marketCap}, reflecting strong institutional confidence and liquidity.`);
    points.push(`Revenue growth of ${fin.revenueGrowth} demonstrates continued business expansion and customer demand.`);
    points.push(`Profitability metrics of ${fin.profitability} indicate efficient cost management relative to revenue scale.`);
    points.push(`Relatively manageable debt position of ${fin.debtLevel} provides balance sheet flexibility for future investment.`);
  } else {
    points.push(`${name} has active market presence with multiple news mentions, reflecting brand awareness and sector relevance.`);
    points.push(`Strong qualitative search signals indicate growing interest from analysts and institutional investors.`);
    points.push(`Expanding product or service footprint positions the company well for medium-term revenue growth.`);
    points.push(`Management focus on core competencies and operational efficiency suggests sound strategic direction.`);
  }

  return {
    points,
    confidence: 65,
    summary: `${name} presents a credible investment opportunity based on its financial fundamentals and market positioning. The company's growth trajectory and operational metrics support a constructive medium-term outlook.`,
  };
}

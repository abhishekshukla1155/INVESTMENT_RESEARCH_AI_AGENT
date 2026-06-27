/**
 * @file bearAnalyst.js
 * @description Bear Analyst Agent — Agent 2 of the multi-agent debate system.
 *
 * ROLE: A senior hedge fund analyst with a bearish, risk-focused mandate.
 * OBJECTIVE: Build the strongest possible SELL/AVOID case using the shared research context.
 *
 * INTERVIEW TALKING POINT:
 * The Bear Analyst is the adversary to the Bull Analyst. Both agents receive
 * the SAME research context but produce opposite conclusions — this is the core
 * of adversarial multi-agent reasoning. Neither agent is "right". The CIO Judge
 * decides which made the stronger case.
 *
 * INPUT:  sharedResearch { company, searchData, financialData, sources }
 * OUTPUT: { points: string[], confidence: number, summary: string }
 */

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

/**
 * Runs the Bear Analyst agent against the shared research context.
 * @param {Object} sharedResearch - The pre-collected research from researchAgent.js
 * @returns {Promise<Object>} Bear report { points, confidence, summary }
 */
export async function runBearAnalysis(sharedResearch) {
  console.log('Bear Analyst: Building SELL case...');

  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

  // Format financial data for the prompt
  const financialContext = sharedResearch.financialData.hasFinance
    ? `Ticker: ${sharedResearch.financialData.symbol}
Name: ${sharedResearch.financialData.name}
Revenue Growth: ${sharedResearch.financialData.revenueGrowth}
Profit Margin: ${sharedResearch.financialData.profitability}
Debt Level: ${sharedResearch.financialData.debtLevel}
Market Cap: ${sharedResearch.financialData.marketCap}
P/E Ratio: ${sharedResearch.financialData.peRatio}`
    : `No ticker resolved. Using qualitative context only.`;

  const prompt = `You are a senior hedge fund analyst with a bearish, risk-focused investment mandate.

Your ONLY job is to build the strongest possible SELL or AVOID case for this company.

=== WEB RESEARCH & NEWS ===
${sharedResearch.searchData}

=== QUANTITATIVE FINANCIAL DATA ===
${financialContext}

INSTRUCTIONS:
- Identify every risk, red flag, weakness, and downside scenario.
- Focus on: high debt, thin or negative margins, overvaluation (P/E vs peers), competitive threats, regulatory risks, macroeconomic headwinds, declining revenue, geopolitical exposure.
- Be specific — use actual data points from the research above. No generic statements.
- You are allowed to downplay or ignore positive factors for this report.
- Your confidence score reflects how strongly the data supports a SELL/AVOID thesis (0-100).

Return ONLY a valid JSON object. No markdown, no text outside the JSON:

{
  "points": [
    "Bearish risk 1 with specific data",
    "Bearish risk 2 with specific data",
    "Bearish risk 3 with specific data",
    "Bearish risk 4 with specific data"
  ],
  "confidence": 68,
  "summary": "2-3 sentence bear case thesis paragraph."
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
    console.log('Bear Analyst: Done. Confidence:', parsed.confidence);
    return {
      points: parsed.points || [],
      confidence: parsed.confidence || 60,
      summary: parsed.summary || '',
    };
  } catch (error) {
    // GRACEFUL FALLBACK — builds a rule-based bear case from financial metrics
    console.warn('Bear Analyst: Gemini unavailable, using rule-based fallback.', error.message);
    return buildBearFallback(sharedResearch);
  }
}

/**
 * Rule-based bear case generator used when Gemini is unavailable.
 * Uses Yahoo Finance metrics to surface legitimate risk signals.
 * @param {Object} research - sharedResearch object
 * @returns {Object} fallback bear report
 */
function buildBearFallback(research) {
  const fin = research.financialData;
  const name = fin.hasFinance ? fin.name : research.company;
  const points = [];

  if (fin.hasFinance) {
    // Parse P/E for valuation risk signal
    const pe = parseFloat(fin.peRatio) || 0;
    if (pe > 30) {
      points.push(`Elevated P/E ratio of ${fin.peRatio} suggests the stock is priced for perfection — any earnings miss could trigger significant de-rating.`);
    } else {
      points.push(`Current valuation metrics must be weighed against peer multiples to determine if the market has already priced in growth expectations.`);
    }

    points.push(`Debt position of ${fin.debtLevel} introduces balance sheet risk in a rising interest rate environment, increasing the cost of capital.`);
    points.push(`Competitive intensity in the sector means ${name}'s current market share and margins face sustained structural pressure.`);
    points.push(`Macroeconomic headwinds including inflation, consumer spending slowdown, and geopolitical uncertainty could weigh on forward guidance.`);
  } else {
    points.push(`${name} lacks a publicly traded ticker, limiting transparency and institutional investor access to audited financial disclosures.`);
    points.push(`Without verifiable revenue and margin data, the investment risk profile remains speculative and difficult to quantify.`);
    points.push(`Private or early-stage companies face significant execution risk — product-market fit, burn rate, and path to profitability are unverified.`);
    points.push(`Competitive dynamics in the sector from well-capitalised incumbents poses an existential threat to market share capture.`);
  }

  return {
    points,
    confidence: 60,
    summary: `${name} carries identifiable risk factors that warrant caution before committing capital. The combination of valuation risk, competitive pressure, and macroeconomic uncertainty justifies a conservative investment posture.`,
  };
}

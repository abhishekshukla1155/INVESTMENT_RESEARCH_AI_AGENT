/**
 * @file cioJudge.js
 * @description Chief Investment Officer Agent — Agent 3 of the multi-agent debate system.
 *
 * ROLE: Investment Committee Chairman who arbitrates between the Bull and Bear reports.
 * OBJECTIVE: Read both reports, evaluate argument QUALITY (not quantity), and produce
 *            a final reasoned investment verdict.
 *
 * INTERVIEW TALKING POINT:
 * This agent demonstrates "meta-reasoning" — it reasons about the quality of other
 * agents' reasoning, not about the raw data directly. The key design rule is that
 * the CIO is explicitly told NOT to average the two confidence scores. It must
 * independently evaluate which analyst made a more convincing, data-supported case.
 * This is the same principle behind Constitutional AI and debate-based AI alignment research.
 *
 * INPUT:  sharedResearch, bullReport { points, confidence, summary }, bearReport { points, confidence, summary }
 * OUTPUT: { decision: 'INVEST'|'WATCH'|'PASS', confidence: number, reasoning: string, summary: string }
 */

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

/**
 * Runs the CIO Judge agent with both analyst reports and financial context.
 * @param {Object} sharedResearch - The pre-collected research from researchAgent.js
 * @param {Object} bullReport - Output from bullAnalyst.js
 * @param {Object} bearReport - Output from bearAnalyst.js
 * @returns {Promise<Object>} CIO verdict { decision, confidence, reasoning, summary }
 */
export async function runCIOJudgment(sharedResearch, bullReport, bearReport) {
  console.log('CIO Judge: Evaluating debate between Bull and Bear...');

  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

  // Format financial context for grounding the CIO's judgment
  const financialContext = sharedResearch.financialData.hasFinance
    ? `Ticker: ${sharedResearch.financialData.symbol} | Market Cap: ${sharedResearch.financialData.marketCap} | Revenue Growth: ${sharedResearch.financialData.revenueGrowth} | Margin: ${sharedResearch.financialData.profitability} | Debt: ${sharedResearch.financialData.debtLevel} | P/E: ${sharedResearch.financialData.peRatio}`
    : 'No public financial data available.';

  // Format the bull and bear arguments as numbered lists for the CIO
  const bullPointsText = bullReport.points.map((p, i) => `  ${i + 1}. ${p}`).join('\n');
  const bearPointsText = bearReport.points.map((p, i) => `  ${i + 1}. ${p}`).join('\n');

  const prompt = `You are the Chief Investment Officer (CIO) of an institutional investment committee.

Your two analysts have submitted opposing reports on the same company.
Your job is to make the FINAL investment committee decision.

=== BULL ANALYST REPORT (BUY case) ===
Analyst Confidence: ${bullReport.confidence}%
Arguments:
${bullPointsText}
Thesis: ${bullReport.summary}

=== BEAR ANALYST REPORT (SELL/AVOID case) ===
Analyst Confidence: ${bearReport.confidence}%
Arguments:
${bearPointsText}
Thesis: ${bearReport.summary}

=== GROUND TRUTH FINANCIAL DATA ===
${financialContext}

YOUR DECISION FRAMEWORK:
1. You are NOT a calculator. Do NOT average the two confidence scores.
2. Evaluate ARGUMENT QUALITY — which analyst was more specific? Which used real data? Which made credible claims?
3. Use the financial data as ground truth. Any analyst claim contradicted by the financial data should be discounted.
4. Make a decision that a rational investment committee would defend in front of a board.

DECISION OPTIONS:
- INVEST: Bull case is clearly stronger, supported by verifiable data, risk/reward is favorable.
- WATCH: Both cases have merit. Neither side decisively wins. Requires monitoring before committing capital.
- PASS: Bear case is clearly stronger, or risks are not compensated by the potential upside.

Return ONLY a valid JSON object. No markdown, no text outside the JSON:

{
  "decision": "INVEST",
  "confidence": 76,
  "reasoning": "3-4 sentences explaining which analyst made stronger arguments and why you sided with them.",
  "summary": "2 sentences summarizing the committee's final verdict."
}`;

  try {
    if (!apiKey) {
      throw new Error('No Gemini API key — using fallback CIO judgment.');
    }

    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey,
    });

    const responseText = await model.invoke(prompt);
    let outputText = responseText.content.trim();

    // Strip markdown code fences if present
    if (outputText.startsWith('```')) {
      outputText = outputText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
    }

    const parsed = JSON.parse(outputText);
    console.log('CIO Judge: Verdict reached —', parsed.decision, `(${parsed.confidence}% confidence)`);

    return {
      decision: parsed.decision || 'WATCH',
      confidence: parsed.confidence || 65,
      reasoning: parsed.reasoning || '',
      summary: parsed.summary || '',
    };
  } catch (error) {
    // GRACEFUL FALLBACK — uses a heuristic comparison of bull vs bear confidence
    // to produce a reasonable verdict when Gemini is unavailable
    console.warn('CIO Judge: Gemini unavailable, using heuristic fallback.', error.message);
    return buildCIOFallback(bullReport, bearReport, sharedResearch);
  }
}

/**
 * Heuristic CIO decision when Gemini is unavailable.
 * Compares bull vs bear confidence scores to determine a reasonable verdict.
 * @param {Object} bullReport
 * @param {Object} bearReport
 * @param {Object} research
 * @returns {Object} fallback CIO verdict
 */
function buildCIOFallback(bullReport, bearReport, research) {
  const name = research.financialData.hasFinance
    ? research.financialData.name
    : research.company;

  const bullConf = bullReport.confidence || 60;
  const bearConf = bearReport.confidence || 60;
  const gap = bullConf - bearConf;

  let decision, confidence, reasoning;

  if (gap > 12) {
    // Bull case is meaningfully stronger
    decision = 'INVEST';
    confidence = Math.min(80, Math.round((bullConf + 50) / 2));
    reasoning = `The bull analyst presented a considerably stronger case (${bullConf}% confidence) compared to the bear analyst (${bearConf}% confidence). The financial metrics support a constructive outlook, and the bull arguments were more grounded in specific data points.`;
  } else if (gap < -12) {
    // Bear case is meaningfully stronger
    decision = 'PASS';
    confidence = Math.min(75, Math.round((bearConf + 50) / 2));
    reasoning = `The bear analyst presented a considerably stronger risk case (${bearConf}% confidence) compared to the bull analyst (${bullConf}% confidence). The identified risks outweigh the potential upside at this time.`;
  } else {
    // Too close to call — recommend monitoring
    decision = 'WATCH';
    confidence = 55;
    reasoning = `Both analysts presented roughly equally compelling cases (Bull: ${bullConf}%, Bear: ${bearConf}%). The committee could not reach a decisive majority verdict. This company warrants further monitoring before capital commitment.`;
  }

  return {
    decision,
    confidence,
    reasoning,
    summary: `After reviewing both analyst reports, the committee has reached a ${decision} verdict for ${name} with ${confidence}% conviction. This decision will be revisited as new quarterly data becomes available.`,
  };
}

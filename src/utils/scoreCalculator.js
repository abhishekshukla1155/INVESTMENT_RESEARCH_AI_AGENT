/**
 * @file scoreCalculator.js
 * @description Professional weighted investment scoring engine.
 *
 * SCORING ARCHITECTURE (Total: 105 points max, minus risk penalty):
 *
 *  ┌─────────────────────────────┬────────────┐
 *  │ Category                    │ Max Points │
 *  ├─────────────────────────────┼────────────┤
 *  │ Financial Strength          │     40     │
 *  │ Market Position (LLM text)  │     25     │
 *  │ Valuation (P/E Ratio)       │     20     │
 *  │ Risk Penalty (deduction)    │    -25     │
 *  └─────────────────────────────┴────────────┘
 *
 * DECISION THRESHOLDS:
 *  >= 75  →  INVEST  (strong buy signal)
 *  50-74  →  WATCH   (monitor closely)
 *  < 50   →  PASS    (avoid for now)
 *
 * KEY RULE: Final decision ALWAYS comes from this calculator.
 * Gemini only provides reasons / risks / overview text.
 */

// ─── POSITIVE KEYWORD SIGNALS (Market Position) ────────────────────────────
// Broad enough to catch natural LLM prose, specific enough to be meaningful.
const POSITIVE_KEYWORDS = [
  // Market leadership
  'leader', 'leaders', 'leading', 'leadership',
  'dominant', 'dominance', 'dominates', 'dominating',
  'market share', 'market position', 'market leader',

  // Technology & innovation
  'ai', 'artificial intelligence', 'machine learning', 'generative ai',
  'cloud', 'cloud computing', 'azure', 'aws', 'saas', 'platform',
  'innovation', 'innovative', 'cutting-edge', 'next-generation',
  'digital transformation',

  // Financial strength signals in text
  'profitable', 'profitability', 'profit margin', 'strong margins',
  'revenue growth', 'record revenue', 'record earnings',
  'cash flow', 'free cash flow', 'cash rich',
  'dividend', 'buyback', 'share repurchase',

  // Business moat signals
  'competitive advantage', 'moat', 'ecosystem', 'network effect',
  'switching cost', 'brand', 'pricing power', 'subscription',
  'recurring revenue', 'sticky',

  // Growth signals
  'growth', 'growing', 'expanding', 'expansion', 'scaling',
  'strong', 'robust', 'solid', 'resilient',
  'beat expectations', 'guidance raised', 'outperform',
];

// ─── SEVERE RISK KEYWORD SIGNALS (Risk Penalty) ────────────────────────────
// Only TRUE red flags — NOT normal competitive dynamics.
// "competition" alone is NOT a red flag and must NOT be included here.
const RISK_KEYWORDS = [
  // Financial distress
  'bankruptcy', 'insolvent', 'default', 'debt crisis',
  'high debt', 'debt burden', 'overleveraged',
  'declining revenue', 'revenue decline', 'revenue fell', 'revenue drop',
  'negative margin', 'operating loss', 'net loss', 'losing money',

  // Legal & regulatory red flags
  'lawsuit', 'class action', 'fraud', 'accounting irregularities',
  'sec investigation', 'doj investigation', 'criminal charges',
  'antitrust violation',

  // Operational distress
  'going concern', 'restructuring', 'mass layoffs', 'plant closure',
  'product recall', 'data breach', 'major outage',
];

/**
 * Calculates a professional, weighted investment score.
 *
 * @param {Object}   params
 * @param {number}   params.revenueGrowthPct  - Revenue growth % (e.g. 18.3 for 18.3%)
 * @param {number}   params.profitMarginPct   - Profit / operating margin % (e.g. 39.34)
 * @param {number}   params.debtEquityRatio   - D/E ratio (e.g. 0.303)
 * @param {number}   params.peRatio           - Price-to-earnings ratio (e.g. 21.31)
 * @param {string[]} params.reasons           - LLM-generated strength bullets
 * @param {string[]} params.risks             - LLM-generated risk bullets
 * @returns {{ decision: 'INVEST'|'WATCH'|'PASS', confidence: number, breakdown: Object }}
 */
export function calculateInvestmentScore({
  revenueGrowthPct = 0,
  profitMarginPct  = 0,
  debtEquityRatio  = 1,
  peRatio          = 0,
  reasons          = [],
  risks            = [],
}) {
  let financialScore  = 0;
  let marketScore     = 0;
  let valuationScore  = 0;
  let riskPenalty     = 0;

  // ── 1. FINANCIAL STRENGTH (max 40 pts) ────────────────────────────────────
  //
  // Revenue growth tier
  if (revenueGrowthPct > 20) {
    financialScore += 15;       // Hyper-growth
  } else if (revenueGrowthPct >= 10) {
    financialScore += 10;       // Healthy growth (e.g. Microsoft 18.3% → +10)
  } else if (revenueGrowthPct >= 5) {
    financialScore += 5;        // Moderate growth
  } else if (revenueGrowthPct >= 0) {
    financialScore += 2;        // Flat but positive
  }
  // Negative growth → 0 pts

  // Profitability / margin tier
  if (profitMarginPct > 20) {
    financialScore += 15;       // Exceptional (e.g. Microsoft 39% → +15)
  } else if (profitMarginPct > 10) {
    financialScore += 12;       // Strong
  } else if (profitMarginPct > 5) {
    financialScore += 8;        // Acceptable
  } else if (profitMarginPct > 0) {
    financialScore += 4;        // Thin but profitable
  }
  // Negative margin → 0 pts

  // Debt level (Debt-to-Equity)
  if (debtEquityRatio < 0.5) {
    financialScore += 10;       // Very low leverage (e.g. 0.303 → +10)
  } else if (debtEquityRatio < 1.0) {
    financialScore += 7;        // Manageable
  } else if (debtEquityRatio < 1.5) {
    financialScore += 4;        // Moderate
  }
  // High debt → 0 pts

  // ── 2. MARKET POSITION — keyword scan on LLM reasons text (max 25 pts) ───
  //
  // Only scan `reasons` (strengths), not risks — prevents negative text
  // from accidentally matching positive keywords.
  const reasonsText = reasons.join(' ').toLowerCase();

  let positiveMatches = 0;
  const matchedKeywords = [];
  for (const kw of POSITIVE_KEYWORDS) {
    if (reasonsText.includes(kw)) {
      positiveMatches++;
      matchedKeywords.push(kw);
    }
  }

  // Each match is worth ~3.5 pts; cap at 25.
  // This means 7+ keyword matches → full 25 pts.
  // A typical strong company gets 8-12 matches from Gemini prose.
  marketScore = Math.min(25, Math.round(positiveMatches * 3.5));

  // ── 3. VALUATION — P/E Ratio (max 20 pts) ────────────────────────────────
  if (peRatio > 0) {
    if (peRatio < 20) {
      valuationScore = 20;        // Cheap — great entry point
    } else if (peRatio < 30) {
      valuationScore = 18;        // Fairly valued (e.g. MSFT 21 → +18)
    } else if (peRatio <= 50) {
      valuationScore = 12;        // Growth premium — acceptable
    } else if (peRatio <= 80) {
      valuationScore = 6;         // Expensive
    } else {
      valuationScore = 2;         // Highly speculative (e.g. P/E > 80)
    }
  } else {
    // No P/E data (private company, negative earnings, or not listed)
    valuationScore = 10;          // Neutral fallback
  }

  // ── 4. RISK PENALTY — ONLY severe red flags (max -25 pts) ─────────────────
  //
  // BUG FIX: Do NOT add risks.length here.
  // Gemini returns 3-5 risk bullets for EVERY company (even great ones).
  // Counting bullet count as a penalty unfairly penalises strong companies.
  // Only match against the explicit SEVERE keyword list.
  const risksText = risks.join(' ').toLowerCase();
  const allText   = (reasonsText + ' ' + risksText);   // check both for severe signals

  let riskMatches = 0;
  const matchedRisks = [];
  for (const kw of RISK_KEYWORDS) {
    if (allText.includes(kw)) {
      riskMatches++;
      matchedRisks.push(kw);
    }
  }

  // Each severe risk keyword costs 5 pts, capped at 25.
  riskPenalty = Math.min(25, riskMatches * 5);

  // ── FINAL SCORE ───────────────────────────────────────────────────────────
  const rawScore   = financialScore + marketScore + valuationScore - riskPenalty;
  const confidence = Math.max(0, Math.min(100, rawScore));

  let decision;
  if (confidence >= 75) {
    decision = 'INVEST';
  } else if (confidence >= 50) {
    decision = 'WATCH';
  } else {
    decision = 'PASS';
  }

  // ── DEBUG LOG (visible in Next.js server terminal) ───────────────────────
  console.log('\n╔══ SCORE CALCULATOR DEBUG ══════════════════════════════╗');
  console.log(`║  financialScore  : ${String(financialScore).padStart(3)}  (max 40)`);
  console.log(`║  marketScore     : ${String(marketScore).padStart(3)}  (max 25) — ${positiveMatches} keyword matches: [${matchedKeywords.slice(0, 5).join(', ')}${matchedKeywords.length > 5 ? '...' : ''}]`);
  console.log(`║  valuationScore  : ${String(valuationScore).padStart(3)}  (max 20) — P/E: ${peRatio}`);
  console.log(`║  riskPenalty     : -${String(riskPenalty).padStart(2)}  (max -25) — ${riskMatches} severe signals: [${matchedRisks.join(', ')}]`);
  console.log(`║  ─────────────────────────────────────────────────────`);
  console.log(`║  finalScore      : ${String(confidence).padStart(3)}  →  ${decision}`);
  console.log(`║  inputs → growth: ${revenueGrowthPct}%  margin: ${profitMarginPct}%  D/E: ${debtEquityRatio}  PE: ${peRatio}`);
  console.log('╚════════════════════════════════════════════════════════╝\n');

  return {
    decision,
    confidence,
    breakdown: {
      financialScore,
      marketScore,
      valuationScore,
      riskPenalty,
      matchedKeywords,
      matchedRisks,
      inputs: { revenueGrowthPct, profitMarginPct, debtEquityRatio, peRatio },
    },
  };
}

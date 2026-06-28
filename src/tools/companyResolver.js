import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

/**
 * @file companyResolver.js
 * @description Company Resolution Agent — the first step in the pipeline.
 *
 * PROBLEM IT SOLVES:
 * Raw user input like "F1" is ambiguous. Yahoo Finance's search() can match
 * "F1" to "F13.SI" (Fu Yu Corporation), while Tavily returns news about
 * Formula One. This mismatch corrupts every downstream agent.
 *
 * SOLUTION:
 * 1. Use Yahoo Finance search() to get a ranked list of equity candidates.
 * 2. Score each candidate by how well its name matches the user query.
 * 3. If the top candidate's score is too low → return ambiguous suggestions
 *    instead of picking one at random.
 * 4. If confidence is acceptable → return a single verified {companyName, ticker}
 *    that every downstream module must use.
 *
 * INTERVIEW TALKING POINTS:
 * - Single source of truth: one resolution call, one verified entity for the
 *   entire pipeline.
 * - No hardcoded mappings (the old TICKER_RESOLVER is retained in financeTool
 *   only as a fast-path cache, not as the source of truth here).
 * - Levenshtein-free fuzzy matching: we use token overlap + known alias checks,
 *   which is lightweight enough for a Next.js API route.
 */

// ── Well-known alias table ────────────────────────────────────────────────────
// Maps common shorthand / abbreviations to the canonical company name used by
// Yahoo Finance. Only add entries that are genuinely ambiguous in search.
const KNOWN_ALIASES = {
  'F1':         'Formula One Group',
  'META':       'Meta Platforms',
  'GOOGLE':     'Alphabet Inc.',
  'ALPHABET':   'Alphabet Inc.',
  'MSFT':       'Microsoft',
  'AAPL':       'Apple',
  'NVDA':       'NVIDIA',
  'TSLA':       'Tesla',
  'INFY':       'Infosys',
  'AMZN':       'Amazon',
  'AMD':        'Advanced Micro Devices',
};

// ── Minimum match score threshold ────────────────────────────────────────────
// If our best candidate scores below this, we return ambiguous suggestions
// rather than a potentially wrong answer.
const MIN_CONFIDENCE = 0.35;

/**
 * Calculates a similarity score [0, 1] between the user query and a candidate
 * company name. Uses token overlap rather than edit distance — fast and
 * reliable enough for company name disambiguation.
 *
 * @param {string} query       - Normalised user query
 * @param {string} candidate   - Candidate company name from Yahoo Finance
 * @returns {number}           - Overlap score in [0, 1]
 */
function computeMatchScore(query, candidate) {
  if (!candidate) return 0;

  const q = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const c = candidate.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

  // Exact or substring match — highest confidence
  if (c.includes(q) || q.includes(c)) return 0.95;

  // Token overlap score
  const qTokens = new Set(q.split(/\s+/).filter(Boolean));
  const cTokens = c.split(/\s+/).filter(Boolean);
  if (qTokens.size === 0) return 0;

  let matchCount = 0;
  for (const t of cTokens) {
    if (qTokens.has(t)) matchCount++;
  }

  return matchCount / Math.max(qTokens.size, cTokens.length);
}

/**
 * Resolves a raw user query to a single verified company + ticker symbol.
 *
 * @param {string} rawQuery  - Exactly what the user typed (e.g. "F1", "Apple", "INFY")
 * @returns {Promise<Object>} Resolution result:
 *   Success:   { success: true,  userQuery, companyName, ticker, exchange, confidence }
 *   Ambiguous: { success: false, ambiguous: true,  userQuery, suggestions: [{name, ticker}] }
 *   Not found: { success: false, ambiguous: false, userQuery, error: string }
 */
export async function resolveCompany(rawQuery) {
  const userQuery = rawQuery.trim();
  const upperQuery = userQuery.toUpperCase();

  console.log(`[Resolver] Raw query: "${userQuery}"`);

  // ── Step 1: Check alias table first ────────────────────────────────────────
  const aliasedName = KNOWN_ALIASES[upperQuery];
  if (aliasedName) {
    console.log(`[Resolver] Alias match: "${userQuery}" → "${aliasedName}"`);
    // Now look up the aliased name in Yahoo Finance to get the ticker
    return resolveByName(userQuery, aliasedName);
  }

  // ── Step 2: Query Yahoo Finance search with the raw user input ─────────────
  let searchResults;
  try {
    searchResults = await yahooFinance.search(userQuery, { quotesCount: 8, newsCount: 0 });
  } catch (err) {
    console.error('[Resolver] Yahoo Finance search error:', err.message);
    return {
      success: false,
      ambiguous: false,
      userQuery,
      error: `Company lookup failed: ${err.message}`,
    };
  }

  const quotes = (searchResults.quotes || []).filter(
    q => q.quoteType === 'EQUITY' || q.quoteType === 'ETF'
  );

  if (quotes.length === 0) {
    return {
      success: false,
      ambiguous: false,
      userQuery,
      error: `No publicly listed company found matching "${userQuery}". Please check the name and try again.`,
    };
  }

  // ── Step 3: Score each candidate ───────────────────────────────────────────
  const scored = quotes.map(q => ({
    name:       q.longname || q.shortname || q.symbol,
    ticker:     q.symbol,
    exchange:   q.exchange || q.fullExchangeName || 'Unknown',
    score:      computeMatchScore(userQuery, q.longname || q.shortname || ''),
  })).sort((a, b) => b.score - a.score);

  const best = scored[0];

  console.log(`[Resolver] Top candidates:`, scored.slice(0, 3).map(s =>
    `${s.ticker} (${s.name}) score=${s.score.toFixed(2)}`
  ).join(' | '));

  // ── Step 4: If the best score is high enough → resolved ────────────────────
  if (best.score >= MIN_CONFIDENCE) {
    console.log(`[Resolver] Resolved: "${userQuery}" → ${best.ticker} (${best.name}) [score=${best.score.toFixed(2)}]`);
    return {
      success:     true,
      userQuery,
      companyName: best.name,
      ticker:      best.ticker,
      exchange:    best.exchange,
      confidence:  parseFloat(best.score.toFixed(2)),
    };
  }

  // ── Step 5: Low confidence → return ambiguous suggestions ──────────────────
  console.warn(`[Resolver] Ambiguous query "${userQuery}". Top score=${best.score.toFixed(2)} < threshold=${MIN_CONFIDENCE}`);
  return {
    success:     false,
    ambiguous:   true,
    userQuery,
    suggestions: scored.slice(0, 5).map(s => ({ name: s.name, ticker: s.ticker })),
  };
}

/**
 * Internal helper: resolve a canonical company name via Yahoo Finance search
 * when we already know what the company is (alias table hit).
 *
 * @param {string} userQuery    - Original raw query (for logging)
 * @param {string} canonicalName - The aliased canonical company name
 */
async function resolveByName(userQuery, canonicalName) {
  try {
    const results = await yahooFinance.search(canonicalName, { quotesCount: 5, newsCount: 0 });
    const quotes = (results.quotes || []).filter(q => q.quoteType === 'EQUITY');

    if (quotes.length === 0) {
      // Alias known but no Yahoo Finance result — proceed with the alias name and no ticker
      return {
        success:     true,
        userQuery,
        companyName: canonicalName,
        ticker:      null,
        exchange:    null,
        confidence:  0.9,
      };
    }

    const best = quotes[0];
    return {
      success:     true,
      userQuery,
      companyName: best.longname || best.shortname || canonicalName,
      ticker:      best.symbol,
      exchange:    best.exchange || best.fullExchangeName || 'Unknown',
      confidence:  0.9,
    };
  } catch (err) {
    // Even if Yahoo Finance fails, we know from the alias what company was meant
    return {
      success:     true,
      userQuery,
      companyName: canonicalName,
      ticker:      null,
      exchange:    null,
      confidence:  0.8,
    };
  }
}

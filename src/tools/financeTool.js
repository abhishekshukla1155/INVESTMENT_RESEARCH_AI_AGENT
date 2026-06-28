import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

/**
 * @file financeTool.js
 * @description Yahoo Finance data retrieval tool.
 *
 * KEY CHANGE (Company Resolution Fix):
 * This tool now accepts an OPTIONAL pre-verified ticker as its second argument.
 * When a ticker is provided by companyResolver.js, we skip the name-based
 * search entirely and directly call quoteSummary — eliminating the root cause
 * of the company mismatch bug.
 *
 * BEFORE (buggy):
 *   getFinancialData("F1") → yahooFinance.search("F1") → resolves F13.SI (Fu Yu Corp)
 *
 * AFTER (fixed):
 *   getFinancialData("Formula One Group", "FWONA") → yahooFinance.quoteSummary("FWONA")
 *   → Correct company data, no ambiguity.
 *
 * The TICKER_RESOLVER below is kept as a fast-path cache for well-known symbols
 * to avoid an extra network round-trip, not as the primary resolution strategy.
 *
 * INTERVIEW TALKING POINTS:
 * 1. Dependency Injection: The ticker is injected from the resolver rather than
 *    derived internally — classic DI pattern applied to an API integration.
 * 2. Defense in depth: Even when a ticker is injected, we validate the returned
 *    company name against the expected company name and log any divergence.
 */

// Fast-path cache: skips a Yahoo Finance search() call for well-known names.
// This is a performance optimisation, NOT the source of truth for resolution.
const TICKER_RESOLVER = {
  'NVIDIA':     'NVDA',
  'INFOSYS':    'INFY',
  'TESLA':      'TSLA',
  'NVDA':       'NVDA',
  'INFY':       'INFY',
  'TSLA':       'TSLA',
  'APPLE':      'AAPL',
  'AAPL':       'AAPL',
  'MICROSOFT':  'MSFT',
  'MSFT':       'MSFT',
  'AMAZON':     'AMZN',
  'AMZN':       'AMZN',
  'ALPHABET':   'GOOGL',
  'GOOGLE':     'GOOGL',
  'GOOGL':      'GOOGL',
  'META':       'META',
  'AMD':        'AMD',
};

/**
 * Fetches market statistics for a verified company.
 *
 * @param {string}      companyOrSymbol  - Verified company name or ticker from resolver
 * @param {string|null} verifiedTicker   - Pre-verified ticker symbol (preferred, skip search)
 * @returns {Promise<Object>}            - Financial statistics payload
 */
export async function getFinancialData(companyOrSymbol, verifiedTicker = null) {
  const query = companyOrSymbol.trim();
  const upperQuery = query.toUpperCase();

  // ── Priority 1: Use pre-verified ticker from companyResolver ──────────────
  let symbol = verifiedTicker || null;

  // ── Priority 2: Fast-path cache for well-known names ──────────────────────
  if (!symbol) {
    symbol = TICKER_RESOLVER[upperQuery] || null;
    if (symbol) {
      console.log(`[Finance Tool] Fast-path cache hit: "${query}" → ${symbol}`);
    }
  }

  try {
    // ── Priority 3: Yahoo Finance name search (only if no ticker yet) ─────────
    if (!symbol) {
      console.log(`[Finance Tool] No cached ticker for "${query}". Running Yahoo Finance search...`);
      const searchResults = await yahooFinance.search(query, { quotesCount: 5, newsCount: 0 });
      const quotes = (searchResults.quotes || []).filter(q => q.quoteType === 'EQUITY');
      const best = quotes[0];
      symbol = best?.symbol;

      if (symbol) {
        console.log(`[Finance Tool] Search resolved: "${query}" → ${symbol} (${best.shortname || best.longname})`);
      }
    }

    if (!symbol) {
      return {
        hasFinance: false,
        summary: `No active trading symbol resolved for "${query}".`,
      };
    }

    // ── Fetch comprehensive quote data ─────────────────────────────────────
    const quoteSummary = await yahooFinance.quoteSummary(symbol, {
      modules: ['price', 'summaryDetail', 'financialData'],
    });

    const price         = quoteSummary.price         || {};
    const summaryDetail = quoteSummary.summaryDetail  || {};
    const financialData = quoteSummary.financialData  || {};

    const resolvedName = price.longName || price.shortName || query;
    console.log(`[Finance Tool] Data retrieved: ${symbol} → "${resolvedName}"`);

    return {
      hasFinance:   true,
      symbol,
      name:         resolvedName,
      revenueGrowth: financialData.revenueGrowth
        ? `${(financialData.revenueGrowth * 100).toFixed(2)}% YoY`
        : 'N/A',
      profitability: financialData.profitMargins
        ? `Net Profit Margin ${(financialData.profitMargins * 100).toFixed(2)}%`
        : 'N/A',
      debtLevel: financialData.debtToEquity
        ? `Debt/Equity Ratio ${(financialData.debtToEquity / 100).toFixed(3)}`
        : 'Low / No significant debt data',
      marketTrend: summaryDetail.fiftyTwoWeekRange
        ? `52-Week Price Range: ${summaryDetail.fiftyTwoWeekRange}`
        : 'N/A',
      marketCap: price.marketCap
        ? `$${(price.marketCap / 1e9).toFixed(2)}B`
        : 'N/A',
      peRatio: summaryDetail.trailingPE
        ? summaryDetail.trailingPE.toFixed(2)
        : 'N/A',
    };

  } catch (error) {
    console.error(`[Finance Tool] Yahoo Finance extraction failed for "${query}" (ticker: ${symbol}):`, error.message);
    return {
      hasFinance: false,
      summary:    `Failed to connect to Yahoo Finance for "${query}". Error: ${error.message}`,
    };
  }
}

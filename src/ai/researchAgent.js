import { searchCompanyInfo } from '../tools/webSearchTool.js';
import { getFinancialData } from '../tools/financeTool.js';

/**
 * @file researchAgent.js
 * @description Coordination agent that triggers the web research and financial retrieval pipeline.
 *
 * KEY CHANGE (Company Resolution Fix):
 * This module no longer calls Yahoo Finance independently to resolve a ticker.
 * The caller (route.js) MUST provide a pre-resolved { companyName, ticker }
 * object from companyResolver.js.
 *
 * WHY THIS MATTERS:
 * Previously, both Tavily and Yahoo Finance received the raw user query.
 * - "F1" → Tavily returns Formula One content
 * - "F1" → Yahoo Finance resolves ticker F13.SI (Fu Yu Corporation)
 * → Two different companies in the same context → corrupted analysis.
 *
 * Now:
 * - resolveCompany("F1") → { companyName: "Formula One Group", ticker: "FWONA" }
 * - Tavily searches "Formula One Group"
 * - Yahoo Finance fetches data for "FWONA"
 * → One company, consistent context.
 *
 * BACKWARD COMPATIBILITY:
 * collectResearch(companyName) still works with a plain string for backward
 * compatibility. Providing a resolved object { companyName, ticker } is the
 * preferred (and bug-free) calling convention.
 */

/**
 * Gathers and compiles all online research data regarding a company.
 *
 * @param {string|Object} resolvedEntity
 *   Either a plain string (legacy) or a resolver result object:
 *   { companyName: string, ticker: string|null }
 * @returns {Promise<Object>} Compiled research profile with sources
 */
export async function collectResearch(resolvedEntity) {
  // ── Normalise input ────────────────────────────────────────────────────────
  let companyName, ticker;

  if (typeof resolvedEntity === 'string') {
    // Legacy path: called with a raw string (backward compatible)
    companyName = resolvedEntity;
    ticker = null;
    console.log(`[Research Agent] Legacy call with raw string: "${companyName}"`);
  } else {
    // Preferred path: called with pre-resolved entity
    companyName = resolvedEntity.companyName;
    ticker = resolvedEntity.ticker || null;
    console.log(`[Research Agent] Resolved entity: company="${companyName}" ticker="${ticker}"`);
  }

  console.log(`[Research Agent] Starting research for "${companyName}" (ticker: ${ticker || 'none'})...`);

  // ── Execute both lookups in parallel ──────────────────────────────────────
  // Tavily receives the VERIFIED company name — never the raw user query.
  // Yahoo Finance receives the verified ticker when available, falls back to
  // the verified company name (which is still much more accurate than the raw
  // user query).
  const [searchResult, financialResult] = await Promise.all([
    searchCompanyInfo(companyName),                    // uses verified company name
    getFinancialData(ticker || companyName, ticker),   // uses verified ticker first
  ]);

  // ── Cross-validation: detect company mismatch ─────────────────────────────
  // If Yahoo Finance returned data for a different company than what Tavily
  // researched, we log a warning but still proceed — the resolver already
  // verified the entity, so this should be rare. A hard abort would hurt UX
  // for companies where Yahoo uses abbreviated names (e.g. "Apple Inc." vs "Apple").
  if (financialResult.hasFinance && financialResult.name) {
    const finName = financialResult.name.toLowerCase();
    const resName = companyName.toLowerCase();
    const firstWordMatch = finName.split(' ')[0] === resName.split(' ')[0];
    const partialMatch = finName.includes(resName.split(' ')[0]) ||
                         resName.includes(finName.split(' ')[0]);

    if (!firstWordMatch && !partialMatch) {
      console.warn(
        `[Research Agent] ⚠️  CROSS-VALIDATION WARNING: ` +
        `Research company="${companyName}" but Finance returned company="${financialResult.name}". ` +
        `Proceeding with verified company name from resolver.`
      );
    } else {
      console.log(`[Research Agent] ✅ Company validation PASSED: "${companyName}" ↔ "${financialResult.name}"`);
    }
  }

  console.log(`[Research Agent] Research compiled successfully for "${companyName}".`);

  // ── Return structured context ──────────────────────────────────────────────
  // The `company` field is ALWAYS the verified company name from the resolver,
  // not the name Yahoo Finance returned (which may be abbreviated).
  return {
    company:       companyName,
    ticker:        ticker || (financialResult.hasFinance ? financialResult.symbol : null),
    searchData:    searchResult.text,
    financialData: financialResult,
    sources:       searchResult.sources || [],
  };
}

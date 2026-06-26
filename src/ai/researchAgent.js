import { searchCompanyInfo } from '../tools/webSearchTool.js';
import { getFinancialData } from '../tools/financeTool.js';

/**
 * @file researchAgent.js
 * @description Coordination agent that triggers the web research and financial retrieval pipeline.
 * 
 * INTERVIEW TALKING POINTS (DATA FLOW):
 * 1. Parallel/Sequential Scrapes: We accept a raw company name, query Tavily in parallel with Yahoo 
 *    Finance queries to save latency, and merge the qualitative news text with quantitative stock data.
 * 2. Fallback logic: If Yahoo Finance fails or returns hasFinance: false, we fallback to only 
 *    using Tavily qualitative data, making the system extremely resilient.
 */

/**
 * Gathers and compiles all online research data regarding a company.
 * @param {string} companyName - Target company name
 * @returns {Promise<Object>} Compiled research profile with sources
 */
export async function collectResearch(companyName) {
  console.log(`Research Agent: Starting research compile for "${companyName}"...`);

  // Execute web search and financial lookup in parallel to save runtime latency
  const [searchResult, financialResult] = await Promise.all([
    searchCompanyInfo(companyName),
    getFinancialData(companyName)
  ]);

  console.log(`Research Agent: Research compiled successfully for "${companyName}".`);

  // Return the structured context package
  return {
    company: companyName,
    searchData: searchResult.text,
    financialData: financialResult,
    sources: searchResult.sources || []
  };
}

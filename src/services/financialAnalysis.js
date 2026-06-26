/**
 * @file financialAnalysis.js
 * @description Service to retrieve financial statements and metrics indicators.
 * 
 * DATA FLOW:
 * 1. Invoked by the API Route Handler (`/api/analyze/route.js`).
 * 2. Receives target company identifier (string).
 * 3. Returns quantitative financial health overview metrics: revenueGrowth, profitability, debtLevel, and marketTrend.
 * 
 * PURPOSE OF EVERY FUNCTION:
 * - `getFinancialAnalysis(company)`: Simulates pulling financial records (income statement, balance sheet) 
 *   from financial databases (like SEC EDGAR, AlphaVantage, etc.) to analyze core balance sheet health.
 */

/**
 * Retreives financial analysis statements for a company.
 * @param {string} company - Name of the company
 * @returns {Promise<Object>} Mocked financial analysis metrics
 */
export async function getFinancialAnalysis(company) {
  // Simulate network delay (800ms)
  await new Promise((resolve) => setTimeout(resolve, 800));

  const query = company.trim().toUpperCase();

  // Mock financial statement ratios database
  const mockFinancials = {
    'TESLA': {
      revenueGrowth: '15.4% YoY',
      profitability: 'Strong (Net Profit Margin 11.2%)',
      debtLevel: 'Very Low (Debt-to-Equity Ratio 0.08)',
      marketTrend: 'Short-term electric vehicle pricing squeeze; long-term battery storage expansion.'
    },
    'APPLE': {
      revenueGrowth: '8.2% YoY',
      profitability: 'Outstanding (Net Profit Margin 25.8%)',
      debtLevel: 'Moderate (Debt-to-Equity Ratio 1.45, heavily offset by cash flow)',
      marketTrend: 'Steady services sector expansion; hardware upgrade cycles stabilizing.'
    },
    'MICROSOFT': {
      revenueGrowth: '14.1% YoY',
      profitability: 'Exceptional (Net Profit Margin 36.2%)',
      debtLevel: 'Low (Debt-to-Equity Ratio 0.42)',
      marketTrend: 'Accelerated enterprise cloud migration and generative AI SaaS commercialization.'
    }
  };

  const matchedKey = Object.keys(mockFinancials).find(
    (key) => query.includes(key) || key.includes(query)
  );

  if (matchedKey) {
    return mockFinancials[matchedKey];
  }

  // Fallback generic financial metrics
  return {
    revenueGrowth: '5.0% YoY (Estimate)',
    profitability: 'Moderate (Net Profit Margin 10.0%)',
    debtLevel: 'Stable (Debt-to-Equity Ratio 0.75)',
    marketTrend: 'Sideways consolidation with industry-wide macro headwinds.'
  };
}

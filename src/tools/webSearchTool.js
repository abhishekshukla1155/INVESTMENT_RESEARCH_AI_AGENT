/**
 * @file webSearchTool.js
 * @description Tool using Tavily Search API to execute real-time web scrapes.
 * 
 * INTERVIEW TALKING POINTS:
 * 1. Web Scraping abstraction: This tool encapsulates calling the Tavily API, ensuring that 
 *    the frontend and model are fed with fresh context instead of stale pre-training data.
 * 2. Robust Error Fallback: If no API key is supplied, we fallback to a simulated scrape 
 *    based on the company name to guarantee the application does not crash in an interview environment.
 */

/**
 * Searches the web for information regarding a target company.
 * @param {string} company - The target company name
 * @returns {Promise<Object>} Object containing compiled text research and source urls
 */
export async function searchCompanyInfo(company) {
  const apiKey = process.env.TAVILY_API_KEY;

  // Check if API key is not configured
  if (!apiKey || apiKey === 'your_tavily_key_here') {
    console.warn('TAVILY_API_KEY is not configured in .env.local. Using simulated search results.');
    return getSimulatedSearchResults(company);
  }

  try {
    const query = `${company} company overview industry products competitors latest news risks financial metrics`;
    
    // Call the Tavily Search API endpoint using native Node.js fetch
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: 'basic',
        max_results: 5
      })
    });

    if (!response.ok) {
      throw new Error(`Tavily API responded with status code ${response.status}`);
    }

    const data = await response.json();
    
    // Check if results are returned
    if (!data.results || data.results.length === 0) {
      return getSimulatedSearchResults(company);
    }

    // Map the results to extract URLs and compile a text summary context
    const sourceLinks = data.results.map(r => r.url);
    const summaryText = data.results
      .map(r => `[Title: ${r.title}]\n[URL: ${r.url}]\n[Content: ${r.content}]`)
      .join('\n\n');

    return {
      text: summaryText,
      sources: sourceLinks
    };

  } catch (error) {
    console.error('Tavily Search API call failed. Using simulated fallback search.', error);
    return getSimulatedSearchResults(company);
  }
}

/**
 * Simulated search database fallback for local testing without an active Tavily Key.
 */
function getSimulatedSearchResults(company) {
  const name = company.toUpperCase();
  let content = '';
  let urls = [];

  if (name.includes('TESLA')) {
    urls = ['https://www.tesla.com', 'https://en.wikipedia.org/wiki/Tesla,_Inc.', 'https://finance.yahoo.com/quote/TSLA'];
    content = `Tesla Inc. designs and manufactures electric vehicles (EVs), battery energy storage systems, and solar panels. Competitors include BYD, Ford, and Rivian. Known as the EV pioneer. High interest rates are impacting auto sales.`;
  } else if (name.includes('RELIANCE')) {
    urls = ['https://www.ril.com', 'https://en.wikipedia.org/wiki/Reliance_Industries', 'https://finance.yahoo.com/quote/RELIANCE.NS'];
    content = `Reliance Industries Limited is an Indian multinational conglomerate, headquartered in Mumbai. Its businesses include energy, petrochemicals, natural gas, retail, telecommunications (Jio), and mass media. Key competitors are Adani Group, Tata Group. Strong market dominance in India.`;
  } else {
    urls = [`https://www.google.com/search?q=${encodeURIComponent(company)}`];
    content = `Research results for ${company}: A private or public organization operating in general commerce. No official financials available. Low visibility news coverage.`;
  }

  return {
    text: `[Simulated Search Results for ${company}]\n\n${content}`,
    sources: urls
  };
}

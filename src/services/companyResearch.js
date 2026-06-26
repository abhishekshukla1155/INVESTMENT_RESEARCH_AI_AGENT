/**
 * @file companyResearch.js
 * @description Service to retrieve qualitative company profile information.
 * 
 * DATA FLOW:
 * 1. Invoked by the API Route Handler (`/api/analyze/route.js`).
 * 2. Accepts the company identifier input (string).
 * 3. Returns qualitative context details: description, industry, competitors, and marketPosition.
 * 
 * PURPOSE OF EVERY FUNCTION:
 * - `getCompanyResearch(company)`: Simulates fetching qualitative database records or search engine indexing
 *   for a given company name. This provides context on the target company's business activities, sector, 
 *   and competitive layout.
 */

/**
 * Gathers qualitative research profile for a target company.
 * @param {string} company - Name of the company to research
 * @returns {Promise<Object>} Mocked qualitative research profile
 */
export async function getCompanyResearch(company) {
  // Simulate network fetch latency (800ms)
  await new Promise((resolve) => setTimeout(resolve, 800));

  const query = company.trim().toUpperCase();

  // Mock databases of qualitative profiles
  const mockProfiles = {
    'TESLA': {
      name: 'Tesla, Inc.',
      industry: 'Auto Manufacturers & Energy Storage',
      description: 'Tesla, Inc. designs, develops, manufactures, and sells high-performance fully electric vehicles, solar energy generation systems, and energy storage products.',
      competitors: 'BYD, Ford, General Motors, Rivian',
      marketPosition: 'Dominant leader in EV manufacturing technology and battery utility storage systems in North America.'
    },
    'APPLE': {
      name: 'Apple Inc.',
      industry: 'Consumer Electronics & Software Services',
      description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, alongside various related software services.',
      competitors: 'Samsung, Google, Microsoft, Huawei',
      marketPosition: 'Premium brand ecosystem with exceptionally high client retention rates and ecosystem stickiness.'
    },
    'MICROSOFT': {
      name: 'Microsoft Corporation',
      industry: 'Software Infrastructure & Cloud Computing',
      description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and enterprise solutions, focusing heavily on cloud database servers and artificial intelligence.',
      competitors: 'Amazon Web Services (AWS), Google Cloud, Oracle',
      marketPosition: 'Leading enterprise cloud platform provider (Azure) and pioneer in generative AI application suites.'
    }
  };

  // Check if we have matching mock data
  const matchedKey = Object.keys(mockProfiles).find(
    (key) => query.includes(key) || key.includes(query)
  );

  if (matchedKey) {
    return mockProfiles[matchedKey];
  }

  // General fallback profile for arbitrary searches
  return {
    name: company,
    industry: 'General Diversified Commerce',
    description: `A public organization under evaluation. Operates in the ${company} market segment.`,
    competitors: 'Generic Industry Competitor A, Competitor B',
    marketPosition: 'Stable market competitor with general distribution channels.'
  };
}

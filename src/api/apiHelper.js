/**
 * @file apiHelper.js
 * @description Client-side fetch helper interfacing with our Next.js API endpoints.
 * 
 * DATA FLOW:
 * 1. Invoked by frontend UI pages/components (e.g. `page.js`).
 * 2. Packages the search string into a `{ company }` JSON payload.
 * 3. Sends a POST request to `/api/analyze`.
 * 4. Resolves with parsed JSON response, or throws a descriptive error on failure.
 * 
 * PURPOSE OF EVERY FUNCTION:
 * - `analyzeCompany(company)`: Abstracts network-level fetch configurations (headers, POST method, body conversion)
 *   from UI files to promote code reuse and clean separations of concern.
 */

/**
 * Calls the Next.js backend API to analyze a target company.
 * @param {string} company - Name of the company to analyze (e.g., 'Tesla')
 * @returns {Promise<Object>} Investment analysis results payload
 */
export async function analyzeCompany(company) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company }),
    });

    // Check if the server responded with an error status (e.g., 400 or 500)
    if (!response.ok) {
      // Attempt to extract the error message from the response payload
      const errorPayload = await response.json().catch(() => ({}));
      throw new Error(errorPayload.error || `Request failed with status code ${response.status}`);
    }

    // Return parsed JSON payload on success
    return await response.json();
  } catch (error) {
    console.error('Error in API helper analyzeCompany:', error);
    throw error;
  }
}

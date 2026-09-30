import { connectSource } from './sourceService.js'

/**
 * Fetch a LinkedIn summary (headline, about, experience entries, endorsements, recommendations).
 * Mock only - a real integration would use the user's own authorized data export or OAuth.
 */
export async function fetchLinkedinSummary(url, options) {
  const { data } = await connectSource('linkedin', url, options)
  return data
}

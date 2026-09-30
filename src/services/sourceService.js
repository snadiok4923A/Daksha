// Connects professional sources (GitHub, LinkedIn, portfolio, Behance, Dribbble, Instagram, Kaggle,
// LeetCode, Codeforces). No real scraping happens in this prototype: each call validates the link,
// simulates latency and returns deterministic mock data shaped like a real integration response.
//
// To go live: replace the body of `connectSource` with a call to your backend, e.g.
//   const res = await fetch(`${API_CONFIG.baseUrl}/integrations/${platformId}`, { method: 'POST', body: JSON.stringify({ url }) })
// Callers (onboarding, settings) stay unchanged.

import { PLATFORM_BY_ID } from '../config/platforms.js'
import { SOURCE_GENERATORS } from '../data/mockSources.js'
import { hashString } from '../utils/math.js'
import { validateProfileUrl } from '../utils/validators.js'
import { ERROR_CODES, ServiceError, devFlags, simulateLatency } from './client.js'

/** Usernames that simulate an unreachable/private profile (handy for demoing the error states). */
const UNAVAILABLE = /(unavailable|notfound|not-found|ghost|private|deleted|404)/i

/** Stable "how strong does this account look" for arbitrary usernames (0.35 - 0.95). */
const tierFor = (username) => 0.35 + ((hashString(username || 'x') % 61) / 100)

/**
 * @param {string} platformId  one of PLATFORMS ids (except 'other')
 * @param {string} rawUrl      url or username typed by the user
 * @param {{ family?: string, signal?: AbortSignal }} [options]
 * @returns {Promise<{ platformId: string, url: string, username: string, data: object }>}
 */
export async function connectSource(platformId, rawUrl, { family = 'web', signal } = {}) {
  const platform = PLATFORM_BY_ID[platformId]
  if (!platform) throw new ServiceError(ERROR_CODES.SOURCE_UNAVAILABLE, `Unknown source “${platformId}”.`)

  const check = validateProfileUrl(platformId, rawUrl)
  if (!check.ok) throw new ServiceError(ERROR_CODES.INVALID_URL, check.error)
  if (check.empty) throw new ServiceError(ERROR_CODES.INVALID_URL, `Enter your ${platform.label} link first.`)

  await simulateLatency(700, 1400, signal)

  const username = check.username || new URL(check.value).hostname
  const unavailable = UNAVAILABLE.test(username) || (platformId === 'github' && devFlags.simulateGithubDown)
  if (unavailable) {
    throw new ServiceError(
      platformId === 'github' ? ERROR_CODES.GITHUB_UNAVAILABLE : ERROR_CODES.SOURCE_UNAVAILABLE,
      platformId === 'github'
        ? 'We couldn’t reach this GitHub profile. It may be private, renamed or temporarily unavailable.'
        : `We couldn’t reach this ${platform.label} profile. It may be private or temporarily unavailable.`,
    )
  }

  const generate = SOURCE_GENERATORS[platformId]
  if (!generate) {
    return { platformId, url: check.value, username, data: { url: check.value, fetchedAt: new Date().toISOString() } }
  }

  const data = generate(check.value, { tier: tierFor(username), family })
  return { platformId, url: check.value, username, data }
}

/** Re-fetch an already connected source (used by "Refresh" in Settings). */
export const refreshSource = (platformId, url, options) => connectSource(platformId, url, options)

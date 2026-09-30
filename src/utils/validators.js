import { PLATFORM_BY_ID } from '../config/platforms.js'

const BARE_USERNAME = /^@?[A-Za-z0-9._-]{2,40}$/

/**
 * Validate + normalize a professional profile link.
 *
 * Accepts full URLs, scheme-less URLs ("github.com/alex") and - for platforms that have a
 * canonical profile URL - a bare username ("alex").
 *
 * @returns {{ ok: boolean, empty?: boolean, value: string, username?: string, error?: string }}
 */
export function validateProfileUrl(platformId, rawInput) {
  const input = (rawInput ?? '').trim()
  if (!input) return { ok: true, empty: true, value: '', username: '' }

  const platform = PLATFORM_BY_ID[platformId]
  const example = platform?.example ? ` Try something like ${platform.example}.` : ''

  if (/\s/.test(input)) {
    return { ok: false, value: input, error: `Links can't contain spaces.${example}` }
  }

  // Bare username -> canonical URL (only where it makes sense)
  if (platform?.usernameUrl && !input.includes('.') && !input.includes('/') && BARE_USERNAME.test(input)) {
    const username = input.replace(/^@/, '')
    return { ok: true, value: platform.usernameUrl(username), username }
  }

  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(input) ? input : `https://${input}`
  let url
  try {
    url = new URL(withScheme)
  } catch {
    return { ok: false, value: input, error: `That doesn't look like a valid URL.${example}` }
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    return { ok: false, value: input, error: 'Only http(s) links are supported.' }
  }

  const host = url.hostname
    .replace(/^www\./i, '')
    .replace(/^m\./i, '')
    .toLowerCase()
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host) || host.split('.').pop().length < 2) {
    return { ok: false, value: input, error: `That doesn't look like a valid URL.${example}` }
  }

  if (platform?.hosts?.length && !platform.hosts.some((h) => host === h || host.endsWith(`.${h}`))) {
    return { ok: false, value: input, error: `This doesn't look like a ${platform.label} link.${example}` }
  }

  let username = ''
  if (platform?.pathPattern) {
    const match = url.pathname.match(platform.pathPattern)
    if (!match) {
      return { ok: false, value: input, error: `This ${platform.label} link is missing a username.${example}` }
    }
    username = match[1]
  }

  const path = url.pathname.replace(/\/$/, '')
  return { ok: true, value: `https://${url.hostname}${path}`, username }
}

/** Generic http(s) URL check (project links, "other" links). */
export function isValidUrl(input) {
  if (!input) return false
  const result = validateProfileUrl('other', input)
  return result.ok && !result.empty
}

export function validateRequired(value, label = 'This field') {
  return String(value ?? '').trim() ? null : `${label} is required.`
}

export function validateEmail(value) {
  if (!value) return null
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? null : 'Enter a valid email address.'
}

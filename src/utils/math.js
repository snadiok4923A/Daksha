// Pure math helpers. No browser APIs: this file is also imported by Node scripts.

export const clamp = (n, min = 0, max = 100) => Math.min(max, Math.max(min, n))
export const lerp = (a, b, t) => a + (b - a) * t
export const round = (n, decimals = 0) => {
  const f = 10 ** decimals
  return Math.round(n * f) / f
}
export const sum = (arr) => arr.reduce((acc, n) => acc + n, 0)
export const mean = (arr) => (arr.length ? sum(arr) / arr.length : 0)
export const mapRange = (n, inMin, inMax, outMin, outMax) =>
  outMin + ((n - inMin) * (outMax - outMin)) / (inMax - inMin || 1)

/** FNV-1a string hash -> unsigned 32-bit int. Stable across runs. */
export function hashString(str = '') {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Deterministic PRNG (mulberry32). Returns a function producing floats in [0, 1). */
export function seededRandom(seed) {
  let a = typeof seed === 'string' ? hashString(seed) : seed >>> 0
  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Deterministic integer in [min, max] for a given seed string. */
export function seededInt(seed, min, max) {
  const rnd = seededRandom(seed)
  return Math.floor(rnd() * (max - min + 1)) + min
}

/** Pick one item deterministically. */
export function seededPick(seed, items) {
  return items[hashString(seed) % items.length]
}

/** Error function approximation (Abramowitz & Stegun 7.1.26). */
function erf(x) {
  const sign = x < 0 ? -1 : 1
  const ax = Math.abs(x)
  const t = 1 / (1 + 0.3275911 * ax)
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-ax * ax)
  return sign * y
}

/** Standard normal CDF. */
export const normalCdf = (z) => 0.5 * (1 + erf(z / Math.SQRT2))

/** Normal probability density. */
export const normalPdf = (x, mu = 0, sigma = 1) =>
  Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI))

/** z-score for the top-p tail, e.g. 0.10 -> 1.2816. Uses a small lookup + interpolation. */
export function zForTopShare(p) {
  // Acklam-style rational approximation is overkill here; bisection on the CDF is exact enough.
  let lo = -6
  let hi = 6
  const target = 1 - p
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (normalCdf(mid) < target) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

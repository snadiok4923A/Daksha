// Safe localStorage wrapper (handles private mode / quota / SSR / bad JSON).

export const STORAGE_KEYS = {
  theme: 'skillrank:theme',
  state: 'skillrank:state:v1',
  onboardingDraft: 'skillrank:onboarding-draft:v1',
  recentSearches: 'skillrank:recent-searches:v1',
}

const hasStorage = () => {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    return false
  }
}

export function readJSON(key, fallback = null) {
  if (!hasStorage()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  if (!hasStorage()) return false
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function readString(key, fallback = null) {
  if (!hasStorage()) return fallback
  try {
    return window.localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

export function writeString(key, value) {
  if (!hasStorage()) return false
  try {
    window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function removeKey(key) {
  if (!hasStorage()) return
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

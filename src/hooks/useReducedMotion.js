import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

const getSnapshot = () => window.matchMedia(QUERY).matches
const getServerSnapshot = () => false

/** True when the user asked the OS for reduced motion. Reactive. */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** Non-reactive read for event handlers / one-off checks. */
export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches

export default useReducedMotion

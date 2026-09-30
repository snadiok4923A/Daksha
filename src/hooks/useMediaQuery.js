import { useCallback, useSyncExternalStore } from 'react'

/** Reactive `window.matchMedia(query).matches`. */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (callback) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', callback)
      return () => mql.removeEventListener('change', callback)
    },
    [query],
  )
  const getSnapshot = () => window.matchMedia(query).matches
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

/** Tailwind breakpoints as hooks. */
export const useIsMdUp = () => useMediaQuery('(min-width: 768px)')
export const useIsLgUp = () => useMediaQuery('(min-width: 1024px)')
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
export const useCanHover = () => useMediaQuery('(hover: hover) and (pointer: fine)')

export default useMediaQuery

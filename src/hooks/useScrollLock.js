import { useEffect } from 'react'

let locks = 0
let previousOverflow = ''

/**
 * Locks page scroll while `active` (ref-counted so stacked overlays work).
 * index.css sets `scrollbar-gutter: stable`, so there is no layout shift when it locks.
 */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined
    if (locks === 0) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    locks += 1
    return () => {
      locks -= 1
      if (locks === 0) document.body.style.overflow = previousOverflow
    }
  }, [active])
}

export default useScrollLock

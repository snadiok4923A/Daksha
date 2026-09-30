import { useEffect, useState } from 'react'

/**
 * Keeps an element mounted long enough to play its exit animation.
 *
 *   const { mounted, state } = usePresence(open, 200)
 *   if (!mounted) return null
 *   return <div data-state={state} className="anim-pop">...</div>
 *
 * `state` is 'open' while `open` is true and 'closed' during the exit window.
 * Pair with the `.anim-pop | .anim-fade | .anim-sheet | .anim-toast` classes from index.css.
 */
export function usePresence(open, exitMs = 220) {
  const [mounted, setMounted] = useState(open)

  useEffect(() => {
    if (open) {
      setMounted(true)
      return undefined
    }
    const timer = setTimeout(() => setMounted(false), exitMs)
    return () => clearTimeout(timer)
  }, [open, exitMs])

  return { mounted: open || mounted, state: open ? 'open' : 'closed' }
}

export default usePresence

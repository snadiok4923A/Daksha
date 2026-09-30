import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion.js'

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

/**
 * Animates a number towards `target` (ease-out). Re-animates smoothly from the current
 * value whenever `target` changes. Respects prefers-reduced-motion (jumps to target).
 *
 *   const [ref, inView] = useInView()
 *   const value = useCountUp(82, { enabled: inView })
 *
 * While `enabled` is false the hook returns 0 (or the last value) - flip it on when the
 * element enters the viewport.
 */
export function useCountUp(target, { duration = 1200, delay = 0, enabled = true, decimals = 0 } = {}) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(reduced ? target : 0)
  const valueRef = useRef(reduced ? target : 0)

  useEffect(() => {
    if (!enabled) return undefined
    if (reduced) {
      valueRef.current = target
      setValue(target)
      return undefined
    }
    const from = valueRef.current
    if (from === target) return undefined

    let raf = 0
    let start
    const timeout = setTimeout(() => {
      const tick = (now) => {
        if (start === undefined) start = now
        const progress = Math.min(1, (now - start) / duration)
        const next = from + (target - from) * easeOutQuart(progress)
        valueRef.current = next
        setValue(next)
        if (progress < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [target, duration, delay, enabled, reduced])

  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

export default useCountUp

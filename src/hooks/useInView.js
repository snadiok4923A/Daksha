import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Tells you when an element scrolls into view (IntersectionObserver).
 *
 *   const [ref, inView] = useInView()
 *   <div ref={ref} className={inView ? 'animate-fade-up' : 'opacity-0'} />
 *
 * `once` (default true) keeps `inView` true after the first intersection, which is what
 * you want for entrance animations and charts that should animate a single time.
 */
export function useInView({ once = true, rootMargin = '0px 0px -8% 0px', threshold = 0.1 } = {}) {
  const [inView, setInView] = useState(false)
  const observerRef = useRef(null)

  const ref = useCallback(
    (node) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
      if (!node) return
      if (typeof IntersectionObserver === 'undefined') {
        setInView(true)
        return
      }
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true)
            if (once) io.disconnect()
          } else if (!once) {
            setInView(false)
          }
        },
        { rootMargin, threshold },
      )
      io.observe(node)
      observerRef.current = io
    },
    [once, rootMargin, threshold],
  )

  useEffect(() => () => observerRef.current?.disconnect(), [])

  return [ref, inView]
}

export default useInView

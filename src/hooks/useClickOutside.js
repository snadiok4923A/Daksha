import { useEffect, useRef } from 'react'

/**
 * Calls `handler` when a pointer interaction starts outside all of `refs`.
 *
 *   useClickOutside([triggerRef, panelRef], close, open)
 */
export function useClickOutside(refs, handler, enabled = true) {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    if (!enabled) return undefined
    const list = Array.isArray(refs) ? refs : [refs]
    const onPointerDown = (event) => {
      const inside = list.some((r) => r?.current && r.current.contains(event.target))
      if (!inside) handlerRef.current?.(event)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])
}

export default useClickOutside

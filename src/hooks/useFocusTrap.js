import { useEffect } from 'react'
import { getFocusable } from '../utils/dom.js'

/**
 * Traps Tab focus inside `ref` while `active`, moves focus in on activation
 * (prefers `[data-autofocus]`), and restores focus to the previously focused element on cleanup.
 */
export function useFocusTrap(ref, active, { restoreFocus = true, autoFocus = true } = {}) {
  useEffect(() => {
    if (!active) return undefined
    const container = ref.current
    if (!container) return undefined

    const previouslyFocused = document.activeElement

    if (autoFocus) {
      const target = container.querySelector('[data-autofocus]') ?? getFocusable(container)[0] ?? container
      // Wait a frame so the element is painted/visible before focusing.
      const raf = requestAnimationFrame(() => target.focus({ preventScroll: true }))
      container.__focusRaf = raf
    }

    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return
      const items = getFocusable(container)
      if (!items.length) {
        event.preventDefault()
        container.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const current = document.activeElement
      if (event.shiftKey && (current === first || !container.contains(current))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (current === last || !container.contains(current))) {
        event.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', onKeyDown)
    return () => {
      container.removeEventListener('keydown', onKeyDown)
      cancelAnimationFrame(container.__focusRaf)
      if (restoreFocus && previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus({ preventScroll: true })
      }
    }
  }, [ref, active, restoreFocus, autoFocus])
}

export default useFocusTrap

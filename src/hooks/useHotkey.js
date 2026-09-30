import { useEffect, useRef } from 'react'

const isEditable = (el) => !!el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))

/**
 * Global keyboard shortcut.
 *
 *   useHotkey('mod+k', () => openSearch())   // Ctrl+K on Windows/Linux, Cmd+K on macOS
 *   useHotkey('escape', close, { enabled: open })
 *   useHotkey('/', focusSearch)              // ignored while typing in inputs
 *
 * Supported modifiers: mod, ctrl, meta, shift, alt.
 */
export function useHotkey(combo, handler, { enabled = true, allowInInputs = false, preventDefault = true } = {}) {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    if (!enabled) return undefined
    const parts = combo
      .toLowerCase()
      .split('+')
      .map((p) => p.trim())
    const key = parts[parts.length - 1]
    const wants = {
      mod: parts.includes('mod'),
      ctrl: parts.includes('ctrl'),
      meta: parts.includes('meta'),
      shift: parts.includes('shift'),
      alt: parts.includes('alt'),
    }

    const onKeyDown = (event) => {
      if (event.key.toLowerCase() !== key) return
      const modPressed = event.ctrlKey || event.metaKey
      if (wants.mod ? !modPressed : event.ctrlKey !== wants.ctrl || event.metaKey !== wants.meta) return
      if (event.shiftKey !== wants.shift || event.altKey !== wants.alt) return
      if (!allowInInputs && isEditable(event.target) && !wants.mod) return
      if (preventDefault) event.preventDefault()
      handlerRef.current?.(event)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [combo, enabled, allowInInputs, preventDefault])
}

/** "Ctrl" on Windows/Linux, "⌘" on macOS - for displaying shortcut hints. */
export const modKeyLabel = () =>
  typeof navigator !== 'undefined' && /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent) ? '⌘' : 'Ctrl'

export default useHotkey

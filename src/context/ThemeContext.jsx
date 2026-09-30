import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS, readString, writeString } from '../utils/storage.js'
import { prefersReducedMotion } from '../hooks/useReducedMotion.js'

const ThemeContext = createContext(null)

const systemPrefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches

function resolve(preference) {
  return preference === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : preference
}

function applyTheme(resolved, { animate }) {
  const root = document.documentElement
  if (animate && !prefersReducedMotion()) {
    root.classList.add('theme-transition')
    window.setTimeout(() => root.classList.remove('theme-transition'), 420)
  }
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
}

/**
 * Theme preference: 'light' | 'dark' | 'system' (persisted). `resolvedTheme` is what is actually shown.
 * The initial class is set by the inline script in index.html to avoid a flash.
 */
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const stored = readString(STORAGE_KEYS.theme, 'system')
    return ['light', 'dark', 'system'].includes(stored) ? stored : 'system'
  })
  const [resolvedTheme, setResolved] = useState(() => resolve(theme))

  // Apply + persist when the preference changes.
  useEffect(() => {
    const next = resolve(theme)
    setResolved(next)
    applyTheme(next, { animate: true })
    writeString(STORAGE_KEYS.theme, theme)
  }, [theme])

  // Follow the OS while on "system".
  useEffect(() => {
    if (theme !== 'system') return undefined
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const next = mql.matches ? 'dark' : 'light'
      setResolved(next)
      applyTheme(next, { animate: true })
    }
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [theme])

  // Keep the browser UI colour in sync (the static <meta> tags only follow the OS).
  useEffect(() => {
    let meta = document.querySelector('meta[name="theme-color"][data-dynamic]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'theme-color'
      meta.dataset.dynamic = 'true'
      document.head.appendChild(meta)
    }
    meta.content = resolvedTheme === 'dark' ? '#0B0F14' : '#F8FAFC'
  }, [resolvedTheme])

  const setTheme = useCallback((next) => setThemeState(next), [])
  const toggleTheme = useCallback(() => setThemeState((prev) => (resolve(prev) === 'dark' ? 'light' : 'dark')), [])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme, isDark: resolvedTheme === 'dark' }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  )
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/** { theme, resolvedTheme, isDark, setTheme('light'|'dark'|'system'), toggleTheme() } */
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}

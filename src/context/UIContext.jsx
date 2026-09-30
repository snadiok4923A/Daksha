import { Suspense, createContext, lazy, useCallback, useContext, useMemo, useState } from 'react'
import { useHotkey } from '../hooks/useHotkey.js'

const UIContext = createContext(null)

// Heavy overlays are code-split and only mounted after their first open.
const CommandPalette = lazy(() => import('../components/layout/CommandPalette.jsx'))
const ScoringModal = lazy(() => import('../components/score/ScoringModal.jsx'))
const ShareProfileModal = lazy(() => import('../components/profile/ShareProfileModal.jsx'))
const RolePickerModal = lazy(() => import('../components/roles/RolePickerModal.jsx'))

/**
 * Global overlays, reachable from anywhere:
 *   const ui = useUI()
 *   ui.openSearch()        Ctrl/⌘+K command palette
 *   ui.openScoring()       "How is this calculated?" modal
 *   ui.openShare()         Share profile / copy link modal
 *   ui.openRolePicker()    Change target role (updates the profile and plan)
 */
export function UIProvider({ children }) {
  const [open, setOpen] = useState({ search: false, scoring: false, share: false, role: false })
  const [mounted, setMounted] = useState({ search: false, scoring: false, share: false, role: false })

  const set = useCallback((key, value) => {
    setOpen((o) => ({ ...o, [key]: value }))
    if (value) setMounted((m) => (m[key] ? m : { ...m, [key]: true }))
  }, [])

  useHotkey('mod+k', () => setOpen((o) => ({ ...o, search: !o.search })), { allowInInputs: true })
  // mount on first toggle via hotkey too
  useHotkey('mod+k', () => setMounted((m) => (m.search ? m : { ...m, search: true })), { allowInInputs: true })

  const api = useMemo(
    () => ({
      openSearch: () => set('search', true),
      closeSearch: () => set('search', false),
      openScoring: () => set('scoring', true),
      closeScoring: () => set('scoring', false),
      openShare: () => set('share', true),
      closeShare: () => set('share', false),
      openRolePicker: () => set('role', true),
      closeRolePicker: () => set('role', false),
    }),
    [set],
  )

  return (
    <UIContext.Provider value={api}>
      {children}
      <Suspense fallback={null}>
        {mounted.search && <CommandPalette open={open.search} onClose={api.closeSearch} />}
        {mounted.scoring && <ScoringModal open={open.scoring} onClose={api.closeScoring} />}
        {mounted.share && <ShareProfileModal open={open.share} onClose={api.closeShare} />}
        {mounted.role && <RolePickerModal open={open.role} onClose={api.closeRolePicker} />}
      </Suspense>
    </UIContext.Provider>
  )
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>')
  return ctx
}

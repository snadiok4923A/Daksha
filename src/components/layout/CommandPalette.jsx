import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  ArrowRight,
  FileText,
  User,
  Zap,
  Briefcase,
  Layers,
  FolderGit2,
} from 'lucide-react'
import { usePresence } from '../../hooks/usePresence.js'
import { useScrollLock } from '../../hooks/useScrollLock.js'
import { useHotkey } from '../../hooks/useHotkey.js'
import { search } from '../../services/searchService.js'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useUI } from '../../context/UIContext.jsx'
import { cn } from '../../utils/cn.js'

const typeIcons = {
  page: FileText,
  action: Zap,
  role: Briefcase,
  skill: Layers,
  project: FolderGit2,
  user: User,
}

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()
  const { toggleTheme } = useTheme()
  const ui = useUI()

  const { mounted, state } = usePresence(open, 200)
  useScrollLock(open)
  useHotkey('Escape', () => open && onClose())

  const results = search(query, { limit: 20 })

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const executeItem = (item) => {
    if (!item) return
    onClose()
    if (item.action) {
      if (item.action === 'toggle-theme') toggleTheme()
      else if (item.action === 'share-profile') ui.openShare()
      else if (item.action === 'how-calculated') ui.openScoring()
      else if (item.action === 'change-role') ui.openRolePicker()
      else if (item.action === 'start-analysis') navigate('/onboarding')
    } else if (item.to) {
      navigate(item.to)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[selectedIndex]) {
        executeItem(results[selectedIndex])
      }
    }
  }

  if (!mounted) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-state={state}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24"
    >
      <div
        className="fixed inset-0 bg-overlay backdrop-blur-sm anim-fade"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        data-state={state}
        className="relative w-full max-w-xl rounded-2xl border border-line bg-surface shadow-pop anim-pop overflow-hidden z-10 flex flex-col max-h-[75dvh]"
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-line gap-3">
          <Search className="size-5 text-fg-subtle shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, role, skill, or page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono font-medium text-fg-muted border border-line">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="py-8 text-center text-sm text-fg-muted">
              No matching commands or pages found.
            </div>
          ) : (
            results.map((item, index) => {
              const Icon = typeIcons[item.type] || FileText
              const isSelected = index === selectedIndex
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors text-xs sm:text-sm',
                    isSelected
                      ? 'bg-primary text-primary-fg'
                      : 'hover:bg-surface-2 text-fg'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'size-7 rounded-lg flex items-center justify-center shrink-0 border',
                        isSelected
                          ? 'border-white/20 bg-white/10 text-white'
                          : 'border-line bg-surface-2 text-fg-muted'
                      )}
                    >
                      <Icon className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{item.title}</div>
                      {item.subtitle && (
                        <div
                          className={cn(
                            'text-[11px] truncate',
                            isSelected ? 'text-primary-fg/80' : 'text-fg-subtle'
                          )}
                        >
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border shrink-0',
                      isSelected
                        ? 'border-white/20 bg-white/10 text-white'
                        : 'border-line bg-surface-2 text-fg-subtle'
                    )}
                  >
                    {item.type}
                  </span>
                </button>
              )
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-surface-2 border-t border-line text-[11px] font-mono text-fg-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
          </div>
          <span>esc to close</span>
        </div>
      </div>
    </div>
  )
}

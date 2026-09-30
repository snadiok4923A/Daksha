import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, Search, Sparkles } from 'lucide-react'
import { APP_NAV } from '../../config/navigation.js'
import { useUI } from '../../context/UIContext.jsx'
import { cn } from '../../utils/cn.js'

export default function MobileBottomBar() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const ui = useUI()

  const primaryItems = APP_NAV.filter((item) => item.mobile === 'primary').slice(0, 4)
  const moreItems = APP_NAV.filter((item) => item.mobile === 'more')

  return (
    <>
      {/* Slide-over sheet for "More" */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-overlay backdrop-blur-sm anim-fade"
            onClick={() => setSheetOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 max-h-[80vh] rounded-t-3xl border-t border-line bg-surface p-6 shadow-pop anim-sheet z-10 space-y-4 overflow-y-auto pb-safe">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <span className="font-semibold text-sm text-fg">More Navigation</span>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="p-1 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.id}
                    to={item.to}
                    onClick={() => setSheetOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium transition-colors',
                        isActive
                          ? 'border-primary bg-primary-soft text-primary-soft-fg'
                          : 'border-line bg-surface-2/60 text-fg hover:bg-surface-2'
                      )
                    }
                  >
                    <Icon className="size-4 text-primary" />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSheetOpen(false)
                  ui.openSearch()
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-line bg-surface-2 text-xs font-medium text-fg"
              >
                <Search className="size-4 text-fg-subtle" />
                <span>Search Everything (⌘K)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-line px-2 py-1.5 pb-safe flex items-center justify-around">
        {primaryItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-medium transition-colors tap',
                  isActive ? 'text-primary font-semibold' : 'text-fg-subtle hover:text-fg'
                )
              }
            >
              <Icon className="size-4 mb-0.5" />
              <span>{item.short || item.label}</span>
            </NavLink>
          )
        })}

        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className={cn(
            'flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-medium text-fg-subtle hover:text-fg tap',
            sheetOpen && 'text-primary font-semibold'
          )}
        >
          <Menu className="size-4 mb-0.5" />
          <span>More</span>
        </button>
      </nav>
    </>
  )
}

import { NavLink } from 'react-router-dom'
import {
  Sparkles,
  ChevronRight,
  ExternalLink,
  Share2,
} from 'lucide-react'
import { BRAND } from '../../config/brand.js'
import { APP_NAV } from '../../config/navigation.js'
import { useAnalysis } from '../../context/AnalysisContext.jsx'
import { useProfileState } from '../../context/ProfileContext.jsx'
import { useUI } from '../../context/UIContext.jsx'
import Badge from '../ui/Badge.jsx'
import { cn } from '../../utils/cn.js'

export default function AppSidebar() {
  const { role, analysis } = useAnalysis()
  const { profile } = useProfileState()
  const ui = useUI()

  const overall = analysis?.score?.overall ?? 0

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-line bg-surface shrink-0 h-screen sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-4 border-b border-line">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-dot font-bold shadow-sm">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-fg">
              {BRAND.name}
            </span>
            <span className="text-[10px] font-mono text-fg-subtle -mt-1">
              Career Readiness
            </span>
          </div>
        </NavLink>
      </div>

      {/* Target Role Switcher Card */}
      <div className="p-3 border-b border-line">
        <button
          type="button"
          onClick={ui.openRolePicker}
          className="w-full text-left p-2.5 rounded-xl border border-line bg-surface-2/60 hover:bg-surface-2 transition-all group"
        >
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-fg-subtle mb-1">
            <span>Target Role</span>
            <span className="group-hover:text-primary transition-colors flex items-center">
              Change <ChevronRight className="size-3" />
            </span>
          </div>
          <div className="font-semibold text-xs text-fg truncate">
            {role?.name || 'Select Role'}
          </div>
          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-line/60">
            <span className="text-[11px] text-fg-subtle">Readiness Score</span>
            <span className="font-mono text-xs font-bold text-primary tabular">
              {overall}/100
            </span>
          </div>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1">
        {APP_NAV.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors tap',
                  isActive
                    ? 'bg-primary text-primary-fg shadow-sm'
                    : 'text-fg-muted hover:text-fg hover:bg-surface-2'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'size-4 shrink-0',
                      isActive ? 'text-primary-fg' : 'text-fg-subtle'
                    )}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.id === 'roadmap' && (
                    <span
                      className={cn(
                        'size-1.5 rounded-full bg-accent animate-pulse-soft',
                        isActive ? 'bg-white' : 'bg-accent'
                      )}
                    />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User / Share Footer */}
      <div className="p-3 border-t border-line space-y-2">
        <button
          type="button"
          onClick={ui.openShare}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-line bg-surface-2 hover:bg-surface-3 text-xs font-medium text-fg transition-colors"
        >
          <Share2 className="size-3.5 text-primary" />
          <span>Share Profile</span>
        </button>

        <NavLink
          to="/app/profile"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-2 transition-colors"
        >
          <div className="size-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs shrink-0 border border-primary/30">
            {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'ME'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-fg truncate">
              {profile.name || 'Anonymous User'}
            </div>
            <div className="text-[11px] font-mono text-fg-subtle truncate">
              @{profile.handle || 'user'}
            </div>
          </div>
        </NavLink>
      </div>
    </aside>
  )
}

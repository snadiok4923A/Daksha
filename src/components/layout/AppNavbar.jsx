import { Link } from 'react-router-dom'
import {
  Search,
  Sun,
  Moon,
  HelpCircle,
  Share2,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { useAnalysis } from '../../context/AnalysisContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useUI } from '../../context/UIContext.jsx'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'

export default function AppNavbar() {
  const { role, analysis } = useAnalysis()
  const { theme, toggleTheme } = useTheme()
  const ui = useUI()

  const overall = analysis?.score?.overall ?? 0
  const band = analysis?.score?.band?.label ?? 'Evaluating'

  return (
    <header className="sticky top-0 z-30 w-full border-b border-line bg-surface/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 gap-3">
        {/* Mobile brand & Role Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link to="/" className="size-8 rounded-xl bg-primary text-white flex items-center justify-center font-dot font-bold shrink-0">
            S
          </Link>
          <button
            type="button"
            onClick={ui.openRolePicker}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 border border-line text-xs font-semibold text-fg"
          >
            <span className="truncate max-w-[130px]">{role?.name || 'Role'}</span>
            <ChevronDown className="size-3 text-fg-subtle" />
          </button>
        </div>

        {/* Desktop Quick Search Trigger */}
        <div className="hidden sm:flex flex-1 max-w-md">
          <button
            type="button"
            onClick={ui.openSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-line bg-surface-2/60 hover:bg-surface-2 text-xs text-fg-muted transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="size-3.5 text-fg-subtle" />
              <span>Search roles, skills, commands...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 rounded bg-surface px-1.5 py-0.5 text-[10px] font-mono text-fg-subtle border border-line">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right tools & badges */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Active Score Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-surface-2 border border-line">
            <span className="text-[11px] text-fg-subtle">Readiness:</span>
            <span className="font-mono text-xs font-bold text-primary tabular">{overall}</span>
            <Badge variant="primary" size="sm">
              {band}
            </Badge>
          </div>

          {/* How is this calculated? */}
          <button
            type="button"
            onClick={ui.openScoring}
            aria-label="How is this calculated?"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-fg-muted hover:text-fg px-2.5 py-1.5 rounded-xl border border-line hover:bg-surface-2 transition-colors"
          >
            <HelpCircle className="size-3.5" />
            <span className="hidden md:inline">Methodology</span>
          </button>

          {/* Share Profile */}
          <Button
            size="sm"
            variant="outline"
            onClick={ui.openShare}
            className="hidden sm:inline-flex"
            icon={Share2}
          >
            Share
          </Button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="size-8 rounded-lg border border-line bg-surface-2 flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-3 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="size-3.5 text-warning" />
            ) : (
              <Moon className="size-3.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

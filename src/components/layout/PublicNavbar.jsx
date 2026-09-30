import { Link } from 'react-router-dom'
import { Sun, Moon, Sparkles, ArrowRight } from 'lucide-react'
import { BRAND } from '../../config/brand.js'
import { MARKETING_NAV } from '../../config/navigation.js'
import { useTheme } from '../../context/ThemeContext.jsx'
import Button from '../ui/Button.jsx'

export default function PublicNavbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-surface/80 backdrop-blur-md">
      <div className="page-wrap flex h-16 items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="size-8 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <span className="font-dot text-lg font-bold">S</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-fg group-hover:text-primary transition-colors">
              {BRAND.name}
            </span>
            <span className="text-[10px] font-mono text-fg-subtle -mt-1 hidden sm:block">
              Career Intelligence
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-fg-muted">
          {MARKETING_NAV.map((item) => (
            <a
              key={item.id}
              href={item.to}
              className="hover:text-fg transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="size-9 rounded-xl border border-line bg-surface-2 flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-3 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="size-4 text-warning" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>

          <Button
            to="/app"
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
          >
            View Demo
          </Button>

          <Button
            to="/onboarding"
            size="sm"
            iconRight={ArrowRight}
          >
            Analyze Profile
          </Button>
        </div>
      </div>
    </header>
  )
}

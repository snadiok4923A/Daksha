import { Link } from 'react-router-dom'
import { BRAND, TRUST } from '../../config/brand.js'

export default function PublicFooter() {
  return (
    <footer className="border-t border-line bg-surface-2/50 py-12 text-sm text-fg-muted">
      <div className="page-wrap space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-lg bg-primary text-white flex items-center justify-center font-dot text-sm font-bold">
                S
              </div>
              <span className="font-bold text-fg tracking-tight">{BRAND.name}</span>
            </div>
            <p className="text-xs text-fg-subtle max-w-sm">
              {BRAND.tagline} Deterministic career readiness scoring and actionable 30-day roadmaps.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs font-medium">
            <Link to="/roles" className="hover:text-fg transition-colors">
              Explore 35 Roles
            </Link>
            <Link to="/app" className="hover:text-fg transition-colors">
              Demo Dashboard
            </Link>
            <Link to="/onboarding" className="hover:text-fg transition-colors">
              Start Assessment
            </Link>
            <a href="#transparency" className="hover:text-fg transition-colors">
              Scoring Methodology
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-fg-subtle">
          <p>© {new Date().getFullYear()} {BRAND.name}. {TRUST.demoDisclaimer}</p>
          <p className="text-[11px] font-mono">{TRUST.scoreDisclaimerShort}</p>
        </div>
      </div>
    </footer>
  )
}

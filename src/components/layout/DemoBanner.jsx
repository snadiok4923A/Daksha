import { Sparkles, RefreshCw, X, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProfileState, useProfileActions } from '../../context/ProfileContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function DemoBanner() {
  const { isDemo, ui } = useProfileState()
  const { dismissDemoBanner, resetToDemo } = useProfileActions()
  const toast = useToast()

  if (!isDemo || ui.demoBannerDismissed) return null

  const handleReset = () => {
    resetToDemo()
    toast({
      title: 'Demo workspace reset',
      description: 'Loaded default demo profile for Alex Morgan.',
      tone: 'info',
    })
  }

  return (
    <div className="bg-primary/10 border-b border-primary-line px-4 py-2 text-xs text-fg flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 min-w-0">
        <Sparkles className="size-3.5 text-primary shrink-0" />
        <span className="truncate">
          Viewing interactive demo as <span className="font-semibold text-primary">Alex Morgan</span>.
        </span>
        <Link
          to="/onboarding"
          className="hidden md:inline-flex items-center gap-1 font-medium text-primary hover:underline ml-2"
        >
          Analyze your own profile <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleReset}
          className="text-fg-subtle hover:text-fg flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded hover:bg-surface-2 transition-colors"
          title="Reset to fresh demo data"
        >
          <RefreshCw className="size-3" />
          Reset Demo
        </button>
        <button
          type="button"
          onClick={dismissDemoBanner}
          className="p-1 rounded-lg text-fg-subtle hover:text-fg hover:bg-surface-2 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

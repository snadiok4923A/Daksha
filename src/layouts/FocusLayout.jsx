import { Outlet, Link } from 'react-router-dom'
import { X, ArrowLeft } from 'lucide-react'
import { BRAND } from '../config/brand.js'

export default function FocusLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-fg selection:bg-primary/20">
      <header className="h-16 border-b border-line bg-surface/60 backdrop-blur-md sticky top-0 z-40">
        <div className="page-wrap h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-primary text-white flex items-center justify-center font-dot font-bold">
              S
            </div>
            <span className="font-bold text-fg tracking-tight">{BRAND.name}</span>
          </Link>
          <Link
            to="/app"
            className="flex items-center gap-1.5 text-xs font-medium text-fg-muted hover:text-fg px-3 py-1.5 rounded-lg border border-line hover:bg-surface-2 transition-colors"
          >
            <span>Exit to App</span>
            <X className="size-3.5" />
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}

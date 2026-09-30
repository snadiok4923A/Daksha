/** Shown while a lazy route chunk loads: a slim animated bar + a calm skeleton (no spinner). */
export default function RouteFallback() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading page" className="min-h-[60dvh]">
      <div className="fixed inset-x-0 top-0 z-[90] h-0.5 overflow-hidden bg-transparent">
        <div className="h-full w-1/3 animate-[slide-bar_1.1s_var(--ease-in-out-quart)_infinite] rounded-full bg-primary" />
      </div>
      <div className="app-wrap space-y-4 py-10">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-4 w-72 max-w-full" />
        <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="skeleton h-40" />
          <div className="skeleton h-40" />
          <div className="skeleton hidden h-40 lg:block" />
        </div>
      </div>
      <style>{`@keyframes slide-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }`}</style>
    </div>
  )
}

import { Component } from 'react'

/** Catches render errors so a bug in one screen never leaves a blank page. */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Hook for real error reporting (Sentry, etc.)
    console.error('[SkillRank] Unhandled UI error:', error, info?.componentStack)
  }

  reset = () => this.setState({ error: null })

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div role="alert" className="grid min-h-[70dvh] place-items-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 text-center shadow-card">
          <p className="eyebrow">Something went wrong</p>
          <h1 className="mt-3 text-h2 text-fg">This screen hit an unexpected error</h1>
          <p className="mt-2 text-sm text-fg-muted">
            Your data is safe - it is stored on this device. Try again, or head back to your overview.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={this.reset}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-fg transition-colors hover:bg-primary-hover"
            >
              Try again
            </button>
            <a
              href="/app"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-line-strong px-5 text-sm font-medium text-fg transition-colors hover:bg-surface-2"
            >
              Go to overview
            </a>
          </div>
        </div>
      </div>
    )
  }
}

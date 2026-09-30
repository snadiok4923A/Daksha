import { Link } from 'react-router-dom'
import { ArrowLeft, Home, Search } from 'lucide-react'
import Button from '../components/ui/Button.jsx'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-bg text-fg">
      <div className="size-16 rounded-2xl bg-surface-2 border border-line flex items-center justify-center text-primary font-mono text-xl font-bold mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Page Not Found</h1>
      <p className="text-sm text-fg-muted max-w-sm mb-6">
        The page you are looking for doesn't exist or may have been moved.
      </p>
      <div className="flex items-center gap-3">
        <Button to="/app" icon={Home}>
          Go to Dashboard
        </Button>
        <Button to="/" variant="secondary" icon={ArrowLeft}>
          Back to Home
        </Button>
      </div>
    </div>
  )
}

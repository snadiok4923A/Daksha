import { FolderOpen } from 'lucide-react'
import { cn } from '../../utils/cn.js'
import Button from './Button.jsx'

export function EmptyState({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'There are no items to display right now.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-line bg-surface-2/40',
        className
      )}
    >
      <div className="size-12 rounded-2xl bg-surface-2 border border-line flex items-center justify-center text-fg-muted mb-4 shadow-sm">
        <Icon className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-fg mb-1">{title}</h3>
      <p className="text-sm text-fg-muted max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState

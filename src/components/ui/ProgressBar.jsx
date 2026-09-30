import { cn } from '../../utils/cn.js'

export function ProgressBar({
  value = 0,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  label,
  className = '',
  ...props
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  const sizes = {
    xs: 'h-1.5',
    sm: 'h-2',
    md: 'h-2.5',
    lg: 'h-3.5',
  }

  const variants = {
    primary: 'bg-primary',
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    gradient: 'bg-gradient-to-r from-primary to-accent',
  }

  return (
    <div className={cn('w-full', className)} {...props}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-xs font-medium text-fg-muted mb-1.5">
          <span>{label}</span>
          <span className="tabular font-mono">{Math.round(percent)}%</span>
        </div>
      )}
      <div className={cn('w-full rounded-full bg-surface-2 overflow-hidden border border-line/40', sizes[size] || sizes.md)}>
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', variants[variant] || variants.primary)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar

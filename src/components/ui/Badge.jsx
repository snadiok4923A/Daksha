import { cn } from '../../utils/cn.js'

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) {
  const variants = {
    default: 'bg-surface-2 text-fg border-line',
    subtle: 'bg-surface-2 text-fg-muted border-transparent',
    primary: 'bg-primary-soft text-primary-soft-fg border-primary-line',
    accent: 'bg-accent-soft text-accent border-transparent',
    success: 'bg-success-soft text-success-fg border-transparent',
    warning: 'bg-warning-soft text-warning-fg border-transparent',
    danger: 'bg-danger-soft text-danger-fg border-transparent',
    outline: 'bg-transparent text-fg-muted border-line-strong',
    inverse: 'bg-inverse text-inverse-fg border-transparent',
  }

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-mono tracking-tight',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }

  const dotColors = {
    default: 'bg-fg-subtle',
    subtle: 'bg-fg-subtle',
    primary: 'bg-primary',
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    outline: 'bg-fg-subtle',
    inverse: 'bg-inverse-fg',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-colors select-none whitespace-nowrap',
        variants[variant] || variants.default,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'size-1.5 rounded-full shrink-0 animate-pulse-soft',
            dotColors[variant] || 'bg-fg-subtle'
          )}
        />
      )}
      {children}
    </span>
  )
}

export default Badge

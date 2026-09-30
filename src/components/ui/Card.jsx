import { cn } from '../../utils/cn.js'

export function Card({
  children,
  hover = false,
  glass = false,
  className = '',
  ...props
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-line bg-surface p-6 shadow-card transition-all duration-200',
        hover && 'card-hover cursor-pointer',
        glass && 'glass',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div
      className={cn('flex flex-col gap-1 pb-4 border-b border-line mb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3
      className={cn('text-h3 text-fg font-semibold tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={cn('text-sm text-fg-muted', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between pt-4 mt-4 border-t border-line',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card

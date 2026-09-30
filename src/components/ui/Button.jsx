import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn.js'

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconRight: IconRight,
    loading = false,
    disabled = false,
    to,
    href,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 select-none tap outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'

  const variants = {
    primary:
      'bg-primary text-primary-fg hover:bg-primary-hover shadow-sm active:scale-[0.98]',
    secondary:
      'bg-surface-2 text-fg hover:bg-surface-3 border border-line active:scale-[0.98]',
    outline:
      'bg-transparent text-fg hover:bg-surface-2 border border-line-strong active:scale-[0.98]',
    ghost:
      'bg-transparent text-fg-muted hover:text-fg hover:bg-surface-2 active:scale-[0.98]',
    danger:
      'bg-danger text-white hover:bg-danger-solid active:scale-[0.98]',
    subtle:
      'bg-primary-soft text-primary-soft-fg hover:bg-primary-soft/80 active:scale-[0.98]',
  }

  const sizes = {
    xs: 'text-xs h-7 px-2.5 gap-1.5 rounded-lg min-h-0 min-w-0',
    sm: 'text-xs h-8 px-3 gap-1.5 rounded-lg min-h-0 min-w-0',
    md: 'text-sm h-10 px-4 gap-2 rounded-xl',
    lg: 'text-base h-12 px-6 gap-2.5 rounded-2xl font-semibold',
    icon: 'h-10 w-10 p-0 rounded-xl justify-center',
    'icon-sm': 'h-8 w-8 p-0 rounded-lg justify-center min-h-0 min-w-0',
  }

  const classes = cn(
    base,
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    className
  )

  const content = (
    <>
      {loading ? (
        <Loader2 className="size-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="size-4 shrink-0" />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight className="size-4 shrink-0" />}
    </>
  )

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        className={classes}
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {content}
    </button>
  )
})

export default Button

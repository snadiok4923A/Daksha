import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, Info, TriangleAlert, CircleAlert, X } from 'lucide-react'
import { cn } from '../utils/cn.js'
import { usePresence } from '../hooks/usePresence.js'

const ToastContext = createContext(null)

const TONES = {
  success: { icon: CheckCircle2, iconClass: 'text-success', bar: 'bg-success' },
  info: { icon: Info, iconClass: 'text-accent', bar: 'bg-accent' },
  warning: { icon: TriangleAlert, iconClass: 'text-warning', bar: 'bg-warning' },
  danger: { icon: CircleAlert, iconClass: 'text-danger', bar: 'bg-danger' },
}

let counter = 0

/**
 * Toasts: `const toast = useToast(); toast.success('Saved', { description: '…' })`
 *
 *   toast({ title, description?, tone: 'success'|'info'|'warning'|'danger', duration?: ms (0 = sticky),
 *           action?: { label, onClick } })
 *   toast.success(title, opts) · toast.info · toast.warning · toast.error  (error = danger tone)
 *   toast.dismiss(id)
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => setToasts((list) => list.map((t) => (t.id === id ? { ...t, open: false } : t))), [])
  const remove = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), [])

  const push = useCallback((input) => {
    const id = `toast-${++counter}`
    const toast = { id, tone: 'info', duration: 4800, open: true, ...input }
    setToasts((list) => [...list.slice(-3), toast])
    return id
  }, [])

  const api = useMemo(() => {
    const fn = (input) => push(typeof input === 'string' ? { title: input } : input)
    fn.success = (title, opts) => push({ ...opts, title, tone: 'success' })
    fn.info = (title, opts) => push({ ...opts, title, tone: 'info' })
    fn.warning = (title, opts) => push({ ...opts, title, tone: 'warning' })
    fn.error = (title, opts) => push({ ...opts, title, tone: 'danger' })
    fn.dismiss = dismiss
    return fn
  }, [push, dismiss])

  return (
    <ToastContext.Provider value={api}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            aria-live="polite"
            aria-atomic="false"
            role="region"
            aria-label="Notifications"
            className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 px-3 pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:items-end md:px-6 md:pb-6"
          >
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} onDismiss={dismiss} onRemove={remove} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss, onRemove }) {
  const { mounted, state } = usePresence(toast.open, 260)
  const tone = TONES[toast.tone] ?? TONES.info
  const Icon = tone.icon
  const timerRef = useRef(null)

  // Auto-dismiss (pauses while hovered / focused).
  const start = useCallback(() => {
    if (!toast.duration) return
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onDismiss(toast.id), toast.duration)
  }, [toast.duration, toast.id, onDismiss])
  const stop = () => clearTimeout(timerRef.current)

  useEffect(() => {
    start()
    return stop
  }, [start])

  useEffect(() => {
    if (!mounted) onRemove(toast.id)
  }, [mounted, onRemove, toast.id])

  if (!mounted) return null

  return (
    <div
      data-state={state}
      onMouseEnter={stop}
      onMouseLeave={start}
      onFocus={stop}
      onBlur={start}
      role={toast.tone === 'danger' ? 'alert' : 'status'}
      className="anim-toast pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-xl border border-line bg-surface p-3.5 pr-10 shadow-pop md:w-96"
    >
      <span className={cn('absolute inset-y-0 left-0 w-1', tone.bar)} aria-hidden="true" />
      <Icon className={cn('mt-0.5 size-5 shrink-0', tone.iconClass)} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-fg">{toast.title}</p>
        {toast.description ? <p className="mt-0.5 text-sm text-fg-muted">{toast.description}</p> : null}
        {toast.action ? (
          <button
            type="button"
            onClick={() => {
              toast.action.onClick?.()
              onDismiss(toast.id)
            }}
            className="mt-2 rounded-md text-sm font-medium text-primary-soft-fg underline-offset-4 hover:underline"
          >
            {toast.action.label}
          </button>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="absolute right-1.5 top-1.5 grid size-8 place-items-center rounded-lg text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { usePresence } from '../../hooks/usePresence.js'
import { useFocusTrap } from '../../hooks/useFocusTrap.js'
import { useHotkey } from '../../hooks/useHotkey.js'
import { useScrollLock } from '../../hooks/useScrollLock.js'
import { cn } from '../../utils/cn.js'

export function Modal({
  open = false,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-xl',
  className = '',
}) {
  const { mounted, state } = usePresence(open, 220)
  const dialogRef = useRef(null)

  useScrollLock(open)
  useFocusTrap(dialogRef, open)
  useHotkey('Escape', () => open && onClose?.())

  if (!mounted) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      data-state={state}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        data-state={state}
        className="fixed inset-0 bg-overlay backdrop-blur-sm anim-fade transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={dialogRef}
        data-state={state}
        className={cn(
          'relative w-full rounded-2xl border border-line bg-surface p-6 shadow-pop anim-pop my-auto z-10',
          maxWidth,
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            {title && (
              <h2 className="text-h3 text-fg font-semibold tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-fg-muted">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="size-8 rounded-lg flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors tap shrink-0"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Modal

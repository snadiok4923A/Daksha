// DOM helpers shared by overlays (Modal, Popover, Tooltip, ...).

export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',')

export function getFocusable(container) {
  if (!container) return []
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('aria-hidden') && el.offsetParent !== null,
  )
}

/**
 * Compute a floating position for a panel next to an anchor rect.
 * Returns viewport-fixed coordinates, flipping vertically when space is tight.
 *
 * @param {DOMRect} anchor    bounding rect of the trigger
 * @param {{width:number,height:number}} panel  measured panel size
 * @param {{side?:'bottom'|'top', align?:'start'|'center'|'end', offset?:number, margin?:number}} opts
 */
export function computePosition(anchor, panel, { side = 'bottom', align = 'start', offset = 8, margin = 8 } = {}) {
  const vw = window.innerWidth
  const vh = window.innerHeight

  let placement = side
  const spaceBelow = vh - anchor.bottom - offset - margin
  const spaceAbove = anchor.top - offset - margin
  if (side === 'bottom' && panel.height > spaceBelow && spaceAbove > spaceBelow) placement = 'top'
  if (side === 'top' && panel.height > spaceAbove && spaceBelow > spaceAbove) placement = 'bottom'

  let top = placement === 'bottom' ? anchor.bottom + offset : anchor.top - panel.height - offset
  let left
  if (align === 'start') left = anchor.left
  else if (align === 'end') left = anchor.right - panel.width
  else left = anchor.left + anchor.width / 2 - panel.width / 2

  left = Math.min(Math.max(margin, left), Math.max(margin, vw - panel.width - margin))
  top = Math.min(Math.max(margin, top), Math.max(margin, vh - panel.height - margin))

  return { top, left, placement }
}

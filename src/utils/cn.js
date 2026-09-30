/**
 * Tiny className joiner (clsx-style).
 *   cn('a', cond && 'b', { c: true, d: false }, ['e', null]) -> 'a b c e'
 *
 * NOTE: there is no Tailwind class de-duplication. Components should avoid
 * relying on `className` overrides that conflict with their own utilities.
 */
export function cn(...args) {
  const out = []
  for (const arg of args) {
    if (!arg) continue
    if (typeof arg === 'string' || typeof arg === 'number') {
      out.push(arg)
    } else if (Array.isArray(arg)) {
      const inner = cn(...arg)
      if (inner) out.push(inner)
    } else if (typeof arg === 'object') {
      for (const key of Object.keys(arg)) if (arg[key]) out.push(key)
    }
  }
  return out.join(' ')
}

export default cn

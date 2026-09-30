// Formatting helpers. Pure functions (safe for Node scripts).

const numberFmt = new Intl.NumberFormat('en-US')
const compactFmt = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

export const formatNumber = (n) => numberFmt.format(Math.round(n ?? 0))
export const formatCompact = (n) => compactFmt.format(n ?? 0)

/** 1 -> 1st, 22 -> 22nd, 83 -> 83rd, 11 -> 11th */
export function ordinal(n) {
  const v = Math.round(n)
  const mod100 = v % 100
  if (mod100 >= 11 && mod100 <= 13) return `${v}th`
  switch (v % 10) {
    case 1:
      return `${v}st`
    case 2:
      return `${v}nd`
    case 3:
      return `${v}rd`
    default:
      return `${v}th`
  }
}

export const pluralize = (n, singular, plural = `${singular}s`) => `${formatNumber(n)} ${n === 1 ? singular : plural}`

/** ['a','b','c'] -> 'a, b and c' */
export function joinList(items = [], conjunction = 'and') {
  const list = items.filter(Boolean)
  if (list.length <= 1) return list[0] ?? ''
  if (list.length === 2) return `${list[0]} ${conjunction} ${list[1]}`
  return `${list.slice(0, -1).join(', ')} ${conjunction} ${list[list.length - 1]}`
}

export function greeting(date = new Date()) {
  const h = date.getHours()
  if (h < 5) return 'Good evening'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const slugify = (str = '') =>
  str
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const truncate = (str = '', max = 120) => (str.length > max ? `${str.slice(0, max - 1).trimEnd()}…` : str)

export function formatBytes(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatDate(input, options = { month: 'short', year: 'numeric' }) {
  if (!input) return ''
  const d = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(d.getTime())) return String(input)
  return d.toLocaleDateString('en-US', options)
}

export function timeAgo(input, now = Date.now()) {
  const t = input instanceof Date ? input.getTime() : new Date(input).getTime()
  if (Number.isNaN(t)) return ''
  const diff = Math.max(0, now - t)
  const s = Math.floor(diff / 1000)
  if (s < 45) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  const w = Math.floor(d / 7)
  if (w < 5) return `${w}w ago`
  const mo = Math.floor(d / 30)
  if (mo < 12) return `${mo}mo ago`
  return `${Math.floor(d / 365)}y ago`
}

/** Short label for durations, e.g. 3 weeks -> "~3 weeks" */
export const formatWeeks = (w) => (w <= 1 ? '~1 week' : `~${w} weeks`)

/** Strip protocol + www for compact display of URLs. */
export const displayUrl = (url = '') =>
  url
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/$/, '')

export const capitalize = (s = '') => (s ? s[0].toUpperCase() + s.slice(1) : s)

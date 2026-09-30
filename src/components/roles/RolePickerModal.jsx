import { useState, useMemo } from 'react'
import { Search, Check, Briefcase } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Badge from '../ui/Badge.jsx'
import { ROLES } from '../../data/roles/roles.js'
import { ROLE_CATEGORIES } from '../../data/roles/categories.js'
import { useProfileActions, useProfileState } from '../../context/ProfileContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { cn } from '../../utils/cn.js'

export default function RolePickerModal({ open, onClose }) {
  const { profile } = useProfileState()
  const { setTargetRole } = useProfileActions()
  const toast = useToast()

  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredRoles = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ROLES.filter((r) => {
      const matchesCat = activeCategory === 'all' || r.category === activeCategory
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.core.some((s) => s.toLowerCase().includes(q)) ||
        r.blurb.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [query, activeCategory])

  const handleSelectRole = (role) => {
    if (role.id === profile.targetRoleId) {
      onClose()
      return
    }
    setTargetRole(role.id)
    toast({
      title: `Role updated to ${role.name}`,
      description: 'Your readiness score and 30-day roadmap have been recalibrated.',
      tone: 'success',
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Select Target Career"
      description="Choose the position you are targeting. SkillRank will recalculate your score against this role's benchmark."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-subtle" />
          <input
            type="text"
            placeholder="Search roles or core skills (e.g. React, Python, ML)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg placeholder:text-fg-subtle outline-none focus:border-primary"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors tap',
              activeCategory === 'all'
                ? 'bg-primary text-primary-fg'
                : 'bg-surface-2 text-fg-muted hover:text-fg'
            )}
          >
            All Roles ({ROLES.length})
          </button>
          {ROLE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors tap',
                activeCategory === cat.id
                  ? 'bg-primary text-primary-fg'
                  : 'bg-surface-2 text-fg-muted hover:text-fg'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Roles list */}
        <div className="max-h-[50dvh] overflow-y-auto space-y-2 pr-1">
          {filteredRoles.length === 0 ? (
            <div className="py-8 text-center text-sm text-fg-muted">
              No matching roles found. Try searching for a different keyword.
            </div>
          ) : (
            filteredRoles.map((role) => {
              const isSelected = role.id === profile.targetRoleId
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleSelectRole(role)}
                  className={cn(
                    'w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all',
                    isSelected
                      ? 'border-primary bg-primary-soft/50 ring-1 ring-primary'
                      : 'border-line bg-surface hover:border-line-strong hover:bg-surface-2/60'
                  )}
                >
                  <div className="space-y-1.5 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-fg">
                        {role.name}
                      </span>
                      {isSelected && (
                        <Badge variant="primary" size="sm" dot>
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-fg-muted line-clamp-1">
                      {role.blurb}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {role.core.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-2 text-fg-subtle border border-line"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="size-6 rounded-full bg-primary text-primary-fg flex items-center justify-center shrink-0">
                      <Check className="size-3.5" />
                    </div>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>
    </Modal>
  )
}

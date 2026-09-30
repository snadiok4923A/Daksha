import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Search,
  Briefcase,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Users,
} from 'lucide-react'
import { ROLES, getRole } from '../data/roles/roles.js'
import { ROLE_CATEGORIES } from '../data/roles/categories.js'
import { SCORE_CATEGORIES } from '../data/scoring.js'
import { useProfileActions } from '../context/ProfileContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'

export default function Roles() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setTargetRole } = useProfileActions()
  const toast = useToast()

  const [activeCategory, setActiveCategory] = useState('all')
  const [query, setQuery] = useState('')

  const selectedRoleId = searchParams.get('role') || ROLES[0]?.id
  const selectedRole = getRole(selectedRoleId) || ROLES[0]

  const filteredRoles = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ROLES.filter((r) => {
      const matchCat = activeCategory === 'all' || r.category === activeCategory
      const matchQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.core.some((s) => s.toLowerCase().includes(q)) ||
        r.blurb.toLowerCase().includes(q)
      return matchCat && matchQuery
    })
  }, [activeCategory, query])

  const handleSelectRole = (r) => {
    setSearchParams({ role: r.id })
  }

  const handleTargetRole = (r) => {
    setTargetRole(r.id)
    toast({
      title: `Target role set to ${r.name}`,
      description: 'Your workspace has been calibrated for this position.',
      tone: 'success',
    })
    navigate('/app')
  }

  return (
    <div className="page-wrap py-12 space-y-10 animate-fade-in">
      {/* 1. HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="eyebrow">Standardized Taxonomies</span>
        <h1 className="text-display text-fg font-extrabold tracking-tight">
          35 Evaluated Tech Roles
        </h1>
        <p className="text-sm sm:text-base text-fg-muted">
          Each role is backed by an independent skill matrix, project expectations, and peer cohort distributions.
        </p>
      </div>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors tap ${
              activeCategory === 'all'
                ? 'bg-primary text-primary-fg shadow-sm'
                : 'bg-surface-2 text-fg-muted hover:text-fg'
            }`}
          >
            All ({ROLES.length})
          </button>
          {ROLE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors tap ${
                activeCategory === cat.id
                  ? 'bg-primary text-primary-fg shadow-sm'
                  : 'bg-surface-2 text-fg-muted hover:text-fg'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-fg-subtle" />
          <input
            type="text"
            placeholder="Search roles or technologies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-line bg-surface text-xs text-fg placeholder:text-fg-subtle outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* 3. SPLIT EXPLORER: ROLES LIST ON LEFT, DETAIL INSPECTOR ON RIGHT */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Roles Grid */}
        <div className="lg:col-span-7 grid gap-3 sm:grid-cols-2">
          {filteredRoles.map((r) => {
            const isSelected = r.id === selectedRole?.id
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSelectRole(r)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-primary bg-primary-soft/40 shadow-sm ring-1 ring-primary'
                    : 'border-line bg-surface hover:border-line-strong hover:bg-surface-2/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-fg">{r.name}</span>
                    <span className="text-[10px] font-mono text-fg-subtle uppercase">
                      {r.category}
                    </span>
                  </div>
                  <p className="text-xs text-fg-muted line-clamp-2 leading-relaxed">
                    {r.blurb}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {r.core.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 text-fg-subtle border border-line"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected Role Detail Card */}
        {selectedRole && (
          <div className="lg:col-span-5 sticky top-24">
            <Card className="p-6 space-y-6 bg-surface shadow-card">
              <div className="space-y-2 pb-4 border-b border-line">
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="sm">
                    {selectedRole.category}
                  </Badge>
                  <span className="text-xs font-mono text-fg-subtle">
                    {selectedRole.platform?.profiles ?? 2400}+ evaluated
                  </span>
                </div>
                <h2 className="text-xl font-bold text-fg">{selectedRole.name}</h2>
                <p className="text-xs text-fg-muted leading-relaxed">
                  {selectedRole.blurb}
                </p>
              </div>

              {/* Core Skill Requirements */}
              <div className="space-y-2">
                <span className="eyebrow block">Required Core Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRole.core.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-surface-2 text-xs font-mono text-fg font-medium border border-line"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dimension Weights for this role */}
              <div className="space-y-3">
                <span className="eyebrow block">Evaluation Weights</span>
                <div className="space-y-2">
                  {SCORE_CATEGORIES.map((cat) => {
                    const weight = selectedRole.weights?.[cat.id] ?? 0.125
                    const percent = Math.round(weight * 100)
                    return (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-fg-muted">{cat.label}</span>
                          <span className="font-mono font-semibold text-fg">{percent}%</span>
                        </div>
                        <ProgressBar value={percent} max={35} size="xs" />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-line">
                <Button
                  className="w-full"
                  onClick={() => handleTargetRole(selectedRole)}
                  iconRight={ArrowRight}
                >
                  Set as My Target Role
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

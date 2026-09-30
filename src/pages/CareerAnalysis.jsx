import { useState, useMemo } from 'react'
import {
  ScanSearch,
  CheckCircle2,
  TrendingUp,
  Award,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Layers,
  ChevronRight,
} from 'lucide-react'
import { useAnalysis } from '../context/AnalysisContext.jsx'
import { useProfileActions } from '../context/ProfileContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import BenchmarkBarChart from '../components/charts/BenchmarkBarChart.jsx'
import { ROLES } from '../data/roles/roles.js'
import { analyzeProfile } from '../engine/index.js'

export default function CareerAnalysis() {
  const { analysis, role, profile } = useAnalysis()
  const { setTargetRole } = useProfileActions()
  const toast = useToast()

  const categories = analysis?.score?.categories ?? []
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || 'technical')

  const selectedCategory = categories.find((c) => c.id === selectedCatId) || categories[0]

  // Compare Alex vs top alternative roles
  const otherRoleScores = useMemo(() => {
    return ROLES.filter((r) => r.id !== role?.id)
      .map((r) => {
        const a = analyzeProfile(profile, { roleId: r.id })
        return {
          role: r,
          score: a.score.overall,
          band: a.score.band.label,
          topPercent: a.ranking.topPercent,
        }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }, [profile, role])

  const handleSwitchRole = (newRoleId, newRoleName) => {
    setTargetRole(newRoleId)
    toast({
      title: `Switched target role to ${newRoleName}`,
      description: 'Career analysis recalibrated for this role requirements.',
      tone: 'success',
    })
  }

  const comparisonData = categories.map((c) => ({
    short: c.short || c.label,
    label: c.label,
    you: c.score,
    average: c.average || 70,
    top10: c.top10 || 90,
  }))

  const presenceItems = analysis?.presence?.items ?? []

  return (
    <div className="space-y-10 animate-fade-in">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow">Diagnostic Breakdown</span>
            <span className="text-fg-subtle">·</span>
            <span className="text-xs font-semibold text-primary">{role?.name}</span>
          </div>
          <h1 className="text-h2 text-fg font-bold mt-1">
            Career Readiness Analysis
          </h1>
          <p className="text-xs text-fg-muted mt-1">
            In-depth evaluation of all 8 core dimensions evaluated for this position.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="primary" size="lg">
            Overall Score: {analysis?.score?.overall ?? 0}/100
          </Badge>
        </div>
      </div>

      {/* 2. BENCHMARK COMPARISON BAR CHART */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="eyebrow block">Peer Calibration</span>
            <h3 className="text-base font-semibold text-fg">
              You vs Platform Average vs Top 10%
            </h3>
          </div>
          <span className="text-xs text-fg-subtle font-mono">
            Calibrated against {analysis?.ranking?.total ?? 2000}+ peer profiles
          </span>
        </div>

        <BenchmarkBarChart comparison={comparisonData} height={300} />
      </Card>

      {/* 3. DIMENSION DEEP DIVE EXPLORER */}
      <div className="space-y-4">
        <div>
          <span className="eyebrow block">Pillar Diagnostics</span>
          <h2 className="text-h3 text-fg font-semibold">Explore Each Dimension</h2>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors tap border ${
                selectedCatId === cat.id
                  ? 'border-primary bg-primary text-primary-fg shadow-sm'
                  : 'border-line bg-surface hover:bg-surface-2 text-fg'
              }`}
            >
              {cat.label} ({cat.score})
            </button>
          ))}
        </div>

        {/* Selected Dimension Card */}
        {selectedCategory && (
          <Card className="p-6 space-y-6 bg-surface-2/40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-line">
              <div className="space-y-1">
                <span className="eyebrow block">Selected Dimension</span>
                <h3 className="text-xl font-bold text-fg">{selectedCategory.label}</h3>
                <p className="text-xs text-fg-muted max-w-xl">
                  {selectedCategory.summary}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-surface p-3.5 rounded-xl border border-line shrink-0">
                <div className="text-right">
                  <div className="text-[11px] font-mono text-fg-subtle">Dimension Score</div>
                  <div className="font-mono text-2xl font-bold text-primary tabular">
                    {selectedCategory.score}/100
                  </div>
                </div>
                <div className="text-right border-l border-line pl-4">
                  <div className="text-[11px] font-mono text-fg-subtle">Role Weight</div>
                  <div className="font-mono text-2xl font-bold text-fg tabular">
                    {Math.round(selectedCategory.weight * 100)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostic Signals */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-fg-muted">
                Observed Signals & Evidence
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {selectedCategory.signals?.map((signal, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-surface border border-line flex items-start gap-2.5 text-xs text-fg-muted"
                  >
                    <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
                    <span>{signal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dimension Insight / Recommendation */}
            <div className="p-4 rounded-xl border border-primary-line bg-primary-soft text-primary-soft-fg text-xs space-y-1">
              <span className="font-semibold block">Key Recommendation:</span>
              <p className="leading-relaxed">
                {selectedCategory.insight ||
                  'Maintain steady progression by completing role-specific roadmap milestones.'}
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* 4. CROSS-ROLE READINESS COMPARISON */}
      <div className="space-y-4">
        <div>
          <span className="eyebrow block">Career Flexibility</span>
          <h2 className="text-h3 text-fg font-semibold">How You Score in Adjacent Roles</h2>
          <p className="text-xs text-fg-muted">
            Your current skills and portfolio evaluated against other potential careers.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {otherRoleScores.map((item) => (
            <div
              key={item.role.id}
              className="p-4 rounded-2xl border border-line bg-surface flex flex-col justify-between space-y-3 hover:border-line-strong transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-fg">{item.role.name}</h4>
                  <p className="text-xs text-fg-muted line-clamp-1">{item.role.blurb}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-base font-bold text-fg tabular">
                    {item.score}
                  </span>
                  <span className="text-[10px] text-fg-subtle block">/100</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-line/60">
                <Badge variant={item.score >= 75 ? 'success' : 'subtle'} size="sm">
                  Top {item.topPercent}%
                </Badge>
                <button
                  type="button"
                  onClick={() => handleSwitchRole(item.role.id, item.role.name)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  Set as Target <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

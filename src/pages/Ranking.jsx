import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Trophy,
  Filter,
  Users,
  ShieldCheck,
  TrendingUp,
  Award,
  ExternalLink,
  ChevronDown,
} from 'lucide-react'
import { useAnalysis } from '../context/AnalysisContext.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import ScoreRing from '../components/ui/ScoreRing.jsx'
import { computeRanking } from '../engine/ranking.js'
import { getCommunity } from '../data/community.js'
import { TRUST } from '../config/brand.js'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

export default function Ranking() {
  const { analysis, role } = useAnalysis()
  const overall = analysis?.score?.overall ?? 82

  const [filters, setFilters] = useState({
    experience: 'all',
    work: 'all',
    status: 'all',
  })

  // Compute ranking with filters
  const ranking = useMemo(() => {
    const f = {}
    if (filters.experience !== 'all') f.experience = filters.experience
    if (filters.work !== 'all') f.work = filters.work
    if (filters.status !== 'all') f.status = filters.status
    return computeRanking({ role, score: overall, filters: f })
  }, [role, overall, filters])

  // Mock distribution brackets for the role
  const distributionData = [
    { range: '< 50', count: 120, min: 0, max: 49 },
    { range: '50-59', count: 340, min: 50, max: 59 },
    { range: '60-69', count: 680, min: 60, max: 69 },
    { range: '70-79', count: 790, min: 70, max: 79 },
    { range: '80-89', count: 410, min: 80, max: 89 },
    { range: '90+', count: 90, min: 90, max: 100 },
  ]

  // Community peers
  const communityMembers = useMemo(() => {
    return getCommunity()
      .filter((m) => m.role.id === role?.id || true)
      .slice(0, 8)
  }, [role])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow">Peer Benchmarking</span>
            <span className="text-fg-subtle">·</span>
            <span className="text-xs font-semibold text-primary">{role?.name}</span>
          </div>
          <h1 className="text-h2 text-fg font-bold mt-1">Platform Standing</h1>
          <p className="text-xs text-fg-muted mt-1">
            {TRUST.rankingDisclaimerShort}
          </p>
        </div>

        <Badge variant="primary" size="lg" dot>
          Live Evaluation
        </Badge>
      </div>

      {/* 2. TOP BANNER / SCORE POSITION */}
      <Card className="p-6 bg-gradient-to-tr from-surface via-surface to-primary-soft/30 border-line">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-fg-subtle">
                Cohort Evaluation
              </span>
              <Badge variant="success" size="sm">
                Top {ranking.topPercent}%
              </Badge>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
              Rank #{ranking.rank} of {ranking.total} Profiles
            </h2>

            <p className="text-xs sm:text-sm text-fg-muted max-w-xl leading-relaxed">
              Your overall score of <span className="font-bold text-fg font-mono">{overall}</span> places you in the 82nd percentile among evaluated {role?.name} candidates.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-mono">
              <div className="flex items-center gap-1.5 bg-surface-2 px-3 py-1.5 rounded-xl border border-line">
                <span className="text-fg-subtle">Cohort Average:</span>
                <span className="font-bold text-fg">{ranking.mean}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-2 px-3 py-1.5 rounded-xl border border-line">
                <span className="text-fg-subtle">Top 10% Cutoff:</span>
                <span className="font-bold text-primary">{ranking.top10}+</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center bg-surface p-6 rounded-2xl border border-line shrink-0 min-w-[220px] shadow-sm">
            <ScoreRing score={overall} size={140} subtitle="Percentile" />
            <span className="text-xs font-mono uppercase text-fg-subtle mt-2 font-medium">
              Percentile: {ranking.percentile}th
            </span>
          </div>
        </div>
      </Card>

      {/* 3. COHORT FILTERS */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-fg">Filter Peer Cohort</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {/* Experience Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-fg-subtle">
              Experience Level
            </label>
            <select
              value={filters.experience}
              onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
              className="w-full bg-surface-2 border border-line rounded-xl p-2 text-xs text-fg font-medium outline-none focus:border-primary"
            >
              <option value="all">All Experience Levels</option>
              <option value="junior">Junior (0-2 yrs)</option>
              <option value="mid">Mid-Level (3-5 yrs)</option>
              <option value="senior">Senior (6+ yrs)</option>
            </select>
          </div>

          {/* Work Preference */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-fg-subtle">
              Work Preference
            </label>
            <select
              value={filters.work}
              onChange={(e) => setFilters({ ...filters, work: e.target.value })}
              className="w-full bg-surface-2 border border-line rounded-xl p-2 text-xs text-fg font-medium outline-none focus:border-primary"
            >
              <option value="all">All Arrangements</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-fg-subtle">
              Career Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full bg-surface-2 border border-line rounded-xl p-2 text-xs text-fg font-medium outline-none focus:border-primary"
            >
              <option value="all">All Candidates</option>
              <option value="professional">Professional</option>
              <option value="student">Student / Early Career</option>
            </select>
          </div>
        </div>
      </Card>

      {/* 4. SCORE DISTRIBUTION CHART */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="eyebrow block">Distribution Curve</span>
            <h3 className="text-base font-semibold text-fg">Where You Fit in the Pool</h3>
          </div>
          <span className="text-xs font-mono text-fg-subtle">
            Primary bracket highlighted
          </span>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="range" stroke="var(--c-fg-subtle)" fontSize={11} />
              <YAxis stroke="var(--c-fg-subtle)" fontSize={11} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload
                    return (
                      <div className="rounded-xl border border-line bg-surface p-2.5 shadow-lift text-xs">
                        <div className="font-semibold text-fg">Score Bracket: {item.range}</div>
                        <div className="text-primary font-mono mt-1 font-bold">
                          {item.count} Candidates
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {distributionData.map((entry, index) => {
                  const isUserBucket = overall >= entry.min && overall <= entry.max
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isUserBucket ? 'var(--c-primary)' : 'var(--c-surface-3)'}
                    />
                  )
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 5. COMMUNITY BENCHMARK TABLE */}
      <div className="space-y-4">
        <div>
          <span className="eyebrow block">Community Leaderboard</span>
          <h2 className="text-h3 text-fg font-semibold">Evaluated Peer Profiles</h2>
          <p className="text-xs text-fg-muted">
            Representative candidates across tech roles to show score variance.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 border-b border-line text-fg-subtle font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Target Role</th>
                  <th className="py-3 px-4">Readiness</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {communityMembers.map((m, idx) => (
                  <tr key={m.profile.handle} className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-7 rounded-full bg-primary-soft text-primary font-bold flex items-center justify-center text-[10px] shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-fg">{m.profile.name}</div>
                          <div className="text-[11px] text-fg-subtle font-mono">
                            @{m.profile.handle}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-fg">{m.role.name}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-primary tabular">
                          {m.score}
                        </span>
                        <Badge variant="subtle" size="sm">
                          {m.score >= 85 ? 'Top 5%' : m.score >= 75 ? 'Top 15%' : 'Top 30%'}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-fg-muted">{m.profile.location}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/u/${m.profile.handle}`}
                        className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                      >
                        <span>View</span>
                        <ExternalLink className="size-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle2,
  Circle,
  ExternalLink,
  Share2,
  Calendar,
  Sparkles,
  ChevronRight,
  Layers,
  FileText,
  AlertCircle,
  Check,
} from 'lucide-react'
import { useAnalysis } from '../context/AnalysisContext.jsx'
import { useProfileState, useProfileActions } from '../context/ProfileContext.jsx'
import { useUI } from '../context/UIContext.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import ScoreRing from '../components/ui/ScoreRing.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import ScoreRadarChart from '../components/charts/ScoreRadarChart.jsx'
import ScoreHistoryChart from '../components/charts/ScoreHistoryChart.jsx'
import { TRUST } from '../config/brand.js'

export default function Dashboard() {
  const { analysis, role, profile, history, scoreDelta } = useAnalysis()
  const { roadmapProgress } = useProfileState()
  const { toggleRoadmapTask, upsertSkill } = useProfileActions()
  const ui = useUI()

  const overall = analysis?.score?.overall ?? 0
  const band = analysis?.score?.band?.label ?? 'Evaluating'
  const ranking = analysis?.ranking
  const categories = analysis?.score?.categories ?? []
  const recommendedSkills = analysis?.skills?.recommended?.slice(0, 4) ?? []
  const currentWeek = analysis?.roadmap?.weeks?.[0]
  const weekTasks = currentWeek?.tasks ?? []

  // Count completed tasks in week 1
  const completedCount = weekTasks.filter((t) => roadmapProgress[t.id]).length

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. WELCOME & ACTION BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow">Overview</span>
            <span className="text-fg-subtle">·</span>
            <button
              type="button"
              onClick={ui.openRolePicker}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              {role?.name} <ChevronRight className="size-3" />
            </button>
          </div>
          <h1 className="text-h2 text-fg font-bold mt-1">
            Readiness Cockpit
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={ui.openShare}
            icon={Share2}
          >
            Share Profile
          </Button>
          <Button
            size="sm"
            to="/app/roadmap"
            iconRight={ArrowRight}
          >
            30-Day Plan
          </Button>
        </div>
      </div>

      {/* 2. HEADLINE METRICS ROW */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Readiness Card */}
        <Card className="p-6 flex flex-col justify-between relative overflow-hidden bg-surface">
          <div className="flex items-start justify-between">
            <div>
              <span className="eyebrow block">Career Readiness</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-fg">{band}</span>
                <Badge variant="primary" size="sm">
                  {overall}/100
                </Badge>
              </div>
            </div>
            {scoreDelta && (
              <div className="inline-flex items-center gap-1 text-xs font-semibold text-success bg-success-soft px-2 py-0.5 rounded-full">
                <TrendingUp className="size-3" />
                <span>+{scoreDelta.value} pts</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center my-4">
            <ScoreRing score={overall} size={150} subtitle="Overall" />
          </div>

          <div className="pt-4 border-t border-line space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-fg-subtle">Platform Ranking</span>
              <span className="font-mono font-semibold text-fg">
                #{ranking?.rank ?? '-'} of {ranking?.total ?? '-'}
              </span>
            </div>
            <div className="text-xs text-primary font-medium flex items-center justify-between">
              <span>Standing:</span>
              <span className="font-mono font-bold">Top {ranking?.topPercent ?? 20}%</span>
            </div>
          </div>
        </Card>

        {/* Score Progression Trend */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="eyebrow">Score Trajectory</span>
              <span className="text-[11px] font-mono text-fg-subtle">Last 12 mos</span>
            </div>
            <h3 className="text-sm font-semibold text-fg">Historical Growth</h3>
          </div>

          <div className="my-2">
            <ScoreHistoryChart history={history} height={160} />
          </div>

          <p className="text-xs text-fg-muted pt-2 border-t border-line">
            Steady gains driven by project additions and TypeScript practice.
          </p>
        </Card>

        {/* 8-Dimensional Radar Chart */}
        <Card className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="eyebrow">Dimensional Balance</span>
            <button
              type="button"
              onClick={ui.openScoring}
              className="text-[11px] text-primary hover:underline font-medium"
            >
              Weights & Rules
            </button>
          </div>
          <h3 className="text-sm font-semibold text-fg">You vs Peer Average</h3>

          <div className="my-1">
            <ScoreRadarChart categories={categories} height={180} />
          </div>

          <div className="flex items-center justify-around text-[11px] font-mono pt-2 border-t border-line text-fg-subtle">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary" /> You
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-fg-subtle" /> Peer Avg
            </span>
          </div>
        </Card>
      </div>

      {/* 3. 8-DIMENSION READINESS BREAKDOWN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h3 text-fg font-semibold">Evaluation Dimensions</h2>
            <p className="text-xs text-fg-muted">
              How your profile scores across the 8 key pillars for {role?.name}.
            </p>
          </div>
          <Button to="/app/analysis" variant="ghost" size="sm" iconRight={ChevronRight}>
            Detailed analysis
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to="/app/analysis"
              className="p-4 rounded-2xl border border-line bg-surface hover:border-line-strong hover:shadow-card transition-all block group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-fg group-hover:text-primary transition-colors">
                  {cat.label}
                </span>
                <span className="font-mono text-xs font-bold text-fg tabular">
                  {cat.score}/100
                </span>
              </div>

              <ProgressBar
                value={cat.score}
                variant={cat.score >= 80 ? 'primary' : cat.score >= 60 ? 'accent' : 'warning'}
                size="sm"
                className="mb-2.5"
              />

              <p className="text-[11px] text-fg-muted line-clamp-2 leading-relaxed">
                {cat.insight || cat.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. SPLIT ROW: PRIORITY SKILL GAPS & 30-DAY PLAN */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Skill Gaps */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="eyebrow block">High-Leverage Gaps</span>
              <h3 className="text-base font-semibold text-fg">Recommended Skill Focus</h3>
            </div>
            <Button to="/app/skills" variant="ghost" size="sm" iconRight={ChevronRight}>
              All skills
            </Button>
          </div>

          <div className="space-y-3">
            {recommendedSkills.map((gap) => (
              <div
                key={gap.id}
                className="p-3.5 rounded-xl border border-line bg-surface-2/50 flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-fg">{gap.label}</span>
                    <Badge variant="subtle" size="sm">
                      {gap.currentLabel} → {gap.targetLabel}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-fg-muted truncate">
                    {gap.reason || 'Critical for target role readiness'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-fg-subtle hidden sm:inline">
                    {gap.effort}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      upsertSkill(gap.label, gap.target)
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-primary text-primary-fg hover:bg-primary-hover transition-colors"
                  >
                    Mark Acquired
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 30-Day Plan Snapshot */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="eyebrow block">Actionable Roadmap</span>
              <h3 className="text-base font-semibold text-fg">
                Week 1: {currentWeek?.title || 'Immediate Milestones'}
              </h3>
            </div>
            <Button to="/app/roadmap" variant="ghost" size="sm" iconRight={ChevronRight}>
              Full 4 weeks
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-fg-muted mb-1">
              <span>Week 1 Progress:</span>
              <span className="font-mono font-semibold">
                {completedCount} of {weekTasks.length} completed
              </span>
            </div>
            <ProgressBar value={completedCount} max={Math.max(1, weekTasks.length)} size="sm" />
          </div>

          <div className="space-y-2 pt-2">
            {weekTasks.slice(0, 4).map((task) => {
              const isDone = Boolean(roadmapProgress[task.id])
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => toggleRoadmapTask(task.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${
                    isDone
                      ? 'border-line/60 bg-surface-2/30 text-fg-subtle line-through'
                      : 'border-line bg-surface hover:bg-surface-2 text-fg'
                  }`}
                >
                  <div
                    className={`size-4 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                      isDone
                        ? 'bg-success border-success text-white'
                        : 'border-line-strong bg-surface'
                    }`}
                  >
                    {isDone && <Check className="size-3" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium">{task.title}</div>
                    <div className="text-[10px] font-mono text-fg-subtle mt-0.5">
                      {task.hours}h · {task.impact || 'High impact'}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

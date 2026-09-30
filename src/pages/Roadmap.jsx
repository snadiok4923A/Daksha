import { useState } from 'react'
import {
  Calendar,
  CheckCircle2,
  Check,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Award,
} from 'lucide-react'
import { useAnalysis } from '../context/AnalysisContext.jsx'
import { useProfileActions, useProfileState } from '../context/ProfileContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'

export default function Roadmap() {
  const { analysis, role } = useAnalysis()
  const { roadmapProgress } = useProfileState()
  const { toggleRoadmapTask } = useProfileActions()
  const toast = useToast()

  const weeks = analysis?.roadmap?.weeks ?? []

  // Count total tasks & completed
  let totalTasks = 0
  let completedTasks = 0
  weeks.forEach((w) => {
    ;(w.tasks || []).forEach((t) => {
      totalTasks++
      if (roadmapProgress[t.id]) completedTasks++
    })
  })

  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const handleTaskToggle = (task) => {
    const nextState = !roadmapProgress[task.id]
    toggleRoadmapTask(task.id)
    if (nextState) {
      toast({
        title: 'Task completed',
        description: `Completed "${task.title}". Your readiness is growing!`,
        tone: 'success',
      })
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow">Actionable Trajectory</span>
            <span className="text-fg-subtle">·</span>
            <span className="text-xs font-semibold text-primary">{role?.name}</span>
          </div>
          <h1 className="text-h2 text-fg font-bold mt-1">30-Day Growth Roadmap</h1>
          <p className="text-xs text-fg-muted mt-1">
            Prioritized week-by-week milestones specifically engineered to maximize your score for {role?.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" size="lg">
            {completedTasks} / {totalTasks} Tasks Done
          </Badge>
        </div>
      </div>

      {/* 2. PROGRESS BANNER */}
      <Card className="p-6 bg-surface-2/40 border-line">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="eyebrow">Completion Status</span>
              <span className="font-mono text-xs font-bold text-primary">
                {progressPercent}% Complete
              </span>
            </div>
            <h3 className="text-lg font-bold text-fg">
              Keep momentum. Each completed task improves your percentile standing.
            </h3>
            <p className="text-xs text-fg-muted">
              Completing this 4-week cycle typically yields a +8 to +15 point readiness increase.
            </p>
            <ProgressBar value={progressPercent} size="md" className="pt-2 max-w-md" />
          </div>

          <div className="bg-surface p-4 rounded-2xl border border-line shrink-0 min-w-[200px] text-center">
            <span className="text-xs text-fg-subtle block font-mono">Target Finish</span>
            <span className="text-2xl font-bold font-mono text-primary">
              4 Weeks
            </span>
            <div className="text-[11px] text-fg-muted mt-1">~6-8 hours / week</div>
          </div>
        </div>
      </Card>

      {/* 3. WEEKS LIST */}
      <div className="space-y-6">
        {weeks.map((week, weekIdx) => {
          const weekTasks = week.tasks || []
          const weekCompleted = weekTasks.filter((t) => roadmapProgress[t.id]).length
          const isWeekDone = weekTasks.length > 0 && weekCompleted === weekTasks.length

          return (
            <Card key={weekIdx} className="p-6 space-y-5">
              {/* Week Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-line">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-primary-soft text-primary font-mono text-xs font-bold border border-primary-line">
                      Week {week.week || weekIdx + 1}
                    </span>
                    <h3 className="text-base font-bold text-fg">
                      {week.title || week.theme || `Milestone Phase ${weekIdx + 1}`}
                    </h3>
                    {isWeekDone && (
                      <Badge variant="success" size="sm">
                        Phase Complete
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-fg-muted">
                    {week.focus || week.description || 'Targeted technical deliverables and evidence collection.'}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-xs text-fg-subtle">
                    {weekCompleted} of {weekTasks.length} Done
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5">
                {weekTasks.map((task) => {
                  const isDone = Boolean(roadmapProgress[task.id])

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleTaskToggle(task)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                        isDone
                          ? 'border-line/60 bg-surface-2/30 text-fg-subtle'
                          : 'border-line bg-surface hover:border-line-strong hover:bg-surface-2/60 text-fg'
                      }`}
                    >
                      {/* Checkbox */}
                      <div
                        className={`size-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                          isDone
                            ? 'bg-success border-success text-white'
                            : 'border-line-strong bg-surface'
                        }`}
                      >
                        {isDone && <Check className="size-3.5" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={`text-xs font-semibold ${
                              isDone ? 'line-through text-fg-muted' : 'text-fg'
                            }`}
                          >
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {task.hours && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-fg-subtle bg-surface-2 px-2 py-0.5 rounded border border-line">
                                <Clock className="size-2.5" />
                                {task.hours}h
                              </span>
                            )}
                            {task.impact && (
                              <Badge
                                variant={task.impact.toLowerCase().includes('high') ? 'primary' : 'subtle'}
                                size="sm"
                              >
                                {task.impact}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p
                          className={`text-xs leading-relaxed ${
                            isDone ? 'line-through text-fg-subtle' : 'text-fg-muted'
                          }`}
                        >
                          {task.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

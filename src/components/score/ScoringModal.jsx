import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Badge from '../ui/Badge.jsx'
import { SCORE_CATEGORIES } from '../../data/scoring.js'
import { TRUST } from '../../config/brand.js'
import { useAnalysis } from '../../context/AnalysisContext.jsx'

export default function ScoringModal({ open, onClose }) {
  const { analysis, role } = useAnalysis()

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="How SkillRank Works"
      description="Transparent, deterministic assessment calibrated specifically for your target career."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 max-h-[60dvh] overflow-y-auto pr-1">
        {/* Transparency callout */}
        <div className="rounded-xl border border-primary-line bg-primary-soft p-4 flex gap-3">
          <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs text-primary-soft-fg leading-relaxed">
            <span className="font-semibold block mb-0.5">Not a hiring decision or black-box algorithm.</span>
            {TRUST.scoreDisclaimer}
          </div>
        </div>

        {/* Current target role breakdown */}
        {role && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-line">
            <div>
              <span className="eyebrow block">Active Role Weights</span>
              <span className="text-sm font-semibold text-fg">{role.name}</span>
            </div>
            <Badge variant="primary" size="sm">
              Overall: {analysis?.score?.overall ?? 0}/100
            </Badge>
          </div>
        )}

        {/* 8 Categories */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-fg-muted">
            The 8 Evaluation Dimensions
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {SCORE_CATEGORIES.map((cat) => {
              const catAnalysis = analysis?.score?.categories?.find((c) => c.id === cat.id)
              const weightPercent = role?.weights ? Math.round(role.weights[cat.id] * 100) : null
              return (
                <div
                  key={cat.id}
                  className="rounded-xl border border-line bg-surface p-3.5 space-y-2 hover:border-line-strong transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-fg">{cat.label}</span>
                    {weightPercent !== null && (
                      <span className="text-[11px] font-mono text-fg-subtle">
                        {weightPercent}% weight
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-fg-muted leading-relaxed">
                    {cat.summary}
                  </p>
                  {catAnalysis && (
                    <div className="pt-1 flex items-center justify-between text-xs border-t border-line/60">
                      <span className="text-fg-subtle">Your Score:</span>
                      <span className="font-mono font-bold text-fg">
                        {catAnalysis.score}/100
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* What drives higher scores */}
        <div className="rounded-xl border border-line bg-surface-2/60 p-4 space-y-2">
          <h4 className="text-xs font-semibold text-fg flex items-center gap-2">
            <CheckCircle2 className="size-4 text-success" />
            Deterministic & Actionable
          </h4>
          <p className="text-xs text-fg-muted leading-relaxed">
            Every point is tied to concrete requirements: skills you've verified, depth of open-source projects,
            years of experience matched against industry baselines, and cross-platform presence. There are no
            random scores — you can directly influence your standing by completing your 30-day roadmap.
          </p>
        </div>
      </div>
    </Modal>
  )
}

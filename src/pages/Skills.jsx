import { useState, useMemo } from 'react'
import {
  Layers,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  Search,
  Sparkles,
  Check,
  ChevronDown,
} from 'lucide-react'
import { useAnalysis } from '../context/AnalysisContext.jsx'
import { useProfileActions, useProfileState } from '../context/ProfileContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import Modal from '../components/ui/Modal.jsx'
import { SKILLS, findSkill } from '../data/roles/skillLibrary.js'
import { SELECTABLE_LEVELS, levelLabel } from '../data/scoring.js'

export default function Skills() {
  const { analysis, role } = useAnalysis()
  const { profile } = useProfileState()
  const { upsertSkill, removeItem } = useProfileActions()
  const toast = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState('intermediate')

  const skillInsights = analysis?.skills ?? { have: [], recommended: [], strong: [], toImprove: [] }
  const userSkills = profile?.skills ?? []

  // Filter skills by search query
  const filteredUserSkills = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return userSkills
    return userSkills.filter((s) => s.name.toLowerCase().includes(q))
  }, [userSkills, searchQuery])

  // Count role coverage
  const requiredCount = role?.requirements?.length ?? 10
  const matchedCount = skillInsights.have?.length ?? 0
  const coveragePercent = Math.min(100, Math.round((matchedCount / Math.max(1, requiredCount)) * 100))

  const handleAddSkill = (e) => {
    e?.preventDefault()
    if (!newSkillName.trim()) return
    upsertSkill(newSkillName.trim(), newSkillLevel)
    toast({
      title: 'Skill added',
      description: `Added ${newSkillName.trim()} (${newSkillLevel}) to your profile.`,
      tone: 'success',
    })
    setNewSkillName('')
    setModalOpen(false)
  }

  const handleLevelChange = (skillName, newLevel) => {
    upsertSkill(skillName, newLevel)
    toast({
      title: 'Proficiency updated',
      description: `${skillName} updated to ${newLevel}.`,
      tone: 'info',
    })
  }

  const handleRemoveSkill = (skillId, skillName) => {
    removeItem('skills', skillId)
    toast({
      title: 'Skill removed',
      description: `${skillName} removed from your profile.`,
      tone: 'warning',
    })
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow">Skill Matrix</span>
            <span className="text-fg-subtle">·</span>
            <span className="text-xs font-semibold text-primary">{role?.name}</span>
          </div>
          <h1 className="text-h2 text-fg font-bold mt-1">Skills & Proficiency</h1>
          <p className="text-xs text-fg-muted mt-1">
            Evaluate your technical stack and bridge high-priority skill requirements.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setModalOpen(true)}
          icon={Plus}
        >
          Add Skill
        </Button>
      </div>

      {/* 2. ROLE COVERAGE HERO */}
      <Card className="p-6 bg-gradient-to-r from-primary-soft/40 via-surface to-accent-soft/20 border-line">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="eyebrow">Requirement Match</span>
              <Badge variant="primary" size="sm">
                {coveragePercent}% Covered
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-fg">
              {matchedCount} of {requiredCount} Core Role Requirements Met
            </h3>
            <p className="text-xs text-fg-muted leading-relaxed">
              Our evaluation engine checks both direct skills and evidence demonstrated across your projects and GitHub repos.
            </p>
            <ProgressBar value={coveragePercent} size="md" className="pt-2 max-w-md" />
          </div>

          <div className="bg-surface p-4 rounded-2xl border border-line shrink-0 min-w-[200px] text-center">
            <span className="text-xs text-fg-subtle block font-mono">Verified Skills</span>
            <span className="text-3xl font-bold font-mono text-primary tabular">
              {userSkills.length}
            </span>
            <div className="text-[11px] text-fg-muted mt-1">Total in your profile</div>
          </div>
        </div>
      </Card>

      {/* 3. HIGH-LEVERAGE GAPS TO CLOSE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="eyebrow block">High Leverage</span>
            <h2 className="text-h3 text-fg font-semibold">Priority Skill Gaps</h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skillInsights.recommended?.slice(0, 6).map((gap) => (
            <div
              key={gap.id}
              className="p-4 rounded-2xl border border-line bg-surface flex flex-col justify-between space-y-3 hover:border-line-strong transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-fg">{gap.label}</span>
                  <span className="text-[11px] font-mono text-primary font-semibold">
                    {gap.effort}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-fg-muted mb-2">
                  <span className="text-fg-subtle font-mono">{gap.currentLabel}</span>
                  <span>→</span>
                  <span className="font-semibold text-fg font-mono">{gap.targetLabel}</span>
                </div>
                <p className="text-xs text-fg-muted line-clamp-2">{gap.reason}</p>
              </div>

              <button
                type="button"
                onClick={() => upsertSkill(gap.label, gap.target)}
                className="w-full py-2 px-3 rounded-xl bg-surface-2 hover:bg-primary hover:text-primary-fg text-xs font-semibold text-fg transition-all text-center"
              >
                Mark as Mastered
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. VERIFIED SKILLS LIST & MANAGEMENT */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="eyebrow block">Inventory</span>
            <h2 className="text-h3 text-fg font-semibold">Your Verified Skills ({userSkills.length})</h2>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-fg-subtle" />
            <input
              type="text"
              placeholder="Filter your skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-line bg-surface text-xs text-fg placeholder:text-fg-subtle outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUserSkills.map((s) => (
            <div
              key={s.id}
              className="p-3.5 rounded-xl border border-line bg-surface flex items-center justify-between gap-3 hover:border-line-strong transition-colors"
            >
              <div className="min-w-0">
                <div className="font-semibold text-xs text-fg truncate">{s.name}</div>
                <div className="text-[11px] font-mono text-fg-subtle capitalize mt-0.5">
                  Level: {s.level}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Level selector */}
                <select
                  value={s.level}
                  onChange={(e) => handleLevelChange(s.name, e.target.value)}
                  className="text-xs bg-surface-2 border border-line rounded-lg px-2 py-1 text-fg outline-none focus:border-primary capitalize font-medium"
                >
                  {SELECTABLE_LEVELS.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lvl.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s.id, s.name)}
                  aria-label={`Remove ${s.name}`}
                  className="p-1 rounded-lg text-fg-subtle hover:text-danger hover:bg-danger-soft transition-colors"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD SKILL MODAL */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Skill to Profile"
        description="Select a technology and your current proficiency level."
      >
        <form onSubmit={handleAddSkill} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-fg">Skill Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Next.js, Docker, GraphQL, PyTorch..."
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-fg">Proficiency Level</label>
            <div className="grid grid-cols-2 gap-2">
              {SELECTABLE_LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setNewSkillLevel(lvl.id)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-colors ${
                    newSkillLevel === lvl.id
                      ? 'border-primary bg-primary-soft text-primary-soft-fg ring-1 ring-primary'
                      : 'border-line bg-surface-2 text-fg hover:bg-surface-3'
                  }`}
                >
                  <div className="font-semibold">{lvl.label}</div>
                  <div className="text-[10px] text-fg-subtle mt-0.5">
                    {lvl.id === 'beginner' && 'Basics, tutorials, toy projects'}
                    {lvl.id === 'intermediate' && 'Comfortable, shipped small apps'}
                    {lvl.id === 'advanced' && 'Production-ready, deep patterns'}
                    {lvl.id === 'expert' && 'Architectural level, mentoring'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Add to Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

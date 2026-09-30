import { useState } from 'react'
import {
  FolderKanban,
  Plus,
  ExternalLink,
  Trash2,
  Edit2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { GithubIcon } from '../components/ui/Icons.jsx'
import { useAnalysis } from '../context/AnalysisContext.jsx'
import { useProfileActions, useProfileState } from '../context/ProfileContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import Modal from '../components/ui/Modal.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

export default function Projects() {
  const { analysis, role } = useAnalysis()
  const { profile } = useProfileState()
  const { addItem, updateItem, removeItem } = useProfileActions()
  const toast = useToast()

  const projects = profile?.projects ?? []
  const evaluatedProjects = analysis?.projects?.items ?? []

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tech: '',
    url: '',
    repo: '',
    complexity: 3,
    impact: 3,
    year: new Date().getFullYear(),
  })

  const openAddModal = () => {
    setEditingId(null)
    setFormData({
      name: '',
      description: '',
      tech: '',
      url: '',
      repo: '',
      complexity: 3,
      impact: 3,
      year: new Date().getFullYear(),
    })
    setModalOpen(true)
  }

  const openEditModal = (p) => {
    setEditingId(p.id)
    setFormData({
      name: p.name || '',
      description: p.description || '',
      tech: Array.isArray(p.tech) ? p.tech.join(', ') : p.tech || '',
      url: p.url || '',
      repo: p.repo || '',
      complexity: p.complexity || 3,
      impact: p.impact || 3,
      year: p.year || new Date().getFullYear(),
    })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e?.preventDefault()
    if (!formData.name.trim()) return

    const techArray = formData.tech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      tech: techArray,
      url: formData.url.trim(),
      repo: formData.repo.trim(),
      complexity: Number(formData.complexity),
      impact: Number(formData.impact),
      year: Number(formData.year),
    }

    if (editingId) {
      updateItem('projects', editingId, payload)
      toast({
        title: 'Project updated',
        description: `Saved changes to "${formData.name}".`,
        tone: 'success',
      })
    } else {
      addItem('projects', payload)
      toast({
        title: 'Project added',
        description: `Added "${formData.name}" to your portfolio.`,
        tone: 'success',
      })
    }
    setModalOpen(false)
  }

  const handleDelete = (id, name) => {
    removeItem('projects', id)
    toast({
      title: 'Project deleted',
      description: `Removed "${name}" from your portfolio.`,
      tone: 'warning',
    })
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow">Portfolio Proof</span>
            <span className="text-fg-subtle">·</span>
            <span className="text-xs font-semibold text-primary">{role?.name}</span>
          </div>
          <h1 className="text-h2 text-fg font-bold mt-1">Production Projects</h1>
          <p className="text-xs text-fg-muted mt-1">
            Real projects demonstrate real competence. Each project is evaluated for technical depth and relevance.
          </p>
        </div>

        <Button size="sm" onClick={openAddModal} icon={Plus}>
          Add Project
        </Button>
      </div>

      {/* 2. PROJECTS LIST */}
      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects added yet"
          description="Projects carry up to 25% of your career score. Add full-stack applications, open-source repos, or case studies."
          actionLabel="Add Your First Project"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => {
            const evalItem = evaluatedProjects.find((p) => p.name === project.name || p.id === project.id)
            const relevancePercent = evalItem ? Math.round(evalItem.relevance * 100) : 75

            return (
              <Card
                key={project.id}
                className="p-6 flex flex-col justify-between space-y-4 hover:border-line-strong transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-fg">{project.name}</h3>
                        <Badge variant="subtle" size="sm">
                          {project.year || 2026}
                        </Badge>
                      </div>
                      <span className="text-xs text-primary font-mono font-medium">
                        {relevancePercent}% Relevance to {role?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(project)}
                        aria-label="Edit project"
                        className="p-1.5 rounded-lg text-fg-subtle hover:text-fg hover:bg-surface-2 transition-colors"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(project.id, project.name)}
                        aria-label="Delete project"
                        className="p-1.5 rounded-lg text-fg-subtle hover:text-danger hover:bg-danger-soft transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-fg-muted leading-relaxed line-clamp-3 mb-4">
                    {project.description || 'No description provided.'}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(project.tech || []).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-2 text-fg-subtle border border-line"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Metrics bar */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-line/60 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface-2/60">
                      <span className="text-fg-subtle">Complexity:</span>
                      <span className="font-mono font-bold text-fg">
                        {project.complexity || 3}/5
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface-2/60">
                      <span className="text-fg-subtle">Impact:</span>
                      <span className="font-mono font-bold text-fg">
                        {project.impact || 3}/5
                      </span>
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="flex items-center gap-3 pt-2">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <ExternalLink className="size-3" />
                      Live Demo
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted hover:text-fg"
                    >
                      <GithubIcon className="size-3.5" />
                      Repository
                    </a>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* ADD / EDIT PROJECT MODAL */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Project' : 'Add Project'}
        description="Share a production project, open-source library, or significant app."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-fg">Project Name</label>
            <input
              type="text"
              required
              placeholder="e.g. AgriDoctor, Pulse Dashboard"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-fg">Description</label>
            <textarea
              rows={3}
              required
              placeholder="What problem did it solve? What was your architecture and impact?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-fg">
              Technologies (comma separated)
            </label>
            <input
              type="text"
              placeholder="React, TypeScript, Tailwind, Node.js"
              value={formData.tech}
              onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-fg">Live Demo URL</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-line bg-surface-2 text-xs text-fg outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-fg">Repository URL</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={formData.repo}
                onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-line bg-surface-2 text-xs text-fg outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-fg">Technical Complexity (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.complexity}
                onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-fg">User / Team Impact (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              {editingId ? 'Save Changes' : 'Add Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Link2,
  ExternalLink,
  Plus,
  Trash2,
  Save,
  Globe,
  Share2,
} from 'lucide-react'
import { GithubIcon } from '../components/ui/Icons.jsx'
import { useProfileState, useProfileActions } from '../context/ProfileContext.jsx'
import { useUI } from '../context/UIContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import Modal from '../components/ui/Modal.jsx'

export default function Profile() {
  const { profile } = useProfileState()
  const { setProfileFields, setLink, addItem, removeItem } = useProfileActions()
  const ui = useUI()
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: profile.name || '',
    handle: profile.handle || '',
    headline: profile.headline || '',
    bio: profile.bio || '',
    location: profile.location || '',
    yearsExperience: profile.yearsExperience || 3,
  })

  const [linksData, setLinksData] = useState({
    github: profile.links?.github || '',
    linkedin: profile.links?.linkedin || '',
    portfolio: profile.links?.portfolio || '',
    twitter: profile.links?.twitter || '',
  })

  // Experience modal state
  const [expModalOpen, setExpModalOpen] = useState(false)
  const [newExp, setNewExp] = useState({
    role: '',
    company: '',
    period: '',
    description: '',
  })

  const handleSaveBasic = (e) => {
    e?.preventDefault()
    setProfileFields(formData)
    setLink('github', linksData.github)
    setLink('linkedin', linksData.linkedin)
    setLink('portfolio', linksData.portfolio)
    setLink('twitter', linksData.twitter)

    toast({
      title: 'Profile updated',
      description: 'Your profile details and links have been saved.',
      tone: 'success',
    })
  }

  const handleAddExperience = (e) => {
    e?.preventDefault()
    if (!newExp.role || !newExp.company) return
    addItem('experience', newExp)
    toast({
      title: 'Experience added',
      description: `Added ${newExp.role} at ${newExp.company}.`,
      tone: 'success',
    })
    setNewExp({ role: '', company: '', period: '', description: '' })
    setExpModalOpen(false)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Candidate Dossier</span>
          <h1 className="text-h2 text-fg font-bold mt-1">Profile & Evidence</h1>
          <p className="text-xs text-fg-muted mt-1">
            Maintain your work history, linked platforms, and public portfolio bio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            to={`/u/${profile.handle || 'alex-morgan'}`}
            iconRight={ExternalLink}
          >
            Public View
          </Button>
          <Button size="sm" onClick={handleSaveBasic} icon={Save}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* 2. BASIC INFORMATION FORM */}
      <form onSubmit={handleSaveBasic}>
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-line">
            <User className="size-4 text-primary" />
            <h3 className="text-base font-semibold text-fg">Basic Information</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-fg">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-fg">Public Handle / Username</label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 rounded-l-xl border border-r-0 border-line bg-surface text-xs font-mono text-fg-subtle">
                  /u/
                </span>
                <input
                  type="text"
                  required
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-r-xl border border-line bg-surface-2 text-sm font-mono text-fg outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-fg">Professional Headline</label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="e.g. Frontend Engineer specializing in React, TypeScript & Design Systems"
              className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-fg">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. San Francisco, CA (or Remote)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-fg">Years of Professional Experience</label>
              <input
                type="number"
                min="0"
                max="40"
                value={formData.yearsExperience}
                onChange={(e) => setFormData({ ...formData, yearsExperience: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-fg">Bio / Summary</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Connected Links */}
          <div className="pt-4 border-t border-line space-y-4">
            <div className="flex items-center gap-2">
              <Link2 className="size-4 text-primary" />
              <h4 className="text-sm font-semibold text-fg">Connected Platforms & Links</h4>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-fg-subtle">GitHub Profile URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={linksData.github}
                  onChange={(e) => setLinksData({ ...linksData, github: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-surface-2 text-xs text-fg outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-fg-subtle">LinkedIn Profile URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={linksData.linkedin}
                  onChange={(e) => setLinksData({ ...linksData, linkedin: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-surface-2 text-xs text-fg outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-fg-subtle">Personal Portfolio URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={linksData.portfolio}
                  onChange={(e) => setLinksData({ ...linksData, portfolio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-surface-2 text-xs text-fg outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-fg-subtle">X / Twitter</label>
                <input
                  type="text"
                  placeholder="https://twitter.com/..."
                  value={linksData.twitter}
                  onChange={(e) => setLinksData({ ...linksData, twitter: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-surface-2 text-xs text-fg outline-none focus:border-primary font-mono"
                />
              </div>
            </div>
          </div>
        </Card>
      </form>

      {/* 3. WORK EXPERIENCE HISTORY */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div className="flex items-center gap-2">
            <Briefcase className="size-4 text-primary" />
            <h3 className="text-base font-semibold text-fg">Work Experience History</h3>
          </div>
          <Button size="sm" variant="secondary" onClick={() => setExpModalOpen(true)} icon={Plus}>
            Add Role
          </Button>
        </div>

        <div className="space-y-3">
          {(profile.experience || []).map((exp) => (
            <div
              key={exp.id}
              className="p-4 rounded-xl border border-line bg-surface-2/40 flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-fg">{exp.role}</h4>
                  <span className="text-fg-subtle">at</span>
                  <span className="text-sm font-medium text-primary">{exp.company}</span>
                </div>
                <div className="text-[11px] font-mono text-fg-subtle">{exp.period}</div>
                <p className="text-xs text-fg-muted pt-1 leading-relaxed">
                  {exp.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeItem('experience', exp.id)}
                aria-label="Delete experience"
                className="p-1 rounded-lg text-fg-subtle hover:text-danger hover:bg-danger-soft transition-colors"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* ADD EXPERIENCE MODAL */}
      <Modal
        open={expModalOpen}
        onClose={() => setExpModalOpen(false)}
        title="Add Work Experience"
        description="Add a previous or current engineering or design role."
      >
        <form onSubmit={handleAddExperience} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-fg">Job Title / Role</label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Frontend Engineer"
              value={newExp.role}
              onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-fg">Company</label>
              <input
                type="text"
                required
                placeholder="e.g. Vercel, Acme Corp"
                value={newExp.company}
                onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-fg">Period</label>
              <input
                type="text"
                placeholder="2023 - Present"
                value={newExp.period}
                onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-fg">Key Responsibilities & Impact</label>
            <textarea
              rows={3}
              placeholder="What did you build? What was the scale or performance improvement?"
              value={newExp.description}
              onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setExpModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Save Role
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

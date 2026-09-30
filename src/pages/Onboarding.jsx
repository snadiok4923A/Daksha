import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Briefcase,
  User,
  Layers,
  FolderGit2,
  Sparkles,
  Link2,
} from 'lucide-react'
import { ROLES, getRole, DEFAULT_ROLE_ID } from '../data/roles/roles.js'
import { useProfileActions } from '../context/ProfileContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'

export default function Onboarding() {
  const navigate = useNavigate()
  const { setTargetRole, setProfileFields, upsertSkill, addItem, setLink } = useProfileActions()
  const toast = useToast()

  const [step, setStep] = useState(1)
  const totalSteps = 4

  // State
  const [selectedRoleId, setSelectedRoleId] = useState(DEFAULT_ROLE_ID)
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    headline: '',
    yearsExperience: 2,
    location: '',
  })
  const [selectedSkills, setSelectedSkills] = useState(['React', 'JavaScript', 'CSS', 'HTML', 'Git'])
  const [projectInfo, setProjectInfo] = useState({
    name: '',
    description: '',
    tech: 'React, TypeScript, CSS',
    url: '',
    repo: '',
  })

  const targetRole = getRole(selectedRoleId) || ROLES[0]

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Finalize setup
      setTargetRole(selectedRoleId)
      setProfileFields({
        name: basicInfo.name || 'Aspiring Professional',
        handle: (basicInfo.name || 'user').toLowerCase().replace(/\s+/g, '-'),
        headline: basicInfo.headline || `${targetRole.name} Candidate`,
        yearsExperience: Number(basicInfo.yearsExperience),
        location: basicInfo.location || 'Remote',
      })

      // Add selected skills
      selectedSkills.forEach((s) => {
        upsertSkill(s, 'intermediate')
      })

      // Add initial project if provided
      if (projectInfo.name.trim()) {
        addItem('projects', {
          name: projectInfo.name.trim(),
          description: projectInfo.description.trim() || 'Core showcase project demonstrating full architectural flow.',
          tech: projectInfo.tech.split(',').map((t) => t.trim()),
          url: projectInfo.url.trim(),
          repo: projectInfo.repo.trim(),
          complexity: 3,
          impact: 3,
          year: new Date().getFullYear(),
        })
      }

      toast({
        title: 'Profile analyzed successfully!',
        description: `Your custom career readiness dashboard is ready for ${targetRole.name}.`,
        tone: 'success',
      })

      navigate('/app')
    }
  }

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  return (
    <div className="page-wrap py-10 sm:py-16 max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Step Header */}
      <div className="space-y-3 text-center">
        <div className="flex items-center justify-between text-xs font-mono text-fg-subtle">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
        </div>
        <ProgressBar value={step} max={totalSteps} size="sm" />
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        {/* STEP 1: SELECT ROLE */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-bold text-fg">Choose Your Target Career</h2>
              <p className="text-xs text-fg-muted">
                SkillRank calibrates all score benchmarks, questions, and roadmaps to your chosen position.
              </p>
            </div>

            <div className="grid gap-2.5 max-h-[50dvh] overflow-y-auto pr-1">
              {ROLES.slice(0, 14).map((r) => {
                const isSelected = r.id === selectedRoleId
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRoleId(r.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-primary bg-primary-soft/50 ring-1 ring-primary'
                        : 'border-line bg-surface hover:bg-surface-2'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-fg">{r.name}</div>
                      <div className="text-[11px] text-fg-muted line-clamp-1">{r.blurb}</div>
                    </div>
                    {isSelected && (
                      <div className="size-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                        <Check className="size-3" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 2: BASIC INFO */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-bold text-fg">Tell Us About Yourself</h2>
              <p className="text-xs text-fg-muted">
                Basic details for your profile dossier and cohort classification.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-fg">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Maya Chen"
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-fg">Headline / Current Title</label>
                <input
                  type="text"
                  placeholder={`e.g. Aspiring ${targetRole.name}`}
                  value={basicInfo.headline}
                  onChange={(e) => setBasicInfo({ ...basicInfo, headline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-fg">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={basicInfo.yearsExperience}
                    onChange={(e) =>
                      setBasicInfo({ ...basicInfo, yearsExperience: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-fg">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, CA"
                    value={basicInfo.location}
                    onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CORE SKILLS */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-bold text-fg">Select Your Current Skills</h2>
              <p className="text-xs text-fg-muted">
                Tap technologies you are familiar with for {targetRole.name}.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 max-h-[45dvh] overflow-y-auto p-1">
              {[...targetRole.core, 'Git', 'Docker', 'Testing', 'REST APIs', 'GraphQL', 'Tailwind CSS', 'SQL'].map(
                (skill) => {
                  const isChecked = selectedSkills.includes(skill)
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                        isChecked
                          ? 'bg-primary text-primary-fg shadow-sm'
                          : 'bg-surface-2 text-fg hover:bg-surface-3 border border-line'
                      }`}
                    >
                      <span>{skill}</span>
                      {isChecked && <Check className="size-3" />}
                    </button>
                  )
                }
              )}
            </div>
          </div>
        )}

        {/* STEP 4: FIRST PROJECT */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-bold text-fg">Highlight a Showcase Project</h2>
              <p className="text-xs text-fg-muted">
                Demonstrated applications boost your portfolio score by up to 25%.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-fg">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Analytics Platform, E-Commerce Engine"
                  value={projectInfo.name}
                  onChange={(e) => setProjectInfo({ ...projectInfo, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-sm text-fg outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-fg">Description & Architecture</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what it does and your role in building it..."
                  value={projectInfo.description}
                  onChange={(e) => setProjectInfo({ ...projectInfo, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-surface-2 text-xs text-fg outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-fg">Live URL (optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={projectInfo.url}
                    onChange={(e) => setProjectInfo({ ...projectInfo, url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-surface-2 text-xs text-fg outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-fg">Repo URL (optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={projectInfo.repo}
                    onChange={(e) => setProjectInfo({ ...projectInfo, repo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-surface-2 text-xs text-fg outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-line">
          {step > 1 ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setStep(step - 1)}
              icon={ArrowLeft}
            >
              Previous
            </Button>
          ) : (
            <div />
          )}

          <Button size="sm" onClick={handleNext} iconRight={ArrowRight}>
            {step === totalSteps ? 'Generate Score & Dashboard' : 'Next Step'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

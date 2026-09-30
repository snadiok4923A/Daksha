import { useState } from 'react'
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Monitor,
  Shield,
  Bell,
  Database,
  Download,
  RotateCcw,
  Trash2,
  Check,
} from 'lucide-react'
import { useProfileState, useProfileActions } from '../context/ProfileContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'

export default function Settings() {
  const { settings, profile } = useProfileState()
  const { setPrivacy, setNotification, resetToDemo, resetToEmpty } = useProfileActions()
  const { theme, setTheme } = useTheme()
  const toast = useToast()

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `skillrank-profile-${profile.handle || 'user'}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    toast({
      title: 'Profile exported',
      description: 'Saved your complete SkillRank profile JSON to your computer.',
      tone: 'success',
    })
  }

  const handleResetDemo = () => {
    resetToDemo()
    toast({
      title: 'Demo data loaded',
      description: 'Reset workspace to default Alex Morgan profile.',
      tone: 'info',
    })
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your workspace? This will erase all entered skills and projects.')) {
      resetToEmpty()
      toast({
        title: 'Workspace cleared',
        description: 'All local data has been reset.',
        tone: 'warning',
      })
    }
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* 1. HEADER */}
      <div>
        <span className="eyebrow">Preferences</span>
        <h1 className="text-h2 text-fg font-bold mt-1">Workspace Settings</h1>
        <p className="text-xs text-fg-muted mt-1">
          Manage your appearance theme, privacy visibility, and local storage data.
        </p>
      </div>

      {/* 2. THEME & DISPLAY */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-line">
          <Sun className="size-4 text-primary" />
          <h3 className="text-base font-semibold text-fg">Appearance & Theme</h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Monitor },
          ].map((mode) => {
            const Icon = mode.icon
            const isSelected = theme === mode.id
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setTheme(mode.id)}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all tap ${
                  isSelected
                    ? 'border-primary bg-primary-soft text-primary font-semibold ring-1 ring-primary'
                    : 'border-line bg-surface-2/60 text-fg-muted hover:text-fg hover:bg-surface-2'
                }`}
              >
                <Icon className="size-5" />
                <span className="text-xs">{mode.label}</span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* 3. PRIVACY & VISIBILITY */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-line">
          <Shield className="size-4 text-primary" />
          <h3 className="text-base font-semibold text-fg">Privacy & Public Visibility</h3>
        </div>

        <div className="space-y-3">
          {/* Public Profile toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-line bg-surface-2/40">
            <div>
              <div className="text-xs font-semibold text-fg">Public Profile URL</div>
              <p className="text-[11px] text-fg-muted">
                Allow anyone with your link to view your verified skills at /u/{profile.handle}
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy?.publicProfile ?? true}
              onChange={(e) => setPrivacy('publicProfile', e.target.checked)}
              className="size-4 accent-primary cursor-pointer"
            />
          </div>

          {/* Show Score publicly */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-line bg-surface-2/40">
            <div>
              <div className="text-xs font-semibold text-fg">Display Numerical Readiness Score</div>
              <p className="text-[11px] text-fg-muted">
                Display the overall score and radar chart on your public link.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy?.showScore ?? true}
              onChange={(e) => setPrivacy('showScore', e.target.checked)}
              className="size-4 accent-primary cursor-pointer"
            />
          </div>

          {/* Recruiter Contact */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-line bg-surface-2/40">
            <div>
              <div className="text-xs font-semibold text-fg">Recruiter Contact Inquiries</div>
              <p className="text-[11px] text-fg-muted">
                Show your LinkedIn and contact link for career opportunities.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy?.contactable ?? true}
              onChange={(e) => setPrivacy('contactable', e.target.checked)}
              className="size-4 accent-primary cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* 4. NOTIFICATIONS */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-line">
          <Bell className="size-4 text-primary" />
          <h3 className="text-base font-semibold text-fg">Notifications & Reminders</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-line bg-surface-2/40">
            <div>
              <div className="text-xs font-semibold text-fg">Roadmap Weekly Cadence</div>
              <p className="text-[11px] text-fg-muted">
                Weekly reminder to check off completed tasks and update skill proficiencies.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications?.roadmapReminder ?? true}
              onChange={(e) => setNotification('roadmapReminder', e.target.checked)}
              className="size-4 accent-primary cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* 5. DATA MANAGEMENT & RESETS */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-line">
          <Database className="size-4 text-primary" />
          <h3 className="text-base font-semibold text-fg">Data Management & Reset</h3>
        </div>

        <p className="text-xs text-fg-muted">
          Your profile, scores, and roadmap progress are saved exclusively inside your browser's LocalStorage.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            icon={Download}
          >
            Export JSON
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetDemo}
            icon={RotateCcw}
          >
            Reset to Demo Profile (Alex Morgan)
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={handleClearAll}
            icon={Trash2}
          >
            Clear All Data
          </Button>
        </div>
      </Card>
    </div>
  )
}

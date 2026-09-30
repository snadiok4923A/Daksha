import { useState, useRef } from 'react'
import {
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  Trash2,
  Sparkles,
  Download,
  Info,
} from 'lucide-react'
import { useAnalysis } from '../context/AnalysisContext.jsx'
import { useProfileActions, useProfileState } from '../context/ProfileContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import ScoreRing from '../components/ui/ScoreRing.jsx'

export default function Resume() {
  const { analysis, role } = useAnalysis()
  const { profile } = useProfileState()
  const { setResume } = useProfileActions()
  const toast = useToast()
  const fileInputRef = useRef(null)

  const resumeData = analysis?.resume ?? {
    overall: 84,
    scores: {
      ats: 86,
      contentQuality: 89,
      technicalRelevance: 93,
      projectStrength: 83,
      experienceRelevance: 70,
    },
    keywords: {
      matched: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Tailwind', 'Git', 'REST APIs'],
      missing: ['Testing / Jest', 'Next.js', 'Docker', 'CI/CD'],
    },
    suggestions: [
      'Quantify results on your internal dashboard bullet points (e.g. reduced load time by 35%).',
      'Explicitly highlight unit test coverage and automated integration workflows.',
      'Group core frontend libraries in a prominent "Technical Skills" top block for automated ATS parsers.',
    ],
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setResume({
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    })

    toast({
      title: 'Resume uploaded successfully',
      description: `Analyzed ${file.name} against ${role?.name} ATS parameters.`,
      tone: 'success',
    })
  }

  const handleRemoveResume = () => {
    setResume(null)
    toast({
      title: 'Resume removed',
      description: 'Your resume has been cleared from this workspace.',
      tone: 'info',
    })
  }

  const subScores = [
    { label: 'ATS Parsability', score: resumeData.scores?.ats ?? 85, desc: 'Formatting, clean font hierarchy, text-based sections' },
    { label: 'Technical Relevance', score: resumeData.scores?.technicalRelevance ?? 90, desc: 'Alignment with core role stack' },
    { label: 'Content Quality', score: resumeData.scores?.contentQuality ?? 85, desc: 'Action verbs, impact metrics, clarity' },
    { label: 'Project Strength', score: resumeData.scores?.projectStrength ?? 80, desc: 'Evidence of architecture & shipping' },
    { label: 'Experience Match', score: resumeData.scores?.experienceRelevance ?? 75, desc: 'Seniority and responsibilities baseline' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow">Document Intelligence</span>
            <span className="text-fg-subtle">·</span>
            <span className="text-xs font-semibold text-primary">{role?.name}</span>
          </div>
          <h1 className="text-h2 text-fg font-bold mt-1">Resume & ATS Readiness</h1>
          <p className="text-xs text-fg-muted mt-1">
            How your resume matches recruiter keywords and automated Applicant Tracking Systems.
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileUpload}
        />

        <div className="flex items-center gap-2">
          {profile?.resume && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveResume}
              icon={Trash2}
            >
              Clear
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            icon={Upload}
          >
            {profile?.resume ? 'Replace Resume' : 'Upload Resume'}
          </Button>
        </div>
      </div>

      {/* 2. OVERALL SCORE CARD */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Badge variant="primary" size="sm">
                ATS Calibrated
              </Badge>
              {profile?.resume && (
                <span className="text-xs font-mono text-fg-subtle">
                  File: {profile.resume.name}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-fg">Resume Readiness Summary</h3>
            <p className="text-xs sm:text-sm text-fg-muted max-w-lg leading-relaxed">
              Your resume demonstrates strong technical alignment for {role?.name}. Automated parsers will successfully extract your core skills with minimal friction.
            </p>
          </div>

          <div className="flex flex-col items-center bg-surface-2 p-5 rounded-2xl border border-line shrink-0 min-w-[200px]">
            <ScoreRing score={resumeData.overall} size={130} subtitle="ATS Score" />
            <span className="text-xs font-semibold text-primary mt-2">
              Competitive Standard
            </span>
          </div>
        </div>

        {/* Sub-scores */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-6 mt-6 border-t border-line">
          {subScores.map((s) => (
            <div key={s.label} className="p-3.5 rounded-xl bg-surface-2/50 border border-line/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-fg">{s.label}</span>
                <span className="font-mono font-bold text-primary">{s.score}%</span>
              </div>
              <ProgressBar value={s.score} size="xs" />
              <p className="text-[11px] text-fg-subtle">{s.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 3. KEYWORD MATCH ANALYSIS */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Matched Keywords */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 text-success" />
            <h3 className="text-base font-semibold text-fg">Matched Core Keywords</h3>
          </div>
          <p className="text-xs text-fg-muted">
            These essential terms were positively identified in your profile and project descriptions:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {(resumeData.keywords?.matched || []).map((kw) => (
              <span
                key={kw}
                className="px-2.5 py-1 rounded-lg bg-success-soft text-success-fg border border-success/30 text-xs font-mono font-medium flex items-center gap-1.5"
              >
                <CheckCircle className="size-3" />
                {kw}
              </span>
            ))}
          </div>
        </Card>

        {/* Missing Keywords */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-warning" />
            <h3 className="text-base font-semibold text-fg">Missing Target Keywords</h3>
          </div>
          <p className="text-xs text-fg-muted">
            Frequently sought by recruiters for {role?.name} that are currently absent:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {(resumeData.keywords?.missing || []).map((kw) => (
              <span
                key={kw}
                className="px-2.5 py-1 rounded-lg bg-warning-soft text-warning-fg border border-warning/30 text-xs font-mono font-medium flex items-center gap-1.5"
              >
                <AlertTriangle className="size-3" />
                {kw}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* 4. HIGH-IMPACT SUGGESTIONS */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h3 className="text-base font-semibold text-fg">Recommended Bullet Optimizations</h3>
        </div>

        <div className="space-y-3">
          {(resumeData.suggestions || []).map((sug, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-line bg-surface-2/40 flex items-start gap-3 text-xs text-fg-muted leading-relaxed"
            >
              <span className="size-5 rounded-full bg-primary/10 text-primary font-mono font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                {idx + 1}
              </span>
              <span>{sug}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

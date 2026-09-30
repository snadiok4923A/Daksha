import { useParams, Link } from 'react-router-dom'
import {
  ExternalLink,
  Globe,
  Briefcase,
  Layers,
  Award,
  CheckCircle2,
  Share2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { GithubIcon } from '../components/ui/Icons.jsx'
import { useProfileState } from '../context/ProfileContext.jsx'
import { getCommunity } from '../data/community.js'
import { ROLES, getRole } from '../data/roles/roles.js'
import { analyzeProfile } from '../engine/index.js'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import ScoreRing from '../components/ui/ScoreRing.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import ScoreRadarChart from '../components/charts/ScoreRadarChart.jsx'
import { BRAND, TRUST } from '../config/brand.js'

export default function PublicProfile() {
  const { handle } = useParams()
  const { profile: currentProfile } = useProfileState()

  // Find candidate: current user, or community member
  let candidateProfile = null
  let role = null
  let analysis = null

  if (handle === currentProfile.handle || handle === 'alex-morgan') {
    candidateProfile = currentProfile
    role = getRole(currentProfile.targetRoleId)
    analysis = analyzeProfile(candidateProfile, { roleId: role.id })
  } else {
    const community = getCommunity()
    const member = community.find((m) => m.profile.handle === handle)
    if (member) {
      candidateProfile = member.profile
      role = member.role
      analysis = analyzeProfile(candidateProfile, { roleId: role.id })
    }
  }

  if (!candidateProfile || !analysis) {
    return (
      <div className="page-wrap py-24 text-center space-y-4">
        <h2 className="text-h2 text-fg">Candidate Profile Not Found</h2>
        <p className="text-sm text-fg-muted max-w-md mx-auto">
          We couldn't find a public SkillRank evaluation for the handle "@{handle}".
        </p>
        <div className="pt-4">
          <Button to="/roles">Explore Supported Roles</Button>
        </div>
      </div>
    )
  }

  const overall = analysis.score.overall
  const band = analysis.score.band.label
  const ranking = analysis.ranking
  const categories = analysis.score.categories

  return (
    <div className="page-wrap py-12 space-y-12 animate-fade-in max-w-5xl">
      {/* 1. PUBLIC DOSSIER HEADER */}
      <Card className="p-6 sm:p-8 bg-surface">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-4 min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm" dot>
                Verified Assessment
              </Badge>
              <span className="text-xs font-mono text-fg-subtle">
                Target: {role.name}
              </span>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-fg tracking-tight">
                {candidateProfile.name}
              </h1>
              <p className="text-sm text-primary font-medium mt-0.5">
                {candidateProfile.headline || `${role.name} Specialist`}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-fg-muted max-w-xl leading-relaxed">
              {candidateProfile.bio}
            </p>

            {/* Social / Portfolio Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {candidateProfile.links?.github && (
                <a
                  href={candidateProfile.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line bg-surface-2 text-xs font-mono text-fg hover:bg-surface-3 transition-colors"
                >
                  <GithubIcon className="size-3.5" />
                  GitHub
                </a>
              )}
              {candidateProfile.links?.portfolio && (
                <a
                  href={candidateProfile.links.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line bg-surface-2 text-xs font-mono text-fg hover:bg-surface-3 transition-colors"
                >
                  <Globe className="size-3.5" />
                  Portfolio
                </a>
              )}
              {candidateProfile.location && (
                <span className="text-xs text-fg-subtle">
                  📍 {candidateProfile.location}
                </span>
              )}
              {candidateProfile.yearsExperience && (
                <span className="text-xs text-fg-subtle">
                  💼 {candidateProfile.yearsExperience} yrs experience
                </span>
              )}
            </div>
          </div>

          {/* Big Score Radial */}
          <div className="flex flex-col items-center bg-surface-2/60 p-6 rounded-2xl border border-line shrink-0 min-w-[220px]">
            <ScoreRing score={overall} size={140} subtitle="Readiness" />
            <div className="mt-3 text-center">
              <Badge variant="success" size="sm">
                Top {ranking.topPercent}% of Peers
              </Badge>
              <div className="text-[11px] font-mono text-fg-subtle mt-1">
                Rank #{ranking.rank} of {ranking.total}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. READINESS RADAR & DIMENSION SCORES */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="eyebrow block">Competency Polygon</span>
              <h3 className="text-base font-semibold text-fg">8-Dimension Evaluation</h3>
            </div>
            <span className="text-xs font-mono text-primary">Role Calibrated</span>
          </div>

          <ScoreRadarChart categories={categories} height={260} />
        </Card>

        <Card className="p-6 space-y-3">
          <span className="eyebrow block">Dimension Breakdown</span>
          <h3 className="text-base font-semibold text-fg">Evaluated Pillars</h3>

          <div className="space-y-2.5 pt-2">
            {categories.map((cat) => (
              <div key={cat.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-fg">{cat.label}</span>
                  <span className="font-mono text-fg font-bold">{cat.score}/100</span>
                </div>
                <ProgressBar
                  value={cat.score}
                  variant={cat.score >= 80 ? 'primary' : cat.score >= 60 ? 'accent' : 'warning'}
                  size="xs"
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 3. VERIFIED SKILLS */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div>
            <span className="eyebrow block">Technical Matrix</span>
            <h3 className="text-base font-semibold text-fg">Verified Skills</h3>
          </div>
          <span className="text-xs font-mono text-fg-subtle">
            {candidateProfile.skills?.length ?? 0} technologies
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {(candidateProfile.skills || []).map((s) => (
            <span
              key={s.id || s.name}
              className="px-3 py-1.5 rounded-xl border border-line bg-surface-2 text-xs font-mono text-fg flex items-center gap-2"
            >
              <span>{s.name}</span>
              <span className="text-[10px] uppercase font-bold text-primary px-1.5 py-0.2 rounded bg-surface border border-line">
                {s.level}
              </span>
            </span>
          ))}
        </div>
      </Card>

      {/* 4. PRODUCTION PROJECTS */}
      <div className="space-y-4">
        <div>
          <span className="eyebrow block">Demonstrated Work</span>
          <h2 className="text-h3 text-fg font-semibold">Production Projects</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(candidateProfile.projects || []).map((project) => (
            <Card key={project.id || project.name} className="p-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-sm font-bold text-fg">{project.name}</h4>
                  <Badge variant="subtle" size="sm">
                    {project.year || 2026}
                  </Badge>
                </div>
                <p className="text-xs text-fg-muted line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {(project.tech || []).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 text-fg-subtle border border-line"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-line/60">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
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
                    className="inline-flex items-center gap-1 text-xs font-medium text-fg-muted hover:text-fg"
                  >
                    <GithubIcon className="size-3.5" />
                    Code
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. BOTTOM CTA BANNER */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-primary-soft to-accent-soft/30 border border-primary-line flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-fg">Want to evaluate your own career readiness?</h3>
          <p className="text-xs text-fg-muted">
            Benchmark your profile across 35 roles and receive a free personalized 30-day roadmap.
          </p>
        </div>
        <Button to="/onboarding" size="md" iconRight={ArrowRight}>
          Analyze Your Profile
        </Button>
      </div>
    </div>
  )
}

// Turns raw engine output into the lists the UI shows: strong areas, gaps, recommended next steps.
// Pure module (no React / browser APIs).

import { levelLabel } from '../data/scoring.js'
import { ROUTES } from '../config/routes.js'
import { effortLabel } from './skills.js'

/** Estimated technical-score points gained by reaching target on a requirement. */
const techGain = (r) => Math.round(100 * r.share * (1 - r.credit))

export function buildSkillInsights(requirements) {
  const byWeight = (a, b) => b.weight - a.weight
  const byPriority = (a, b) => b.priority - a.priority

  const strong = requirements.filter((r) => r.status === 'strong').sort(byWeight)
  const improve = requirements.filter((r) => r.status === 'improve').sort(byPriority)
  const missing = requirements.filter((r) => r.status === 'missing').sort(byPriority)
  const have = requirements
    .filter((r) => r.status !== 'missing')
    .sort((a, b) => b.currentValue - a.currentValue || b.weight - a.weight)

  const gap = requirements
    .filter((r) => r.status !== 'strong')
    .sort(byPriority)
    .map((r) => ({
      ...r,
      effort: effortLabel(r.effortWeeks),
      techGain: techGain(r),
      currentLabel: levelLabel(r.current),
      targetLabel: levelLabel(r.target),
    }))

  return { all: requirements, strong, improve, missing, have, gap, recommended: gap.slice(0, 5) }
}

/**
 * @returns {Array<{ id, title, detail, impact, category, action: {label, to} }>}
 */
export function buildNextSteps({ profile, role, skills, projects, resume, completeness, roadmap }) {
  const steps = []

  const top = skills.recommended[0]
  if (top) {
    steps.push({
      id: `skill:${top.id}`,
      title: `Level up ${top.label}`,
      detail: `Move from ${top.currentLabel.toLowerCase()} to ${top.targetLabel.toLowerCase()} · ${top.effort}`,
      impact: `≈ +${Math.max(1, top.techGain)} Technical`,
      category: 'technical',
      action: { label: 'See skill gap', to: ROUTES.skills },
      weight: 100 + top.priority,
    })
  }

  if (!profile.resume) {
    steps.push({
      id: 'resume:upload',
      title: 'Upload your resume',
      detail: 'Unlock ATS readiness, keyword gaps and suggestions.',
      impact: '+ Profile quality',
      category: 'profileQuality',
      action: { label: 'Upload resume', to: ROUTES.resume },
      weight: 90,
    })
  } else if (resume && resume.scores.ats < 80) {
    steps.push({
      id: 'resume:ats',
      title: 'Raise your ATS readiness',
      detail: resume.missingKeywords.length
        ? `Add keywords like ${resume.missingKeywords.slice(0, 2).join(' and ')} where truthful.`
        : 'Quantify results and tighten your summary.',
      impact: `ATS ${resume.scores.ats} → 85+`,
      category: 'presence',
      action: { label: 'Open resume analysis', to: ROUTES.resume },
      weight: 80,
    })
  }

  if (role.signals.github >= 0.5 && !profile.integrations?.github) {
    steps.push({
      id: 'connect:github',
      title: 'Connect your GitHub',
      detail: 'Show real code, languages and activity for this role.',
      impact: '+ Consistency & presence',
      category: 'consistency',
      action: { label: 'Connect accounts', to: ROUTES.settings },
      weight: 85,
    })
  }

  if (!projects.items.length) {
    steps.push({
      id: 'project:first',
      title: 'Add your first project',
      detail: 'Projects carry a large share of this role’s score.',
      impact: '+ Projects',
      category: 'projects',
      action: { label: 'Add project', to: ROUTES.projects },
      weight: 95,
    })
  } else {
    const noDemo = projects.items.filter((p) => !p.url)
    if (noDemo.length) {
      steps.push({
        id: 'project:demo',
        title: `Add a live demo to ${noDemo.length === 1 ? noDemo[0].name : `${noDemo.length} projects`}`,
        detail: 'Reviewers trust what they can try in seconds.',
        impact: '+ Portfolio',
        category: 'portfolio',
        action: { label: 'Edit projects', to: ROUTES.projects },
        weight: 60,
      })
    }
  }

  const second = skills.recommended[1]
  if (second) {
    steps.push({
      id: `skill:${second.id}`,
      title: `Start ${second.label}`,
      detail: `${second.currentLabel === 'Not started' ? 'Begin' : 'Continue'} toward ${second.targetLabel.toLowerCase()} · ${second.effort}`,
      impact: `≈ +${Math.max(1, second.techGain)} Technical`,
      category: 'technical',
      action: { label: 'See skill gap', to: ROUTES.skills },
      weight: 70 + second.priority,
    })
  }

  const incomplete = completeness.items
    .filter((i) => !i.done)
    .sort((a, b) => b.weight * (1 - b.ratio) - a.weight * (1 - a.ratio))[0]
  if (incomplete && !['resume', 'links', 'projects', 'skills'].includes(incomplete.id)) {
    steps.push({
      id: `profile:${incomplete.id}`,
      title: `Complete: ${incomplete.label.toLowerCase()}`,
      detail: incomplete.hint,
      impact: '+ Profile quality',
      category: 'profileQuality',
      action: { label: 'Edit profile', to: incomplete.to ?? ROUTES.profile },
      weight: 40,
    })
  }

  if (roadmap?.weeks?.[0]) {
    steps.push({
      id: 'roadmap:start',
      title: `Start week 1: ${roadmap.weeks[0].title}`,
      detail: `${roadmap.weeks[0].tasks.length} focused tasks, about ${Math.round(roadmap.weeks[0].tasks.reduce((a, t) => a + t.minutes, 0) / 60)} hours.`,
      impact: 'Your 30-day plan',
      category: 'roadmap',
      action: { label: 'Open roadmap', to: ROUTES.roadmap },
      weight: 50,
    })
  }

  return steps.sort((a, b) => b.weight - a.weight).map(({ weight, ...rest }) => rest)
}

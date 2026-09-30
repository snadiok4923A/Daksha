// Category scorers. Every formula is deliberately simple and explainable - see the
// "How is this calculated?" modal and docs/ARCHITECTURE.md. Each scorer returns { score, insight }.
// Pure module (no React / browser APIs).

import { PRESENCE_STATUS, presenceStatusFor } from '../data/scoring.js'
import { clamp, mean, round } from '../utils/math.js'
import {
  codingSignal,
  codingSummary,
  creativeSummary,
  githubConsistency,
  githubPolish,
  githubScore,
  linkedinStrength,
  portfolioSiteScore,
} from './signals.js'

const pct = (v) => clamp(Math.round(v), 0, 100)

/* ------------------------------ date helpers ------------------------------ */

/** Whole months between 'YYYY-MM' (or 'YYYY') and another month (null = now). */
export function monthsBetween(start, end, now = new Date()) {
  const parse = (s) => {
    if (!s) return null
    const [y, m] = String(s).split('-').map(Number)
    return y * 12 + ((m || 1) - 1)
  }
  const a = parse(start)
  if (a == null) return 0
  const b = end ? parse(end) : now.getFullYear() * 12 + now.getMonth()
  return Math.max(0, b - a)
}

/* --------------------------------- technical -------------------------------- */

export function scoreTechnical(requirements) {
  const score = pct(100 * requirements.reduce((acc, r) => acc + r.share * r.credit, 0))
  const strong = requirements.filter((r) => r.status === 'strong').length
  const missing = requirements.filter((r) => r.status === 'missing').length
  return {
    score,
    insight: `${strong} of ${requirements.length} role requirements at target level${missing ? ` · ${missing} not yet on your profile` : ''}.`,
  }
}

/* --------------------------------- projects --------------------------------- */

export function scoreProjects(projectAnalysis) {
  const count = projectAnalysis.items.length
  if (!count) return { score: 0, insight: 'No projects yet - add one to unlock this score.' }
  const best = [...projectAnalysis.items].sort((a, b) => b.score - a.score)[0]
  return {
    score: projectAnalysis.score,
    insight: `${count} ${count === 1 ? 'project' : 'projects'} analyzed · strongest match: ${best.name}.`,
  }
}

/* -------------------------------- experience -------------------------------- */

function jobRelevance(job, role) {
  const text = `${job.title ?? ''} ${job.description ?? ''} ${(job.skills ?? []).join(' ')}`.toLowerCase()
  const nameTokens = role.name
    .toLowerCase()
    .split(/[\s/]+/)
    .filter((t) => t.length > 3)
  if (nameTokens.some((t) => (job.title ?? '').toLowerCase().includes(t))) return 1
  const hits = role.keywords.filter((k) => text.includes(k.toLowerCase())).length
  return clamp(0.35 + 0.22 * hits, 0, 1)
}

export function scoreExperience(profile, role, now = new Date()) {
  const entries = profile.experience ?? []
  const student = profile.status === 'student'
  const expected = role.expectedYears * (student ? 0.5 : 1)

  const workMonths = entries
    .filter((e) => e.type !== 'internship')
    .reduce((acc, e) => acc + monthsBetween(e.start, e.end, now), 0)
  const internMonths = entries
    .filter((e) => e.type === 'internship')
    .reduce((acc, e) => acc + monthsBetween(e.start, e.end, now), 0)
  const declared = profile.yearsOfExperience
  const rawYears = Math.max(declared ?? workMonths / 12, (internMonths / 12) * 0.5)

  const totalMonths = workMonths + internMonths
  const relevanceAvg = totalMonths
    ? entries.reduce((acc, e) => acc + monthsBetween(e.start, e.end, now) * jobRelevance(e, role), 0) / totalMonths
    : 0

  // Experience in an unrelated field still counts, but at a discount.
  const years = rawYears * (0.4 + 0.6 * relevanceAvg)

  const yearsScore = clamp(years / expected, 0, 1)
  const breadth = clamp(entries.length / 4, 0, 1)
  const achievementsScore = clamp(
    ((profile.achievements?.length ?? 0) + 0.5 * (profile.certifications?.length ?? 0)) / 8,
    0,
    1,
  )

  const score = pct(100 * (0.5 * yearsScore + 0.2 * relevanceAvg + 0.1 * breadth + 0.2 * achievementsScore))
  const yearsLabel = round(years, 1)
  return {
    score,
    years: yearsLabel,
    expectedYears: round(expected, 1),
    relevanceAvg,
    insight: entries.length
      ? `${yearsLabel} ${yearsLabel === 1 ? 'year' : 'years'} of experience vs ~${round(expected, 1)} typically expected for this role.`
      : 'Add work or internship experience to strengthen this score.',
  }
}

/* ------------------------------ problem solving ------------------------------ */

export function scoreProblemSolving(profile, role, projectAnalysis) {
  const coding = codingSignal(profile.integrations)
  const top = [...projectAnalysis.items].sort((a, b) => b.score - a.score).slice(0, 3)
  const depth = top.length ? mean(top.map((p) => (p.technicalDepth / 5) * (0.35 + 0.65 * p.relevance))) : 0
  const achievements = clamp((profile.achievements?.length ?? 0) / 3, 0, 1)

  const wCoding = 0.6 * role.signals.coding
  const wAchv = 0.2
  const wDepth = 1 - wCoding - wAchv
  const score = pct(100 * (wCoding * coding + wAchv * achievements + wDepth * depth))

  const lines = codingSummary(profile.integrations)
  return {
    score,
    insight: lines.length
      ? `${lines[0]}${lines.length > 1 ? ` · +${lines.length - 1} more` : ''}.`
      : role.signals.coding >= 0.6
        ? 'Connect LeetCode, Codeforces or Kaggle to show problem-solving practice.'
        : 'Based on project depth and achievements.',
  }
}

/* ------------------------------ profile quality ------------------------------ */

export function computeCompleteness(profile, role) {
  const links = Object.entries(profile.links ?? {}).filter(([key, url]) => key !== 'other' && url).length
  const exp = profile.experience?.length ?? 0
  const edu = profile.education?.length ?? 0
  const projects = profile.projects ?? []
  const bioLen = (profile.bio ?? '').trim().length

  const items = [
    {
      id: 'headline',
      label: 'Name & headline',
      weight: 7,
      ratio: profile.name ? (profile.headline ? 1 : 0.5) : 0,
      hint: 'Add a one-line headline that states your target role.',
      to: '/app/profile',
    },
    {
      id: 'bio',
      label: 'Professional summary',
      weight: 7,
      ratio: bioLen >= 80 ? 1 : bioLen >= 30 ? 0.5 : 0,
      hint: 'Write two or three sentences about what you build and what you want next.',
      to: '/app/profile',
    },
    {
      id: 'location',
      label: 'Location',
      weight: 3,
      ratio: profile.location ? 1 : 0,
      hint: 'Add your city or region.',
      to: '/app/profile',
    },
    {
      id: 'basics',
      label: 'Experience level & preferences',
      weight: 4,
      ratio: (profile.yearsOfExperience != null ? 0.5 : 0) + (profile.workPreference ? 0.5 : 0),
      hint: 'Set your years of experience and work preference.',
      to: '/app/profile',
    },
    {
      id: 'links',
      label: 'Professional links',
      weight: 15,
      ratio: clamp(links / 3, 0, 1),
      hint: 'Connect at least three sources, such as GitHub, LinkedIn and a portfolio.',
      to: '/app/settings',
    },
    {
      id: 'resume',
      label: 'Resume',
      weight: 15,
      ratio: profile.resume ? 1 : 0,
      hint: 'Upload your resume to unlock resume analysis.',
      to: '/app/resume',
    },
    {
      id: 'skills',
      label: 'Skills',
      weight: 15,
      ratio: clamp((profile.skills?.length ?? 0) / 10, 0, 1),
      hint: 'List at least ten skills with honest levels.',
      to: '/app/skills',
    },
    {
      id: 'projects',
      label: 'Projects',
      weight: 12,
      ratio: clamp((profile.projects?.length ?? 0) / 3, 0, 1),
      hint: 'Add three or more projects.',
      to: '/app/projects',
    },
    {
      id: 'projectLinks',
      label: 'Project links',
      weight: 5,
      ratio: projects.length ? projects.filter((p) => p.url && p.repo).length / projects.length : 0,
      hint: 'Give every project a live demo and a source link.',
      to: '/app/projects',
    },
    {
      id: 'background',
      label: 'Experience & education',
      weight: 7,
      ratio: clamp((exp + edu) / 3, 0, 1),
      hint: 'Add your work, internship or education history.',
      to: '/app/profile',
    },
    {
      id: 'certs',
      label: 'Certifications',
      weight: 5,
      ratio: clamp((profile.certifications?.length ?? 0) / 1, 0, 1),
      hint: 'Add a relevant certification or course.',
      to: '/app/profile',
    },
    {
      id: 'achievements',
      label: 'Achievements',
      weight: 5,
      ratio: clamp((profile.achievements?.length ?? 0) / 2, 0, 1),
      hint: 'Add awards, hackathons or notable results.',
      to: '/app/profile',
    },
  ]
  const score = pct(items.reduce((acc, i) => acc + i.weight * clamp(i.ratio, 0, 1), 0))
  return { score, items: items.map((i) => ({ ...i, ratio: clamp(i.ratio, 0, 1), done: i.ratio >= 0.999 })) }
}

export function scoreProfileQuality(completeness) {
  const open = completeness.items.filter((i) => !i.done)
  return {
    score: completeness.score,
    insight: open.length
      ? `${completeness.items.length - open.length} of ${completeness.items.length} sections complete · next: ${open[0].label.toLowerCase()}.`
      : 'Every profile section is complete.',
  }
}

/* --------------------------------- portfolio --------------------------------- */

export function scorePortfolio(profile, role, projectAnalysis) {
  const avgRelevance = projectAnalysis.items.length ? mean(projectAnalysis.items.map((p) => p.relevance)) : 0.5
  const rawSite = portfolioSiteScore(profile.integrations?.portfolio)
  // A polished site helps most when the work on it is relevant to the role.
  const site = rawSite == null ? null : Math.round(rawSite * (0.55 + 0.45 * avgRelevance))
  const creative = creativeSummary(profile.integrations)
  const showcase = projectAnalysis.items.length ? mean(projectAnalysis.items.map((p) => p.portfolioValue)) * 20 : null

  // Optional sources (low relevance for the role) don't count against you when missing.
  const parts = [
    { key: 'site', value: site, weight: role.signals.portfolio, optional: role.signals.portfolio < 0.5 },
    { key: 'showcase', value: showcase, weight: 0.7, optional: false },
    {
      key: 'creative',
      value: creative?.score ?? null,
      weight: role.signals.creative,
      optional: role.signals.creative < 0.5,
    },
  ]
  let num = 0
  let den = 0
  for (const p of parts) {
    if (p.value == null && p.optional) continue
    num += (p.value ?? 0) * p.weight
    den += p.weight
  }
  const score = den ? pct(num / den) : 0

  const notes = []
  if (site != null) notes.push(`portfolio site ${site}`)
  if (showcase != null) notes.push(`project showcase ${Math.round(showcase)}`)
  if (creative) notes.push(`creative profiles ${creative.score}`)
  return {
    score,
    site,
    showcase: showcase == null ? null : Math.round(showcase),
    creative: creative?.score ?? null,
    insight: notes.length ? `${notes.join(' · ')}.` : 'Add a portfolio link or project demos to show your work.',
  }
}

/* -------------------------------- consistency -------------------------------- */

export function scoreConsistency(profile, role, now = new Date()) {
  const gh = profile.integrations?.github
  const creative = creativeSummary(profile.integrations)
  const year = now.getFullYear()
  const projects = profile.projects ?? []
  const recency = projects.length
    ? (100 * projects.filter((p) => (p.year ?? 0) >= year - 1).length) / projects.length
    : null

  const parts = [
    { key: 'github', value: githubConsistency(gh), weight: role.signals.github, optional: role.signals.github < 0.5 },
    {
      key: 'creative',
      value: creative?.consistency ?? null,
      weight: role.signals.creative,
      optional: role.signals.creative < 0.5,
    },
    { key: 'recency', value: recency, weight: 0.4, optional: true },
  ]
  let num = 0
  let den = 0
  for (const p of parts) {
    if (p.value == null && p.optional) continue
    num += (p.value ?? 0) * p.weight
    den += p.weight
  }
  const score = den ? pct(num / den) : 0

  const weeks = gh?.consistency?.activeWeeks
  return {
    score,
    insight: gh
      ? `${weeks} active weeks in the last year · longest streak ${gh.consistency?.longestStreak} days.`
      : creative
        ? `${creative.posts90} creative posts in the last 90 days.`
        : 'Connect GitHub or a creative platform to measure consistency.',
  }
}

/* --------------------------------- presence --------------------------------- */

export function buildPresence(profile, role, resumeOverall) {
  const integ = profile.integrations ?? {}
  const li = integ.linkedin
  const gh = integ.github
  const po = integ.portfolio
  const creative = creativeSummary(integ)
  const creativeLabel = creative
    ? creative.connected
        .map((c) => ({ behance: 'Behance', dribbble: 'Dribbble', instagram: 'Instagram' })[c.id])
        .join(' / ')
    : 'Creative profile'

  const items = [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      relevance: 1,
      connected: Boolean(li),
      score: linkedinStrength(li),
      url: profile.links?.linkedin ?? '',
      note: li
        ? `Profile ${li.completeness}% complete · ${li.recommendations} recommendations · ${li.endorsements} endorsements.`
        : 'Connect LinkedIn so recruiters can see your experience.',
    },
    {
      id: 'github',
      label: 'GitHub',
      relevance: role.signals.github,
      connected: Boolean(gh),
      score: githubPolish(gh) == null ? null : Math.round(0.5 * githubPolish(gh) + 0.5 * githubScore(gh)),
      url: profile.links?.github ?? '',
      note: gh
        ? `${gh.repos} repositories · ${gh.followers} followers · ${Math.round((gh.quality?.readmeCoverage ?? 0) * 100)}% have READMEs.`
        : 'Connect GitHub to show real code and activity.',
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      relevance: role.signals.portfolio * 0.9,
      connected: Boolean(po),
      score: portfolioSiteScore(po),
      url: profile.links?.portfolio ?? '',
      note: po
        ? `Design ${po.design} · performance ${po.performance} · content ${po.content}.`
        : 'A personal site gives your work a home you control.',
    },
    {
      id: 'resume',
      label: 'Resume',
      relevance: 0.8,
      connected: Boolean(profile.resume),
      score: profile.resume ? resumeOverall : null,
      url: '',
      note: profile.resume
        ? `${profile.resume.name} · overall resume score ${resumeOverall}.`
        : 'Upload a resume to check ATS readiness and keywords.',
    },
    {
      id: 'creative',
      label: creativeLabel,
      relevance: role.signals.creative,
      connected: Boolean(creative),
      score: creative?.score ?? null,
      url: profile.links?.behance || profile.links?.dribbble || profile.links?.instagram || '',
      note: creative
        ? `${creative.connected.length} creative ${creative.connected.length === 1 ? 'profile' : 'profiles'} · ${creative.posts90} posts in the last 90 days.`
        : 'Behance, Dribbble or Instagram show your creative side.',
    },
  ]

  let num = 0
  let den = 0
  const enriched = items.map((item) => {
    const optional = item.relevance < 0.5
    const status = item.connected ? presenceStatusFor(item.score ?? 0) : 'not-connected'
    if (!(item.score == null && optional)) {
      num += (item.score ?? 0) * item.relevance
      den += item.relevance
    }
    return { ...item, optional, status, statusLabel: PRESENCE_STATUS[status].label }
  })

  return { score: den ? pct(num / den) : 0, items: enriched }
}

export function scorePresence(presence) {
  const connected = presence.items.filter((i) => i.connected)
  const best = [...connected].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0]
  return {
    score: presence.score,
    insight: connected.length
      ? `${connected.length} of ${presence.items.length} sources connected${best ? ` · ${best.label} is your strongest` : ''}.`
      : 'Connect a source to measure your professional presence.',
  }
}

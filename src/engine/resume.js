// Resume analysis (mock but role-aware and deterministic).
// Real implementation later: parse the uploaded file, extract sections + keywords, run an LLM review.
// Pure module (no React / browser APIs).

import { clamp } from '../utils/math.js'
import { hashString } from '../utils/math.js'

const pct = (v) => clamp(Math.round(v), 0, 100)

const FORMAT_SCORES = { pdf: 0.94, docx: 0.96, doc: 0.85, txt: 0.78, rtf: 0.8 }

const hasMetric = (text = '') => /\d/.test(text)

/**
 * @param {object} input
 * @param {object} input.profile
 * @param {object} input.role
 * @param {Array}  input.requirements   evaluated requirements (engine/skills.js)
 * @param {number} input.technical      technical category score
 * @param {number} input.projects       projects category score
 * @param {number} input.experience     experience category score
 * @param {number} input.relevanceAvg   average job relevance 0..1
 * @param {object} [input.file]         resume metadata { name, size }
 */
export function analyzeResume({
  profile,
  role,
  requirements,
  technical,
  projects,
  experience,
  relevanceAvg = 0,
  file = profile.resume,
}) {
  const fileName = file?.name ?? 'resume.pdf'
  const ext = fileName.split('.').pop()?.toLowerCase() ?? 'pdf'
  const format = FORMAT_SCORES[ext] ?? 0.7
  // Tiny per-file variation so different uploads feel distinct while staying deterministic.
  const jitter = (hashString(fileName) % 5) - 2

  const coverage = 100 * requirements.filter((r) => r.status !== 'missing').reduce((acc, r) => acc + r.share, 0)

  const bioLen = (profile.bio ?? '').trim().length
  const exp = profile.experience ?? []
  const projectsList = profile.projects ?? []
  const metricsRatio = exp.length ? exp.filter((e) => hasMetric(e.description)).length / exp.length : 0
  const detailRatio = exp.length ? exp.filter((e) => (e.description ?? '').length >= 80).length / exp.length : 0
  const projectDetail = projectsList.length
    ? projectsList.filter((p) => (p.description ?? '').length >= 80 && (p.url || p.repo)).length / projectsList.length
    : 0

  const sections = [
    {
      id: 'summary',
      label: 'Summary',
      score: bioLen >= 200 ? 88 : bioLen >= 120 ? 76 : bioLen >= 60 ? 60 : bioLen >= 20 ? 45 : 25,
      strong: 'Clear, role-focused summary.',
      weak: 'Summary is missing or too short - lead with your target role and strongest skills.',
    },
    {
      id: 'skills',
      label: 'Skills',
      score: pct(30 + 0.6 * coverage),
      strong: 'Skills section mirrors what this role asks for.',
      weak: 'Skills section misses several keywords this role looks for.',
    },
    {
      id: 'experience',
      label: 'Experience',
      score: exp.length ? pct(30 + 35 * metricsRatio + 30 * detailRatio) : 20,
      strong: 'Experience entries are specific and quantified.',
      weak: 'Experience bullets lack numbers - add scale, speed or impact.',
    },
    {
      id: 'projects',
      label: 'Projects',
      score: projectsList.length ? pct(35 + 35 * projectDetail + 20 * Math.min(1, projectsList.length / 3)) : 15,
      strong: 'Projects are described with links and outcomes.',
      weak: 'Projects need clearer outcomes and links to live demos or code.',
    },
    {
      id: 'education',
      label: 'Education & certifications',
      score:
        (profile.education?.length ?? 0) + (profile.certifications?.length ?? 0) >= 2
          ? 80
          : (profile.education?.length ?? 0)
            ? 68
            : 40,
      strong: 'Education and certifications are clearly listed.',
      weak: 'Add education or certifications that support this role.',
    },
    {
      id: 'formatting',
      label: 'Formatting',
      score: pct(100 * format),
      strong: 'File format is ATS-friendly.',
      weak: 'Use a simple single-column PDF or DOCX - some ATS tools struggle with other formats.',
    },
  ]

  const sectionsScore = sections.reduce((acc, s) => acc + s.score, 0) / sections.length

  // Exact-phrase keyword match: skills you can claim at target level count fully, partial ones at 60%.
  const keywordMatch =
    100 *
    requirements.reduce((acc, r) => acc + r.share * (r.status === 'strong' ? 1 : r.status === 'improve' ? 0.6 : 0), 0)

  const scores = {
    ats: pct(0.35 * keywordMatch + 0.2 * 100 * format + 0.3 * sectionsScore + 0.15 * 100 * metricsRatio + jitter),
    contentQuality: pct(
      100 *
        (0.3 * Math.min(1, bioLen / 200) +
          0.35 * metricsRatio +
          0.2 * detailRatio +
          0.15 * Math.min(1, (profile.skills?.length ?? 0) / 14)) +
        jitter,
    ),
    technicalRelevance: pct(0.6 * technical + 0.4 * coverage + jitter),
    projectStrength: pct(0.8 * projects + 0.2 * projectDetail * 100),
    experienceRelevance: pct(0.85 * experience + 0.15 * relevanceAvg * 100 - 4),
  }
  const overall = pct(Object.values(scores).reduce((a, b) => a + b, 0) / 5)

  const missingKeywords = requirements
    .filter((r) => r.status === 'missing' || (r.status === 'improve' && r.credit < 0.6))
    .sort((a, b) => b.share - a.share)
    .slice(0, 8)
    .map((r) => r.label)

  const strongSections = sections
    .filter((s) => s.score >= 75)
    .map((s) => ({ id: s.id, label: s.label, note: s.strong, score: s.score }))
  const weakSections = sections
    .filter((s) => s.score < 65)
    .sort((a, b) => a.score - b.score)
    .map((s) => ({ id: s.id, label: s.label, note: s.weak, score: s.score }))

  const suggestions = []
  if (metricsRatio < 0.8 && exp.length)
    suggestions.push({
      id: 'quantify',
      title: 'Quantify your impact',
      detail: 'Add numbers to experience bullets - users reached, load time cut, revenue or hours saved.',
      impact: 'High',
    })
  if (missingKeywords.length)
    suggestions.push({
      id: 'keywords',
      title: `Add keywords for ${role.name} roles`,
      detail: `Where truthful, mention ${missingKeywords.slice(0, 3).join(', ')} in skills or project bullets.`,
      impact: 'High',
    })
  if (bioLen < 120)
    suggestions.push({
      id: 'summary',
      title: 'Sharpen your summary',
      detail: `Open with a two-line summary naming the ${role.name} role and your strongest proof points.`,
      impact: 'Medium',
    })
  if (projectDetail < 0.8 && projectsList.length)
    suggestions.push({
      id: 'project-links',
      title: 'Link your best projects',
      detail: 'Give each project a live link or repository and one line describing the outcome.',
      impact: 'Medium',
    })
  if (format < 0.9)
    suggestions.push({
      id: 'format',
      title: 'Use an ATS-friendly format',
      detail: 'Export as a simple single-column PDF or DOCX with standard section headings.',
      impact: 'Medium',
    })
  suggestions.push({
    id: 'tailor',
    title: 'Tailor the top third',
    detail: 'Recruiters skim the top of page one - mirror the role title and key skills there.',
    impact: 'Low',
  })

  return {
    file: { name: fileName, size: file?.size ?? 0, uploadedAt: file?.uploadedAt ?? null },
    scores,
    overall,
    sections,
    missingKeywords,
    strongSections,
    weakSections,
    suggestions,
  }
}

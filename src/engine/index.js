// The analysis pipeline:
//
//   profile (user data + connected-source data)
//     -> skill matching against the role's requirements      (skills.js)
//     -> project analysis                                     (projects.js)
//     -> category scoring                                     (scoring.js + signals.js)
//     -> weighted overall score                               (here)
//     -> benchmarks + ranking                                 (ranking.js)
//     -> skill gap, next steps, roadmap                       (insights.js, roadmap.js)
//
// Everything is deterministic and runs on the client. To plug in a real AI / scoring backend, return
// an object with the same shape from services/profileAnalysisService.js (see docs/ARCHITECTURE.md).
//
// Pure module (no React / browser APIs).

import { getFamily } from '../data/roles/families.js'
import { getRole } from '../data/roles/roles.js'
import { SCORE_CATEGORIES, getBand } from '../data/scoring.js'
import { round } from '../utils/math.js'
import { buildNextSteps, buildSkillInsights } from './insights.js'
import { analyzeProjects } from './projects.js'
import { computeRanking, getCategoryBenchmarks, getRoleDistribution } from './ranking.js'
import { analyzeResume } from './resume.js'
import { generateRoadmap } from './roadmap.js'
import {
  buildPresence,
  computeCompleteness,
  scoreConsistency,
  scoreExperience,
  scorePortfolio,
  scorePresence,
  scoreProblemSolving,
  scoreProfileQuality,
  scoreProjects,
  scoreTechnical,
} from './scoring.js'
import { buildSkillContext, evaluateRequirements } from './skills.js'
import { githubConsistency, githubScore } from './signals.js'

export const ENGINE_VERSION = 'mock-1.0'

/** True when there is too little information for a meaningful assessment. */
export function hasEnoughData(profile) {
  const skills = profile.skills?.length ?? 0
  const projects = profile.projects?.length ?? 0
  const links = Object.values(profile.links ?? {}).filter(Boolean).length
  return skills >= 3 || projects >= 1 || links >= 2 || Boolean(profile.resume)
}

/**
 * @param {object} profile
 * @param {{ roleId?: string, now?: Date, roadmap?: object }} [options]
 */
export function analyzeProfile(profile, { roleId, now = new Date(), roadmap } = {}) {
  const role = getRole(roleId ?? profile.targetRoleId)
  const family = getFamily(role.family)

  // 1. skills + projects
  const ctx = buildSkillContext(profile)
  const requirements = evaluateRequirements(role, ctx)
  const skills = buildSkillInsights(requirements)
  const projects = analyzeProjects(profile, role)

  // 2. categories (resume estimate feeds presence)
  const technical = scoreTechnical(requirements)
  const projectsCat = scoreProjects(projects)
  const experience = scoreExperience(profile, role, now)
  const completeness = computeCompleteness(profile, role)
  const resume = profile.resume
    ? analyzeResume({
        profile,
        role,
        requirements,
        technical: technical.score,
        projects: projectsCat.score,
        experience: experience.score,
        relevanceAvg: experience.relevanceAvg,
      })
    : null
  const presence = buildPresence(profile, role, resume?.overall ?? 0)

  const results = {
    technical,
    projects: projectsCat,
    experience,
    problemSolving: scoreProblemSolving(profile, role, projects),
    profileQuality: scoreProfileQuality(completeness),
    portfolio: scorePortfolio(profile, role, projects),
    consistency: scoreConsistency(profile, role, now),
    presence: scorePresence(presence),
  }

  // 3. weighted overall
  const benchmarks = getCategoryBenchmarks(role)
  const categories = SCORE_CATEGORIES.map((cat) => {
    const result = results[cat.id]
    const weight = role.weights[cat.id]
    return {
      id: cat.id,
      label: cat.label,
      short: cat.short,
      summary: family.notes[cat.id] ?? cat.summary,
      signals: cat.signals,
      score: result.score,
      weight,
      contribution: round(result.score * weight, 1),
      insight: result.insight,
      average: benchmarks[cat.id].average,
      top10: benchmarks[cat.id].top10,
    }
  })
  const overall = Math.round(categories.reduce((acc, c) => acc + c.score * c.weight, 0))
  const band = getBand(overall)

  // 4. ranking + comparison
  const distribution = getRoleDistribution(role)
  const ranking = computeRanking({ role, score: overall })
  const comparison = categories.map((c) => ({
    id: c.id,
    label: c.label,
    short: c.short,
    you: c.score,
    average: c.average,
    top10: c.top10,
  }))

  // 5. github analytics (derived view)
  const gh = profile.integrations?.github
  const github = gh ? { ...gh, score: githubScore(gh), consistencyScore: githubConsistency(gh) } : null

  // 6. plan + next steps
  const plan = roadmap?.roleId === role.id ? roadmap : generateRoadmap({ role, requirements })
  const nextSteps = buildNextSteps({ profile, role, skills, projects, resume, completeness, roadmap: plan })

  return {
    meta: { engineVersion: ENGINE_VERSION, roleId: role.id, generatedAt: now.toISOString() },
    role,
    score: { overall, band, categories },
    ranking,
    peers: { average: distribution.mean, top10: distribution.top10, total: distribution.total },
    comparison,
    skills,
    projects,
    github,
    presence,
    resume,
    completeness,
    roadmap: plan,
    nextSteps,
    summary: {
      strongAreas: skills.strong.slice(0, 4).map((r) => r.label),
      improveAreas: skills.improve.slice(0, 3).map((r) => r.label),
      missingSkills: skills.missing.slice(0, 3).map((r) => r.label),
    },
  }
}

export { computeRanking } from './ranking.js'
export { generateRoadmap, roadmapProgress, weekProgress } from './roadmap.js'
export { effortLabel } from './skills.js'

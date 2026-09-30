// Skill matching: maps a user's free-text skills onto a role's requirements.
// Pure module (no React / browser APIs).

import { findSkill, SKILL_BY_ID } from '../data/roles/skillLibrary.js'
import { levelFromValue, levelValue } from '../data/scoring.js'
import { clamp } from '../utils/math.js'

/** Evidence bonus (in level points, 0-100 scale) for skills demonstrated by real work. */
const BONUS = { project: 6, github: 4, work: 4, cap: 10 }
/** Level (0-100) inferred when a skill shows up in evidence but the user never listed it. */
const INFERRED = { project: 30, github: 25, work: 30 }

/**
 * Build the context used to evaluate requirements:
 *  - declared: catalog skill id -> declared level value
 *  - evidence: skill ids demonstrated in projects / GitHub languages / work experience
 */
export function buildSkillContext(profile) {
  const declared = new Map()
  const names = new Map()
  const unmatched = []

  for (const entry of profile.skills ?? []) {
    const lib = findSkill(entry.name)
    if (!lib) {
      unmatched.push(entry)
      continue
    }
    const value = levelValue(entry.level)
    if (value >= (declared.get(lib.id) ?? -1)) declared.set(lib.id, value)
    names.set(lib.id, [...(names.get(lib.id) ?? []), entry.name])
  }

  const evidence = { project: new Set(), github: new Set(), work: new Set() }
  for (const project of profile.projects ?? []) {
    for (const tag of project.tech ?? []) {
      const lib = findSkill(tag)
      if (lib) evidence.project.add(lib.id)
    }
  }
  for (const lang of profile.integrations?.github?.languages ?? []) {
    const lib = findSkill(lang.name)
    if (lib) evidence.github.add(lib.id)
  }
  for (const job of profile.experience ?? []) {
    for (const tag of job.skills ?? []) {
      const lib = findSkill(tag)
      if (lib) evidence.work.add(lib.id)
    }
  }

  return { declared, names, evidence, unmatched }
}

/**
 * Resolve a single catalog skill to a value.
 * Returns the declared/inferred/related value (no bonus) plus the bonus separately, so the UI can
 * show honest level labels while scoring still rewards demonstrated skills.
 */
export function resolveSkill(skillId, ctx) {
  let value = ctx.declared.get(skillId) ?? 0
  let source = value > 0 ? 'declared' : 'none'

  // Partial credit from related skills (e.g. Next.js implies React).
  const lib = SKILL_BY_ID[skillId]
  for (const [otherId, factor] of lib?.related ?? []) {
    const other = ctx.declared.get(otherId) ?? 0
    const partial = other * factor
    if (partial > value) {
      value = partial
      source = 'related'
    }
  }

  // Inferred from evidence when never declared.
  if (value === 0) {
    if (ctx.evidence.project.has(skillId)) {
      value = INFERRED.project
      source = 'inferred'
    } else if (ctx.evidence.work.has(skillId)) {
      value = INFERRED.work
      source = 'inferred'
    } else if (ctx.evidence.github.has(skillId)) {
      value = INFERRED.github
      source = 'inferred'
    }
  }

  let bonus = 0
  if (value > 0) {
    if (ctx.evidence.project.has(skillId)) bonus += BONUS.project
    if (ctx.evidence.github.has(skillId)) bonus += BONUS.github
    if (ctx.evidence.work.has(skillId)) bonus += BONUS.work
    bonus = Math.min(bonus, BONUS.cap)
  }

  return { value, bonus, source, evidenced: bonus > 0 }
}

/**
 * Evaluate one role requirement ("any of" groups take the best skill).
 */
export function evaluateRequirement(req, ctx) {
  let best = { value: 0, bonus: 0, source: 'none', skillId: req.skills[0], evidenced: false }
  for (const skillId of req.skills) {
    const r = resolveSkill(skillId, ctx)
    if (r.value + r.bonus > best.value + best.bonus) best = { ...r, skillId }
  }

  const targetValue = levelValue(req.target)
  const effective = Math.min(100, best.value + best.bonus)
  const credit = clamp(effective / targetValue, 0, 1)
  const declaredCredit = clamp(best.value / targetValue, 0, 1)

  const status = best.value === 0 ? 'missing' : declaredCredit >= 1 ? 'strong' : 'improve'
  const gapValue = Math.max(0, targetValue - best.value)

  // Effort: levels to climb (each level ~ 25 points) x weeks per level for this skill.
  const levelsToClimb = gapValue / 25
  const weeks = gapValue === 0 ? 0 : Math.max(1, Math.ceil(levelsToClimb * (req.effort ?? 2)))

  return {
    id: req.id,
    label: req.label,
    skills: req.skills,
    matchedSkillId: best.skillId,
    matchedSkillLabel: SKILL_BY_ID[best.skillId]?.label ?? req.label,
    userNames: ctx.names.get(best.skillId) ?? [],
    group: req.group,
    importance: req.importance,
    weight: req.weight,
    share: req.share,
    why: req.why,
    target: req.target,
    targetValue,
    current: best.value === 0 ? 'none' : levelFromValue(best.value),
    currentValue: Math.round(best.value),
    source: best.source,
    evidenced: best.evidenced,
    credit,
    status,
    gapValue,
    effortWeeks: weeks,
    priority: req.share * gapValue,
  }
}

export function evaluateRequirements(role, ctx) {
  return role.requirements.map((req) => evaluateRequirement(req, ctx))
}

/** Friendly effort label: "~1 week", "2-3 weeks", "~2 months". */
export function effortLabel(weeks) {
  if (!weeks) return 'Target met'
  if (weeks <= 1) return '~1 week'
  if (weeks <= 4) {
    const lo = Math.max(1, Math.round(weeks * 0.75))
    const hi = Math.max(lo + 1, Math.ceil(weeks * 1.25))
    return `${lo}–${hi} weeks`
  }
  const months = Math.max(1, Math.round(weeks / 4.3))
  return months <= 1 ? '~1 month' : `~${months} months`
}

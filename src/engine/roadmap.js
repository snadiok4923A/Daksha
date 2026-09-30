// 30-day improvement plan generator.
// Uses a hand-written shape when the role has one (data/roles/roadmaps.js), otherwise builds a plan
// from the user's biggest skill gaps. Task ids are stable per role so progress survives regeneration.
// Pure module (no React / browser APIs).

import { ROADMAP_OVERRIDES } from '../data/roles/roadmaps.js'
import { SKILL_BY_ID } from '../data/roles/skillLibrary.js'
import { joinList } from '../utils/format.js'

const task = (title, kind = 'learn', minutes = 60) => ({ title, kind, minutes })

const PUBLISH_BY_FAMILY = {
  game: 'Publish a playable build and a short trailer',
  creative3d: 'Publish the finished piece with a process breakdown',
  design: 'Publish it as a case study on your portfolio',
}

function withIds(roleId, weeks) {
  return weeks.map((week, wi) => ({
    ...week,
    id: `${roleId}:w${wi + 1}`,
    week: wi + 1,
    tasks: week.tasks.map((t, ti) => ({ ...t, id: `${roleId}:w${wi + 1}:t${ti + 1}` })),
  }))
}

function labelsForSkills(skillIds, role) {
  return skillIds
    .map((id) => role.requirements.find((r) => r.skills.includes(id))?.label ?? SKILL_BY_ID[id]?.label)
    .filter(Boolean)
}

function autoWeeks(role, gaps) {
  const g = gaps.length ? gaps : [...role.requirements].slice(0, 4).map((r) => ({ label: r.label }))
  const pick = (i) => g[Math.min(i, g.length - 1)]
  const g1 = pick(0)
  const g2 = pick(1)
  const g3 = pick(2)
  const g4 = pick(3)
  const publish = PUBLISH_BY_FAMILY[role.family] ?? 'Deploy it and add a live link to your profile'

  return [
    {
      title: `${g1.label} fundamentals`,
      summary: `Close your biggest gap for ${role.name} roles first.`,
      focus: [g1.label],
      tasks: [
        task(`Work through a focused ${g1.label} course or official guide`, 'learn', 120),
        task(`Note the five ${g1.label} concepts that matter most in ${role.name} work`, 'review', 30),
        task(`Build a small exercise that uses ${g1.label}`, 'build', 120),
        task(`Apply ${g1.label} to one of your existing projects`, 'build', 120),
      ],
      outcome: `A working ${g1.label} example on your profile.`,
    },
    {
      title: `${g2.label} in practice`,
      summary: 'Turn knowledge into habits by using it on real work.',
      focus: [g2.label, g1.label],
      tasks: [
        task(`Study ${g2.label}: core concepts and common patterns`, 'learn', 90),
        task(`Build a feature that combines ${g2.label} and ${g1.label}`, 'build', 180),
        task(`Review your code and refactor one rough edge`, 'practice', 60),
        task('Write a short note on what you learned and what surprised you', 'review', 30),
      ],
      outcome: 'A feature that shows both skills working together.',
    },
    {
      title: g4 && g4 !== g3 ? `${g3.label} + ${g4.label}` : `${g3.label} and quality`,
      summary: 'Make your work dependable and easier to evaluate.',
      focus: g4 && g4 !== g3 ? [g3.label, g4.label] : [g3.label],
      tasks: [
        task(`Learn the essentials of ${g3.label}`, 'learn', 90),
        task(`Apply ${g3.label} to a project and document the result`, 'build', 150),
        ...(g4 && g4 !== g3
          ? [task(`Get hands-on with ${g4.label} in a small exercise`, 'practice', 90)]
          : [task('Add tests or checks that prove your work behaves as expected', 'practice', 90)]),
        task('Ask a peer to review your work and capture their feedback', 'review', 45),
      ],
      outcome: 'Reviewed, more dependable work.',
    },
    {
      title: 'Build a production-ready project',
      summary: 'Bring it together in one project worth leading your profile with.',
      focus: role.core.slice(0, 3),
      tasks: [
        task(`Scope a project that combines ${joinList(role.core.slice(0, 3))}`, 'review', 60),
        task('Build it with clear structure, tests where they matter, and a README', 'build', 300),
        task(`${publish}`, 'review', 90),
        task('Update your resume, LinkedIn and portfolio with the new project', 'review', 45),
      ],
      outcome: 'A flagship project that shows your growth.',
    },
  ]
}

/**
 * @param {{ role: object, requirements: Array }} input
 * @returns {{ roleId: string, title: string, weeks: Array }}
 */
export function generateRoadmap({ role, requirements }) {
  const gaps = requirements.filter((r) => r.status !== 'strong').sort((a, b) => b.priority - a.priority)
  const override = ROADMAP_OVERRIDES[role.id]

  const weeks = override
    ? override.map((w) => ({ ...w, focus: labelsForSkills(w.skills ?? [], role) }))
    : autoWeeks(role, gaps)

  return { roleId: role.id, title: '30-Day Improvement Plan', weeks: withIds(role.id, weeks) }
}

/** { done, total, percent } for a plan given a map of completed task ids. */
export function roadmapProgress(roadmap, completed = {}) {
  const tasks = roadmap?.weeks?.flatMap((w) => w.tasks) ?? []
  const done = tasks.filter((t) => completed[t.id]).length
  return { done, total: tasks.length, percent: tasks.length ? Math.round((done / tasks.length) * 100) : 0 }
}

export function weekProgress(week, completed = {}) {
  const done = week.tasks.filter((t) => completed[t.id]).length
  return {
    done,
    total: week.tasks.length,
    percent: week.tasks.length ? Math.round((done / week.tasks.length) * 100) : 0,
    complete: done === week.tasks.length,
  }
}

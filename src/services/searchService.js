// Global search (Ctrl/Cmd + K). Builds an in-memory index over roles, skills, projects, people, pages
// and actions. Swap `search()` for a server-backed query later - the result shape is the contract.
//
// Result: { id, type: 'page'|'action'|'role'|'skill'|'project'|'user', title, subtitle, to?, action? }
// `action` is an id handled by the command palette (see components/layout/CommandPalette.jsx).

import { APP_NAV } from '../config/navigation.js'
import { ROUTES } from '../config/routes.js'
import { getCommunity } from '../data/community.js'
import { ROLE_CATEGORY_BY_ID } from '../data/roles/categories.js'
import { ROLES } from '../data/roles/roles.js'
import { SKILLS, findSkill } from '../data/roles/skillLibrary.js'
import { levelLabel } from '../data/scoring.js'

const norm = (s = '') =>
  String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')

export const SEARCH_GROUPS = [
  { type: 'page', label: 'Pages' },
  { type: 'action', label: 'Actions' },
  { type: 'role', label: 'Roles' },
  { type: 'skill', label: 'Skills' },
  { type: 'project', label: 'Projects' },
  { type: 'user', label: 'People' },
]

const ACTIONS = [
  { id: 'action:toggle-theme', action: 'toggle-theme', title: 'Toggle dark mode', subtitle: 'Switch between light and dark', keywords: 'theme appearance light dark mode' },
  { id: 'action:share', action: 'share-profile', title: 'Share my profile', subtitle: 'Copy your public profile link', keywords: 'copy link public profile recruiter' },
  { id: 'action:how', action: 'how-calculated', title: 'How is this calculated?', subtitle: 'Understand the scoring categories', keywords: 'score methodology explain transparency' },
  { id: 'action:change-role', action: 'change-role', title: 'Change target role', subtitle: 'Get assessed for a different career', keywords: 'switch role career job' },
  { id: 'action:analyze', action: 'start-analysis', title: 'Analyze my profile', subtitle: 'Start a new guided analysis', keywords: 'onboarding start new run assessment' },
]

// How many roles require each skill (for "Used in N roles").
const rolesPerSkill = (() => {
  const map = new Map()
  for (const role of ROLES) {
    const seen = new Set()
    for (const req of role.requirements) for (const id of req.skills) if (!seen.has(id)) (seen.add(id), map.set(id, (map.get(id) ?? 0) + 1))
  }
  return map
})()

let staticIndex = null

function buildStaticIndex() {
  const entries = []

  for (const item of APP_NAV) {
    entries.push({ id: `page:${item.id}`, type: 'page', title: item.label, subtitle: item.description, to: item.to, keywords: item.short })
  }
  entries.push({ id: 'page:roles', type: 'page', title: 'Role Explorer', subtitle: 'Browse every career we evaluate', to: ROUTES.roles, keywords: 'roles careers jobs explore browse' })
  entries.push({ id: 'page:home', type: 'page', title: 'Home', subtitle: 'Back to the landing page', to: ROUTES.home, keywords: 'landing start' })

  for (const a of ACTIONS) entries.push({ ...a, type: 'action' })

  for (const role of ROLES) {
    const cat = ROLE_CATEGORY_BY_ID[role.category]
    entries.push({
      id: `role:${role.id}`,
      type: 'role',
      title: role.name,
      subtitle: `${cat?.label ?? 'Role'} · ${role.core.slice(0, 3).join(', ')}`,
      to: `${ROUTES.roles}?role=${role.id}`,
      keywords: `${role.core.join(' ')} ${role.blurb} ${cat?.label ?? ''}`,
    })
  }

  for (const skill of SKILLS) {
    const n = rolesPerSkill.get(skill.id) ?? 0
    entries.push({
      id: `skill:${skill.id}`,
      type: 'skill',
      skillId: skill.id,
      title: skill.label,
      subtitle: n ? `Used in ${n} ${n === 1 ? 'role' : 'roles'}` : 'Skill',
      to: `${ROUTES.roles}?skill=${skill.id}`,
      keywords: skill.aliases.join(' '),
    })
  }

  for (const member of getCommunity()) {
    const { profile } = member
    entries.push({
      id: `user:${profile.handle}`,
      type: 'user',
      title: profile.name,
      subtitle: `${member.role.name} · ${member.score} readiness`,
      to: ROUTES.publicProfile(profile.handle),
      keywords: `${profile.location} ${profile.headline}`,
    })
    for (const project of profile.projects ?? []) {
      entries.push({
        id: `project:${profile.handle}:${project.id}`,
        type: 'project',
        title: project.name,
        subtitle: `by ${profile.name} · ${(project.tech ?? []).slice(0, 3).join(', ')}`,
        to: ROUTES.publicProfile(profile.handle),
        keywords: `${(project.tech ?? []).join(' ')} ${project.description ?? ''}`,
      })
    }
  }

  return entries
}

function getStaticIndex() {
  if (!staticIndex) staticIndex = buildStaticIndex()
  return staticIndex
}

/** Entries that depend on the signed-in user's data. */
function buildUserIndex(profile) {
  if (!profile) return []
  const entries = []
  for (const project of profile.projects ?? []) {
    entries.push({
      id: `myproject:${project.id}`,
      type: 'project',
      title: project.name,
      subtitle: `Your project · ${(project.tech ?? []).slice(0, 3).join(', ')}`,
      to: `${ROUTES.projects}?project=${project.id}`,
      keywords: `${(project.tech ?? []).join(' ')} ${project.description ?? ''} mine`,
      boost: 25,
    })
  }
  for (const entry of profile.skills ?? []) {
    const lib = findSkill(entry.name)
    entries.push({
      id: `myskill:${entry.id}`,
      type: 'skill',
      title: entry.name,
      subtitle: `Your skill · ${levelLabel(entry.level)}`,
      to: ROUTES.skills,
      keywords: lib?.aliases.join(' ') ?? '',
      boost: 25,
    })
  }
  return entries
}

function scoreEntry(entry, tokens) {
  const title = norm(entry.title)
  const haystack = `${title} ${norm(entry.subtitle)} ${norm(entry.keywords)}`
  let score = entry.boost ?? 0
  for (const token of tokens) {
    if (title === token) score += 120
    else if (title.startsWith(token)) score += 80
    else if (title.split(/[\s/&.-]+/).some((w) => w.startsWith(token))) score += 55
    else if (title.includes(token)) score += 35
    else if (haystack.includes(token)) score += 10
    else return 0
  }
  return score
}

/**
 * @param {string} query
 * @param {{ profile?: object, perGroup?: number }} [options]
 * @returns {Array<{ type: string, label: string, items: Array }>} groups with at least one result
 */
export function search(query, { profile, perGroup = 5 } = {}) {
  const tokens = norm(query).trim().split(/\s+/).filter(Boolean)
  if (!tokens.length) return []

  const pool = [...buildUserIndex(profile), ...getStaticIndex()]
  const seen = new Set()
  const scored = []
  for (const entry of pool) {
    const score = scoreEntry(entry, tokens)
    if (!score) continue
    // Don't list a skill twice (yours + catalog) or a project twice.
    const dedupe = `${entry.type}:${norm(entry.title)}`
    if (seen.has(dedupe)) continue
    seen.add(dedupe)
    scored.push({ entry, score })
  }

  return SEARCH_GROUPS.map((group) => ({
    ...group,
    items: scored
      .filter((s) => s.entry.type === group.type)
      .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
      .slice(0, perGroup)
      .map((s) => s.entry),
  })).filter((g) => g.items.length)
}

/** What to show before the user types. */
export function getSuggestions({ profile } = {}) {
  const index = getStaticIndex()
  const byId = (id) => index.find((e) => e.id === id)
  const pages = ['page:overview', 'page:analysis', 'page:skills', 'page:ranking', 'page:roadmap'].map(byId).filter(Boolean)
  const actions = ['action:toggle-theme', 'action:share', 'action:how', 'action:change-role'].map(byId).filter(Boolean)
  const roles = ['role:frontend-developer', 'role:backend-developer', 'role:ai-ml-engineer', 'role:ui-ux-designer'].map(byId).filter(Boolean)
  const mine = profile?.projects?.slice(0, 2).map((p) => ({ id: `myproject:${p.id}`, type: 'project', title: p.name, subtitle: 'Your project', to: `${ROUTES.projects}?project=${p.id}` })) ?? []
  return [
    { type: 'page', label: 'Go to', items: pages },
    { type: 'action', label: 'Quick actions', items: actions },
    { type: 'role', label: 'Explore roles', items: roles },
    ...(mine.length ? [{ type: 'project', label: 'Your projects', items: mine }] : []),
  ]
}

// Shape of a user profile + helpers to create / normalize one.
// Pure module (no React / browser APIs).
//
// Profile {
//   id, name, handle, headline, location, region, bio, email,
//   targetRoleId, yearsOfExperience, status: 'professional'|'student', workPreference: 'remote'|'hybrid'|'onsite',
//   links:   { github?, linkedin?, portfolio?, behance?, dribbble?, instagram?, kaggle?, leetcode?, codeforces?, other: string[] },
//   resume:  { name, size, type?, uploadedAt } | null,
//   skills:         [{ id, name, level: 'beginner'|'intermediate'|'advanced'|'expert' }],
//   projects:       [{ id, name, description, tech: string[], url, repo, year, complexity: 1-5, impact: 1-5 }],
//   experience:     [{ id, type: 'work'|'internship', company, title, start: 'YYYY-MM', end: 'YYYY-MM'|null, current, description, skills?: string[] }],
//   education:      [{ id, school, degree, field?, start, end }],
//   certifications: [{ id, name, issuer, year }],
//   achievements:   [{ id, title, year, description? }],
//   integrations:   { github?, linkedin?, portfolio?, behance?, dribbble?, instagram?, kaggle?, leetcode?, codeforces? }  // data from connected sources
// }

import { slugify } from '../utils/format.js'
import { uid } from '../utils/id.js'
import { DEFAULT_ROLE_ID } from './roles/roles.js'

export const COLLECTIONS = {
  skills: { prefix: 'sk', singular: 'skill' },
  projects: { prefix: 'pr', singular: 'project' },
  experience: { prefix: 'ex', singular: 'experience entry' },
  education: { prefix: 'ed', singular: 'education entry' },
  certifications: { prefix: 'ce', singular: 'certification' },
  achievements: { prefix: 'ac', singular: 'achievement' },
}

export const WORK_PREFERENCES = [
  { id: 'remote', label: 'Remote' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'onsite', label: 'On-site' },
]

export const STATUS_OPTIONS = [
  { id: 'professional', label: 'Professional' },
  { id: 'student', label: 'Student' },
]

export const REGION_OPTIONS = [
  { id: 'north-america', label: 'North America' },
  { id: 'europe', label: 'Europe' },
  { id: 'south-asia', label: 'South Asia' },
  { id: 'east-asia', label: 'East Asia & Pacific' },
  { id: 'latin-america', label: 'Latin America' },
  { id: 'africa-me', label: 'Africa & Middle East' },
]

export function createEmptyProfile(overrides = {}) {
  return {
    id: uid('u'),
    name: '',
    handle: '',
    headline: '',
    location: '',
    region: 'north-america',
    bio: '',
    email: '',
    targetRoleId: DEFAULT_ROLE_ID,
    yearsOfExperience: 0,
    status: 'professional',
    workPreference: 'remote',
    links: { other: [] },
    resume: null,
    skills: [],
    projects: [],
    experience: [],
    education: [],
    certifications: [],
    achievements: [],
    integrations: {},
    ...overrides,
  }
}

/** Fill anything missing (e.g. after loading an older persisted state). */
export function normalizeProfile(profile = {}) {
  const base = createEmptyProfile()
  return {
    ...base,
    ...profile,
    links: { other: [], ...(profile.links ?? {}) },
    integrations: { ...(profile.integrations ?? {}) },
    skills: profile.skills ?? [],
    projects: profile.projects ?? [],
    experience: profile.experience ?? [],
    education: profile.education ?? [],
    certifications: profile.certifications ?? [],
    achievements: profile.achievements ?? [],
  }
}

/** "Alex Morgan" -> "alex-morgan" (adds -2, -3… if taken). */
export function uniqueHandle(name, taken = new Set()) {
  const base = slugify(name) || 'you'
  if (!taken.has(base)) return base
  let i = 2
  while (taken.has(`${base}-${i}`)) i += 1
  return `${base}-${i}`
}

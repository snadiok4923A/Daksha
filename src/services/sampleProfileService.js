// "Use sample data" for onboarding: builds a realistic, role-appropriate set of skills, projects,
// experience and connected-source data so anyone can see the full product without typing.

import { generateProfile } from '../data/profileGenerator.js'
import { getRole } from '../data/roles/roles.js'
import { slugify } from '../utils/format.js'
import { simulateLatency } from './client.js'

/**
 * @param {string} roleId
 * @param {{ name?: string }} [identity]
 */
export async function generateSampleProfile(roleId, { name = 'You' } = {}) {
  await simulateLatency(500, 900)
  const role = getRole(roleId)
  const handle = slugify(name) || 'you'
  const profile = generateProfile({
    id: 'sample',
    name,
    handle,
    roleId: role.id,
    tier: 0.68,
    years: 3,
    status: 'professional',
    workPreference: 'remote',
  })
  // Only hand back the building blocks onboarding collects - identity fields stay with the user.
  return {
    skills: profile.skills,
    projects: profile.projects,
    experience: profile.experience,
    education: profile.education,
    certifications: profile.certifications,
    achievements: profile.achievements,
    links: profile.links,
    integrations: profile.integrations,
    bio: profile.bio,
    headline: profile.headline,
    yearsOfExperience: profile.yearsOfExperience,
    resume: profile.resume,
  }
}

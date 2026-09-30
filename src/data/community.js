// The demo community: fictional people used for public profiles, search, and "people like you".
// All names, employers and accounts are invented. Scores are computed by the same engine as the
// signed-in user's, so every public profile is internally consistent.
//
// Pure module (no React / browser APIs).

import { analyzeProfile } from '../engine/index.js'
import { createDemoProfile } from './demoProfile.js'
import { generateProfile } from './profileGenerator.js'

// `tier` = how strong the generated profile looks (0..1). Tuned so the headline examples
// (Alex 82, Rahul 76, Maya 91) read well - run `npm run engine:report` to see the numbers.
const PEOPLE = [
  {
    name: 'Rahul Sharma',
    handle: 'rahul-sharma',
    roleId: 'fullstack-developer',
    tier: 0.66,
    years: 4,
    location: 'Bengaluru, India',
    region: 'south-asia',
    workPreference: 'hybrid',
  },
  {
    name: 'Maya Chen',
    handle: 'maya-chen',
    roleId: 'ai-ml-engineer',
    tier: 0.98,
    years: 6,
    location: 'Singapore',
    region: 'east-asia',
    workPreference: 'remote',
  },
  {
    name: 'Sofia Alvarez',
    handle: 'sofia-alvarez',
    roleId: 'ui-ux-designer',
    tier: 0.78,
    years: 5,
    location: 'Madrid, Spain',
    region: 'europe',
    workPreference: 'hybrid',
  },
  {
    name: 'Daniel Okafor',
    handle: 'daniel-okafor',
    roleId: 'backend-developer',
    tier: 0.7,
    years: 5,
    location: 'Lagos, Nigeria',
    region: 'africa-me',
    workPreference: 'remote',
  },
  {
    name: 'Emma Lindqvist',
    handle: 'emma-lindqvist',
    roleId: 'devops-engineer',
    tier: 0.8,
    years: 6,
    location: 'Stockholm, Sweden',
    region: 'europe',
    workPreference: 'hybrid',
  },
  {
    name: 'Liam O’Connor',
    handle: 'liam-oconnor',
    roleId: 'game-developer',
    tier: 0.62,
    years: 3,
    location: 'Dublin, Ireland',
    region: 'europe',
    workPreference: 'onsite',
  },
  {
    name: 'Priya Nair',
    handle: 'priya-nair',
    roleId: 'data-scientist',
    tier: 0.74,
    years: 4,
    location: 'Chennai, India',
    region: 'south-asia',
    workPreference: 'hybrid',
  },
  {
    name: 'Noah Kim',
    handle: 'noah-kim',
    roleId: 'unity-developer',
    tier: 0.55,
    years: 2,
    location: 'Seoul, South Korea',
    region: 'east-asia',
    workPreference: 'onsite',
  },
  {
    name: 'Zara Hussain',
    handle: 'zara-hussain',
    roleId: 'cybersecurity-engineer',
    tier: 0.68,
    years: 4,
    location: 'Dubai, UAE',
    region: 'africa-me',
    workPreference: 'hybrid',
  },
  {
    name: 'Mateo Silva',
    handle: 'mateo-silva',
    roleId: 'mobile-app-developer',
    tier: 0.6,
    years: 3,
    location: 'São Paulo, Brazil',
    region: 'latin-america',
    workPreference: 'remote',
  },
  {
    name: 'Hana Yamamoto',
    handle: 'hana-yamamoto',
    roleId: '3d-designer',
    tier: 0.72,
    years: 4,
    location: 'Tokyo, Japan',
    region: 'east-asia',
    workPreference: 'hybrid',
  },
  {
    name: 'Oliver Grant',
    handle: 'oliver-grant',
    roleId: 'software-engineer',
    tier: 0.45,
    years: 0,
    status: 'student',
    location: 'Melbourne, Australia',
    region: 'east-asia',
    workPreference: 'hybrid',
  },
  {
    name: 'Amara Diallo',
    handle: 'amara-diallo',
    roleId: 'product-designer',
    tier: 0.76,
    years: 5,
    location: 'Paris, France',
    region: 'europe',
    workPreference: 'remote',
  },
  {
    name: 'Lucas Meyer',
    handle: 'lucas-meyer',
    roleId: 'blockchain-developer',
    tier: 0.58,
    years: 2,
    location: 'Berlin, Germany',
    region: 'europe',
    workPreference: 'remote',
  },
  {
    name: 'Chloe Bennett',
    handle: 'chloe-bennett',
    roleId: 'cloud-engineer',
    tier: 0.64,
    years: 4,
    location: 'Austin, USA',
    region: 'north-america',
    workPreference: 'hybrid',
  },
]

let cache = null

/** All demo profiles (Alex first). Each gets a computed `analysis` summary for cards + search. */
export function getCommunity(now = Date.now()) {
  if (cache) return cache
  const alex = createDemoProfile(now)
  const profiles = [
    alex,
    ...PEOPLE.map((p, i) => generateProfile({ id: `u_${p.handle}`, now, ...p, tier: p.tier, seedIndex: i })),
  ]
  cache = profiles.map((profile) => {
    const analysis = analyzeProfile(profile, { now: new Date(now) })
    return {
      profile,
      score: analysis.score.overall,
      band: analysis.score.band,
      topPercent: analysis.ranking.topPercent,
      role: analysis.role,
      strongAreas: analysis.summary.strongAreas,
    }
  })
  return cache
}

export const getCommunityProfiles = () => getCommunity().map((c) => c.profile)
export const findCommunityMember = (handle) => getCommunity().find((c) => c.profile.handle === handle) ?? null

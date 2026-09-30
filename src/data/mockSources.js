// Deterministic generators that fake what real integrations would return
// (GitHub, LinkedIn, portfolio, Behance/Dribbble/Instagram, LeetCode, Codeforces, Kaggle).
//
// Same input -> same output, so the demo feels stable across reloads. The shapes match the
// "integration" contract in docs/ARCHITECTURE.md - replace these generators with real API calls
// inside src/services/* when a backend exists.
//
// `tier` (0..1) controls how strong the fake account looks.
// Pure module (no React / browser APIs).

import { clamp, round, seededRandom } from '../utils/math.js'

const DAY = 86_400_000
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const LANGUAGE_POOLS = {
  web: ['TypeScript', 'JavaScript', 'CSS', 'HTML', 'Python', 'Shell'],
  backend: ['Python', 'Java', 'Go', 'TypeScript', 'SQL', 'Shell'],
  ai: ['Python', 'Jupyter Notebook', 'C++', 'Shell', 'Dockerfile', 'TypeScript'],
  data: ['Python', 'SQL', 'Jupyter Notebook', 'R', 'Shell', 'TypeScript'],
  infra: ['HCL', 'Shell', 'Python', 'Go', 'YAML', 'Dockerfile'],
  security: ['Python', 'C', 'Shell', 'Go', 'JavaScript', 'Assembly'],
  game: ['C#', 'C++', 'ShaderLab', 'HLSL', 'Python', 'GLSL'],
  creative3d: ['Python', 'C#', 'GLSL', 'JavaScript', 'HLSL', 'Shell'],
  design: ['JavaScript', 'CSS', 'HTML', 'TypeScript', 'Shell'],
  emerging: ['Solidity', 'TypeScript', 'Rust', 'Python', 'JavaScript', 'Shell'],
  embedded: ['C', 'C++', 'Python', 'Assembly', 'Shell', 'CMake'],
}

const REPO_NAMES = {
  web: [
    'pulse-dashboard',
    'design-kit',
    'waypoint',
    'recipe-box',
    'portfolio-v3',
    'ui-playground',
    'form-lab',
    'motion-notes',
  ],
  backend: [
    'orders-api',
    'auth-service',
    'queue-worker',
    'schema-lab',
    'rate-limiter',
    'billing-core',
    'event-hub',
    'cache-kit',
  ],
  ai: [
    'leaf-classifier',
    'rag-notes',
    'vision-lab',
    'nlp-playground',
    'ml-from-scratch',
    'feature-store',
    'eval-harness',
    'model-serving',
  ],
  data: [
    'churn-analysis',
    'sales-dashboard',
    'sql-patterns',
    'forecast-lab',
    'ab-test-kit',
    'etl-notes',
    'survey-insights',
    'kaggle-notebooks',
  ],
  infra: [
    'terraform-modules',
    'ci-templates',
    'k8s-playground',
    'observability-stack',
    'deploy-scripts',
    'cost-watch',
    'runbooks',
    'gitops-demo',
  ],
  security: [
    'ctf-writeups',
    'recon-toolkit',
    'vuln-lab',
    'hardening-scripts',
    'log-hunter',
    'crypto-notes',
    'web-exploits',
    'threat-models',
  ],
  game: [
    'neon-drift',
    'dungeon-systems',
    'shader-garden',
    'jam-2024',
    'ability-kit',
    'pathing-lab',
    'camera-rig',
    'tiny-tactics',
  ],
  creative3d: [
    'blender-tools',
    'shader-lab',
    'procedural-props',
    'render-presets',
    'scene-exports',
    'texture-kit',
    'turntable-scripts',
    'rig-helpers',
  ],
  design: [
    'design-tokens',
    'case-study-site',
    'icon-set',
    'prototype-kit',
    'ux-notes',
    'motion-specs',
    'portfolio',
    'accessibility-audit',
  ],
  emerging: [
    'token-vault',
    'dao-toolkit',
    'nft-market',
    'contract-audits',
    'gas-lab',
    'wallet-connect-demo',
    'xr-sandbox',
    'protocol-notes',
  ],
  embedded: [
    'sensor-hub',
    'motor-control',
    'rtos-demo',
    'bootloader',
    'ble-beacon',
    'pcb-notes',
    'drone-fc',
    'robot-arm',
  ],
}

const ACTIVITY = [
  ['pr', (r) => `Merged: improve ${r} test coverage`],
  ['push', (r) => `Pushed 3 commits to main in ${r}`],
  ['release', (r) => `Released a new minor version of ${r}`],
  ['issue', (r) => `Opened an issue in ${r}: edge case on slow connections`],
  ['pr', (r) => `Opened a pull request in ${r}: refactor shared helpers`],
  ['push', (r) => `Pushed 6 commits to a feature branch in ${r}`],
]

/** The n most recent month labels, oldest first, relative to `now`. */
export function lastMonths(n = 12, now = Date.now()) {
  const d = new Date(now)
  const out = []
  for (let i = n - 1; i >= 0; i--) {
    const m = new Date(d.getFullYear(), d.getMonth() - i, 1)
    out.push(MONTHS[m.getMonth()])
  }
  return out
}

const usernameFrom = (urlOrName = '') => {
  const clean = String(urlOrName).trim().replace(/\/+$/, '')
  return clean.split('/').filter(Boolean).pop()?.replace(/^@/, '') || 'developer'
}

function normalizePercents(weights) {
  const total = weights.reduce((a, b) => a + b, 0) || 1
  const pcts = weights.map((w) => Math.round((w / total) * 100))
  const diff = 100 - pcts.reduce((a, b) => a + b, 0)
  pcts[0] += diff
  return pcts
}

/* ---------------------------------- GitHub ---------------------------------- */

export function mockGithub(urlOrUsername, { tier = 0.6, family = 'web', now = Date.now(), languages } = {}) {
  const username = usernameFrom(urlOrUsername)
  const rnd = seededRandom(`gh:${username}`)
  const t = clamp(tier, 0.05, 1)

  const pool = languages ?? LANGUAGE_POOLS[family] ?? LANGUAGE_POOLS.web
  const weights = pool.map((_, i) => (pool.length - i) ** 1.6 * (0.7 + rnd() * 0.6))
  const pcts = normalizePercents(weights)
  const langs = pool.map((name, i) => ({ name, pct: pcts[i] })).sort((a, b) => b.pct - a.pct)

  const monthly = lastMonths(12, now).map((month, i) => {
    const trend = 0.75 + (i / 11) * 0.5
    return { month, count: Math.max(0, Math.round(t * 170 * trend * (0.55 + rnd() * 0.7))) }
  })
  const contributions = monthly.reduce((a, m) => a + m.count, 0)

  const repoNames = REPO_NAMES[family] ?? REPO_NAMES.web
  const repos = Math.round(6 + t * 42 + rnd() * 6)

  const recent = Array.from({ length: 4 }, (_, i) => {
    const [type, title] = ACTIVITY[Math.floor(rnd() * ACTIVITY.length)]
    const repo = repoNames[Math.floor(rnd() * repoNames.length)]
    return {
      id: `${username}-act-${i}`,
      type,
      repo,
      title: title(repo),
      when: new Date(now - (i * 2 + 1 + Math.floor(rnd() * 2)) * DAY).toISOString(),
    }
  })

  const pinned = repoNames.slice(0, 4).map((name, i) => ({
    name,
    description: `A ${langs[i % langs.length].name} project exploring ${name.replace(/-/g, ' ')}.`,
    language: langs[i % langs.length].name,
    stars: Math.round(t * (90 - i * 18) * (0.6 + rnd() * 0.8)),
  }))

  return {
    username,
    url: `https://github.com/${username}`,
    fetchedAt: new Date(now).toISOString(),
    repos,
    contributions,
    stars: Math.round(t * 260 * (0.6 + rnd() * 0.8)),
    followers: Math.round(t * 120 * (0.5 + rnd())),
    following: Math.round(20 + rnd() * 60),
    languages: langs,
    monthly,
    recent,
    pinned,
    quality: {
      readmeCoverage: round(clamp(0.35 + t * 0.5 + (rnd() - 0.5) * 0.12, 0.1, 0.98), 2),
      testsCoverage: round(clamp(0.1 + t * 0.4 + (rnd() - 0.5) * 0.15, 0.03, 0.9), 2),
      ciCoverage: round(clamp(0.05 + t * 0.35 + (rnd() - 0.5) * 0.12, 0.02, 0.85), 2),
      score: Math.round(clamp(42 + t * 42 + (rnd() - 0.5) * 8, 25, 96)),
    },
    consistency: {
      activeWeeks: Math.round(clamp(10 + t * 36 + (rnd() - 0.5) * 6, 4, 52)),
      longestStreak: Math.round(clamp(3 + t * 26 + rnd() * 8, 2, 120)),
    },
    profilePolish: round(clamp(0.4 + t * 0.5 + (rnd() - 0.5) * 0.12, 0.2, 1), 2),
  }
}

/* --------------------------------- LinkedIn --------------------------------- */

export function mockLinkedin(url, { tier = 0.6, now = Date.now() } = {}) {
  const rnd = seededRandom(`li:${usernameFrom(url)}`)
  const t = clamp(tier, 0.05, 1)
  return {
    url,
    fetchedAt: new Date(now).toISOString(),
    headline: t > 0.25,
    about: t > 0.35,
    experienceEntries: Math.max(1, Math.round(1 + t * 3 + rnd())),
    skills: Math.round(6 + t * 24),
    endorsements: Math.round(t * 70 * (0.6 + rnd() * 0.8)),
    recommendations: Math.round(t * 4 * rnd() + (t > 0.7 ? 1 : 0)),
    connections: t > 0.6 ? '500+' : `${Math.round(60 + t * 400)}`,
    completeness: Math.round(clamp(45 + t * 48 + (rnd() - 0.5) * 8, 30, 99)),
  }
}

/* --------------------------------- Portfolio -------------------------------- */

export function mockPortfolio(url, { tier = 0.6, now = Date.now() } = {}) {
  const rnd = seededRandom(`po:${usernameFrom(url)}`)
  const t = clamp(tier, 0.05, 1)
  const score = (base, spread = 8) => Math.round(clamp(base + (rnd() - 0.5) * spread, 35, 99))
  return {
    url,
    fetchedAt: new Date(now).toISOString(),
    design: score(45 + t * 45),
    performance: score(55 + t * 38),
    content: score(40 + t * 42),
    responsive: score(50 + t * 42),
    projectsShown: Math.round(1 + t * 5),
    hasCaseStudies: t > 0.55,
  }
}

/* ------------------------- Behance / Dribbble / Instagram ------------------------- */

export function mockCreative(platform, url, { tier = 0.6, now = Date.now() } = {}) {
  const rnd = seededRandom(`${platform}:${usernameFrom(url)}`)
  const t = clamp(tier, 0.05, 1)
  const scale = { behance: 1, dribbble: 0.9, instagram: 1.6 }[platform] ?? 1
  return {
    url,
    platform,
    fetchedAt: new Date(now).toISOString(),
    followers: Math.round(t * 2100 * scale * (0.5 + rnd())),
    items: Math.round(3 + t * 40 * (0.6 + rnd() * 0.6)),
    appreciations: Math.round(t * 3200 * scale * (0.5 + rnd())),
    postsLast90d: Math.round(clamp(t * 11 * (0.5 + rnd()), 0, 30)),
  }
}

/* ------------------------------ Coding profiles ------------------------------ */

export function mockLeetcode(url, { tier = 0.6 } = {}) {
  const rnd = seededRandom(`lc:${usernameFrom(url)}`)
  const t = clamp(tier, 0.05, 1)
  const solved = Math.round(30 + t * 420 * (0.7 + rnd() * 0.5))
  const hard = Math.round(solved * (0.04 + t * 0.06))
  const medium = Math.round(solved * 0.48)
  return {
    url,
    solved,
    easy: Math.max(0, solved - medium - hard),
    medium,
    hard,
    rating: Math.round(1200 + t * 700 * (0.7 + rnd() * 0.5)),
    contests: Math.round(t * 22 * (0.4 + rnd())),
    streak: Math.round(t * 40 * (0.3 + rnd())),
  }
}

export function mockCodeforces(url, { tier = 0.6 } = {}) {
  const rnd = seededRandom(`cf:${usernameFrom(url)}`)
  const t = clamp(tier, 0.05, 1)
  const rating = Math.round(900 + t * 900 * (0.75 + rnd() * 0.4))
  const rank =
    rating >= 1900
      ? 'Candidate Master'
      : rating >= 1600
        ? 'Expert'
        : rating >= 1400
          ? 'Specialist'
          : rating >= 1200
            ? 'Pupil'
            : 'Newbie'
  return { url, rating, maxRating: rating + Math.round(rnd() * 90), contests: Math.round(6 + t * 40 * rnd()), rank }
}

export function mockKaggle(url, { tier = 0.6 } = {}) {
  const rnd = seededRandom(`kg:${usernameFrom(url)}`)
  const t = clamp(tier, 0.05, 1)
  const tier4 = t > 0.85 ? 'Master' : t > 0.6 ? 'Expert' : t > 0.35 ? 'Contributor' : 'Novice'
  return {
    url,
    tier: tier4,
    medals: { gold: Math.round(t * 3 * rnd()), silver: Math.round(t * 6 * rnd()), bronze: Math.round(t * 10 * rnd()) },
    notebooks: Math.round(2 + t * 30 * rnd()),
    competitions: Math.round(t * 8 * rnd()),
  }
}

/** Convenience: which generator handles which platform id. */
export const SOURCE_GENERATORS = {
  github: (url, opts) => mockGithub(url, opts),
  linkedin: (url, opts) => mockLinkedin(url, opts),
  portfolio: (url, opts) => mockPortfolio(url, opts),
  behance: (url, opts) => mockCreative('behance', url, opts),
  dribbble: (url, opts) => mockCreative('dribbble', url, opts),
  instagram: (url, opts) => mockCreative('instagram', url, opts),
  leetcode: (url, opts) => mockLeetcode(url, opts),
  codeforces: (url, opts) => mockCodeforces(url, opts),
  kaggle: (url, opts) => mockKaggle(url, opts),
}

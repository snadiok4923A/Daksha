// Generates realistic, role-appropriate demo profiles from a role config + a "strength" tier (0..1).
// Used for the demo community (public profiles, search) and the "use sample data" option in onboarding.
// Deterministic for a given seed. Pure module (no React / browser APIs).

import { getFamily } from './roles/families.js'
import { getRole } from './roles/roles.js'
import { SKILL_BY_ID } from './roles/skillLibrary.js'
import { SOURCE_GENERATORS } from './mockSources.js'
import { clamp, hashString, seededRandom } from '../utils/math.js'

/* -------------------------------- templates -------------------------------- */
// [name, description, tech[], complexity(1-5), impact(1-5)]
const PROJECT_TEMPLATES = {
  web: [
    [
      'Pulse Dashboard',
      'Real-time analytics dashboard with role-based views, accessible charts and full keyboard navigation.',
      ['React', 'TypeScript', 'REST APIs', 'Tailwind CSS'],
      4,
      3,
    ],
    [
      'Waypoint',
      'Offline-first trip planner PWA with drag-and-drop itineraries, shareable maps and a responsive layout.',
      ['React', 'JavaScript', 'Responsive Design', 'Vite'],
      3,
      3,
    ],
    [
      'Design Kit',
      'A documented component library with design tokens, theming and automated accessibility tests.',
      ['React', 'TypeScript', 'CSS', 'Accessibility', 'Testing'],
      3,
      2,
    ],
    [
      'Recipe Box',
      'Recipe manager with search, meal planning and a distraction-free reading mode.',
      ['JavaScript', 'HTML', 'CSS', 'Node.js'],
      2,
      2,
    ],
  ],
  backend: [
    [
      'Orders API',
      'Order-management service with idempotent payments, cursor pagination and per-tenant rate limiting.',
      ['Node.js', 'PostgreSQL', 'REST APIs', 'Docker', 'Testing'],
      4,
      3,
    ],
    [
      'Auth Service',
      'Standalone authentication service: OAuth2 login, refresh-token rotation and role-based access.',
      ['Node.js', 'Authentication', 'Redis', 'System design'],
      4,
      3,
    ],
    [
      'Queue Worker',
      'Background job system with retries, dead-letter queues and a small metrics dashboard.',
      ['Python', 'Message queues', 'Docker', 'Monitoring'],
      4,
      2,
    ],
    [
      'Schema Lab',
      'Migration tooling and query-performance experiments comparing index strategies on 10M rows.',
      ['PostgreSQL', 'Databases', 'SQL', 'Caching'],
      3,
      2,
    ],
  ],
  ai: [
    [
      'Leaf Classifier',
      'Plant-disease classifier trained on 50k images with a FastAPI inference service and a simple web UI.',
      ['Python', 'PyTorch', 'Computer vision', 'FastAPI', 'Docker'],
      4,
      4,
    ],
    [
      'RAG Notes',
      'Retrieval-augmented assistant over personal notes with evaluation harness and citation checks.',
      ['Python', 'LLMs', 'FastAPI', 'Machine learning'],
      4,
      3,
    ],
    [
      'ML From Scratch',
      'Regression, trees and a small neural network implemented in NumPy with notebooks explaining the math.',
      ['Python', 'NumPy', 'Mathematics', 'Statistics', 'Machine learning'],
      3,
      2,
    ],
    [
      'Model Serving Kit',
      'Reusable template to package, monitor and roll back ML models behind a REST API.',
      ['Python', 'Docker', 'Model deployment', 'CI/CD'],
      3,
      3,
    ],
  ],
  data: [
    [
      'Churn Analysis',
      'End-to-end churn study with cohort analysis, a gradient-boosting model and a stakeholder-ready summary.',
      ['Python', 'Pandas', 'Statistics', 'Machine learning', 'Data visualization'],
      4,
      3,
    ],
    [
      'Sales Dashboard',
      'Interactive executive dashboard with drill-downs, KPIs and automated weekly refresh.',
      ['SQL', 'Tableau', 'Excel', 'Data visualization'],
      3,
      4,
    ],
    [
      'A/B Test Toolkit',
      'Reusable notebook for experiment design, power analysis and sequential testing.',
      ['Python', 'Statistics', 'Experiment design', 'Pandas'],
      3,
      3,
    ],
    [
      'Forecast Lab',
      'Demand forecasting comparison of classical and ML models with backtesting.',
      ['Python', 'Machine learning', 'Statistics', 'SQL'],
      3,
      2,
    ],
  ],
  infra: [
    [
      'Terraform Modules',
      'Reusable modules for VPCs, ECS services and IAM with policy tests and documentation.',
      ['Terraform', 'AWS', 'Linux', 'Security fundamentals'],
      4,
      3,
    ],
    [
      'CI Templates',
      'Shared pipeline templates: build, test, scan and deploy with caching and approvals.',
      ['CI/CD', 'Docker', 'Git', 'Scripting'],
      3,
      4,
    ],
    [
      'K8s Playground',
      'Local Kubernetes lab with GitOps, autoscaling and chaos experiments.',
      ['Kubernetes', 'Docker', 'Monitoring', 'Linux'],
      4,
      2,
    ],
    [
      'Observability Stack',
      'Metrics, logs and traces with SLO dashboards and alert routing for a sample microservice app.',
      ['Monitoring', 'Kubernetes', 'SRE practices', 'Scripting'],
      4,
      3,
    ],
  ],
  security: [
    [
      'CTF Write-ups',
      'Documented solutions to 40+ web, crypto and pwn challenges with reusable helper scripts.',
      ['Penetration testing', 'Python', 'Web security', 'Cryptography'],
      3,
      2,
    ],
    [
      'Recon Toolkit',
      'Automation that chains subdomain discovery, port scans and screenshot triage for scoped assessments.',
      ['Python', 'Networking', 'Security tooling', 'Linux'],
      4,
      3,
    ],
    [
      'Vuln Lab',
      'Intentionally vulnerable app with guided exercises mapped to the OWASP Top 10.',
      ['Web security', 'Node.js', 'Docker', 'Threat modeling'],
      4,
      3,
    ],
    [
      'Log Hunter',
      'Detection rules and queries for suspicious authentication patterns, tested on simulated attacks.',
      ['SIEM', 'Incident response', 'Scripting', 'Linux'],
      3,
      3,
    ],
  ],
  game: [
    [
      'Neon Drift',
      'Arcade racing prototype with drift physics, ghost replays and controller support.',
      ['Unity', 'C#', 'Game programming', 'Physics'],
      4,
      3,
    ],
    [
      'Dungeon Systems',
      'Data-driven ability, inventory and loot systems with enemy AI and an in-editor tuning tool.',
      ['Unity', 'C#', 'Gameplay systems', 'Game AI'],
      4,
      3,
    ],
    [
      'Shader Garden',
      'Collection of stylized shaders (dissolve, outline, water) with breakdowns and performance notes.',
      ['Shaders', 'Unity', 'Optimization', '3D mathematics'],
      3,
      2,
    ],
    [
      'Jam Entry: Tiny Tactics',
      'Turn-based tactics game built in 72 hours, ranked top 5% of entries.',
      ['C#', 'Unity', 'Game design', 'Git'],
      3,
      3,
    ],
  ],
  creative3d: [
    [
      'Stylized Diorama',
      'A hand-painted stylized environment, from blockout and sculpt to textures, lighting and final renders.',
      ['Blender', '3D modeling', 'Texturing', 'Lighting', 'Rendering'],
      4,
      3,
    ],
    [
      'Hard-surface Props Pack',
      'Twelve game-ready props with clean topology, PBR textures and LODs.',
      ['Blender', '3D modeling', 'Substance', 'Real-time asset pipeline'],
      4,
      3,
    ],
    [
      'Product Visualization',
      'Photoreal product shots for a fictional headphone brand with turntable and studio lighting.',
      ['Blender', 'Lighting', 'Rendering', 'Compositing'],
      3,
      3,
    ],
    [
      'Character Bust',
      'Sculpted character bust with retopology, skin shading and a short turntable.',
      ['ZBrush', 'Sculpting', 'Texturing', 'Rendering'],
      3,
      2,
    ],
  ],
  design: [
    [
      'Fintech Onboarding Redesign',
      'Case study: cut drop-off in a banking onboarding flow through research, prototyping and testing.',
      ['Figma', 'UX research', 'Prototyping', 'Usability testing', 'Case studies'],
      4,
      4,
    ],
    [
      'Design System Starter',
      'A token-based design system with documented components, usage guidance and accessibility notes.',
      ['Figma', 'Design systems', 'Accessibility', 'Visual design'],
      4,
      3,
    ],
    [
      'Health Tracker App',
      'Mobile app concept: flows, wireframes, high-fidelity UI and micro-interactions.',
      ['Figma', 'Wireframing', 'Interaction design', 'Prototyping'],
      3,
      3,
    ],
    [
      'Checkout UX Audit',
      'Heuristic evaluation and prioritized fixes for an e-commerce checkout.',
      ['UX research', 'Usability testing', 'Information architecture'],
      2,
      2,
    ],
  ],
  emerging: [
    [
      'Token Vault',
      'Audited vesting and staking contracts with full test suite, fuzzing and gas reports.',
      ['Solidity', 'Smart contracts', 'Testing', 'Contract security'],
      4,
      3,
    ],
    [
      'DAO Toolkit',
      'Governance dApp: proposals, quadratic voting and on-chain treasury with a React front end.',
      ['Solidity', 'Web3 tooling', 'TypeScript', 'React'],
      4,
      3,
    ],
    [
      'Gas Lab',
      'Benchmarks of storage and calldata patterns with optimization write-ups.',
      ['Solidity', 'Optimization', 'Blockchain fundamentals'],
      3,
      2,
    ],
    [
      'XR Sandbox',
      'Hand-tracking interaction experiments for Quest with performance budgets.',
      ['Unity', 'AR / VR development', 'C#', '3D mathematics'],
      3,
      2,
    ],
  ],
  embedded: [
    [
      'Sensor Hub',
      'Low-power multi-sensor node with BLE reporting and over-the-air updates.',
      ['C', 'Embedded systems', 'Hardware protocols', 'IoT systems'],
      4,
      3,
    ],
    [
      'Motor Controller',
      'Closed-loop BLDC motor controller with PID tuning and live telemetry.',
      ['C++', 'Control systems', 'Electronics', 'Real-time systems'],
      4,
      3,
    ],
    [
      'RTOS Demo',
      'Task scheduler demo showing priority inversion and its fix on an STM32 board.',
      ['C', 'Real-time systems', 'Embedded systems', 'Git'],
      3,
      2,
    ],
    [
      'Robot Arm',
      'Three-axis robot arm with inverse kinematics and a ROS interface.',
      ['ROS', 'Python', 'Robotics', 'Control systems'],
      4,
      3,
    ],
  ],
}

const ACHIEVEMENTS = {
  web: [
    'Finalist, CivicHack 2025',
    'Speaker, Frontend Meetup: “Motion with purpose”',
    '3 merged PRs in popular UI libraries',
  ],
  backend: [
    'Top 5%, Backend Bootcamp Cup',
    'Open-sourced a rate-limiter used by 400+ projects',
    'Speaker, Platform Engineering Meetup',
  ],
  ai: [
    'Top 8% in a public Kaggle competition',
    'Reproduced a recent vision paper with released code',
    'Finalist, AI for Good Hackathon',
  ],
  data: [
    'Kaggle Notebooks Expert',
    'Winner, Regional Data Challenge',
    'Published a public analysis read by 20k people',
  ],
  infra: [
    'Cut cloud spend 31% in a cost-optimization sprint',
    'Open-sourced a Terraform module used by 200+ repos',
    'Speaker, Cloud Native Meetup',
  ],
  security: [
    'Top 3% on a public CTF platform',
    'Acknowledged in two responsible disclosure programs',
    'Speaker, Local Security Meetup',
  ],
  game: ['Top 5% in a 72-hour game jam', 'Published a free demo with 12k downloads', 'Finalist, Indie Showcase'],
  creative3d: [
    'Featured on a major art community front page',
    'Top 10, Monthly Environment Challenge',
    'Commissioned by two indie studios',
  ],
  design: ['Case study featured in a design newsletter', 'Winner, Design Sprint Challenge', 'Mentor at a UX bootcamp'],
  emerging: [
    'Finalist, ETH hackathon',
    'Found and responsibly disclosed a contract bug',
    'Speaker, Web3 Builders Meetup',
  ],
  embedded: [
    'Winner, Regional Robotics Contest',
    'Shipped a firmware update to 3k devices',
    'Published a teardown series',
  ],
}

const CERTS = {
  web: [
    ['Responsive Web Design', 'Open Web Academy'],
    ['Advanced React Patterns', 'Frontend Guild'],
  ],
  backend: [
    ['Backend Engineering Professional', 'Stackwise'],
    ['Cloud Practitioner', 'Skybridge Cloud'],
  ],
  ai: [
    ['Deep Learning Specialization', 'Neural Academy'],
    ['ML Engineering for Production', 'Stackwise'],
  ],
  data: [
    ['Data Analytics Professional', 'Insight Institute'],
    ['Statistics for Data Science', 'Open Web Academy'],
  ],
  infra: [
    ['Cloud Solutions Associate', 'Skybridge Cloud'],
    ['Kubernetes Administrator', 'Cloud Native Guild'],
  ],
  security: [
    ['Security Fundamentals', 'CyberGuild'],
    ['Certified Ethical Hacker Prep', 'CyberGuild'],
  ],
  game: [
    ['Unity Certified Programmer Prep', 'Play Academy'],
    ['Game Design Foundations', 'Play Academy'],
  ],
  creative3d: [
    ['3D Environment Art', 'Render School'],
    ['PBR Texturing Workflow', 'Render School'],
  ],
  design: [
    ['UX Design Professional', 'Design Institute'],
    ['Accessibility for Designers', 'Design Institute'],
  ],
  emerging: [
    ['Smart Contract Security', 'Chain Academy'],
    ['Ethereum Developer', 'Chain Academy'],
  ],
  embedded: [
    ['Embedded Systems Professional', 'Circuit Institute'],
    ['RTOS Fundamentals', 'Circuit Institute'],
  ],
}

const COMPANIES = [
  'Northwind Labs',
  'Brightside Studio',
  'Helio Systems',
  'Quanta Works',
  'Lumen Digital',
  'Fieldstone',
  'Orbit & Co',
  'Kite Analytics',
  'Nimbus Labs',
  'Harbor Systems',
  'Paperplane',
  'Vantage Works',
]
const SCHOOLS = [
  'Lakeshore University',
  'Northfield Institute of Technology',
  'Riverside University',
  'Summit College',
  'Atlas Polytechnic',
  'Meridian University',
]
const DEGREES = {
  creative3d: 'B.A. Digital Media',
  design: 'B.Des. Interaction Design',
  game: 'B.Sc. Game Development',
  default: 'B.Sc. Computer Science',
}

/* -------------------------------- builders -------------------------------- */

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

function levelForValue(v) {
  if (v < 18) return null
  if (v < 40) return 'beginner'
  if (v < 62) return 'intermediate'
  if (v < 84) return 'advanced'
  return 'expert'
}

/** Skills for a role at a given strength. Heavier requirements are more likely to be present. */
export function buildSkillsForRole(role, { tier = 0.6, seed = role.id } = {}) {
  const rnd = seededRandom(`${seed}:skills`)
  const skills = []
  for (const req of role.requirements) {
    // Heavier requirements are more likely to be present; stronger profiles have more of them.
    const presence = clamp(0.2 + tier * 0.85 + (req.share - 0.08) * 3, 0.05, 0.99)
    if (rnd() > presence) continue
    const v = 8 + tier * 88 + (rnd() - 0.5) * 34
    const level = levelForValue(v)
    if (!level) continue
    const skillId = req.skills[Math.floor(rnd() * req.skills.length)]
    const lib = SKILL_BY_ID[skillId]
    skills.push({ id: `sk_${slug(seed)}_${skillId}`, name: lib?.label ?? req.label, level })
  }
  return skills
}

export function buildProjectsForRole(role, { tier = 0.6, seed = role.id, count = 3, now = Date.now() } = {}) {
  const rnd = seededRandom(`${seed}:projects`)
  const templates = PROJECT_TEMPLATES[role.family] ?? PROJECT_TEMPLATES.web
  const start = Math.floor(rnd() * templates.length)
  const year = new Date(now).getFullYear()
  return Array.from({ length: Math.min(count, templates.length) }, (_, i) => {
    const [name, description, tech, complexity, impact] = templates[(start + i) % templates.length]
    const key = slug(`${seed}-${name}`)
    return {
      id: `pr_${key}`,
      name,
      description,
      tech,
      url: tier > 0.35 ? `https://${slug(name)}.example` : '',
      repo: tier > 0.2 ? `https://github.com/${slug(seed)}/${slug(name)}` : '',
      year: year - Math.floor(rnd() * 3),
      complexity: clamp(Math.round(complexity + (tier - 0.6) * 1.5), 1, 5),
      impact: clamp(Math.round(impact + (tier - 0.6)), 1, 5),
    }
  })
}

const monthStr = (now, monthsAgo) => {
  const d = new Date(now)
  d.setMonth(d.getMonth() - monthsAgo)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function buildExperience({ role, years = 3, seed = role.id, now = Date.now(), status = 'professional' }) {
  const rnd = seededRandom(`${seed}:exp`)
  const pick = () => COMPANIES[Math.floor(rnd() * COMPANIES.length)]
  const entries = []
  if (status === 'student') {
    entries.push({
      id: `ex_${slug(seed)}_intern`,
      type: 'internship',
      company: pick(),
      title: `${role.name} Intern`,
      start: monthStr(now, 8),
      end: monthStr(now, 5),
      current: false,
      description: `Supported the team on ${role.core[0]} and ${role.core[1] ?? role.core[0]} work; shipped two small features and wrote documentation.`,
      skills: role.core.slice(0, 2),
    })
    return entries
  }
  const currentMonths = Math.max(6, Math.round(years * 12 * 0.65))
  const priorMonths = Math.max(4, Math.round(years * 12 * 0.35))
  entries.push({
    id: `ex_${slug(seed)}_current`,
    type: 'work',
    company: pick(),
    title: role.name,
    start: monthStr(now, currentMonths),
    end: null,
    current: true,
    description: `Own ${role.core[0]} and ${role.core[1] ?? role.core[0]} work for a product used by 25k people. Reduced delivery time by 30% and mentored two junior teammates.`,
    skills: role.core.slice(0, 3),
  })
  entries.push({
    id: `ex_${slug(seed)}_prior`,
    type: 'work',
    company: pick(),
    title: `Junior ${role.name}`,
    start: monthStr(now, currentMonths + priorMonths),
    end: monthStr(now, currentMonths),
    current: false,
    description: `Delivered features across ${role.core[0]} and ${role.core[2] ?? role.core[0]} for 10+ client projects.`,
    skills: role.core.slice(0, 2),
  })
  if (years >= 3) {
    entries.push({
      id: `ex_${slug(seed)}_intern`,
      type: 'internship',
      company: pick(),
      title: `${role.name} Intern`,
      start: monthStr(now, currentMonths + priorMonths + 4),
      end: monthStr(now, currentMonths + priorMonths),
      current: false,
      description: `Prototyped internal tools and fixed 15 bugs in a summer internship.`,
      skills: role.core.slice(0, 1),
    })
  }
  return entries
}

/**
 * Connected-source data for a generated profile. Which sources exist depends on the role family.
 */
export function buildIntegrations(role, { handle, tier = 0.6, now = Date.now(), links }) {
  const family = getFamily(role.family)
  const opts = { tier, family: role.family, now }
  const out = {}
  for (const id of [
    'github',
    'linkedin',
    'portfolio',
    'behance',
    'dribbble',
    'instagram',
    'leetcode',
    'codeforces',
    'kaggle',
  ]) {
    if (links[id])
      out[id] = SOURCE_GENERATORS[id](links[id], {
        ...opts,
        tier: clamp(tier + (hashString(`${handle}:${id}`) % 10) / 100 - 0.05, 0.05, 1),
      })
  }
  return out
}

/** Links a generated profile "has", based on strength and what matters for the role family. */
export function buildLinks(role, { handle, tier = 0.6, seed = handle }) {
  const family = getFamily(role.family)
  const rnd = seededRandom(`${seed}:links`)
  const links = {}
  const want = family.primaryLinks
  want.forEach((id, i) => {
    if (rnd() < 0.55 + tier * 0.5 - i * 0.08) links[id] = undefined
  })
  const urls = {
    github: `https://github.com/${handle}`,
    linkedin: `https://www.linkedin.com/in/${handle}`,
    portfolio: `https://${handle.replace(/-/g, '')}.dev`,
    behance: `https://www.behance.net/${handle}`,
    dribbble: `https://dribbble.com/${handle}`,
    instagram: `https://www.instagram.com/${handle.replace(/-/g, '.')}`,
    kaggle: `https://www.kaggle.com/${handle}`,
    leetcode: `https://leetcode.com/u/${handle}`,
    codeforces: `https://codeforces.com/profile/${handle}`,
  }
  for (const id of Object.keys(links)) links[id] = urls[id]
  // always include the top two primary sources so every generated profile has something to analyze
  for (const id of want.slice(0, 2)) links[id] = urls[id]
  return links
}

/**
 * Build a complete profile.
 * @param {object} cfg  { id, name, handle, headline, location, region, roleId, tier, years, status, workPreference, bio, now, skillCountBoost }
 */
export function generateProfile(cfg) {
  const role = getRole(cfg.roleId)
  const now = cfg.now ?? Date.now()
  const seed = cfg.handle ?? cfg.id
  const tier = cfg.tier ?? 0.6
  const status = cfg.status ?? 'professional'
  const years = cfg.years ?? (status === 'student' ? 0 : 3)

  const links = cfg.links ?? buildLinks(role, { handle: seed, tier, seed })
  const skills = buildSkillsForRole(role, { tier, seed })
  const projects = buildProjectsForRole(role, { tier, seed, count: tier > 0.7 ? 4 : tier > 0.4 ? 3 : 2, now })
  const experience = buildExperience({ role, years, seed, now, status })
  const family = role.family

  return {
    id: cfg.id ?? `u_${slug(seed)}`,
    name: cfg.name,
    handle: cfg.handle,
    headline: cfg.headline ?? `${role.name} · ${role.core.slice(0, 2).join(' & ')}`,
    location: cfg.location ?? '',
    region: cfg.region ?? 'north-america',
    bio:
      cfg.bio ??
      (tier > 0.5
        ? `${role.name} with a focus on ${role.core.slice(0, 3).join(', ')}. I enjoy turning ideas into well-crafted work and learning in public.`
        : ''),
    targetRoleId: role.id,
    yearsOfExperience: years,
    status,
    workPreference: cfg.workPreference ?? 'hybrid',
    links: { ...links, other: [] },
    resume:
      tier > 0.35
        ? {
            name: `${slug(cfg.name)}-resume.pdf`,
            size: 160_000 + (hashString(seed) % 120_000),
            uploadedAt: new Date(now - 9 * 86_400_000).toISOString(),
          }
        : null,
    skills,
    projects,
    experience,
    education: [
      {
        id: `ed_${slug(seed)}`,
        school: SCHOOLS[hashString(seed) % SCHOOLS.length],
        degree: DEGREES[family] ?? DEGREES.default,
        start: new Date(now).getFullYear() - 4 - Math.round(years),
        end: new Date(now).getFullYear() - Math.round(years),
      },
    ],
    certifications:
      tier > 0.45
        ? (CERTS[family] ?? CERTS.web).slice(0, tier > 0.75 ? 2 : 1).map(([name, issuer], i) => ({
            id: `ce_${slug(seed)}_${i}`,
            name,
            issuer,
            year: new Date(now).getFullYear() - 1 - i,
          }))
        : [],
    achievements: (ACHIEVEMENTS[family] ?? ACHIEVEMENTS.web)
      .slice(0, tier > 0.75 ? 3 : tier > 0.5 ? 2 : tier > 0.3 ? 1 : 0)
      .map((title, i) => ({ id: `ac_${slug(seed)}_${i}`, title, year: new Date(now).getFullYear() - i })),
    integrations: buildIntegrations(role, { handle: seed, tier, now, links }),
  }
}

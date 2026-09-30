// Project analysis: how relevant, deep and showcase-worthy each project is for the selected role.
// Pure module (no React / browser APIs).

import { findSkill } from '../data/roles/skillLibrary.js'
import { evaluateRequirement } from './skills.js'
import { clamp } from '../utils/math.js'
import { joinList } from '../utils/format.js'

// Which "layers" of a stack a project touches (used for technical depth).
const LAYERS = {
  frontend: [
    'html',
    'css',
    'javascript',
    'typescript',
    'react',
    'nextjs',
    'vue',
    'angular',
    'svelte',
    'tailwind',
    'responsive-design',
    'ui-implementation',
    'accessibility',
    'animation',
    'state-management',
    'threejs',
    'react-native',
    'flutter',
    'android',
    'ios',
  ],
  backend: [
    'nodejs',
    'express',
    'nestjs',
    'django',
    'flask',
    'fastapi',
    'spring-boot',
    'dotnet',
    'rest-apis',
    'graphql',
    'authentication',
    'microservices',
    'php',
    'ruby',
    'go',
    'java',
    'message-queues',
    'caching',
  ],
  data: [
    'databases',
    'sql',
    'data-modeling',
    'data-processing',
    'pandas',
    'data-pipelines',
    'spark',
    'airflow',
    'data-visualization',
    'bi-tools',
    'excel',
  ],
  ai: [
    'machine-learning',
    'deep-learning',
    'pytorch',
    'tensorflow',
    'scikit-learn',
    'nlp',
    'computer-vision',
    'llms',
    'opencv',
    'huggingface',
    'model-deployment',
    'prompt-engineering',
    'statistics',
  ],
  infra: [
    'docker',
    'kubernetes',
    'ci-cd',
    'terraform',
    'aws',
    'azure',
    'gcp',
    'linux',
    'deployment',
    'serverless',
    'monitoring',
    'networking',
  ],
  native: [
    'cpp',
    'c',
    'rust',
    'embedded',
    'protocols',
    'electronics',
    'real-time-systems',
    'unity',
    'unreal',
    'shaders',
    'game-programming',
    'math-3d',
    'physics',
    'ros',
    'robotics',
    'solidity',
    'smart-contracts',
    'csharp',
  ],
  creative: [
    'blender',
    'maya',
    '3dsmax',
    'zbrush',
    'substance',
    'houdini',
    'modeling',
    'texturing',
    'lighting',
    'rendering',
    'sculpting',
    'figma',
    'visual-design',
    'prototyping',
    'ux-research',
    'motion-design',
    'after-effects',
    'animation-3d',
    'rigging',
    'wireframing',
    'design-systems',
  ],
}
const LAYER_OF = new Map()
for (const [layer, ids] of Object.entries(LAYERS)) for (const id of ids) if (!LAYER_OF.has(id)) LAYER_OF.set(id, layer)

const COMPLEXITY_LABELS = ['', 'Simple', 'Simple', 'Moderate', 'Advanced', 'Complex']
const IMPACT_LABELS = ['', 'Personal', 'Personal', 'Shared with others', 'Real users', 'Widely used']

const textOf = (project) =>
  `${project.name ?? ''} ${project.description ?? ''} ${(project.tech ?? []).join(' ')}`.toLowerCase()

/** How many role keywords show up in the project text (0..n). */
function keywordHits(project, role) {
  const text = textOf(project)
  return role.keywords.filter((k) => text.includes(k.toLowerCase())).length
}

export function analyzeProject(project, role) {
  const techSkills = (project.tech ?? []).map((tag) => ({
    tag,
    lib: findSkill(tag),
  }))
  const libIds = techSkills.filter((t) => t.lib).map((t) => t.lib.id)
  const uniqueIds = [...new Set(libIds)]

  // Pretend the project's tech is declared at an advanced level, then see which requirements it touches.
  const ctx = {
    declared: new Map(uniqueIds.map((id) => [id, 80])),
    names: new Map(),
    evidence: { project: new Set(), github: new Set(), work: new Set() },
  }
  const touched = role.requirements
    .map((req) => ({ req, result: evaluateRequirement(req, ctx) }))
    .filter(({ result }) => result.credit >= 0.6)
    .sort((a, b) => b.req.weight - a.req.weight)

  const matchedShare = touched.reduce((acc, { req }) => acc + req.share, 0)
  const hits = keywordHits(project, role)
  const relevance = clamp(0.75 * Math.min(1, matchedShare / 0.4) + 0.25 * Math.min(1, hits / 3), 0, 1)

  const complexity = clamp(Math.round(project.complexity ?? 3), 1, 5)
  const impact = clamp(Math.round(project.impact ?? 2), 1, 5)
  const techCount = (project.tech ?? []).length
  const layers = new Set(uniqueIds.map((id) => LAYER_OF.get(id)).filter(Boolean)).size

  const technicalDepth = clamp(
    Math.round(0.5 * complexity + 0.25 * Math.min(5, techCount * 0.9) + 0.25 * Math.min(5, layers * 1.7)),
    1,
    5,
  )

  const descLen = (project.description ?? '').length
  const portfolioValue = clamp(
    Math.round(
      0.25 * impact +
        0.2 * (project.url ? 5 : 2) +
        0.15 * (project.repo ? 5 : 2) +
        0.3 * relevance * 5 +
        0.1 * (descLen >= 140 ? 5 : descLen >= 60 ? 3.5 : 2),
    ),
    1,
    5,
  )

  const quality =
    0.4 * (complexity / 5) + 0.3 * (impact / 5) + 0.15 * (project.url ? 1 : 0.4) + 0.15 * (project.repo ? 1 : 0.4)
  const score = quality * (0.35 + 0.65 * relevance)

  const relevanceLabel = relevance >= 0.7 ? 'High' : relevance >= 0.4 ? 'Medium' : 'Low'
  const topLabels = touched.slice(0, 3).map(({ req }) => req.label)

  let contribution
  if (topLabels.length >= 2) {
    contribution = `Demonstrates ${joinList(topLabels)} - core requirements for ${role.name} roles.`
  } else if (topLabels.length === 1) {
    contribution = `Shows hands-on ${topLabels[0]}, one of the core skills for ${role.name} roles.`
  } else {
    contribution = `Shows general engineering ability, but uses little of the stack ${role.name} roles ask for.`
  }

  const suggestions = []
  if (!project.url) suggestions.push('Add a live demo link so reviewers can try it.')
  if (!project.repo) suggestions.push('Link the source code to show how it is built.')
  if (descLen < 80) suggestions.push('Expand the description with the problem, your role and the result.')
  if (relevance < 0.4)
    suggestions.push(`Highlight any ${role.core[0]} or ${role.core[1] ?? role.core[0]} work in this project.`)

  return {
    id: project.id,
    name: project.name,
    description: project.description ?? '',
    tech: project.tech ?? [],
    url: project.url ?? '',
    repo: project.repo ?? '',
    year: project.year,
    complexity,
    complexityLabel: COMPLEXITY_LABELS[complexity],
    impact,
    impactLabel: IMPACT_LABELS[impact],
    technicalDepth,
    portfolioValue,
    relevance,
    relevanceLabel,
    matchedSkills: touched.map(({ req }) => req.label),
    contribution,
    suggestions,
    score,
    layers,
  }
}

// A project scoring ~0.88 (4/5 complexity and impact, live demo + source, well matched to the role)
// is treated as "excellent" - scores are normalized against that reference.
const EXCELLENT_PROJECT = 0.88

/** Analyze all projects; `score` (0-100) weights the best three most heavily. */
export function analyzeProjects(profile, role) {
  const items = (profile.projects ?? []).map((p) => analyzeProject(p, role))
  const ranked = [...items].sort((a, b) => b.score - a.score)
  const weights = [0.45, 0.33, 0.22]
  const top = ranked.slice(0, 3).reduce((acc, p, i) => acc + p.score * weights[i], 0)
  const normalized = Math.min(1, top / EXCELLENT_PROJECT)
  const countFactor = Math.min(items.length, 4) / 4
  const score = items.length ? Math.round(100 * (0.85 * normalized + 0.15 * countFactor)) : 0
  // Keep the user's original order in the list, but expose the ranking separately.
  return { items, ranked: ranked.map((p) => p.id), score }
}

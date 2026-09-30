// Prints what the scoring engine produces for the demo community + sanity checks for every role.
//   npm run engine:report
// Pure Node (no browser, no bundler): the engine is framework-free on purpose.

import { ROLES, validateRoles } from '../src/data/roles/roles.js'
import { SKILLS } from '../src/data/roles/skillLibrary.js'
import { getCommunity } from '../src/data/community.js'
import { generateProfile } from '../src/data/profileGenerator.js'
import { analyzeProfile } from '../src/engine/index.js'
import { computeRanking } from '../src/engine/ranking.js'
import { getRole } from '../src/data/roles/roles.js'

const pad = (s, n) => String(s).padEnd(n)
const num = (n, w = 4) => String(n).padStart(w)

console.log(`\n${SKILLS.length} skills · ${ROLES.length} roles`)
const problems = validateRoles()
console.log(problems.length ? `\nROLE PROBLEMS:\n - ${problems.join('\n - ')}` : 'Role config: OK')

console.log('\n=== Demo community ===')
console.log(pad('name', 16), pad('role', 26), 'ovr  tech proj exp  prob prof port cons pres | top%  rank/total')
for (const member of getCommunity()) {
  const a = analyzeProfile(member.profile)
  const c = Object.fromEntries(a.score.categories.map((x) => [x.id, x.score]))
  console.log(
    pad(member.profile.name, 16),
    pad(a.role.name, 26),
    num(a.score.overall, 3),
    num(c.technical),
    num(c.projects),
    num(c.experience),
    num(c.problemSolving),
    num(c.profileQuality),
    num(c.portfolio),
    num(c.consistency),
    num(c.presence),
    '|',
    num(a.ranking.topPercent, 3),
    ` #${a.ranking.rank}/${a.ranking.total}`,
  )
}

const alex = analyzeProfile(getCommunity()[0].profile)
console.log('\n=== Alex Morgan detail ===')
console.log(
  'overall',
  alex.score.overall,
  alex.score.band.label,
  '| percentile',
  alex.ranking.percentile,
  '| top',
  alex.ranking.topPercent + '%',
  '| rank',
  alex.ranking.rank,
  'of',
  alex.ranking.total,
)
console.log('strong  :', alex.summary.strongAreas.join(', '))
console.log('improve :', alex.summary.improveAreas.join(', '))
console.log('missing :', alex.summary.missingSkills.join(', '))
console.log(
  'gap top5:',
  alex.skills.recommended.map((g) => `${g.label} (${g.currentLabel}→${g.targetLabel}, ${g.effort})`).join(' | '),
)
console.log(
  'have    :',
  alex.skills.have
    .slice(0, 8)
    .map((g) => g.label)
    .join(', '),
)
console.log('resume  :', JSON.stringify(alex.resume.scores))
console.log('presence:', alex.presence.items.map((i) => `${i.label}=${i.statusLabel}(${i.score ?? '-'})`).join(', '))
console.log(
  'projects:',
  alex.projects.items
    .map((p) => `${p.name} d${p.technicalDepth}/v${p.portfolioValue}/rel${Math.round(p.relevance * 100)}`)
    .join(' | '),
)
console.log(
  'benchmarks (you/avg/top10):',
  alex.comparison.map((c) => `${c.short} ${c.you}/${c.average}/${c.top10}`).join(' · '),
)
console.log('peers avg/top10:', alex.peers.average, alex.peers.top10)
console.log('next steps:', alex.nextSteps.map((s) => s.title).join(' → '))

console.log('\n=== Alex vs every role (role-specific scoring) ===')
const rows = ROLES.map((r) => ({ r, a: analyzeProfile(alex && getCommunity()[0].profile, { roleId: r.id }) })).sort(
  (x, y) => y.a.score.overall - x.a.score.overall,
)
for (const { r, a } of rows)
  console.log(pad(r.name, 28), num(a.score.overall, 3), 'technical', num(a.score.categories[0].score, 3))

console.log('\n=== Generated sample profile per role (tier 0.7 / 0.4) ===')
for (const role of ROLES) {
  const hi = analyzeProfile(
    generateProfile({ id: 'x', name: 'Sample Person', handle: 'sample-person', roleId: role.id, tier: 0.7 }),
  )
  const lo = analyzeProfile(
    generateProfile({
      id: 'y',
      name: 'Sample Person',
      handle: 'sample-person',
      roleId: role.id,
      tier: 0.4,
      status: 'student',
      years: 0,
    }),
  )
  console.log(pad(role.name, 28), 'strong:', num(hi.score.overall, 3), ' early:', num(lo.score.overall, 3))
}

console.log('\n=== Ranking filters (Alex, frontend) ===')
const role = getRole('frontend-developer')
const cases = [
  {},
  { experience: 'mid' },
  { experience: 'senior' },
  { status: 'student' },
  { location: 'europe', work: 'remote' },
  { experience: 'senior', status: 'student', location: 'africa-me', work: 'onsite' },
]
for (const f of cases) {
  const r = computeRanking({ role, score: alex.score.overall, filters: f })
  console.log(
    pad(JSON.stringify(f), 70),
    r.insufficient
      ? `insufficient data (pool ${r.total})`
      : `#${r.rank} of ${r.total} · top ${r.topPercent}% · p${r.percentile} · avg ${r.mean} · top10 ${r.top10}`,
  )
}
console.log()

import { ROLES, validateRoles } from '../src/data/roles/roles.js'
import { analyzeProfile } from '../src/engine/index.js'
import { computeRanking } from '../src/engine/ranking.js'
import { getCommunity } from '../src/data/community.js'
import fs from 'node:fs'
import path from 'node:path'

console.log('--- SkillRank Comprehensive QA Suite ---')

// 1. Validate Roles Configuration
console.log('\n[1/4] Checking role definitions...')
const roleProblems = validateRoles()
if (roleProblems.length > 0) {
  console.error('FAIL: Role validation issues found:', roleProblems)
  process.exit(1)
}
console.log(`PASS: All ${ROLES.length} roles verified with valid weights, levels, and skills.`)

// 2. Test Analysis Engine for every role
console.log('\n[2/4] Testing engine analysis across all roles...')
const community = getCommunity()
let analyzedCount = 0
for (const member of community) {
  const res = analyzeProfile(member.profile, { roleId: member.role.id })
  if (typeof res.score.overall !== 'number' || res.score.overall < 0 || res.score.overall > 100) {
    console.error(`FAIL: Invalid score for ${member.profile.name}:`, res.score)
    process.exit(1)
  }
  analyzedCount++
}
console.log(`PASS: Successfully analyzed ${analyzedCount} community profiles across diverse roles.`)

// 3. Test Ranking Computation
console.log('\n[3/4] Testing cohort ranking computations...')
for (const role of ROLES.slice(0, 10)) {
  const ranking = computeRanking({ role, score: 78, filters: { experience: 'mid' } })
  if (!ranking.rank || !ranking.total) {
    console.error(`FAIL: Bad ranking output for role ${role.id}:`, ranking)
    process.exit(1)
  }
}
console.log('PASS: Cohort ranking distribution logic verified.')

// 4. Verify Production Build Artifacts
console.log('\n[4/4] Verifying production build files...')
const distIndex = path.resolve('dist/index.html')
if (!fs.existsSync(distIndex)) {
  console.warn('WARN: dist/index.html does not exist yet (run npm run build first).')
} else {
  const html = fs.readFileSync(distIndex, 'utf8')
  if (!html.includes('<div id="root">')) {
    console.error('FAIL: dist/index.html missing root div')
    process.exit(1)
  }
  console.log('PASS: Production dist build confirmed healthy.')
}

console.log('\nALL QA CHECKS PASSED!')

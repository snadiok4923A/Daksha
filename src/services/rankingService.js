// Peer ranking (mock). Computes where a profile sits among profiles evaluated for a role.
// A real backend would run this against the actual profile pool and return the same shape.

import { analyzeProfile } from '../engine/index.js'
import { computeRanking } from '../engine/ranking.js'
import { getCategoryBenchmarks } from '../engine/ranking.js'
import { getRole } from '../data/roles/roles.js'
import { DEFAULT_RANKING_FILTERS } from '../data/ranking.js'
import { simulateLatency } from './client.js'

/**
 * @param {{ profile: object, roleId?: string, filters?: object, signal?: AbortSignal }} input
 * @returns {Promise<{ roleId: string, role: object, score: number, categories: Array, ranking: object, comparison: Array }>}
 */
export async function fetchRanking({ profile, roleId, filters = DEFAULT_RANKING_FILTERS, signal }) {
  await simulateLatency(380, 720, signal)
  const role = getRole(roleId ?? profile.targetRoleId)
  // Score the same profile against the requested role's requirements - role-specific by design.
  const analysis = analyzeProfile(profile, { roleId: role.id })
  const ranking = computeRanking({ role, score: analysis.score.overall, filters })
  const benchmarks = getCategoryBenchmarks(role)

  return {
    roleId: role.id,
    role,
    score: analysis.score.overall,
    categories: analysis.score.categories,
    ranking,
    comparison: analysis.score.categories.map((c) => ({
      id: c.id,
      label: c.label,
      short: c.short,
      you: c.score,
      average: benchmarks[c.id].average,
      top10: benchmarks[c.id].top10,
    })),
  }
}

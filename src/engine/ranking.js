// Peer ranking model.
//
// Each role has a pool of evaluated profiles whose scores follow a (mocked) normal distribution.
// Filters select cohorts inside that pool (smaller share + shifted average). Your percentile is
// where your score falls in the cohort's distribution. Swap this module for an API call later -
// the output shape is the contract (see docs/ARCHITECTURE.md).
//
// Pure module (no React / browser APIs).

import { DEFAULT_RANKING_FILTERS, MIN_RANKING_POOL, RANKING_FILTER_DEFS } from '../data/ranking.js'
import { SCORE_CATEGORIES } from '../data/scoring.js'
import { clamp, normalCdf, round, seededRandom, zForTopShare } from '../utils/math.js'

const Z_TOP_10 = zForTopShare(0.1)

// Typical peer averages per category relative to the role average (people are better at listing
// skills than at staying consistent, etc.).
const CATEGORY_BASELINE = {
  technical: 2,
  projects: 0,
  experience: -2,
  problemSolving: -3,
  profileQuality: 4,
  portfolio: -2,
  consistency: -4,
  presence: 1,
}

/** Distribution of overall scores for a role. */
export function getRoleDistribution(role) {
  const rnd = seededRandom(`${role.id}:dist`)
  const mean = role.platform.avg
  const sd = role.platform.sd ?? round(14 + rnd() * 3, 1)
  return { mean, sd, total: role.platform.profiles, top10: Math.min(99, round(mean + Z_TOP_10 * sd, 0)) }
}

/** Average + top-10% benchmark for every category. */
export function getCategoryBenchmarks(role) {
  const base = getRoleDistribution(role)
  const out = {}
  for (const cat of SCORE_CATEGORIES) {
    const rnd = seededRandom(`${role.id}:${cat.id}`)
    // Roles weighting a category heavily tend to have peers who are a bit stronger there.
    const emphasis = (role.weights[cat.id] - 0.125) * 18
    const mean = clamp(round(base.mean + CATEGORY_BASELINE[cat.id] + emphasis + (rnd() - 0.5) * 6, 0), 35, 88)
    const sd = 11 + rnd() * 5
    out[cat.id] = { average: mean, top10: clamp(round(mean + Z_TOP_10 * sd, 0), mean + 8, 98) }
  }
  return out
}

/** Resolve filters -> cohort size, mean and sd. */
export function getCohort(role, filters = DEFAULT_RANKING_FILTERS) {
  const base = getRoleDistribution(role)
  let share = 1
  let shift = 0
  let active = 0
  const labels = []
  for (const def of RANKING_FILTER_DEFS) {
    const option = def.options.find((o) => o.id === (filters[def.id] ?? 'all'))
    if (option && option.id !== 'all') {
      share *= option.share
      shift += option.shift
      active += 1
      labels.push(option.label)
    }
  }
  return {
    total: Math.round(base.total * share),
    mean: base.mean + shift * 0.85,
    sd: base.sd * (1 - 0.05 * active),
    activeFilters: active,
    labels,
    roleTotal: base.total,
  }
}

/**
 * Rank a score inside a role pool (optionally filtered).
 *
 * @returns {{
 *   insufficient: boolean, total: number, rank: number|null, percentile: number|null, topPercent: number|null,
 *   mean: number, sd: number, top10: number, activeFilters: number, labels: string[], distribution: Array<{from:number,to:number,count:number,isYou:boolean}>
 * }}
 */
export function computeRanking({ role, score, filters = DEFAULT_RANKING_FILTERS }) {
  const cohort = getCohort(role, filters)
  const top10 = Math.min(99, round(cohort.mean + Z_TOP_10 * cohort.sd, 0))
  const distribution = buildDistribution(cohort, score)

  if (cohort.total < MIN_RANKING_POOL) {
    return {
      insufficient: true,
      total: cohort.total,
      rank: null,
      percentile: null,
      topPercent: null,
      mean: round(cohort.mean, 0),
      sd: cohort.sd,
      top10,
      activeFilters: cohort.activeFilters,
      labels: cohort.labels,
      distribution,
    }
  }

  const z = (score - cohort.mean) / cohort.sd
  const percentile = clamp(Math.round(normalCdf(z) * 100), 1, 99)
  const topPercent = clamp(100 - percentile, 1, 99)
  const rank = clamp(Math.round((topPercent / 100) * cohort.total), 1, cohort.total)

  return {
    insufficient: false,
    total: cohort.total,
    rank,
    percentile,
    topPercent,
    mean: round(cohort.mean, 0),
    sd: cohort.sd,
    top10,
    activeFilters: cohort.activeFilters,
    labels: cohort.labels,
    distribution,
  }
}

function buildDistribution(cohort, score) {
  const step = 5
  const bins = []
  for (let from = 0; from < 100; from += step) {
    const to = from + step
    const lo = from === 0 ? -Infinity : from
    const hi = to === 100 ? Infinity : to
    const p = normalCdf((hi - cohort.mean) / cohort.sd) - normalCdf((lo - cohort.mean) / cohort.sd)
    bins.push({
      from,
      to,
      count: Math.round(p * cohort.total),
      isYou: score >= from && (score < to || (to === 100 && score <= 100)),
    })
  }
  return bins
}

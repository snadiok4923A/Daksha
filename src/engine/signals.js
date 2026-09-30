// Turns data from connected sources (GitHub, LinkedIn, portfolio, creative + coding profiles)
// into normalized signals. All integration shapes are defined in docs/ARCHITECTURE.md and produced
// by src/services/*. Pure module (no React / browser APIs).

import { clamp, mean } from '../utils/math.js'

const pct = (v) => clamp(Math.round(v), 0, 100)

/* --------------------------------- GitHub --------------------------------- */

/** Overall GitHub strength (0-100): breadth, activity, project quality, community, profile polish. */
export function githubScore(gh) {
  if (!gh) return null
  const repos = Math.min(1, (gh.repos ?? 0) / 30)
  const activity = Math.min(1, (gh.contributions ?? 0) / 1200)
  const quality = (gh.quality?.score ?? 0) / 100
  const community = Math.min(1, ((gh.stars ?? 0) + (gh.followers ?? 0) * 2) / 400)
  const polish = gh.profilePolish ?? 0.5
  return pct(100 * (0.25 * repos + 0.3 * activity + 0.2 * quality + 0.15 * community + 0.1 * polish))
}

/** Consistency (0-100): how steady activity is across the year, not how much of it there is. */
export function githubConsistency(gh) {
  if (!gh) return null
  const weeks = Math.min(1, (gh.consistency?.activeWeeks ?? 0) / 52)
  const streak = Math.min(1, (gh.consistency?.longestStreak ?? 0) / 30)
  const monthly = (gh.monthly ?? []).map((m) => m.count)
  let recency = 0.5
  if (monthly.length >= 6) {
    const recent = mean(monthly.slice(-3))
    const overall = mean(monthly) || 1
    recency = clamp(recent / overall, 0, 1.2) / 1.2
  }
  return pct(100 * (0.6 * weeks + 0.25 * streak + 0.15 * recency))
}

/** Quality of the public profile itself (bio, pinned repos, READMEs) used for presence. */
export function githubPolish(gh) {
  if (!gh) return null
  return pct(
    100 *
      (0.45 * (gh.profilePolish ?? 0.5) +
        0.35 * (gh.quality?.readmeCoverage ?? 0.4) +
        0.2 * Math.min(1, (gh.followers ?? 0) / 100)),
  )
}

/* --------------------------------- LinkedIn -------------------------------- */

export function linkedinStrength(li) {
  if (!li) return null
  const endorse = Math.min(100, (li.endorsements ?? 0) * 1.5)
  const recs = Math.min(100, (li.recommendations ?? 0) * 25)
  return pct(0.7 * (li.completeness ?? 50) + 0.15 * endorse + 0.15 * recs)
}

/* --------------------------------- Portfolio ------------------------------- */

export function portfolioSiteScore(po) {
  if (!po) return null
  const base =
    0.35 * (po.design ?? 0) + 0.2 * (po.performance ?? 0) + 0.25 * (po.content ?? 0) + 0.2 * (po.responsive ?? 0)
  return pct(base + (po.hasCaseStudies ? 4 : 0))
}

/* -------------------------- Creative platforms (Behance etc.) -------------------------- */

const CREATIVE_IDS = ['behance', 'dribbble', 'instagram']

export function creativePlatformScore(data) {
  if (!data) return null
  const items = Math.min(1, (data.items ?? 0) / 20)
  const audience = Math.min(1, (data.followers ?? 0) / 2500)
  const appreciation = Math.min(1, (data.appreciations ?? 0) / 4000)
  const recency = Math.min(1, (data.postsLast90d ?? 0) / 10)
  return pct(100 * (0.3 * items + 0.25 * audience + 0.2 * appreciation + 0.25 * recency))
}

/** Best creative platform drives the score; the others add a little. */
export function creativeSummary(integrations = {}) {
  const connected = CREATIVE_IDS.filter((id) => integrations[id]).map((id) => ({
    id,
    score: creativePlatformScore(integrations[id]),
    data: integrations[id],
  }))
  if (!connected.length) return null
  const best = Math.max(...connected.map((c) => c.score))
  const avg = mean(connected.map((c) => c.score))
  const score = pct(0.75 * best + 0.25 * avg)
  const posts90 = connected.reduce((acc, c) => acc + (c.data.postsLast90d ?? 0), 0)
  return { score, connected, posts90, consistency: pct(100 * Math.min(1, posts90 / 14)) }
}

/* ------------------------------ Coding profiles ------------------------------ */

const KAGGLE_TIERS = { novice: 0.15, contributor: 0.3, expert: 0.55, master: 0.8, grandmaster: 1 }

/** 0..1 - any one strong signal is enough ("noisy-or"), so people aren't punished for not using every site. */
export function codingSignal(integrations = {}) {
  const parts = []
  const lc = integrations.leetcode
  if (lc)
    parts.push(
      0.6 * Math.min(1, (lc.solved ?? 0) / 400) + 0.4 * Math.min(1, Math.max(0, (lc.rating ?? 0) - 1000) / 900),
    )
  const cf = integrations.codeforces
  if (cf) parts.push(Math.min(1, Math.max(0, (cf.rating ?? 0) - 800) / 800))
  const kg = integrations.kaggle
  if (kg) {
    const tier = KAGGLE_TIERS[String(kg.tier ?? '').toLowerCase()] ?? 0.2
    const medals = (kg.medals?.gold ?? 0) * 0.15 + (kg.medals?.silver ?? 0) * 0.08 + (kg.medals?.bronze ?? 0) * 0.04
    parts.push(Math.min(1, tier + medals))
  }
  if (!parts.length) return 0
  return 1 - parts.reduce((acc, p) => acc * (1 - clamp(p, 0, 1)), 1)
}

export function codingSummary(integrations = {}) {
  const lines = []
  const lc = integrations.leetcode
  if (lc) lines.push(`LeetCode: ${lc.solved} solved${lc.rating ? `, rating ${lc.rating}` : ''}`)
  const cf = integrations.codeforces
  if (cf) lines.push(`Codeforces: ${cf.rating} (${cf.rank ?? 'rated'})`)
  const kg = integrations.kaggle
  if (kg)
    lines.push(
      `Kaggle: ${kg.tier}${kg.medals ? `, ${kg.medals.gold + kg.medals.silver + kg.medals.bronze} medals` : ''}`,
    )
  return lines
}

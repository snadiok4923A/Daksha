// Peer-ranking filter cohorts. `share` is the fraction of a role's profiles in that cohort,
// `shift` moves the cohort's average score (points) relative to the whole role pool.
// Pure module (no React / browser APIs).

export const RANKING_FILTER_DEFS = [
  {
    id: 'experience',
    label: 'Experience',
    options: [
      { id: 'all', label: 'All experience levels' },
      { id: 'entry', label: 'Entry (0–1 yrs)', share: 0.22, shift: -8 },
      { id: 'junior', label: 'Junior (1–3 yrs)', share: 0.31, shift: -2 },
      { id: 'mid', label: 'Mid-level (3–6 yrs)', share: 0.29, shift: 4 },
      { id: 'senior', label: 'Senior (6+ yrs)', share: 0.18, shift: 9 },
    ],
  },
  {
    id: 'skill',
    label: 'Skill level',
    options: [
      { id: 'all', label: 'All skill levels' },
      { id: 'beginner', label: 'Beginner', share: 0.26, shift: -10 },
      { id: 'intermediate', label: 'Intermediate', share: 0.46, shift: 0 },
      { id: 'advanced', label: 'Advanced', share: 0.28, shift: 10 },
    ],
  },
  {
    id: 'location',
    label: 'Location',
    options: [
      { id: 'all', label: 'Worldwide' },
      { id: 'north-america', label: 'North America', share: 0.27, shift: 1 },
      { id: 'europe', label: 'Europe', share: 0.26, shift: 1 },
      { id: 'south-asia', label: 'South Asia', share: 0.22, shift: -2 },
      { id: 'east-asia', label: 'East Asia & Pacific', share: 0.12, shift: 2 },
      { id: 'latin-america', label: 'Latin America', share: 0.07, shift: -2 },
      { id: 'africa-me', label: 'Africa & Middle East', share: 0.06, shift: -3 },
    ],
  },
  {
    id: 'status',
    label: 'Student / Professional',
    options: [
      { id: 'all', label: 'Students & professionals' },
      { id: 'student', label: 'Students', share: 0.38, shift: -6 },
      { id: 'professional', label: 'Professionals', share: 0.62, shift: 4 },
    ],
  },
  {
    id: 'work',
    label: 'Work preference',
    options: [
      { id: 'all', label: 'Remote, hybrid & on-site' },
      { id: 'remote', label: 'Remote', share: 0.41, shift: 1 },
      { id: 'hybrid', label: 'Hybrid', share: 0.33, shift: 0 },
      { id: 'onsite', label: 'On-site', share: 0.26, shift: -1 },
    ],
  },
]

export const DEFAULT_RANKING_FILTERS = Object.fromEntries(RANKING_FILTER_DEFS.map((f) => [f.id, 'all']))

/** Minimum cohort size before we show a rank - smaller pools aren't meaningful. */
export const MIN_RANKING_POOL = 40

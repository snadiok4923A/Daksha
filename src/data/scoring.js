// Scoring metadata shared by the engine and the UI (categories, levels, bands, statuses).
// Pure module (no React / browser APIs).

/** The 8 categories every role is scored on. Role families change the WEIGHTS and the signals used. */
export const SCORE_CATEGORIES = [
  {
    id: 'technical',
    label: 'Technical Skills',
    short: 'Technical',
    summary: 'How closely your skills match what this role asks for, weighted by importance.',
    signals: [
      'Skills you listed, matched to the role’s requirements',
      'Skills demonstrated in projects and GitHub count slightly more',
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    short: 'Projects',
    summary: 'Relevance, depth and polish of the work you have built for this role.',
    signals: [
      'Technology overlap with the role',
      'Complexity, impact and technical depth',
      'Live demo and source availability',
    ],
  },
  {
    id: 'experience',
    label: 'Experience',
    short: 'Experience',
    summary: 'Years of relevant hands-on work, including internships and achievements.',
    signals: [
      'Years of experience versus what the role typically expects',
      'Relevance of job titles and descriptions',
      'Internships, certifications and achievements',
    ],
  },
  {
    id: 'problemSolving',
    label: 'Problem Solving',
    short: 'Problem solving',
    summary: 'Evidence that you can break down and solve hard problems.',
    signals: [
      'Algorithm practice and contests (LeetCode, Codeforces, Kaggle)',
      'Technical depth of your projects',
      'Competitions, hackathons and awards',
    ],
  },
  {
    id: 'profileQuality',
    label: 'Profile Quality',
    short: 'Profile quality',
    summary: 'How complete, clear and up to date the information on your profile is.',
    signals: [
      'Headline, summary and location',
      'Resume, links and skills provided',
      'Education, certifications and achievements',
    ],
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    short: 'Portfolio',
    summary: 'How well your work is presented and showcased to others.',
    signals: [
      'Portfolio site quality (design, content, performance)',
      'Project case-study completeness',
      'Creative platforms (for design and 3D roles)',
    ],
  },
  {
    id: 'consistency',
    label: 'Consistency',
    short: 'Consistency',
    summary: 'Steady activity over time rather than occasional bursts.',
    signals: [
      'Contribution and posting cadence over the last year',
      'Longest active streak',
      'How recent your projects and activity are',
    ],
  },
  {
    id: 'presence',
    label: 'Professional Presence',
    short: 'Presence',
    summary: 'How professional and credible you look across the platforms recruiters check.',
    signals: [
      'LinkedIn, GitHub and portfolio strength',
      'Resume quality',
      'Creative profiles (for design and 3D roles)',
    ],
  },
]

export const CATEGORY_BY_ID = Object.fromEntries(SCORE_CATEGORIES.map((c) => [c.id, c]))
export const CATEGORY_IDS = SCORE_CATEGORIES.map((c) => c.id)

/* ------------------------------- skill levels ------------------------------ */

export const LEVELS = [
  { id: 'none', label: 'Not started', value: 0 },
  { id: 'beginner', label: 'Beginner', value: 30 },
  { id: 'intermediate', label: 'Intermediate', value: 55 },
  { id: 'advanced', label: 'Advanced', value: 80 },
  { id: 'expert', label: 'Expert', value: 95 },
]

export const LEVEL_BY_ID = Object.fromEntries(LEVELS.map((l) => [l.id, l]))
/** Levels a user can pick when adding a skill. */
export const SELECTABLE_LEVELS = LEVELS.filter((l) => l.id !== 'none')

export const levelValue = (id) => LEVEL_BY_ID[id]?.value ?? 0
export const levelLabel = (id) => LEVEL_BY_ID[id]?.label ?? 'Not started'

/** Nearest level id for a 0-100 value. */
export function levelFromValue(value) {
  let best = LEVELS[0]
  for (const level of LEVELS) if (value >= level.value - 12) best = level
  return best.id
}

/* --------------------------------- bands --------------------------------- */

export const SCORE_BANDS = [
  {
    min: 90,
    id: 'exceptional',
    label: 'Exceptional',
    tone: 'primary',
    blurb: 'Well ahead of what most profiles show for this role.',
  },
  { min: 75, id: 'strong', label: 'Strong', tone: 'success', blurb: 'A strong, well-rounded profile for this role.' },
  { min: 60, id: 'solid', label: 'Solid', tone: 'primary', blurb: 'A solid base with clear room to grow.' },
  {
    min: 40,
    id: 'developing',
    label: 'Developing',
    tone: 'warning',
    blurb: 'Foundations are forming - a few focused wins will move the needle.',
  },
  {
    min: 0,
    id: 'early',
    label: 'Getting started',
    tone: 'neutral',
    blurb: 'Add more detail to get a more meaningful assessment.',
  },
]

export const getBand = (score) => SCORE_BANDS.find((b) => score >= b.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1]

/* ------------------------------ importance + status ------------------------------ */

export const IMPORTANCE = {
  high: { id: 'high', label: 'High', tone: 'primary' },
  medium: { id: 'medium', label: 'Medium', tone: 'neutral' },
  low: { id: 'low', label: 'Nice to have', tone: 'neutral' },
}

/** Subtle, non-judgmental states for professional presence. */
export const PRESENCE_STATUS = {
  excellent: { id: 'excellent', label: 'Excellent', tone: 'primary', level: 4 },
  strong: { id: 'strong', label: 'Strong', tone: 'success', level: 3 },
  good: { id: 'good', label: 'Good', tone: 'neutral', level: 2 },
  'needs-work': { id: 'needs-work', label: 'Needs improvement', tone: 'warning', level: 1 },
  'not-connected': { id: 'not-connected', label: 'Not connected', tone: 'outline', level: 0 },
}

export const presenceStatusFor = (score) =>
  score >= 90 ? 'excellent' : score >= 75 ? 'strong' : score >= 55 ? 'good' : 'needs-work'

export const SKILL_STATUS = {
  strong: { id: 'strong', label: 'Strong', tone: 'success' },
  improve: { id: 'improve', label: 'Needs improvement', tone: 'warning' },
  missing: { id: 'missing', label: 'Missing', tone: 'neutral' },
}

/** Years of experience -> experience bucket used by ranking filters + sample data. */
export const experienceBucket = (years = 0) =>
  years < 1 ? 'entry' : years < 3 ? 'junior' : years < 6 ? 'mid' : 'senior'

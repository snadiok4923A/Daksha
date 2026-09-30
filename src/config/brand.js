// Single source of truth for product naming + trust copy.
// Rename the product here (and in index.html <title>/meta) - nothing else hardcodes it.

export const BRAND = {
  name: 'SkillRank',
  tagline: 'Know where you stand. Know what to improve.',
  description: 'Analyze your skills, projects, experience and professional presence for the career you want.',
  domain: 'skillrank.app',
  // Used for shareable profile links (falls back to the current origin).
  publicBaseUrl: typeof window !== 'undefined' ? window.location.origin : 'https://skillrank.app',
  supportEmail: 'hello@skillrank.app',
}

/** Trust & transparency copy - keep these consistent everywhere they appear. */
export const TRUST = {
  scoreDisclaimer:
    'This score is an estimated platform assessment based on the information you provide. It is not a hiring decision or a guarantee of any outcome.',
  scoreDisclaimerShort: 'Estimated platform assessment - not a hiring decision.',
  rankingDisclaimer:
    'Rankings are a platform metric based on the profiles evaluated on SkillRank. They do not represent the wider job market.',
  rankingDisclaimerShort: 'Based on profiles evaluated on this platform.',
  demoDisclaimer: 'All people, scores and rankings shown here are fictional demo data for this prototype.',
  rankPhrase: (topPercent) =>
    `Your profile currently ranks in the top ${topPercent}% among profiles evaluated on this platform.`,
}

export const publicProfileUrl = (handle) => `${BRAND.publicBaseUrl}/u/${handle}`

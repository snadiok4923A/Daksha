// Role families decide HOW a role is scored (category weights, which external signals matter).
// Roles (roles.js) decide WHAT is required (skills + targets). Adding a new role usually means
// picking an existing family and listing skill requirements - no engine changes needed.
//
// Pure module (no React / browser APIs).

/**
 * weights  - must sum to 1. Keys are SCORE_CATEGORIES ids.
 * signals  - 0..1 relevance of external sources for this family:
 *            github (code activity), coding (LeetCode/Codeforces/Kaggle), portfolio (personal site),
 *            creative (Behance/Dribbble/Instagram)
 * expectedYears - hands-on years after which "experience" stops being a limiting factor.
 * primaryLinks  - sources shown first in onboarding.
 * notes    - family-specific copy that replaces the default category description.
 */
export const FAMILIES = {
  web: {
    label: 'Web & product engineering',
    weights: {
      technical: 0.28,
      projects: 0.16,
      experience: 0.12,
      problemSolving: 0.08,
      profileQuality: 0.07,
      portfolio: 0.13,
      consistency: 0.06,
      presence: 0.1,
    },
    signals: { github: 1, coding: 0.5, portfolio: 1, creative: 0.2 },
    expectedYears: 4.5,
    primaryLinks: ['github', 'linkedin', 'portfolio', 'leetcode'],
    notes: {},
  },
  backend: {
    label: 'Backend & software engineering',
    weights: {
      technical: 0.31,
      projects: 0.15,
      experience: 0.15,
      problemSolving: 0.11,
      profileQuality: 0.06,
      portfolio: 0.05,
      consistency: 0.08,
      presence: 0.09,
    },
    signals: { github: 1, coding: 0.9, portfolio: 0.35, creative: 0 },
    expectedYears: 5,
    primaryLinks: ['github', 'linkedin', 'leetcode', 'portfolio'],
    notes: {
      portfolio: 'Project write-ups, READMEs and any personal site - depth matters more than polish for this role.',
    },
  },
  ai: {
    label: 'AI & machine learning',
    weights: {
      technical: 0.3,
      projects: 0.18,
      experience: 0.1,
      problemSolving: 0.12,
      profileQuality: 0.06,
      portfolio: 0.06,
      consistency: 0.08,
      presence: 0.1,
    },
    signals: { github: 1, coding: 0.8, portfolio: 0.5, creative: 0.05 },
    expectedYears: 4,
    primaryLinks: ['github', 'kaggle', 'linkedin', 'portfolio'],
    notes: {
      problemSolving:
        'Kaggle results, research-style experiments, competitions and the technical depth of your AI projects.',
    },
  },
  data: {
    label: 'Data & analytics',
    weights: {
      technical: 0.3,
      projects: 0.15,
      experience: 0.14,
      problemSolving: 0.11,
      profileQuality: 0.07,
      portfolio: 0.08,
      consistency: 0.05,
      presence: 0.1,
    },
    signals: { github: 0.6, coding: 0.7, portfolio: 0.6, creative: 0 },
    expectedYears: 4,
    primaryLinks: ['kaggle', 'linkedin', 'github', 'portfolio'],
    notes: {
      problemSolving:
        'Analytical challenges: Kaggle work, case-style projects, competitions and the depth of your analyses.',
    },
  },
  infra: {
    label: 'Cloud, DevOps & reliability',
    weights: {
      technical: 0.32,
      projects: 0.14,
      experience: 0.18,
      problemSolving: 0.07,
      profileQuality: 0.06,
      portfolio: 0.04,
      consistency: 0.08,
      presence: 0.11,
    },
    signals: { github: 0.9, coding: 0.5, portfolio: 0.3, creative: 0 },
    expectedYears: 5,
    primaryLinks: ['github', 'linkedin', 'portfolio'],
    notes: {
      portfolio: 'Infrastructure write-ups, public repos (IaC, pipelines) and any technical blog you maintain.',
    },
  },
  security: {
    label: 'Security engineering',
    weights: {
      technical: 0.31,
      projects: 0.13,
      experience: 0.16,
      problemSolving: 0.13,
      profileQuality: 0.06,
      portfolio: 0.05,
      consistency: 0.06,
      presence: 0.1,
    },
    signals: { github: 0.7, coding: 0.45, portfolio: 0.4, creative: 0 },
    expectedYears: 5,
    primaryLinks: ['github', 'linkedin', 'portfolio'],
    notes: {
      problemSolving: 'CTFs, bug bounties, lab write-ups and the depth of your security projects.',
      portfolio: 'Write-ups, research posts and public tools.',
    },
  },
  game: {
    label: 'Game development',
    weights: {
      technical: 0.26,
      projects: 0.22,
      experience: 0.09,
      problemSolving: 0.07,
      profileQuality: 0.05,
      portfolio: 0.17,
      consistency: 0.06,
      presence: 0.08,
    },
    signals: { github: 0.8, coding: 0.4, portfolio: 1, creative: 0.5 },
    expectedYears: 4,
    primaryLinks: ['github', 'portfolio', 'linkedin', 'instagram'],
    notes: {
      problemSolving: 'Algorithmic thinking plus the technical depth of your games, prototypes and game-jam entries.',
      portfolio:
        'Playable builds, trailers and breakdowns on your portfolio - players and hiring teams want to see the game.',
    },
  },
  creative3d: {
    label: '3D & creative technology',
    weights: {
      technical: 0.22,
      projects: 0.17,
      experience: 0.08,
      problemSolving: 0.04,
      profileQuality: 0.06,
      portfolio: 0.28,
      consistency: 0.06,
      presence: 0.09,
    },
    signals: { github: 0.15, coding: 0, portfolio: 1, creative: 1 },
    expectedYears: 3,
    primaryLinks: ['behance', 'portfolio', 'instagram', 'linkedin'],
    notes: {
      technical: 'Mastery of the tools and techniques this role relies on, weighted by importance.',
      problemSolving: 'Creative problem solving: breakdowns, challenges, competitions and project depth.',
      portfolio:
        'The quality, range and presentation of your portfolio and creative profiles - the most important signal for this role.',
      consistency: 'How regularly you publish and refine work on your portfolio and creative platforms.',
    },
  },
  design: {
    label: 'Product & UX design',
    weights: {
      technical: 0.2,
      projects: 0.2,
      experience: 0.1,
      problemSolving: 0.09,
      profileQuality: 0.06,
      portfolio: 0.25,
      consistency: 0.04,
      presence: 0.06,
    },
    signals: { github: 0, coding: 0, portfolio: 1, creative: 1 },
    expectedYears: 4,
    primaryLinks: ['behance', 'dribbble', 'portfolio', 'linkedin'],
    notes: {
      technical: 'Craft and tooling: the design skills and methods this role relies on, weighted by importance.',
      problemSolving: 'Design thinking: how well your case studies frame problems, explore options and prove outcomes.',
      portfolio:
        'Case-study depth, craft and storytelling across your portfolio and design platforms - the most important signal for this role.',
      consistency: 'How regularly you publish and refine work on your portfolio and design platforms.',
    },
  },
  emerging: {
    label: 'Emerging technology',
    weights: {
      technical: 0.29,
      projects: 0.19,
      experience: 0.1,
      problemSolving: 0.09,
      profileQuality: 0.06,
      portfolio: 0.08,
      consistency: 0.08,
      presence: 0.11,
    },
    signals: { github: 1, coding: 0.5, portfolio: 0.6, creative: 0.1 },
    expectedYears: 3,
    primaryLinks: ['github', 'linkedin', 'portfolio'],
    notes: {},
  },
  embedded: {
    label: 'Embedded & robotics',
    weights: {
      technical: 0.32,
      projects: 0.18,
      experience: 0.15,
      problemSolving: 0.09,
      profileQuality: 0.06,
      portfolio: 0.06,
      consistency: 0.05,
      presence: 0.09,
    },
    signals: { github: 0.9, coding: 0.5, portfolio: 0.5, creative: 0 },
    expectedYears: 5,
    primaryLinks: ['github', 'linkedin', 'portfolio'],
    notes: {
      portfolio: 'Project write-ups with schematics, photos and demo videos - hardware work needs to be seen.',
    },
  },
}

export const DEFAULT_FAMILY = 'backend'
export const getFamily = (id) => FAMILIES[id] ?? FAMILIES[DEFAULT_FAMILY]

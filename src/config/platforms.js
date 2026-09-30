import {
  Code2,
  Briefcase,
  Globe,
  Camera,
  PenTool,
  Palette,
  FlaskConical,
  Terminal,
  Trophy,
  Link2,
  FileText,
} from 'lucide-react'

/**
 * Professional sources a user can connect.
 * Lucide v1 has no brand icons, so we use neutral glyphs + the platform name (no logos).
 *
 * `kind` groups them in the UI. `primaryFor` lists role families for which this source is
 * shown first in onboarding (see data/roles/families.js).
 * `pattern` describes the profile URL shape we validate against (see utils/validators.js).
 */
export const PLATFORMS = [
  {
    id: 'github',
    label: 'GitHub',
    kind: 'code',
    icon: Code2,
    hosts: ['github.com'],
    example: 'github.com/your-username',
    pathPattern: /^\/([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/?$/,
    usernameUrl: (u) => `https://github.com/${u}`,
    benefit: 'Repositories, languages and activity',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    kind: 'social',
    icon: Briefcase,
    hosts: ['linkedin.com'],
    example: 'linkedin.com/in/your-name',
    pathPattern: /^\/in\/([A-Za-z0-9\-_%]{3,100})\/?$/,
    usernameUrl: (u) => `https://www.linkedin.com/in/${u}`,
    benefit: 'Experience, headline and endorsements',
  },
  {
    id: 'portfolio',
    label: 'Portfolio website',
    kind: 'portfolio',
    icon: Globe,
    hosts: [],
    example: 'yourname.dev',
    pathPattern: null,
    usernameUrl: null,
    benefit: 'Design, content and performance',
  },
  {
    id: 'behance',
    label: 'Behance',
    kind: 'creative',
    icon: PenTool,
    hosts: ['behance.net'],
    example: 'behance.net/your-name',
    pathPattern: /^\/([A-Za-z0-9_\-]{2,50})\/?$/,
    usernameUrl: (u) => `https://www.behance.net/${u}`,
    benefit: 'Creative projects and appreciation',
  },
  {
    id: 'dribbble',
    label: 'Dribbble',
    kind: 'creative',
    icon: Palette,
    hosts: ['dribbble.com'],
    example: 'dribbble.com/your-name',
    pathPattern: /^\/([A-Za-z0-9_\-]{2,50})\/?$/,
    usernameUrl: (u) => `https://dribbble.com/${u}`,
    benefit: 'Shots, followers and consistency',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    kind: 'creative',
    icon: Camera,
    hosts: ['instagram.com'],
    example: 'instagram.com/your-handle',
    pathPattern: /^\/([A-Za-z0-9._]{1,30})\/?$/,
    usernameUrl: (u) => `https://www.instagram.com/${u}`,
    benefit: 'Creative presence and audience',
  },
  {
    id: 'kaggle',
    label: 'Kaggle',
    kind: 'competitive',
    icon: FlaskConical,
    hosts: ['kaggle.com'],
    example: 'kaggle.com/your-name',
    pathPattern: /^\/([A-Za-z0-9_\-]{2,50})\/?$/,
    usernameUrl: (u) => `https://www.kaggle.com/${u}`,
    benefit: 'Notebooks, competitions and medals',
  },
  {
    id: 'leetcode',
    label: 'LeetCode',
    kind: 'competitive',
    icon: Terminal,
    hosts: ['leetcode.com'],
    example: 'leetcode.com/u/your-name',
    pathPattern: /^\/(?:u\/)?([A-Za-z0-9_\-]{2,50})\/?$/,
    usernameUrl: (u) => `https://leetcode.com/u/${u}`,
    benefit: 'Problems solved and contest rating',
  },
  {
    id: 'codeforces',
    label: 'Codeforces',
    kind: 'competitive',
    icon: Trophy,
    hosts: ['codeforces.com'],
    example: 'codeforces.com/profile/your-handle',
    pathPattern: /^\/profile\/([A-Za-z0-9_.\-]{3,24})\/?$/,
    usernameUrl: (u) => `https://codeforces.com/profile/${u}`,
    benefit: 'Contest rating and history',
  },
  {
    id: 'other',
    label: 'Other link',
    kind: 'other',
    icon: Link2,
    hosts: [],
    example: 'https://…',
    pathPattern: null,
    usernameUrl: null,
    benefit: 'Publications, talks, blog…',
  },
]

export const RESUME_PLATFORM = { id: 'resume', label: 'Resume', icon: FileText }

export const PLATFORM_BY_ID = Object.fromEntries(PLATFORMS.map((p) => [p.id, p]))

/** Sources that have a dedicated mock analysis service. "other" is stored but not analyzed. */
export const ANALYZABLE_PLATFORMS = PLATFORMS.filter((p) => p.id !== 'other').map((p) => p.id)

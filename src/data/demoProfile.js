// "Alex Morgan" - the seeded demo user (a fictional frontend developer).
// Hand-written (not generated) so the headline numbers on the dashboard read well. Dates are computed
// relative to "now" so the profile never looks stale.
//
// Pure module (no React / browser APIs).

import { lastMonths, mockCreative } from './mockSources.js'

const DAY = 86_400_000

const monthStr = (now, monthsAgo) => {
  const d = new Date(now)
  d.setMonth(d.getMonth() - monthsAgo)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function createDemoProfile(now = Date.now()) {
  const year = new Date(now).getFullYear()
  const iso = (daysAgo) => new Date(now - daysAgo * DAY).toISOString()

  const monthlyCounts = [78, 92, 101, 88, 110, 96, 124, 118, 131, 142, 99, 105]
  const labels = lastMonths(12, now)

  return {
    id: 'u_alex-morgan',
    name: 'Alex Morgan',
    handle: 'alex-morgan',
    headline: 'Frontend Developer building fast, accessible interfaces',
    location: 'Toronto, Canada',
    region: 'north-america',
    bio: 'Frontend developer with three years of experience shipping React products used by tens of thousands of people. I care about accessibility, performance and the small details that make interfaces feel considered. Currently deepening my TypeScript and testing practice.',
    targetRoleId: 'frontend-developer',
    yearsOfExperience: 3,
    status: 'professional',
    workPreference: 'remote',
    links: {
      github: 'https://github.com/alexmorgan-dev',
      linkedin: 'https://www.linkedin.com/in/alex-morgan-dev',
      portfolio: 'https://alexmorgan.dev',
      instagram: 'https://www.instagram.com/alex.builds.ui',
      leetcode: 'https://leetcode.com/u/alexmorgan',
      other: [],
    },
    resume: { name: 'Alex_Morgan_Resume.pdf', size: 184_320, uploadedAt: iso(12) },
    skills: [
      { id: 'sk_alex_html', name: 'HTML', level: 'expert' },
      { id: 'sk_alex_css', name: 'CSS', level: 'advanced' },
      { id: 'sk_alex_js', name: 'JavaScript', level: 'advanced' },
      { id: 'sk_alex_react', name: 'React', level: 'advanced' },
      { id: 'sk_alex_ts', name: 'TypeScript', level: 'intermediate' },
      { id: 'sk_alex_git', name: 'Git', level: 'advanced' },
      { id: 'sk_alex_rest', name: 'REST APIs', level: 'advanced' },
      { id: 'sk_alex_resp', name: 'Responsive Design', level: 'advanced' },
      { id: 'sk_alex_ui', name: 'Component Libraries', level: 'advanced' },
      { id: 'sk_alex_tw', name: 'Tailwind CSS', level: 'advanced' },
      { id: 'sk_alex_test', name: 'Testing', level: 'beginner' },
      { id: 'sk_alex_a11y', name: 'Accessibility', level: 'intermediate' },
      { id: 'sk_alex_perf', name: 'Web Performance', level: 'intermediate' },
      { id: 'sk_alex_node', name: 'Node.js', level: 'intermediate' },
      { id: 'sk_alex_mongo', name: 'MongoDB', level: 'intermediate' },
      { id: 'sk_alex_figma', name: 'Figma', level: 'intermediate' },
      { id: 'sk_alex_redux', name: 'Redux', level: 'intermediate' },
      { id: 'sk_alex_py', name: 'Python', level: 'beginner' },
      { id: 'sk_alex_next', name: 'Next.js', level: 'beginner' },
    ],
    projects: [
      {
        id: 'pr_alex_agridoctor',
        name: 'AgriDoctor',
        description:
          'AI-assisted crop disease detection: snap a photo of a leaf, get a diagnosis and a treatment plan. Used by 4,000+ farmers during the beta, with offline support for low-connectivity areas.',
        tech: ['React', 'MongoDB', 'AI', 'Node.js'],
        url: 'https://agridoctor.example',
        repo: 'https://github.com/alexmorgan-dev/agridoctor',
        year,
        complexity: 4,
        impact: 4,
      },
      {
        id: 'pr_alex_pulse',
        name: 'Pulse Dashboard',
        description:
          'Real-time analytics dashboard with role-based views, accessible charts and full keyboard navigation. Replaced three internal tools at Northwind Labs.',
        tech: ['React', 'TypeScript', 'REST APIs', 'Tailwind CSS'],
        url: 'https://pulse-dashboard.example',
        repo: 'https://github.com/alexmorgan-dev/pulse-dashboard',
        year,
        complexity: 4,
        impact: 3,
      },
      {
        id: 'pr_alex_waypoint',
        name: 'Waypoint',
        description:
          'Offline-first trip planner PWA with drag-and-drop itineraries, shareable maps and a fully responsive layout.',
        tech: ['React', 'JavaScript', 'Responsive Design', 'Vite'],
        url: 'https://waypoint-trips.example',
        repo: 'https://github.com/alexmorgan-dev/waypoint',
        year: year - 1,
        complexity: 3,
        impact: 3,
      },
      {
        id: 'pr_alex_designkit',
        name: 'Design Kit',
        description:
          'A documented component library with design tokens, theming and automated accessibility tests, used across two client projects.',
        tech: ['React', 'TypeScript', 'CSS', 'Accessibility', 'Testing'],
        url: '',
        repo: 'https://github.com/alexmorgan-dev/design-kit',
        year: year - 1,
        complexity: 3,
        impact: 3,
      },
    ],
    experience: [
      {
        id: 'ex_alex_1',
        type: 'work',
        company: 'Northwind Labs',
        title: 'Frontend Developer',
        start: monthStr(now, 38),
        end: null,
        current: true,
        description:
          'Lead frontend for the analytics product used by 25,000 people. Cut largest-page load time by 38% and introduced the team’s accessibility checklist.',
        skills: ['React', 'TypeScript', 'Accessibility'],
      },
      {
        id: 'ex_alex_2',
        type: 'work',
        company: 'Brightside Studio',
        title: 'Junior Web Developer',
        start: monthStr(now, 62),
        end: monthStr(now, 38),
        current: false,
        description:
          'Built responsive marketing sites and web apps for clients; moved the studio’s projects onto a shared React component library.',
        skills: ['JavaScript', 'CSS', 'React'],
      },
      {
        id: 'ex_alex_3',
        type: 'internship',
        company: 'Helio Systems',
        title: 'UI Engineering Intern',
        start: monthStr(now, 68),
        end: monthStr(now, 64),
        current: false,
        description: 'Prototyped internal tools and fixed 40+ UI bugs during a four-month summer internship.',
        skills: ['HTML', 'CSS'],
      },
    ],
    education: [
      {
        id: 'ed_alex_1',
        school: 'Lakeshore University',
        degree: 'B.Sc. Computer Science',
        start: year - 9,
        end: year - 5,
      },
    ],
    certifications: [
      { id: 'ce_alex_1', name: 'Responsive Web Design', issuer: 'Open Web Academy', year: year - 2 },
      { id: 'ce_alex_2', name: 'Advanced React Patterns', issuer: 'Frontend Guild', year: year - 1 },
    ],
    achievements: [
      { id: 'ac_alex_1', title: 'Finalist, CivicHack', year },
      { id: 'ac_alex_2', title: 'Speaker, Frontend Meetup: “Motion with purpose”', year: year - 1 },
      { id: 'ac_alex_3', title: '3 merged pull requests in popular UI libraries', year: year - 1 },
    ],
    integrations: {
      github: {
        username: 'alexmorgan-dev',
        url: 'https://github.com/alexmorgan-dev',
        fetchedAt: iso(0),
        repos: 38,
        contributions: monthlyCounts.reduce((a, b) => a + b, 0),
        stars: 214,
        followers: 96,
        following: 41,
        languages: [
          { name: 'TypeScript', pct: 41 },
          { name: 'JavaScript', pct: 27 },
          { name: 'CSS', pct: 14 },
          { name: 'HTML', pct: 8 },
          { name: 'Python', pct: 6 },
          { name: 'Shell', pct: 4 },
        ],
        monthly: labels.map((month, i) => ({ month, count: monthlyCounts[i] })),
        recent: [
          {
            id: 'gh-1',
            type: 'pr',
            repo: 'pulse-dashboard',
            title: 'Merged: add keyboard navigation to chart legends',
            when: iso(1),
          },
          {
            id: 'gh-2',
            type: 'push',
            repo: 'design-kit',
            title: 'Pushed 4 commits: tokens for dark mode',
            when: iso(2),
          },
          {
            id: 'gh-3',
            type: 'release',
            repo: 'design-kit',
            title: 'Released v0.9.0 with focus-visible refinements',
            when: iso(5),
          },
          {
            id: 'gh-4',
            type: 'issue',
            repo: 'agridoctor',
            title: 'Opened an issue: image upload fails on slow connections',
            when: iso(8),
          },
        ],
        pinned: [
          {
            name: 'pulse-dashboard',
            description: 'Real-time analytics dashboard with accessible charts.',
            language: 'TypeScript',
            stars: 86,
          },
          {
            name: 'design-kit',
            description: 'Token-based React component library.',
            language: 'TypeScript',
            stars: 64,
          },
          { name: 'waypoint', description: 'Offline-first trip planner PWA.', language: 'JavaScript', stars: 38 },
          { name: 'agridoctor', description: 'AI-assisted crop disease detection.', language: 'JavaScript', stars: 26 },
        ],
        quality: { readmeCoverage: 0.78, testsCoverage: 0.41, ciCoverage: 0.27, score: 82 },
        consistency: { activeWeeks: 34, longestStreak: 14 },
        profilePolish: 0.8,
      },
      linkedin: {
        url: 'https://www.linkedin.com/in/alex-morgan-dev',
        fetchedAt: iso(0),
        headline: true,
        about: true,
        experienceEntries: 3,
        skills: 26,
        endorsements: 64,
        recommendations: 3,
        connections: '500+',
        completeness: 70,
      },
      portfolio: {
        url: 'https://alexmorgan.dev',
        fetchedAt: iso(0),
        design: 90,
        performance: 92,
        content: 82,
        responsive: 90,
        projectsShown: 5,
        hasCaseStudies: true,
      },
      instagram: {
        ...mockCreative('instagram', 'https://www.instagram.com/alex.builds.ui', { tier: 0.62, now }),
        followers: 1240,
        items: 46,
        appreciations: 2800,
        postsLast90d: 9,
      },
      leetcode: {
        url: 'https://leetcode.com/u/alexmorgan',
        solved: 356,
        easy: 158,
        medium: 171,
        hard: 27,
        rating: 1740,
        contests: 14,
        streak: 21,
      },
    },
  }
}

/** Score history seeds for the demo (months ago -> score offset relative to today's score). */
export const DEMO_HISTORY_OFFSETS = [
  { monthsAgo: 6, delta: -21 },
  { monthsAgo: 5, delta: -17 },
  { monthsAgo: 4, delta: -12 },
  { monthsAgo: 3, delta: -9 },
  { monthsAgo: 2, delta: -6 },
  { monthsAgo: 1, delta: -3 },
]

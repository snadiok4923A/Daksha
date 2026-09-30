// All in-app paths in one place. Use these instead of string literals.

export const ROUTES = {
  home: '/',
  roles: '/roles',
  onboarding: '/onboarding',
  app: '/app',
  analysis: '/app/analysis',
  skills: '/app/skills',
  projects: '/app/projects',
  resume: '/app/resume',
  ranking: '/app/ranking',
  roadmap: '/app/roadmap',
  profile: '/app/profile',
  settings: '/app/settings',
  publicProfile: (handle) => `/u/${handle}`,
}

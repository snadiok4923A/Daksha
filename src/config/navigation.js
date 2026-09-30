import {
  LayoutDashboard,
  ScanSearch,
  Layers,
  FolderKanban,
  FileText,
  Trophy,
  Route,
  UserRound,
  Settings,
} from 'lucide-react'
import { ROUTES } from './routes.js'

/**
 * Signed-in app navigation (desktop sidebar + mobile bottom bar + command palette).
 * `mobile: 'primary'` items appear in the bottom bar; the rest live in the "More" sheet.
 */
export const APP_NAV = [
  {
    id: 'overview',
    label: 'Overview',
    short: 'Home',
    to: ROUTES.app,
    end: true,
    icon: LayoutDashboard,
    mobile: 'primary',
    description: 'Your readiness at a glance',
  },
  {
    id: 'analysis',
    label: 'Career Analysis',
    short: 'Analysis',
    to: ROUTES.analysis,
    icon: ScanSearch,
    mobile: 'primary',
    description: 'Score breakdown, GitHub and presence',
  },
  {
    id: 'skills',
    label: 'Skills',
    short: 'Skills',
    to: ROUTES.skills,
    icon: Layers,
    mobile: 'more',
    description: 'Skill gap and your skill set',
  },
  {
    id: 'projects',
    label: 'Projects',
    short: 'Projects',
    to: ROUTES.projects,
    icon: FolderKanban,
    mobile: 'more',
    description: 'How your projects support this role',
  },
  {
    id: 'resume',
    label: 'Resume',
    short: 'Resume',
    to: ROUTES.resume,
    icon: FileText,
    mobile: 'more',
    description: 'ATS readiness and keyword analysis',
  },
  {
    id: 'ranking',
    label: 'Ranking',
    short: 'Ranking',
    to: ROUTES.ranking,
    icon: Trophy,
    mobile: 'primary',
    description: 'How you compare with peers',
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    short: 'Roadmap',
    to: ROUTES.roadmap,
    icon: Route,
    mobile: 'primary',
    description: 'Your 30-day improvement plan',
  },
  {
    id: 'profile',
    label: 'Profile',
    short: 'Profile',
    to: ROUTES.profile,
    icon: UserRound,
    mobile: 'more',
    description: 'Your public professional profile',
  },
  {
    id: 'settings',
    label: 'Settings',
    short: 'Settings',
    to: ROUTES.settings,
    icon: Settings,
    mobile: 'more',
    description: 'Theme, privacy and data',
  },
]

/** Marketing (public) navigation. */
export const MARKETING_NAV = [
  { id: 'how', label: 'How it works', to: `${ROUTES.home}#how-it-works` },
  { id: 'roles', label: 'Roles', to: ROUTES.roles },
  { id: 'trust', label: 'Transparency', to: `${ROUTES.home}#transparency` },
]

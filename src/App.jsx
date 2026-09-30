import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'
import { AnalysisProvider } from './context/AnalysisContext.jsx'
import { UIProvider } from './context/UIContext.jsx'
import ErrorBoundary from './components/layout/ErrorBoundary.jsx'
import RouteFallback from './components/layout/RouteFallback.jsx'

// Layouts are tiny and always needed, so they are bundled eagerly. Pages are code-split per route.
import MarketingLayout from './layouts/MarketingLayout.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import FocusLayout from './layouts/FocusLayout.jsx'

const Landing = lazy(() => import('./pages/Landing.jsx'))
const Roles = lazy(() => import('./pages/Roles.jsx'))
const PublicProfile = lazy(() => import('./pages/PublicProfile.jsx'))
const Onboarding = lazy(() => import('./pages/Onboarding.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const CareerAnalysis = lazy(() => import('./pages/CareerAnalysis.jsx'))
const Skills = lazy(() => import('./pages/Skills.jsx'))
const Projects = lazy(() => import('./pages/Projects.jsx'))
const Resume = lazy(() => import('./pages/Resume.jsx'))
const Ranking = lazy(() => import('./pages/Ranking.jsx'))
const Roadmap = lazy(() => import('./pages/Roadmap.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

// Component galleries - development only (used to eyeball components in both themes / breakpoints).
const DevRoutes = import.meta.env.DEV
  ? [
      ['core', lazy(() => import('./pages/dev/GalleryCore.jsx'))],
      ['overlays', lazy(() => import('./pages/dev/GalleryOverlays.jsx'))],
      ['charts', lazy(() => import('./pages/dev/GalleryCharts.jsx'))],
    ]
  : []

/** Scroll to top on navigation, or to the #anchor when the URL has one. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/u/:handle" element={<PublicProfile />} />
        </Route>

        <Route element={<FocusLayout />}>
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>

        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="analysis" element={<CareerAnalysis />} />
          <Route path="skills" element={<Skills />} />
          <Route path="projects" element={<Projects />} />
          <Route path="resume" element={<Resume />} />
          <Route path="ranking" element={<Ranking />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>

        {DevRoutes.map(([path, Component]) => (
          <Route key={path} path={`/dev/${path}`} element={<Component />} />
        ))}

        <Route element={<MarketingLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ProfileProvider>
          <AnalysisProvider>
            <BrowserRouter>
              <UIProvider>
                <ScrollManager />
                <ErrorBoundary>
                  <AppRoutes />
                </ErrorBoundary>
              </UIProvider>
            </BrowserRouter>
          </AnalysisProvider>
        </ProfileProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

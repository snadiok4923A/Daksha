import { createContext, useContext, useDeferredValue, useEffect, useMemo, useRef } from 'react'
import { analyzeProfile } from '../engine/index.js'
import { useToast } from './ToastContext.jsx'
import { useProfileActions, useProfileState } from './ProfileContext.jsx'

const AnalysisContext = createContext(null)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY = 86_400_000

/**
 * Derives the analysis from the current profile (pure + memoized), keeps the 30-day plan persisted,
 * records progress snapshots, and celebrates score changes with a toast.
 *
 * Swap analyzeProfile() for an API call here if you want server-side scoring - see docs/ARCHITECTURE.md.
 */
export function AnalysisProvider({ children }) {
  const state = useProfileState()
  const actions = useProfileActions()
  const toast = useToast()

  // Keeps typing in forms responsive: the analysis catches up a frame later.
  const deferredProfile = useDeferredValue(state.profile)
  const analysis = useMemo(() => analyzeProfile(deferredProfile, { roadmap: state.roadmap }), [deferredProfile, state.roadmap])

  const overall = analysis.score.overall
  const roleId = analysis.role.id

  // Persist the plan the first time we generate it for a role so task progress has stable ids.
  useEffect(() => {
    if (state.hasAnalyzed && state.roadmap?.roleId !== roleId) actions.setRoadmap(analysis.roadmap)
  }, [state.hasAnalyzed, state.roadmap?.roleId, roleId, analysis.roadmap, actions])

  // Score change -> snapshot + toast (debounced so typing doesn't spam).
  const baseline = useRef(null)
  useEffect(() => {
    if (!state.hasAnalyzed) {
      baseline.current = null
      return undefined
    }
    const key = `${state.profile.id}:${roleId}`
    if (!baseline.current || baseline.current.key !== key) {
      baseline.current = { key, score: overall }
      return undefined
    }
    if (baseline.current.score === overall) return undefined
    const from = baseline.current.score
    const timer = setTimeout(() => {
      baseline.current = { key, score: overall }
      actions.recordSnapshot(overall, roleId)
      toast({
        title: `Readiness ${overall > from ? 'up' : 'down'} to ${overall}`,
        description: `${from} → ${overall} after your latest change.`,
        tone: overall > from ? 'success' : 'info',
        duration: 3800,
      })
    }, 700)
    return () => clearTimeout(timer)
  }, [overall, roleId, state.profile.id, state.hasAnalyzed, actions, toast])

  // Progress history for the active role, always ending at today's score.
  const history = useMemo(() => {
    const points = state.history
      .filter((h) => h.roleId === roleId)
      .map((h) => ({ date: h.date, label: MONTHS[new Date(h.date).getMonth()], score: h.score }))
    if (!points.length) points.push({ date: new Date().toISOString(), label: MONTHS[new Date().getMonth()], score: overall })
    else points[points.length - 1] = { ...points[points.length - 1], score: overall }
    return points
  }, [state.history, roleId, overall])

  // Change vs roughly a month ago (nearest earlier snapshot), or null when there is no history yet.
  const scoreDelta = useMemo(() => {
    if (history.length < 2) return null
    const target = Date.now() - 30 * DAY
    const earlier = history.slice(0, -1)
    const nearest = earlier.reduce((best, p) => (Math.abs(new Date(p.date) - target) < Math.abs(new Date(best.date) - target) ? p : best), earlier[0])
    return { value: overall - nearest.score, since: nearest.date }
  }, [history, overall])

  const value = useMemo(
    () => ({ analysis, role: analysis.role, profile: state.profile, history, scoreDelta, isDemo: state.isDemo, hasAnalyzed: state.hasAnalyzed }),
    [analysis, history, scoreDelta, state.profile, state.isDemo, state.hasAnalyzed],
  )

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>
}

/**
 * { analysis, role, profile, history, scoreDelta, isDemo, hasAnalyzed }
 *   analysis     -> engine output (see docs/ARCHITECTURE.md "Analysis object")
 *   history      -> [{ date, label, score }] for the active role (last point = today)
 *   scoreDelta   -> { value, since } | null  (change vs ~1 month ago)
 */
export function useAnalysis() {
  const ctx = useContext(AnalysisContext)
  if (!ctx) throw new Error('useAnalysis must be used inside <AnalysisProvider>')
  return ctx
}

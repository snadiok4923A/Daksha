import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { createDemoProfile, DEMO_HISTORY_OFFSETS } from '../data/demoProfile.js'
import { getCommunity } from '../data/community.js'
import { COLLECTIONS, createEmptyProfile, normalizeProfile, uniqueHandle } from '../data/profileModel.js'
import { DEFAULT_ROLE_ID, hasRole } from '../data/roles/roles.js'
import { analyzeProfile } from '../engine/index.js'
import { setDevFlags } from '../services/client.js'
import { clamp } from '../utils/math.js'
import { uid } from '../utils/id.js'
import { normalizeSkillKey } from '../data/roles/skillLibrary.js'
import { STORAGE_KEYS, readJSON, removeKey, writeJSON } from '../utils/storage.js'

const STATE_VERSION = 1

const ProfileStateContext = createContext(null)
const ProfileActionsContext = createContext(null)

/* ------------------------------ initial state ------------------------------ */

export const DEFAULT_SETTINGS = {
  notifications: { weeklyDigest: true, rankingChanges: true, roadmapReminders: false, productUpdates: false },
  privacy: { publicProfile: true, showScore: true, showRanking: true, showLocation: true, includeInRanking: true, searchable: true },
  dev: { simulateGithubDown: false, simulateResumeFail: false, simulateAnalysisFail: false, slowNetwork: false },
}

const monthsAgoISO = (now, months) => {
  const d = new Date(now)
  d.setMonth(d.getMonth() - months)
  return d.toISOString()
}

/** The seeded demo workspace (Alex Morgan, frontend developer). */
export function createDemoState(now = Date.now()) {
  const profile = createDemoProfile(now)
  const analysis = analyzeProfile(profile, { now: new Date(now) })
  const score = analysis.score.overall
  const roleId = profile.targetRoleId
  const history = [
    ...DEMO_HISTORY_OFFSETS.map(({ monthsAgo, delta }) => ({ date: monthsAgoISO(now, monthsAgo), score: clamp(score + delta, 5, 99), roleId })),
    { date: new Date(now).toISOString(), score, roleId },
  ]
  const firstTasks = analysis.roadmap.weeks[0].tasks.slice(0, 2).map((t) => t.id)
  return {
    version: STATE_VERSION,
    profile,
    isDemo: true,
    hasAnalyzed: true,
    analyzedAt: new Date(now).toISOString(),
    roadmap: analysis.roadmap,
    roadmapProgress: Object.fromEntries(firstTasks.map((id) => [id, true])),
    history,
    settings: structuredClone(DEFAULT_SETTINGS),
    ui: { demoBannerDismissed: false },
  }
}

/** What "Delete my profile data" leaves behind: an empty workspace with nothing analyzed. */
export function createBlankState() {
  return {
    version: STATE_VERSION,
    profile: createEmptyProfile(),
    isDemo: false,
    hasAnalyzed: false,
    analyzedAt: null,
    roadmap: null,
    roadmapProgress: {},
    history: [],
    settings: structuredClone(DEFAULT_SETTINGS),
    ui: { demoBannerDismissed: true },
  }
}

function loadState() {
  const saved = readJSON(STORAGE_KEYS.state, null)
  if (!saved || saved.version !== STATE_VERSION || !saved.profile) return null
  return {
    ...saved,
    profile: normalizeProfile(saved.profile),
    settings: {
      notifications: { ...DEFAULT_SETTINGS.notifications, ...saved.settings?.notifications },
      privacy: { ...DEFAULT_SETTINGS.privacy, ...saved.settings?.privacy },
      dev: { ...DEFAULT_SETTINGS.dev, ...saved.settings?.dev },
    },
    history: saved.history ?? [],
    roadmapProgress: saved.roadmapProgress ?? {},
    ui: { demoBannerDismissed: false, ...saved.ui },
  }
}

const init = () => loadState() ?? createDemoState()

/* --------------------------------- reducer --------------------------------- */

const takenHandles = (exceptHandle) => new Set(getCommunity().map((c) => c.profile.handle).filter((h) => h !== exceptHandle))

function sameDay(a, b) {
  return new Date(a).toDateString() === new Date(b).toDateString()
}

function reducer(state, action) {
  switch (action.type) {
    case 'profile/update': {
      const patch = { ...action.patch }
      if (patch.name !== undefined && patch.handle === undefined && !state.profile.handle) {
        patch.handle = uniqueHandle(patch.name, takenHandles())
      }
      return { ...state, profile: { ...state.profile, ...patch } }
    }

    case 'profile/setRole': {
      if (!hasRole(action.roleId) || action.roleId === state.profile.targetRoleId) return state
      const profile = { ...state.profile, targetRoleId: action.roleId }
      // New role = new requirements = a fresh plan. (Progress is keyed by role, so it is kept per role.)
      const roadmap = analyzeProfile(profile).roadmap
      return { ...state, profile, roadmap }
    }

    case 'collection/add': {
      const { kind, item } = action
      const prefix = COLLECTIONS[kind].prefix
      const list = state.profile[kind] ?? []
      return { ...state, profile: { ...state.profile, [kind]: [...list, { id: uid(prefix), ...item }] } }
    }
    case 'collection/update': {
      const { kind, id, patch } = action
      return { ...state, profile: { ...state.profile, [kind]: state.profile[kind].map((it) => (it.id === id ? { ...it, ...patch } : it)) } }
    }
    case 'collection/remove': {
      const { kind, id } = action
      return { ...state, profile: { ...state.profile, [kind]: state.profile[kind].filter((it) => it.id !== id) } }
    }
    case 'collection/replace':
      return { ...state, profile: { ...state.profile, [action.kind]: action.items } }

    case 'skill/upsert': {
      const key = normalizeSkillKey(action.name)
      const existing = state.profile.skills.find((s) => normalizeSkillKey(s.name) === key)
      const skills = existing
        ? state.profile.skills.map((s) => (s.id === existing.id ? { ...s, level: action.level } : s))
        : [...state.profile.skills, { id: uid('sk'), name: action.name.trim(), level: action.level }]
      return { ...state, profile: { ...state.profile, skills } }
    }

    case 'link/set': {
      const links = { ...state.profile.links, [action.platformId]: action.url }
      if (!action.url) delete links[action.platformId]
      return { ...state, profile: { ...state.profile, links } }
    }
    case 'link/addOther':
      return { ...state, profile: { ...state.profile, links: { ...state.profile.links, other: [...(state.profile.links.other ?? []), action.url] } } }
    case 'link/removeOther':
      return { ...state, profile: { ...state.profile, links: { ...state.profile.links, other: (state.profile.links.other ?? []).filter((_, i) => i !== action.index) } } }

    case 'source/connect': {
      const { platformId, url, data } = action
      return {
        ...state,
        profile: {
          ...state.profile,
          links: { ...state.profile.links, [platformId]: url },
          integrations: { ...state.profile.integrations, [platformId]: data },
        },
      }
    }
    case 'source/disconnect': {
      const links = { ...state.profile.links }
      delete links[action.platformId]
      const integrations = { ...state.profile.integrations }
      delete integrations[action.platformId]
      return { ...state, profile: { ...state.profile, links, integrations } }
    }

    case 'resume/set':
      return { ...state, profile: { ...state.profile, resume: action.resume } }

    case 'onboarding/complete': {
      const name = (action.draft.name ?? '').trim() || 'You'
      const profile = normalizeProfile({
        ...createEmptyProfile(),
        ...action.draft,
        name,
        handle: uniqueHandle(name, takenHandles()),
        headline: action.draft.headline || '',
      })
      const analysis = analyzeProfile(profile)
      const now = new Date().toISOString()
      return {
        ...state,
        profile,
        isDemo: false,
        hasAnalyzed: true,
        analyzedAt: now,
        roadmap: analysis.roadmap,
        roadmapProgress: {},
        history: [{ date: now, score: analysis.score.overall, roleId: profile.targetRoleId }],
        ui: { ...state.ui, demoBannerDismissed: true },
      }
    }

    case 'analysis/complete': {
      const analysis = analyzeProfile(state.profile)
      const now = new Date().toISOString()
      return {
        ...state,
        hasAnalyzed: true,
        analyzedAt: now,
        roadmap: state.roadmap?.roleId === analysis.role.id ? state.roadmap : analysis.roadmap,
      }
    }

    case 'history/record': {
      const { score, roleId } = action
      const now = new Date().toISOString()
      const history = [...state.history]
      const last = history[history.length - 1]
      if (last && last.roleId === roleId && sameDay(last.date, now)) history[history.length - 1] = { ...last, score }
      else history.push({ date: now, score, roleId })
      return { ...state, history: history.slice(-36) }
    }

    case 'roadmap/set':
      return { ...state, roadmap: action.roadmap }
    case 'roadmap/regenerate': {
      const fresh = analyzeProfile(state.profile).roadmap
      const progress = Object.fromEntries(Object.entries(state.roadmapProgress).filter(([id]) => !id.startsWith(`${fresh.roleId}:`)))
      return { ...state, roadmap: fresh, roadmapProgress: progress }
    }
    case 'roadmap/toggleTask': {
      const progress = { ...state.roadmapProgress }
      if (progress[action.taskId]) delete progress[action.taskId]
      else progress[action.taskId] = true
      return { ...state, roadmapProgress: progress }
    }
    case 'roadmap/resetProgress': {
      const prefix = `${action.roleId}:`
      return { ...state, roadmapProgress: Object.fromEntries(Object.entries(state.roadmapProgress).filter(([id]) => !id.startsWith(prefix))) }
    }

    case 'settings/update':
      return { ...state, settings: { ...state.settings, [action.section]: { ...state.settings[action.section], ...action.patch } } }

    case 'ui/dismissDemoBanner':
      return { ...state, ui: { ...state.ui, demoBannerDismissed: true } }

    case 'state/resetToDemo':
      return createDemoState()
    case 'state/deleteAll':
      return createBlankState()

    default:
      return state
  }
}

/* --------------------------------- provider -------------------------------- */

export function ProfileProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, init)

  // Persist (debounced) + keep service-level dev flags in sync with settings.
  const saveTimer = useRef(null)
  useEffect(() => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => writeJSON(STORAGE_KEYS.state, state), 250)
    return () => clearTimeout(saveTimer.current)
  }, [state])
  useEffect(() => {
    const flush = () => writeJSON(STORAGE_KEYS.state, state)
    window.addEventListener('pagehide', flush)
    return () => window.removeEventListener('pagehide', flush)
  }, [state])
  useEffect(() => setDevFlags(state.settings.dev), [state.settings.dev])

  const actions = useMemo(
    () => ({
      /** Shallow-merge fields into the profile (name, headline, bio, years, status, ...). */
      updateProfile: (patch) => dispatch({ type: 'profile/update', patch }),
      setTargetRole: (roleId) => dispatch({ type: 'profile/setRole', roleId }),

      // collections: 'skills' | 'projects' | 'experience' | 'education' | 'certifications' | 'achievements'
      addItem: (kind, item) => dispatch({ type: 'collection/add', kind, item }),
      updateItem: (kind, id, patch) => dispatch({ type: 'collection/update', kind, id, patch }),
      removeItem: (kind, id) => dispatch({ type: 'collection/remove', kind, id }),
      replaceItems: (kind, items) => dispatch({ type: 'collection/replace', kind, items }),
      /** Add a skill or change its level if it already exists (matched by normalized name). */
      upsertSkill: (name, level) => dispatch({ type: 'skill/upsert', name, level }),

      // sources & resume
      setLink: (platformId, url) => dispatch({ type: 'link/set', platformId, url }),
      addOtherLink: (url) => dispatch({ type: 'link/addOther', url }),
      removeOtherLink: (index) => dispatch({ type: 'link/removeOther', index }),
      connectSource: (platformId, url, data) => dispatch({ type: 'source/connect', platformId, url, data }),
      disconnectSource: (platformId) => dispatch({ type: 'source/disconnect', platformId }),
      setResume: (resume) => dispatch({ type: 'resume/set', resume }),

      // lifecycle
      completeOnboarding: (draft) => dispatch({ type: 'onboarding/complete', draft }),
      markAnalyzed: () => dispatch({ type: 'analysis/complete' }),
      recordSnapshot: (score, roleId) => dispatch({ type: 'history/record', score, roleId }),

      // roadmap
      setRoadmap: (roadmap) => dispatch({ type: 'roadmap/set', roadmap }),
      regenerateRoadmap: () => dispatch({ type: 'roadmap/regenerate' }),
      toggleRoadmapTask: (taskId) => dispatch({ type: 'roadmap/toggleTask', taskId }),
      resetRoadmapProgress: (roleId) => dispatch({ type: 'roadmap/resetProgress', roleId }),

      // settings ('notifications' | 'privacy' | 'dev')
      updateSettings: (section, patch) => dispatch({ type: 'settings/update', section, patch }),
      dismissDemoBanner: () => dispatch({ type: 'ui/dismissDemoBanner' }),

      // data management
      resetToDemo: () => dispatch({ type: 'state/resetToDemo' }),
      deleteAllData: () => {
        removeKey(STORAGE_KEYS.onboardingDraft)
        dispatch({ type: 'state/deleteAll' })
      },
    }),
    [],
  )

  return (
    <ProfileStateContext.Provider value={state}>
      <ProfileActionsContext.Provider value={actions}>{children}</ProfileActionsContext.Provider>
    </ProfileStateContext.Provider>
  )
}

/** Whole persisted state: { profile, isDemo, hasAnalyzed, analyzedAt, roadmap, roadmapProgress, history, settings, ui } */
export function useProfileState() {
  const ctx = useContext(ProfileStateContext)
  if (!ctx) throw new Error('useProfileState must be used inside <ProfileProvider>')
  return ctx
}

/** Stable object of action functions (never changes identity). */
export function useProfileActions() {
  const ctx = useContext(ProfileActionsContext)
  if (!ctx) throw new Error('useProfileActions must be used inside <ProfileProvider>')
  return ctx
}

/** Shortcut: just the profile object. */
export const useProfile = () => useProfileState().profile

export { DEFAULT_ROLE_ID }

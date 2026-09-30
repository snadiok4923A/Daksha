// Orchestrates a full profile analysis. Today it runs the local scoring engine behind a staged,
// simulated delay (so the UI can show real progress). Tomorrow this is where an AI analysis backend
// plugs in, following the pipeline in docs/ARCHITECTURE.md:
//
//   User data -> normalization -> role requirements -> AI analysis -> scoring engine
//             -> skill-gap engine -> ranking engine -> personalized recommendations

import { analyzeProfile, hasEnoughData } from '../engine/index.js'
import { getRole } from '../data/roles/roles.js'
import { ERROR_CODES, ServiceError, devFlags, delay } from './client.js'

export const ANALYSIS_STAGES = [
  { id: 'reading', label: 'Reading profile', detail: 'Collecting your details and connected sources' },
  { id: 'skills', label: 'Analyzing skills', detail: 'Matching your skills to what the role asks for' },
  { id: 'projects', label: 'Evaluating projects', detail: 'Scoring depth, relevance and portfolio value' },
  { id: 'role', label: 'Checking role relevance', detail: 'Weighing experience and signals for this role' },
  { id: 'compare', label: 'Comparing profiles', detail: 'Placing you among profiles evaluated on the platform' },
  { id: 'insights', label: 'Preparing insights', detail: 'Building your skill gap and 30-day plan' },
]

/**
 * @param {object} profile
 * @param {{ onStage?: (index: number, stage: object) => void, signal?: AbortSignal }} [options]
 * @returns {Promise<object>} analysis (see engine/index.js)
 * @throws {ServiceError} INSUFFICIENT_DATA | ANALYSIS_FAILED | ABORTED
 */
export async function runProfileAnalysis(profile, { onStage, signal } = {}) {
  const speed = devFlags.slowNetwork ? 2.5 : 1
  const role = getRole(profile.targetRoleId)

  for (let i = 0; i < ANALYSIS_STAGES.length; i++) {
    onStage?.(i, ANALYSIS_STAGES[i])
    await delay((620 + i * 70) * speed, signal)

    if (i === 0 && !hasEnoughData(profile)) {
      throw new ServiceError(
        ERROR_CODES.INSUFFICIENT_DATA,
        `There isn’t enough information to assess you for ${role.name} yet. Add a few skills, a project or a connected source and try again.`,
      )
    }
    if (i === 3 && devFlags.simulateAnalysisFail) {
      throw new ServiceError(ERROR_CODES.ANALYSIS_FAILED, 'Something went wrong while comparing profiles. Nothing was saved - please try again.')
    }
  }

  onStage?.(ANALYSIS_STAGES.length, { id: 'done', label: 'Done', detail: 'Your results are ready' })
  await delay(350, signal)
  return analyzeProfile(profile)
}

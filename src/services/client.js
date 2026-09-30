// Shared plumbing for the mock service layer.
//
// Every service function has the shape a real API client would have (async, throws ServiceError),
// so replacing a mock with `fetch(`${API_CONFIG.baseUrl}/...`)` later does not change any caller.

export const API_CONFIG = {
  // Set VITE_API_URL to point at a real backend once one exists.
  baseUrl: import.meta.env?.VITE_API_URL ?? '',
  mock: true,
}

export const ERROR_CODES = {
  INVALID_URL: 'INVALID_URL',
  GITHUB_UNAVAILABLE: 'GITHUB_UNAVAILABLE',
  SOURCE_UNAVAILABLE: 'SOURCE_UNAVAILABLE',
  RESUME_INVALID_TYPE: 'RESUME_INVALID_TYPE',
  RESUME_TOO_LARGE: 'RESUME_TOO_LARGE',
  RESUME_UPLOAD_FAILED: 'RESUME_UPLOAD_FAILED',
  INSUFFICIENT_DATA: 'INSUFFICIENT_DATA',
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',
  RANKING_UNAVAILABLE: 'RANKING_UNAVAILABLE',
  ABORTED: 'ABORTED',
}

/** Errors thrown by services. `code` is stable (use it in UI logic), `message` is human-readable. */
export class ServiceError extends Error {
  constructor(code, message, { recoverable = true, cause } = {}) {
    super(message)
    this.name = 'ServiceError'
    this.code = code
    this.recoverable = recoverable
    this.cause = cause
  }
}

/**
 * Prototype switches (Settings -> Data management -> Prototype tools) that force failures so the
 * error states can be demonstrated. Kept in a module-level object because services run outside React;
 * the profile store keeps it in sync (see ProfileContext).
 */
export const devFlags = {
  simulateGithubDown: false,
  simulateResumeFail: false,
  simulateAnalysisFail: false,
  slowNetwork: false,
}

export function setDevFlags(next = {}) {
  Object.assign(devFlags, {
    simulateGithubDown: Boolean(next.simulateGithubDown),
    simulateResumeFail: Boolean(next.simulateResumeFail),
    simulateAnalysisFail: Boolean(next.simulateAnalysisFail),
    slowNetwork: Boolean(next.slowNetwork),
  })
}

export const delay = (ms, signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new ServiceError(ERROR_CODES.ABORTED, 'Request cancelled.'))
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(new ServiceError(ERROR_CODES.ABORTED, 'Request cancelled.'))
      },
      { once: true },
    )
  })

/** Simulated network latency between min and max ms (x3 when "slow network" is on). */
export const simulateLatency = (min = 350, max = 800, signal) =>
  delay((min + Math.random() * (max - min)) * (devFlags.slowNetwork ? 3 : 1), signal)

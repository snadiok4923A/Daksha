// Resume upload + analysis (mock). No file is read or sent anywhere: we validate the file, simulate an
// upload with progress, and keep only its metadata. The analysis itself is derived from the profile by
// the scoring engine (engine/resume.js) so it stays consistent with everything else on screen.
//
// To go live: POST the file (multipart) to your backend, parse it server-side, and return the same
// `resume` metadata + an analysis object shaped like engine/resume.js's output.

import { formatBytes } from '../utils/format.js'
import { ERROR_CODES, ServiceError, devFlags, delay } from './client.js'

export const RESUME_LIMITS = {
  maxBytes: 5 * 1024 * 1024,
  extensions: ['pdf', 'doc', 'docx'],
  accept: '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  label: 'PDF, DOC or DOCX · up to 5 MB',
}

/** @throws {ServiceError} RESUME_INVALID_TYPE | RESUME_TOO_LARGE */
export function validateResumeFile(file) {
  if (!file) throw new ServiceError(ERROR_CODES.RESUME_UPLOAD_FAILED, 'No file selected.')
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!RESUME_LIMITS.extensions.includes(ext)) {
    throw new ServiceError(ERROR_CODES.RESUME_INVALID_TYPE, `“${file.name}” isn’t a supported format. Please upload a PDF, DOC or DOCX file.`)
  }
  if (file.size > RESUME_LIMITS.maxBytes) {
    throw new ServiceError(ERROR_CODES.RESUME_TOO_LARGE, `That file is ${formatBytes(file.size)} - the limit is 5 MB. Try exporting a smaller PDF.`)
  }
  if (file.size === 0) {
    throw new ServiceError(ERROR_CODES.RESUME_UPLOAD_FAILED, 'That file looks empty. Please choose a different one.')
  }
}

/**
 * Simulated upload with progress callbacks (0..100).
 * Fails when the "simulate resume failure" prototype flag is on, or when the file name contains "fail".
 *
 * @returns {Promise<{ name: string, size: number, type: string, uploadedAt: string }>}
 */
export async function uploadResume(file, { onProgress, signal } = {}) {
  validateResumeFile(file)

  const willFail = devFlags.simulateResumeFail || /fail|corrupt/i.test(file.name)
  const steps = 14
  const failAt = willFail ? Math.floor(steps * 0.6) : Infinity
  const stepMs = (devFlags.slowNetwork ? 3 : 1) * 130

  for (let i = 1; i <= steps; i++) {
    await delay(stepMs + Math.random() * 60, signal)
    if (i >= failAt) {
      throw new ServiceError(ERROR_CODES.RESUME_UPLOAD_FAILED, 'The upload was interrupted before it finished. Check your connection and try again.')
    }
    onProgress?.(Math.round((i / steps) * 100))
  }

  return { name: file.name, size: file.size, type: file.type || '', uploadedAt: new Date().toISOString() }
}

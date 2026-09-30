// GitHub-specific entry point (thin wrapper over sourceService). Kept as its own module so a real
// implementation can grow here (GraphQL contributions calendar, repo quality checks, etc.).

import { connectSource } from './sourceService.js'

/**
 * Fetch a GitHub summary: repositories, contributions, languages, stars, followers, recent activity,
 * project quality and consistency signals.
 * @throws {ServiceError} code GITHUB_UNAVAILABLE | INVALID_URL
 */
export async function fetchGithubSummary(urlOrUsername, options) {
  const { data } = await connectSource('github', urlOrUsername, options)
  return data
}

/** A few repos the user could import as projects (mock; derived from the summary's pinned repos). */
export function suggestProjectsFromGithub(summary) {
  if (!summary) return []
  return (summary.pinned ?? []).map((repo, i) => ({
    id: `gh_repo_${repo.name}`,
    name: repo.name
      .split('-')
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(' '),
    description: repo.description,
    tech: [repo.language],
    repo: `${summary.url}/${repo.name}`,
    url: '',
    year: new Date().getFullYear() - (i > 1 ? 1 : 0),
    complexity: 3,
    impact: 2,
    stars: repo.stars,
  }))
}

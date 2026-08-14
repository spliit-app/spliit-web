import { cache } from 'react'

const REPO_URL = 'https://github.com/spliit-app/spliit'
const REPO_API_URL = 'https://api.github.com/repos/spliit-app/spliit'

/**
 * Spliit's source repository, and the pages people are sent to from the home
 * page. Hardcoded rather than configurable, for the same reason as
 * `openCollective`: these point at the project itself, not at whoever runs a
 * given instance.
 */
export const github = {
  url: REPO_URL,
  issues: `${REPO_URL}/issues`,
  contributors: `${REPO_URL}/graphs/contributors`,
} as const

/**
 * The unauthenticated GitHub API allows 60 calls an hour per IP address, and
 * the home page is rendered per request (the root layout reads the locale from
 * cookies, so nothing on the page is static). Both calls below are therefore
 * revalidated hourly instead of made once per visitor.
 */
const REVALIDATE_SECONDS = 3600

/**
 * Returns `null` rather than throwing on any failure — a rate-limited API or a
 * GitHub outage must not take the home page down with it. Every caller renders
 * without the data instead.
 */
async function fetchFromGitHub<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${REPO_API_URL}${path}`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!response.ok) {
      console.error(
        `GitHub API responded ${response.status} for ${REPO_API_URL}${path}`,
      )
      return null
    }
    return (await response.json()) as T
  } catch (error) {
    console.error(error)
    return null
  }
}

export type RepoStats = {
  stars: number
  forks: number
}

/**
 * Wrapped in React's `cache` so that the hero and the contribute section, which
 * both display these numbers, share a single request per render.
 */
export const getRepoStats = cache(async (): Promise<RepoStats | null> => {
  const repo = await fetchFromGitHub<{
    stargazers_count: number
    forks_count: number
  }>('')
  if (!repo) return null
  return { stars: repo.stargazers_count, forks: repo.forks_count }
})

export type Contributor = {
  login: string
  avatarUrl: string
  profileUrl: string
}

export const getContributors = cache(
  async (): Promise<Contributor[] | null> => {
    const contributors = await fetchFromGitHub<
      { login?: string; avatar_url?: string; html_url?: string }[]
    >('/contributors?per_page=100')
    if (!contributors) return null

    return contributors.flatMap((contributor) =>
      contributor.login && contributor.avatar_url && contributor.html_url
        ? [
            {
              login: contributor.login,
              avatarUrl: contributor.avatar_url,
              profileUrl: contributor.html_url,
            },
          ]
        : [],
    )
  },
)

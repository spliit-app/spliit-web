import { GitHubStarPillLink } from '@/app/github-star-pill'
import { getContributors, getRepoStats } from '@/lib/github'

/**
 * Social proof in the hero, where the “Open Source” claim is made. Renders
 * nothing when GitHub cannot be reached, rather than an empty pill.
 */
export async function GitHubStarPill() {
  const stats = await getRepoStats()
  if (!stats) return null
  return <GitHubStarPillLink stars={stats.stars} />
}

/**
 * The same numbers, restated under the contributor wall as evidence that the
 * invitation next to it is a real one. Both calls are memoized per render, so
 * this shares its requests with the pill and with `Contributors`.
 */
export async function RepoStatsLine() {
  const [stats, contributors] = await Promise.all([
    getRepoStats(),
    getContributors(),
  ])
  if (!stats) return null

  const parts = [
    contributors && `${contributors.length} contributors`,
    `${stats.stars.toLocaleString('en-US')} stars`,
    `${stats.forks.toLocaleString('en-US')} forks`,
  ].filter(Boolean)

  return (
    <p className="mt-4 text-sm text-muted-foreground">{parts.join(' · ')}</p>
  )
}

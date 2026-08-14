'use client'

import { useAnalytics } from '@/lib/analytics/context'
import { github } from '@/lib/github'
import { Star } from 'lucide-react'

/**
 * The star count is passed in rather than fetched here: the request belongs on
 * the server, and only the click handler needs to run in the browser.
 */
export function GitHubStarPillLink({ stars }: { stars: number }) {
  const sendEvent = useAnalytics()

  return (
    <a
      href={github.url}
      target="_blank"
      rel="noreferrer"
      onClick={() =>
        sendEvent({ event: 'contribute: click', props: { route: 'share' } })
      }
      className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
    >
      <Star className="w-3.5 h-3.5 fill-current" aria-hidden />
      {/* One flex item, so that the gap above separates the icon from the label
          without also spacing out the words. */}
      <span>
        <span className="font-medium">{stars.toLocaleString('en-US')}</span>{' '}
        stars on GitHub
      </span>
    </a>
  )
}

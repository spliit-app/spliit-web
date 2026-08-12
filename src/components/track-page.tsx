'use client'

import { anonymizePath } from '@/lib/anonymize-path'
import { usePlausible } from 'next-plausible'
import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect } from 'react'

/**
 * No properties at all. `{}` would not do: it accepts any object, so it would
 * silently let a `groupId` through.
 */
type NoProps = Record<string, never>

// Group and expense IDs are deliberately absent from every event: they identify
// a specific user's data, and they are unique per document, so they would only
// ever produce single-visitor rows. Properties here must stay low-cardinality.
type Event =
  | { event: 'pageview'; props: NoProps }
  | { event: 'group: create'; props: NoProps }
  | { event: 'group: update'; props: NoProps }
  | { event: 'expense: create'; props: NoProps }
  | { event: 'expense: scan receipt'; props: NoProps }
  | { event: 'expense: create from receipt'; props: NoProps }
  | { event: 'expense: update'; props: NoProps }
  | { event: 'expense: delete'; props: NoProps }
  | { event: 'group: export expenses'; props: NoProps }
  | { event: 'news: open menu'; props: NoProps }
  | { event: 'news: click news'; props: { news: string } }
  | { event: 'expense: attach document'; props: NoProps }
  // Same name Plausible's built-in tracking used, so history stays comparable.
  | { event: 'Outbound Link: Click'; props: { url: string } }

type Props = {
  path: string
}

export function TrackPage(props: Props) {
  return (
    <Suspense>
      <TrackPage_ {...props} />
    </Suspense>
  )
}

function TrackPage_({ path }: Props) {
  const sendEvent = useAnalytics()
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  useEffect(() => {
    sendEvent(
      { event: 'pageview', props: {} },
      `${path}${ref ? `?ref=${ref}` : ''}`,
    )
  }, [path, ref, sendEvent])

  return null
}

/**
 * Replaces Plausible's built-in `trackOutboundLinks`. That one sends the event
 * without a URL, so Plausible falls back to `location.href` — which on a group
 * page carries the group ID. Sending it ourselves routes it through
 * `useAnalytics`, which anonymizes the path.
 *
 * Only the pathname is reported: the expense creation route carries the title
 * and amount in its query string, and those don't belong in analytics either.
 */
export function TrackOutboundLinks() {
  const sendEvent = useAnalytics()

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Middle-click only, matching Plausible's own handler.
      if (event.type === 'auxclick' && event.button !== 1) return
      if (!(event.target instanceof Element)) return

      const anchor = event.target.closest('a')
      // `href` is not a string on SVG anchors, and `host` is empty for
      // `mailto:` and `tel:` links.
      if (typeof anchor?.href !== 'string') return
      if (!anchor.host || anchor.host === window.location.host) return

      sendEvent(
        { event: 'Outbound Link: Click', props: { url: anchor.href } },
        window.location.pathname,
      )
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('auxclick', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('auxclick', handleClick)
    }
  }, [sendEvent])

  return null
}

export function useAnalytics() {
  const plausible = usePlausible()

  // Keep a stable identity: `TrackPage_` passes this to a `useEffect` dependency
  // array, so a new function on every render would re-send the pageview on every
  // re-render (and group pages re-render on every tRPC refetch).
  const sendEvent = useCallback(
    ({ event, props }: Event, path = '/') => {
      // Anonymize here rather than at the call sites, so no caller can leak an
      // ID by passing a path built from `groupId`.
      const url = `${window.location.origin}${anonymizePath(path)}`
      if (process.env.NODE_ENV !== 'production')
        console.log('Analytics event:', event, props, url)
      plausible(event, { props, u: url })
    },
    [plausible],
  )

  return sendEvent
}

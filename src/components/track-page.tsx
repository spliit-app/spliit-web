'use client'

import { usePlausible } from 'next-plausible'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

type Event =
  | { event: 'pageview'; props: {} }
  | { event: 'group: create'; props: {} }
  | { event: 'group: update'; props: { groupId: string } }
  | { event: 'expense: create'; props: { groupId: string } }
  | { event: 'expense: update'; props: { groupId: string; expenseId: string } }
  | { event: 'expense: delete'; props: { groupId: string; expenseId: string } }
  | { event: 'group: export expenses'; props: { groupId: string } }

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

export function useAnalytics() {
  const plausible = usePlausible()

  const sendEvent = ({ event, props }: Event, path: string) => {
    const url = `${window.location.origin}${path}`
    if (process.env.NODE_ENV !== 'production')
      console.log('Analytics event:', event, props, url)
    plausible(event, { props, u: url })
  }

  return sendEvent
}

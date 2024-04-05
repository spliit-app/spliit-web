'use client'

import { useAnalytics } from '@/components/track-page'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

export const ExportLink = function ExportLink({
  groupId,
  children,
  className,
}: PropsWithChildren<{ groupId: string; className?: string }>) {
  const sendEvent = useAnalytics()

  return (
    <Link
      className={className}
      href={`/groups/${groupId}/expenses/export/json`}
      target="_blank"
      prefetch={false}
      onClick={() => {
        sendEvent(
          { event: 'group: export expenses', props: { groupId } },
          `/groups/${groupId}/expenses`,
        )
      }}
      title="Export to JSON"
    >
      {children}
    </Link>
  )
}

import { cached } from '@/app/cached-functions'
import { appStore } from '@/lib/app-store'
import { effectiveBaseUrl } from '@/lib/env'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'
import { GroupLayoutClient } from './layout.client'

type Props = {
  params: Promise<{
    groupId: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { groupId } = await params
  const group = await cached.getGroup(groupId)

  return {
    title: {
      default: group?.name ?? '',
      template: `%s · ${group?.name} · Spliit`,
    },
    // The iOS app claims `/groups/*` as Universal Links, so the Smart App
    // Banner hands it this group's URL: tapping “Open” lands on the group
    // rather than on the app's home screen. Repeats `appId` because a child
    // segment replaces the root layout's `itunes` object rather than merging
    // into it.
    itunes: {
      appId: appStore.id,
      appArgument: `${effectiveBaseUrl}/groups/${groupId}`,
    },
  }
}

export default async function GroupLayout({
  children,
  params,
}: PropsWithChildren<Props>) {
  const { groupId } = await params
  return <GroupLayoutClient groupId={groupId}>{children}</GroupLayoutClient>
}

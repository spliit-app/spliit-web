import BalancesAndReimbursements from '@/app/groups/[groupId]/balances/balances-and-reimbursements'
import { TrackPage } from '@/components/track-page'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Balances',
}

export default async function GroupPage({
  params: { groupId },
}: {
  params: { groupId: string }
}) {
  return (
    <>
      <TrackPage path={`/groups/${groupId}/balances`} />
      <BalancesAndReimbursements groupId={groupId} />
    </>
  )
}

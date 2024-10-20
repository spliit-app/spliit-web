import BalancesAndReimbursements from '@/app/groups/[groupId]/balances/balances-and-reimbursements'
import { TrackPage } from '@/components/track-page'
import { Metadata } from 'next'
import { useCurrentGroup } from '../current-group-context'

export const metadata: Metadata = {
  title: 'Balances',
}

export default async function GroupPage() {
  const { groupId } = useCurrentGroup()

  return (
    <>
      <TrackPage path={`/groups/${groupId}/balances`} />
      <BalancesAndReimbursements />
    </>
  )
}

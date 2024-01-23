'use client'

import { Stats, getStatsAction } from '@/app/stats-display-actions'
import { useEffect, useState } from 'react'

export function StatsDisplay() {
  const stats = useStats()

  return (
    <>
      Already{' '}
      <strong>
        {stats ? <AnimatedCounter count={stats?.groupsCount} /> : '…'}
      </strong>{' '}
      groups and <br className="sm:hidden" />
      <strong>
        {stats ? <AnimatedCounter count={stats?.expensesCount} /> : '…'}
      </strong>{' '}
      expenses created.
    </>
  )
}

function useStats() {
  const [stats, setStats] = useState<null | Stats>(null)

  useEffect(() => {
    getStatsAction().then(setStats).catch(console.error)
  }, [])

  return stats
}

export function AnimatedCounter({ count }: { count: number }) {
  const start = count - 10
  const [current, setCurrent] = useState(start)

  useEffect(() => {
    if (current < count) {
      const delay = 200 * (2 - 2 / ((current - start) / (count - start) + 1))
      setTimeout(() => setCurrent((c) => c + 1), delay)
    }
  }, [start, current, count])

  return (
    <span className="tabular-nums">
      {current.toLocaleString('en-US', { useGrouping: true })}
    </span>
  )
}

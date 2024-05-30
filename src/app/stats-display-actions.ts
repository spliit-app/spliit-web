'use server'

import { prisma } from '@/lib/prisma'

export type Stats = {
  groupsCount: number
  expensesCount: number
}

export async function getStatsAction(): Promise<Stats> {
  'use server'
  const groupsCount = await prisma.group.count()
  const expensesCount = await prisma.expense.count()
  return { groupsCount, expensesCount }
}

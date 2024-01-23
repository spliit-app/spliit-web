'use server'

import { getPrisma } from '@/lib/prisma'

export type Stats = {
  groupsCount: number
  expensesCount: number
}

export async function getStatsAction(): Promise<Stats> {
  'use server'
  const prisma = await getPrisma()
  const groupsCount = await prisma.group.count()
  const expensesCount = await prisma.expense.count()
  return { groupsCount, expensesCount }
}

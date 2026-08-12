import { anonymizePath } from './anonymize-path'

describe('anonymizePath', () => {
  const cases: [path: string, expected: string][] = [
    // Group IDs
    ['/groups/gElKwDeZwPuBWR7zj4sr3', '/groups/[groupId]'],
    ['/groups/gElKwDeZwPuBWR7zj4sr3/expenses', '/groups/[groupId]/expenses'],
    ['/groups/52Xv_FFAu5Q1qm_ekbPT8/balances', '/groups/[groupId]/balances'],
    ['/groups/Isf80VvaN2bBbWwSw3OqK/edit', '/groups/[groupId]/edit'],
    ['/groups/9j4Exo1Khb4v8ynK4GPxt/stats', '/groups/[groupId]/stats'],

    // Expense IDs
    [
      '/groups/gElKwDeZwPuBWR7zj4sr3/expenses/cm5xk2p9r000108l3h1a2b3c4/edit',
      '/groups/[groupId]/expenses/[expenseId]/edit',
    ],

    // Static segments in an ID position are kept
    ['/groups/create', '/groups/create'],
    [
      '/groups/gElKwDeZwPuBWR7zj4sr3/expenses/create',
      '/groups/[groupId]/expenses/create',
    ],
    [
      '/groups/gElKwDeZwPuBWR7zj4sr3/expenses/export/csv',
      '/groups/[groupId]/expenses/export/csv',
    ],

    // Query strings and hashes are preserved, and never scanned for IDs
    [
      '/groups/gElKwDeZwPuBWR7zj4sr3/expenses?ref=share',
      '/groups/[groupId]/expenses?ref=share',
    ],
    ['/groups/create?ref=share', '/groups/create?ref=share'],

    // Paths without IDs are untouched
    ['/', '/'],
    ['/groups', '/groups'],
    ['/blog', '/blog'],
    ['/blog/we-need-an-open-source-alternative', '/blog/we-need-an-open-source-alternative'],
  ]

  test.each(cases)('%s → %s', (path, expected) => {
    expect(anonymizePath(path)).toBe(expected)
  })

  it('is idempotent', () => {
    const once = anonymizePath('/groups/gElKwDeZwPuBWR7zj4sr3/expenses')
    expect(anonymizePath(once)).toBe(once)
  })
})

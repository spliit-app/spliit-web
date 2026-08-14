import { getContributors, github } from '@/lib/github'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import { ReactNode } from 'react'

const AVATAR_SIZE = 60

/**
 * Enough faces to show that this is a crowd, few enough that the invitation
 * below them stays on screen. The rest are one click away, and the exact count
 * is spelled out by `RepoStatsLine`.
 */
const MAX_AVATARS = 30

export async function Contributors() {
  const contributors = await getContributors()
  if (!contributors) {
    return <div>Error loading contributors</div>
  }

  const shown = contributors.slice(0, MAX_AVATARS)
  const remaining = contributors.length - shown.length

  return (
    <ul style={{ textWrap: 'balance' } as any}>
      {shown.map((contributor) => (
        <li key={contributor.login} className="inline-block px-1">
          <a href={contributor.profileUrl} target="_blank" rel="nofollow">
            <Image
              src={contributor.avatarUrl}
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              alt={contributor.login}
              className="rounded-full border hover:scale-110 transition-transform"
            />
          </a>
        </li>
      ))}
      {remaining > 0 && (
        <li className="inline-block px-1 align-top">
          <CircleTile
            href={github.contributors}
            title={`${remaining} more contributors`}
            className="border bg-card text-muted-foreground hover:text-primary"
          >
            <span className="text-sm font-medium">+{remaining}</span>
          </CircleTile>
        </li>
      )}
      <li className="inline-block px-1 align-top">
        {/* Closes the row with an empty slot: a list of people who already
            contributed reads as a credit roll, this makes it an invitation. */}
        <CircleTile
          href={github.issues}
          title="Your avatar could be here"
          className="border-2 border-dashed border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-primary"
        >
          <Plus className="w-4 h-4" aria-hidden />
          <span className="text-[10px] font-medium leading-none">you?</span>
        </CircleTile>
      </li>
    </ul>
  )
}

function CircleTile({
  href,
  title,
  className,
  children,
}: {
  href: string
  title: string
  className: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={title}
      className={`flex flex-col items-center justify-center rounded-full hover:scale-110 transition-all ${className}`}
      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
    >
      {children}
    </a>
  )
}

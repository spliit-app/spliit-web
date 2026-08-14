'use client'

import { locales } from '@/i18n/request'
import { useAnalytics } from '@/lib/analytics/context'
import { github } from '@/lib/github'
import { openCollective } from '@/lib/opencollective'
import {
  ArrowRight,
  Code2,
  HeartHandshake,
  Languages,
  LucideIcon,
  Megaphone,
} from 'lucide-react'
import { ReactNode } from 'react'

/**
 * Weblate's “engage” page rather than the project page: it is the one built to
 * onboard a translator who has never used Weblate before.
 */
const WEBLATE_URL = 'https://hosted.weblate.org/engage/spliit/'

type ContributeRoute = {
  id: 'code' | 'translate' | 'fund' | 'share'
  Icon: LucideIcon
  name: string
  description: ReactNode
  action: string
  href: string
}

/**
 * “Contributing” means four unrelated things depending on who is reading, and
 * only one of them involves writing code. Each gets its own entry point rather
 * than a single link to the repository.
 */
const contributeRoutes: ContributeRoute[] = [
  {
    id: 'code',
    Icon: Code2,
    name: 'Write code',
    description:
      'Spliit is a Next.js application, written in TypeScript and styled with Tailwind. Some issues are marked as a good place to start.',
    action: 'Find a first issue',
    href: github.goodFirstIssues,
  },
  {
    id: 'translate',
    Icon: Languages,
    name: 'Translate it',
    description: `Spliit is available in ${locales.length} languages, added and kept up to date by the people who speak them. Fixing a wording takes a minute in your browser, with nothing to install.`,
    action: 'Translate on Weblate',
    href: WEBLATE_URL,
  },
  {
    id: 'fund',
    Icon: HeartHandshake,
    name: 'Fund the servers',
    description:
      'Hosting, the database and receipt scanning are paid for by donations, on a public ledger where anyone can see what comes in and what it pays for.',
    action: 'Contribute on Open Collective',
    href: openCollective.contribute,
  },
  {
    id: 'share',
    Icon: Megaphone,
    name: 'Spread the word',
    description:
      'Most people hear about Spliit from someone they know. Tell a friend the next time you split a bill, or star the repository.',
    action: 'Star it on GitHub',
    href: github.url,
  },
]

export function ContributeRoutes() {
  const sendEvent = useAnalytics()

  return (
    <ul className="mt-8 w-full grid sm:grid-cols-2 gap-2 sm:gap-4 text-left">
      {contributeRoutes.map(({ id, Icon, name, description, action, href }) => (
        <li key={id} className="flex">
          {/* The whole card is the link: the action label alone would be a
              needlessly small target on a phone. */}
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              sendEvent({ event: 'contribute: click', props: { route: id } })
            }
            className="group bg-card border rounded-md p-4 flex flex-col gap-2 w-full hover:border-primary hover:shadow-sm transition-all"
          >
            <Icon className="w-8 h-8" aria-hidden />
            <strong>{name}</strong>
            <span
              className="text-sm text-muted-foreground"
              style={{ textWrap: 'balance' } as any}
            >
              {description}
            </span>
            <span className="mt-auto pt-2 text-sm font-medium text-primary flex items-center gap-1">
              {action}
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                aria-hidden
              />
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

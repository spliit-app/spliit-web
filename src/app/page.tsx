import { Contributors } from '@/app/contributors'
import { StatsDisplay } from '@/app/stats-display'
import { TrackPage } from '@/components/track-page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BarChartHorizontalBig,
  CircleDollarSign,
  Divide,
  FileImage,
  FolderTree,
  Github,
  List,
  LucideIcon,
  ShieldX,
  Users,
  Wand2,
} from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

// FIX for https://github.com/vercel/next.js/issues/58615
// export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <main>
      <TrackPage path="/" />
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container flex max-w-screen-md flex-col items-center gap-4 text-center">
          <h1 className="!leading-none font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl landing-header py-2">
            Share <strong>Expenses</strong> <br /> with <strong>Friends</strong>{' '}
            & <strong>Family</strong>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            No ads. No account. <br className="sm:hidden" /> Open Source.
            Forever Free.
          </p>
          <div className="flex gap-2">
            <Button asChild size="lg">
              <Link href="/groups/create">Create a group</Link>
            </Button>
            <Button variant="secondary" asChild size="lg">
              <Link href="/blog">Read our blog</Link>
            </Button>
          </div>
          <p className="mt-12 max-w-[42rem] leading-normal text-muted-foreground text-xl sm:text-2xl sm:leading-8">
            <StatsDisplay />
          </p>
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-card py-16 md:py-24 lg:py-32">
        <div className="p-4 flex mx-auto max-w-screen-md flex-col items-center text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p
            className="mt-2 md:mt-3 leading-normal text-muted-foreground sm:text-lg sm:leading-7"
            style={{ textWrap: 'balance' } as any}
          >
            Spliit is a minimalist application to track and share expenses with
            your friends and family.
          </p>
          <div className="mt-8 md:mt-6 w-full grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 text-left">
            <Feature
              Icon={Users}
              name="Groups"
              description="Create a group for a travel, an event, a gift…"
            />
            <Feature
              Icon={List}
              name="Expenses"
              description="Create and list expenses in your group."
            />
            <Feature
              Icon={FolderTree}
              name="Categories"
              description="Assign categories to your expenses."
            />
            <Feature
              Icon={FileImage}
              name="Receipts"
              description="Attach receipt images to expenses."
            />
            <Feature
              Icon={Wand2}
              name="AI Scan"
              description="Scan receipts to create expenses faster."
              beta
            />
            <Feature
              Icon={Divide}
              name="Advanced split"
              description="Split expenses by percentage, shares or amount."
            />
            <Feature
              Icon={BarChartHorizontalBig}
              name="Balances"
              description="Visualize how much each participant spent."
            />
            <Feature
              Icon={CircleDollarSign}
              name="Reimbursements"
              description="Optimize money transfers between participants."
            />
            <Feature
              Icon={ShieldX}
              name="No ads"
              description="No account. No limitation. No problem."
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <div className="container flex max-w-screen-md flex-col items-center text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Proudly Open Source
          </h2>
          <p
            className="mt-2 leading-normal text-muted-foreground sm:text-lg sm:leading-7"
            style={{ textWrap: 'balance' } as any}
          >
            Spliit is open source and lives thanks to amazing{' '}
            <a
              className="underline"
              target="_blank"
              href="https://github.com/spliit-app/spliit/graphs/contributors"
            >
              contributors
            </a>
            !
          </p>
          <div className="mt-6">
            <Contributors />
          </div>
          <div className="mt-4 md:mt-6">
            <Button asChild variant="secondary" size="lg">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/spliit-app/spliit"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

function Feature({
  name,
  Icon,
  description,
  beta = false,
}: {
  name: ReactNode
  Icon: LucideIcon
  description: ReactNode
  beta?: boolean
}) {
  return (
    <div className="bg-card border rounded-md p-4 flex flex-col gap-2 relative">
      {beta && (
        <Badge className="absolute top-4 right-4 bg-pink-700 hover:bg-pink-600 dark:bg-pink-500 dark:hover:bg-pink-600">
          Beta
        </Badge>
      )}
      <Icon className="w-8 h-8" />
      <div>
        <strong>{name}</strong>
      </div>
      <div
        className="text-sm text-muted-foreground"
        style={{ textWrap: 'balance' } as any}
      >
        {description}
      </div>
    </div>
  )
}

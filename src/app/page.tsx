import { Contributors } from '@/app/contributors'
import { StatsDisplay } from '@/app/stats-display'
import { FeedbackModal } from '@/components/feedback-button/feedback-button'
import { TrackPage } from '@/components/track-page'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'
import {
  BarChartHorizontalBig,
  Calendar,
  CircleDollarSign,
  Divide,
  FileImage,
  FolderTree,
  Github,
  LucideIcon,
  ShieldX,
  Users,
  Wand2,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ReactNode, Suspense } from 'react'

// FIX for https://github.com/vercel/next.js/issues/58615
// export const dynamic = 'force-dynamic'

export default function HomePage() {
  const t = useTranslations()
  return (
    <main>
      <TrackPage path="/" />
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container flex max-w-screen-md flex-col items-center gap-4 text-center">
          <h1 className="!leading-none font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl landing-header py-2 text-balance">
            {t.rich('Homepage.title', {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
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
              Icon={Calendar}
              name="Recurring Expenses"
              description="Create daily, weekly, and monthly recurring expenses."
              beta
            />
            <Feature
              Icon={Users}
              name="Groups"
              description="Create a group for a travel, an event, a gift… and add expenses to it."
            />
            {/* <Feature
              Icon={List}
              name="Expenses"
              description="Create and list expenses in your group."
            /> */}
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
            <Suspense fallback={<div>Loading...</div>}>
              <Contributors />
            </Suspense>
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

      <section className="bg-slate-50 dark:bg-card py-16 md:py-24 lg:py-32">
        <div className="p-4 flex mx-auto max-w-screen-md flex-col items-center text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Frequently Asked Questions
          </h2>
          <div className="text-left px-4 flex flex-col gap-4 max-w-screen-md mx-auto w-full mt-8">
            <Accordion type="multiple">
              <Answer
                id="free-to-use"
                question={
                  <>
                    Is <strong>Spliit</strong> free to use?
                  </>
                }
              >
                Yes, you can use Spliit for free, without any limitation! Note
                that in the future, we might add premium features, but we’ll
                never put essential features behind a paywall.
              </Answer>
              <Answer
                id="differences"
                question={
                  <>
                    What differentiates <strong>Spliit</strong> from other
                    similar services?
                  </>
                }
              >
                Spliit is more minimalist than Splitwise or Tricount, and you
                don’t need to create any user account to use it, nor will you
                see any ads. It offers similar features, but we’re still working
                on some of them. Have a look at{' '}
                <a
                  target="_blank"
                  href="https://github.com/spliit-app/spliit/issues"
                >
                  issues on GitHub
                </a>{' '}
                to have an idea of what our contributors are working on!
              </Answer>
              <Answer id="data" question={<>How is my data stored?</>}>
                All the data you enter on Spliit (groups, expenses…) is stored
                in a PostgreSQL database hosted by{' '}
                <a target="_blank" href="https://vercel.com">
                  Vercel
                </a>{' '}
                (same as the web application itself). For now, the data is not
                encrypted, but we’re trying to find the best way to add
                encryption without impacting the user experience too much (see{' '}
                <a
                  target="_blank"
                  href="https://github.com/spliit-app/spliit/issues/34"
                >
                  this issue on GitHub
                </a>
                ).
              </Answer>
              <Answer
                id="feedback"
                question={
                  <>
                    What is the best way to give feedback or suggest a feature?
                  </>
                }
              >
                You can give us feedback by using{' '}
                <FeedbackModal donationUrl={env.STRIPE_DONATION_LINK}>
                  <Button variant="link" className="text-base -mx-4 -my-4">
                    our feedback form
                  </Button>
                </FeedbackModal>
                . We’ll receive it by email and will keep you update, if you
                want to provide your email. But even better, if you know GitHub
                and have an account, you can report issues or suggest a feature
                by{' '}
                <a
                  target="_blank"
                  href="https://github.com/spliit-app/spliit/issues"
                >
                  creating an issue
                </a>{' '}
                there. This way, all our contributors will see it and will be
                able to give their insight.
              </Answer>
              <Answer
                id="contribute"
                question={<>I use Spliit and like it. How can I contribute?</>}
              >
                <p>You can contribute to Spliit by several ways.</p>
                <ul>
                  <li>
                    You can share it with your community on social media to let
                    them know about us,
                  </li>
                  <li>
                    You can{' '}
                    <FeedbackModal
                      donationUrl={env.STRIPE_DONATION_LINK}
                      defaultTab="support"
                    >
                      <Button
                        variant="link"
                        className="text-base text-pink-600 -mx-4 -my-4"
                      >
                        support our hosting costs
                      </Button>
                    </FeedbackModal>{' '}
                    by sponsoring us or donating a small amount,
                  </li>
                  <li>
                    If you’re a developer, you can implement new features or
                    improve the user experience! Go to{' '}
                    <a
                      target="_blank"
                      href="https://github.com/spliit-app/spliit"
                    >
                      our GitHub repository
                    </a>{' '}
                    to know more about the project.
                  </li>
                </ul>
              </Answer>
            </Accordion>
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

function Answer({
  id,
  question,
  children,
}: {
  id: string
  question: ReactNode
  children: ReactNode
}) {
  return (
    <AccordionItem value={id}>
      <AccordionTrigger className="text-left text-lg">
        <span>{question}</span>
      </AccordionTrigger>
      <AccordionContent className="prose dark:prose-invert">
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}

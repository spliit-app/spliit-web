import { AppStoreButton } from '@/components/app-store-button'
import { PhoneMockup } from '@/components/phone-mockup'
import { Button } from '@/components/ui/button'
import { TrackPage } from '@/lib/analytics/track-page'
import { appStore } from '@/lib/app-store'
import { github } from '@/lib/github'
import { openCollective } from '@/lib/opencollective'
// lucide-react v1 dropped its brand icons, so the GitHub mark comes from Radix.
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import {
  Accessibility,
  CircleDollarSign,
  Cloud,
  Link2,
  LucideIcon,
  Mic,
  QrCode,
  ScanLine,
  Server,
  ShieldX,
} from 'lucide-react'
import { Metadata } from 'next'
import { StaticImageData } from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import groupsShot from '../../../public/ios/01-groups.png'
import expensesShot from '../../../public/ios/02-expenses.png'
import splitShot from '../../../public/ios/03-split.png'
import balancesShot from '../../../public/ios/04-balances.png'
import totalsShot from '../../../public/ios/05-totals.png'

const title = 'Spliit for iPhone'
const description =
  'Split expenses with friends from your iPhone. Scan receipts on the device, see who owes whom, and settle up — free, open source, and with no account to create.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/ios' },
  openGraph: {
    title: `${title} · Spliit`,
    description,
    type: 'website',
    url: '/ios',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} · Spliit`,
    description,
  },
}

export default function IosPage() {
  return (
    <main>
      <TrackPage path="/ios" />

      <section className="py-16 md:py-24">
        <div className="container max-w-screen-lg grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col items-center lg:items-start gap-4 text-center lg:text-left">
            <h1 className="!leading-none font-bold text-3xl sm:text-4xl lg:text-5xl landing-header py-2 text-balance">
              Split expenses <strong>from your iPhone</strong>
            </h1>
            <p className="max-w-[36rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Spliit for iOS is the whole app, rewritten in SwiftUI. Create a
              group, add what you spent, and everyone holding the link sees the
              same expenses and the same balances — on the phone, on the web, or
              both.
            </p>
            <div className="mt-2 flex flex-col sm:flex-row items-center gap-4">
              <AppStoreButton placement="hero" />
              <Button variant="link" asChild className="text-base">
                <Link href="/groups/create">Or start in your browser</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Free, with no ads and nothing to sign in to. Requires{' '}
              {appStore.minimumOsVersion} or later — older iPhones are offered
              the last version that runs on them.
            </p>
          </div>
          <PhoneMockup
            image={groupsShot}
            alt="The Spliit home screen on iPhone, listing starred, recent and archived groups"
            sizes="(min-width: 1024px) 15rem, 60vw"
            className="max-w-[15rem]"
            priority
          />
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-card py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="container max-w-screen-lg flex flex-col items-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl text-center">
            A whole trip, settled
          </h2>
          <p
            className="mt-2 md:mt-3 max-w-[42rem] text-center leading-normal text-muted-foreground sm:text-lg sm:leading-7"
            style={{ textWrap: 'balance' } as any}
          >
            From the first dinner someone paid for to the last transfer that
            evens it out.
          </p>
          {/* One screen at a time on a phone, the whole sequence at once on a
              desktop. Scroll snapping rather than a carousel, so the section
              costs no JavaScript. */}
          <div className="mt-10 w-full flex gap-6 overflow-x-auto snap-x snap-mandatory px-8 -mx-8 pb-4 lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:mx-0 lg:px-0 lg:pb-0">
            <Screen
              image={expensesShot}
              caption="Add what you spent, in seconds"
              description="Every expense with its payer, its date and its category — and a camera that reads the receipt for you."
            />
            <Screen
              image={splitShot}
              caption="Split it the way it happened"
              description="Evenly, by shares, by percentage, or by the exact amounts each person actually owes."
            />
            <Screen
              image={balancesShot}
              caption="Know exactly who owes whom"
              description="Who is up, who is down, and the fewest payments that settle the group. Mark one paid in a tap."
            />
            <Screen
              image={totalsShot}
              caption="See what it really cost"
              description="What the group spent, how much of it is yours, and where the money actually went."
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <div className="container max-w-screen-md flex flex-col items-center text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Built for iOS
          </h2>
          <p
            className="mt-2 md:mt-3 leading-normal text-muted-foreground sm:text-lg sm:leading-7"
            style={{ textWrap: 'balance' } as any}
          >
            Not a website in a wrapper — the system’s own navigation, typography
            and materials, and the parts of the phone a website cannot reach.
          </p>
          <div className="mt-8 md:mt-6 w-full grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 text-left">
            <Feature
              Icon={ScanLine}
              name="Scan a receipt"
              description="Point the camera at it and the expense fills itself in — read on the device, not on a server."
            />
            <Feature
              Icon={Cloud}
              name="Groups in iCloud"
              description="A new phone opens on the same list as the old one. Nothing to export, nothing to set up again."
            />
            <Feature
              Icon={QrCode}
              name="Join by QR code"
              description="Hold up a group’s code to join it, and show yours from the group’s information tab."
            />
            <Feature
              Icon={Mic}
              name="Siri and Spotlight"
              description="Ask Siri to open a group or start an expense in one, and find your groups from Spotlight."
            />
            <Feature
              Icon={Link2}
              name="Links open the app"
              description="A shared spliit.app group link opens the group on the phone instead of the browser."
            />
            <Feature
              Icon={Server}
              name="Your own server"
              description="Groups on spliit.app and on an instance you host yourself, side by side in one list."
            />
            <Feature
              Icon={CircleDollarSign}
              name="Every currency"
              description="Each counted the way it is actually counted — yen has no decimals, dinars have three."
            />
            <Feature
              Icon={Accessibility}
              name="Dark Mode and VoiceOver"
              description="Dynamic Type at every size, and every screen usable without looking at it."
            />
            <Feature
              Icon={ShieldX}
              name="No account"
              description="No sign-up, no subscription, no trial. A group is reachable by its link and nothing else."
            />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-card py-16 md:py-24 lg:py-32">
        <div className="container max-w-screen-md flex flex-col items-center text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Read on your phone, not on a server
          </h2>
          <div
            className="mt-4 flex flex-col gap-4 leading-normal text-muted-foreground sm:text-lg sm:leading-7"
            style={{ textWrap: 'balance' } as any}
          >
            <p>
              When you scan a receipt, the picture is read on your iPhone: the
              text recognition and the model that makes sense of it both run on
              the device, and the image is never sent anywhere to be read. If
              you do not attach it to the expense, it is never uploaded at all.
            </p>
            <p>
              There are no accounts either, so there is no identity to attach
              any of it to: no profile building up in the background, and
              nothing that joins your groups to each other or to you.
            </p>
          </div>
          <div className="mt-6">
            <Button asChild variant="secondary" size="lg">
              <Link href="/privacy-policy">Read the privacy policy</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <div className="container max-w-screen-md flex flex-col items-center text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl text-balance">
            Open source, the app included
          </h2>
          <div
            className="mt-4 flex flex-col gap-4 leading-normal text-muted-foreground sm:text-lg sm:leading-7"
            style={{ textWrap: 'balance' } as any}
          >
            <p>
              Spliit has been open source since its first commit, and the iOS
              app is no exception. The SwiftUI behind every screen above is a
              repository you can read, build and run yourself.
            </p>
            <p>
              It talks to spliit.app out of the box, but a group can just as
              well live on an instance you host — both kinds sit side by side in
              the same list, and nothing about the ones on your server reaches
              ours.
            </p>
            <p>
              There is nothing to buy and no advertising. What the public
              instance costs to run is paid for by donations, on a ledger anyone
              can read.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button asChild variant="secondary" size="lg">
              <a target="_blank" rel="noreferrer" href={github.ios}>
                <GitHubLogoIcon className="w-4 h-4 mr-2" />
                The app on GitHub
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a
                target="_blank"
                rel="noreferrer"
                href={openCollective.contribute}
              >
                Support the project
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/*
        Slate rather than the default background: the sections alternate down
        the page, and the open source one above took the slot this used to
        hold.
      */}
      <section className="bg-slate-50 dark:bg-card py-16 md:py-24 lg:py-32">
        <div className="container max-w-screen-md flex flex-col items-center text-center gap-6">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Get the app
          </h2>
          <p
            className="leading-normal text-muted-foreground sm:text-lg sm:leading-7"
            style={{ textWrap: 'balance' } as any}
          >
            Free, forever, and free of ads. They are the same groups either way:
            open one you already use on the web by its link, and it is there.
          </p>
          <AppStoreButton placement="footer" />
        </div>
      </section>
    </main>
  )
}

function Screen({
  image,
  caption,
  description,
}: {
  image: StaticImageData
  caption: string
  description: ReactNode
}) {
  return (
    <div className="snap-center shrink-0 basis-[70%] sm:basis-[45%] lg:basis-auto lg:shrink flex flex-col items-center gap-4">
      {/* The caption names the screen, so the picture beside it is decorative. */}
      <PhoneMockup
        image={image}
        alt=""
        sizes="(min-width: 1024px) 13rem, 60vw"
        className="max-w-[13rem]"
      />
      <div className="text-center">
        <strong className="block text-balance">{caption}</strong>
        <p className="mt-1 text-sm text-muted-foreground text-balance">
          {description}
        </p>
      </div>
    </div>
  )
}

function Feature({
  name,
  Icon,
  description,
}: {
  name: ReactNode
  Icon: LucideIcon
  description: ReactNode
}) {
  return (
    <div className="bg-card border rounded-md p-4 flex flex-col gap-2">
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

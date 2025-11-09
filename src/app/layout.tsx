import { ApplePwaSplash } from '@/app/apple-pwa-splash'
import { getBlogIndexWithPosts } from '@/app/blog/[slug]/helpers'
import { FeedbackModal } from '@/components/feedback-button/feedback-button'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { NewsButton } from '@/components/news-button'
import { ProgressBar } from '@/components/progress-bar'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'
import { env } from '@/lib/env'
import { TRPCProvider } from '@/trpc/client'
import { HeartFilledIcon } from '@radix-ui/react-icons'
import type { Metadata, Viewport } from 'next'
import { AxiomWebVitals } from 'next-axiom'
import { NextIntlClientProvider, useTranslations } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import PlausibleProvider from 'next-plausible'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  title: {
    default: 'Spliit · Share Expenses with Friends & Family',
    template: '%s · Spliit',
  },
  description:
    'Spliit is a minimalist web application to share expenses with friends and family. No ads, no account, no problem.',
  openGraph: {
    title: 'Spliit · Share Expenses with Friends & Family',
    description:
      'Spliit is a minimalist web application to share expenses with friends and family. No ads, no account, no problem.',
    images: `/banner.png`,
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@scastiel',
    site: '@scastiel',
    images: `/banner.png`,
    title: 'Spliit · Share Expenses with Friends & Family',
    description:
      'Spliit is a minimalist web application to share expenses with friends and family. No ads, no account, no problem.',
  },
  appleWebApp: {
    capable: true,
    title: 'Spliit',
  },
  applicationName: 'Spliit',
  icons: [
    {
      url: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      url: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
}

export const viewport: Viewport = {
  themeColor: '#047857',
}

function Content({ children }: { children: React.ReactNode }) {
  const t = useTranslations()
  return (
    <TRPCProvider>
      <header className="fixed top-0 left-0 right-0 h-16 flex justify-between bg-white dark:bg-gray-950 bg-opacity-50 dark:bg-opacity-50 p-2 border-b backdrop-blur-sm z-50">
        <Link
          className="flex items-center gap-2 hover:scale-105 transition-transform"
          href="/"
        >
          <h1>
            <Image
              src="/logo-with-text.png"
              className="m-1 h-auto w-auto"
              width={(35 * 522) / 180}
              height={35}
              alt="Spliit"
            />
          </h1>
        </Link>
        <div role="navigation" aria-label="Menu" className="flex">
          <ul className="flex items-center text-sm">
            <li>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="-my-3 text-primary"
              >
                <Link href="/groups">{t('Header.groups')}</Link>
              </Button>
            </li>
            <li>
              <NewsButton />
            </li>
            <li>
              <LocaleSwitcher />
            </li>
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </header>

      <div className="pt-16 flex-1 flex flex-col">{children}</div>

      <footer className="sm:p-8 md:p-16 sm:mt-16 sm:text-sm md:text-base md:mt-32 bg-slate-50 dark:bg-card border-t p-6 mt-8 grid sm:grid-cols-2 gap-4 text-xs [&_a]:underline">
        <div className="flex flex-col space-y-2">
          <div className="sm:text-lg font-semibold text-base flex space-x-2 items-center">
            <Link className="flex items-center gap-2" href="/">
              <Image
                src="/logo-with-text.png"
                className="m-1 h-auto w-auto"
                width={(35 * 522) / 180}
                height={35}
                alt="Spliit"
              />
            </Link>
          </div>
          <div className="flex flex-col space-y a--no-underline-text-white">
            <span>{t('Footer.madeIn')}</span>
            <span>
              {t.rich('Footer.builtBy', {
                author: (txt) => (
                  <a href="https://scastiel.dev" target="_blank" rel="noopener">
                    {txt}
                  </a>
                ),
                source: (txt) => (
                  <a
                    href="https://github.com/spliit-app/spliit/graphs/contributors"
                    target="_blank"
                    rel="noopener"
                  >
                    {txt}
                  </a>
                ),
              })}
            </span>
            <span>
              <ul className="[&_a]:no-underline [&_a]:px-1 flex -ml-1">
                <li>
                  <Button variant="link" size="sm" asChild>
                    <Link
                      target="_blank"
                      href="https://linkedin.com/company/101119877"
                    >
                      LinkedIn
                    </Link>
                  </Button>
                </li>
                <li>
                  <Button variant="link" size="sm" asChild>
                    <Link target="_blank" href="https://github.com/spliit-app">
                      GitHub
                    </Link>
                  </Button>
                </li>
                <li>
                  <Button variant="link" size="sm" asChild>
                    <Link
                      target="_blank"
                      href="https://www.reddit.com/r/spliit/"
                    >
                      Reddit
                    </Link>
                  </Button>
                </li>
                <li>
                  <Button variant="link" size="sm" asChild>
                    <Link
                      target="_blank"
                      href="https://www.indiehackers.com/product/spliit"
                    >
                      IndieHackers
                    </Link>
                  </Button>
                </li>
              </ul>
            </span>
            <span>
              <FeedbackModal
                donationUrl={env.STRIPE_DONATION_LINK}
                defaultTab="support"
              >
                <Button variant="link" className="text-pink-600 -mx-4">
                  <HeartFilledIcon className="w-4 h-4 mr-2" />
                  {t('Support.buttonLabel')}
                </Button>
              </FeedbackModal>
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-[small] font-semibold mb-1">On our blog</h3>
          <Suspense fallback={<div>Loading…</div>}>
            <BlogPostsList />
          </Suspense>
          <ul className="flex space-x-2 [&_a]:no-underline mt-2">
            <Button size="sm" variant="secondary" asChild>
              <a href="/blog/feed/rss.xml">RSS</a>
            </Button>
            <Button size="sm" variant="secondary" asChild>
              <a href="/blog/feed/feed.xml">Atom</a>
            </Button>
            <Button size="sm" variant="secondary" asChild>
              <a href="/blog/feed/feed.json">JSON</a>
            </Button>
          </ul>
        </div>
      </footer>
      <Toaster />
    </TRPCProvider>
  )
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()
  return (
    <html lang={locale} suppressHydrationWarning>
      {env.PLAUSIBLE_DOMAIN && (
        <PlausibleProvider
          domain={env.PLAUSIBLE_DOMAIN}
          trackOutboundLinks
          manualPageviews
        />
      )}
      <AxiomWebVitals />
      <ApplePwaSplash icon="/logo-with-text.png" color="#027756" />
      <body className="min-h-[100dvh] flex flex-col items-stretch bg-slate-50 bg-opacity-30 dark:bg-background">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense>
              <ProgressBar />
            </Suspense>
            <Content>{children}</Content>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

async function BlogPostsList() {
  const blogIndex = await getBlogIndexWithPosts()
  return (
    <ul>
      {blogIndex.blogPosts.items.map((post) => (
        <li key={post._id}>
          <Button variant="link" asChild size="sm" className="-ml-3 h-7">
            <Link
              href={`/blog/${post._slug}`}
              className="!text-foreground font-normal"
            >
              {post._title}
            </Link>
          </Button>
        </li>
      ))}
      <li>
        <Button variant="link" asChild size="sm" className="-ml-3 h-7">
          <Link href={`/blog`} className="!text-foreground font-normal italic">
            See more…
          </Link>
        </Button>
      </li>
    </ul>
  )
}

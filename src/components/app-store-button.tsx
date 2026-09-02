'use client'

import { useAnalytics } from '@/lib/analytics/context'
import { appStore } from '@/lib/app-store'
import { cn } from '@/lib/utils'

/**
 * Apple's own mark. Drawn here rather than loaded, because the badge has to
 * follow the surrounding type size and a bitmap would not.
 */
function AppleLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 814 1000"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  )
}

type Props = {
  /**
   * Which of the two badges on the page was clicked. The hero one is seen by
   * everybody; the closing one only by people who read to the end, and telling
   * them apart is the only way to know whether the page below the fold earns
   * its place.
   */
  placement: 'hero' | 'footer'
  className?: string
}

/**
 * The App Store badge, kept as close to Apple's artwork as HTML gets: black
 * pill, the mark, and the two lines of type it prescribes. In dark mode it
 * stays black — Apple's badge always is — with a hairline so it does not
 * dissolve into the background.
 */
export function AppStoreButton({ placement, className }: Props) {
  const sendEvent = useAnalytics()
  return (
    <a
      href={appStore.url}
      target="_blank"
      rel="noreferrer"
      onClick={() =>
        sendEvent({ event: 'ios: download', props: { placement } })
      }
      className={cn(
        'inline-flex items-center gap-3 rounded-xl bg-black px-5 py-2.5 text-white no-underline',
        'border border-transparent dark:border-white/25',
        'transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      <AppleLogo className="w-7 h-auto" />
      <span className="flex flex-col text-left leading-none">
        <span className="text-[0.6875rem] tracking-wide">Download on the</span>
        <span className="text-xl font-medium mt-1">App Store</span>
      </span>
    </a>
  )
}

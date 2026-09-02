import { cn } from '@/lib/utils'
import Image, { StaticImageData } from 'next/image'
import './phone-mockup.css'

/**
 * A screenshot in an iPhone. The App Store captures are the screen and nothing
 * else — no hardware, and a gap left in the status bar where the Dynamic
 * Island belongs — so the phone around them is drawn in CSS. See
 * `phone-mockup.css` for where its proportions come from.
 *
 * It sizes itself to whatever width it is given, so callers set that with
 * `className` and nothing else needs to change — but that width has to come
 * from the outside. `container-type: inline-size` stops the contents from
 * sizing the container, so dropped into an `auto` grid track or a shrink-to-fit
 * box it collapses to nothing, taking every `cqw` dimension with it. Give it a
 * definite track (`grid-cols-[1fr_12rem]`) rather than `auto`.
 */
export function PhoneMockup({
  image,
  alt,
  priority = false,
  sizes,
  className,
}: {
  image: StaticImageData
  alt: string
  priority?: boolean
  sizes?: string
  className?: string
}) {
  return (
    <div className={cn('device-frame mx-auto w-full', className)}>
      <div className="device">
        <span aria-hidden className="device-button device-button-action" />
        <span aria-hidden className="device-button device-button-volume-up" />
        <span aria-hidden className="device-button device-button-volume-down" />
        <span aria-hidden className="device-button device-button-power" />
        <div className="device-casing">
          <div className="device-screen">
            <Image src={image} alt={alt} priority={priority} sizes={sizes} />
            <span aria-hidden className="device-island" />
          </div>
        </div>
      </div>
    </div>
  )
}

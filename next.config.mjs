import { withAxiom } from 'next-axiom'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/**
 * Undefined entries are not supported. Push optional patterns to this array only if defined.
 * @type {import('next/dist/shared/lib/image-config').RemotePattern}
 */
const remotePatterns = [
  { hostname: 'avatars.githubusercontent.com' },
  { hostname: 'basehub.earth' },
  { hostname: 'assets.basehub.com' },
]

// S3 Storage
if (process.env.S3_UPLOAD_ENDPOINT) {
  // custom endpoint for providers other than AWS
  const url = new URL(process.env.S3_UPLOAD_ENDPOINT)
  remotePatterns.push({
    hostname: url.hostname,
  })
} else if (process.env.S3_UPLOAD_BUCKET && process.env.S3_UPLOAD_REGION) {
  // default provider
  remotePatterns.push({
    hostname: `${process.env.S3_UPLOAD_BUCKET}.s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com`,
  })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns,
  },
  // Required to run in a codespace (see https://github.com/vercel/next.js/issues/58019)
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  /**
   * Serves Plausible from our own origin, so that ad blockers do not drop it.
   * These replace `withPlausibleProxy()` from next-plausible and produce the
   * same two URLs it did; `PLAUSIBLE_SCRIPT_URL` and `PLAUSIBLE_API_URL` point
   * the analytics provider at them.
   */
  async rewrites() {
    return [
      {
        source: '/js/script.manual.js',
        destination: 'https://plausible.io/js/script.manual.js',
      },
      {
        source: '/proxy/api/event',
        destination: 'https://plausible.io/api/event',
      },
    ]
  },
}

export default withAxiom(withNextIntl(nextConfig))

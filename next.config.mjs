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
  // Emit a self-contained server into .next/standalone, containing only the
  // files Next.js traced as actually reachable at runtime. The Docker runtime
  // stage copies that instead of a full production `node_modules`.
  //
  // Everywhere except Vercel, which packages the app itself: there Next.js
  // hands the build to Vercel's adapter (`Running onBuildComplete from
  // Vercel`), and the standalone step runs right afterwards and reads
  // `.next/next-server.js.nft.json` with no error handling. That file is gone
  // by the time it looks, so the deployment dies on
  // `ENOENT ... .next/next-server.js.nft.json` after an otherwise successful
  // build. Vercel serves the adapter's output and never reads
  // .next/standalone, so there is nothing to lose by not emitting it.
  output: process.env.VERCEL ? undefined : 'standalone',
  images: {
    remotePatterns,
  },
  reactCompiler: true,
  // Required to run in a codespace (see https://github.com/vercel/next.js/issues/58019)
  experimental: {
    serverActions: {
      // localhost:3000 covers local dev and same-host container access; the
      // configured base URL covers a deployment reached under its own domain,
      // whose server actions would otherwise be rejected as cross-origin.
      // An unparseable value is ignored here rather than thrown: this file is
      // evaluated before the env schema runs, and its `Invalid URL` is far less
      // useful than the validation error the schema is about to produce.
      allowedOrigins: (() => {
        const base = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL
        try {
          return ['localhost:3000', ...(base ? [new URL(base).host] : [])]
        } catch {
          return ['localhost:3000']
        }
      })(),
    },
  },
  /**
   * Serves Plausible from our own origin, so that ad blockers do not drop it.
   * These replace `withPlausibleProxy()`, which came with next-plausible, and
   * produce the same two URLs it did. `PLAUSIBLE_SCRIPT_URL` and
   * `PLAUSIBLE_API_URL` point the analytics provider at them.
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
  async headers() {
    return [
      {
        /**
         * The Apple App Site Association file has no extension, so the static
         * handler falls back to `application/octet-stream` and iOS discards it
         * without a word. Universal Links only work when it arrives as JSON.
         */
        source: '/.well-known/apple-app-site-association',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
    ]
  },
  async redirects() {
    return [
      // `/privacy` is the address the iOS app's documentation hands out; the
      // page itself has lived at `/privacy-policy` since the first listing.
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
    ]
  },
}

export default withAxiom(withNextIntl(nextConfig))

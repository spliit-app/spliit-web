import { getPosts } from '@/app/blog/[slug]/helpers'
import { effectiveBaseUrl } from '@/lib/env'
import { MetadataRoute } from 'next'

// Rendered per request, for the same reason as robots.ts.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts()
  return [
    {
      url: effectiveBaseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${effectiveBaseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${effectiveBaseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    ...posts.map(
      (post) =>
        ({
          url: `${effectiveBaseUrl}/blog/${post._slug}`,
          lastModified: new Date(post._sys.lastModifiedAt),
          changeFrequency: 'yearly',
          priority: 1,
        }) as const,
    ),
  ]
}

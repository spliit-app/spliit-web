import { getPosts } from '@/app/blog/[slug]/helpers'
import { env } from '@/lib/env'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts()
  return [
    {
      url: env.NEXT_PUBLIC_BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${env.NEXT_PUBLIC_BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${env.NEXT_PUBLIC_BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    ...posts.map(
      (post) =>
        ({
          url: `${env.NEXT_PUBLIC_BASE_URL}/blog/${post._slug}`,
          lastModified: new Date(post._sys.lastModifiedAt),
          changeFrequency: 'yearly',
          priority: 1,
        }) as const,
    ),
  ]
}

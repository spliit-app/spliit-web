import { getBlogIndexWithPosts } from '@/app/blog/[slug]/helpers'
import { Feed } from 'feed'
import { notFound } from 'next/navigation'
import { ParsedUrlQuery } from 'querystring'

export const dynamicParams = false

export async function generateStaticParams() {
  return ['rss.xml', 'feed.xml', 'feed.json'].map((type) => ({ type }))
}

export async function GET(
  req: Request,
  context: { params: Promise<ParsedUrlQuery> },
) {
  const type = (await context.params).type
  const url = new URL(req.url)
  const feed = await getFeed(url.origin as string)

  switch (type) {
    case 'rss.xml':
      return new Response(feed.rss2(), {
        headers: { 'Content-type': 'application/xml' },
      })
    case 'feed.xml':
      return new Response(feed.atom1(), {
        headers: { 'Content-type': 'application/xml' },
      })
    case 'feed.json':
      return new Response(feed.json1(), {
        headers: { 'Content-type': 'application/json' },
      })
  }

  notFound()
}

async function getFeed(baseUrl: string) {
  const blogIndex = await getBlogIndexWithPosts()

  const feed = new Feed({
    title: blogIndex.title ?? '',
    description: blogIndex.subtitle?.plainText ?? '',
    id: baseUrl,
    link: baseUrl,
    image: `${baseUrl}/logo-512x512-maskable.png`,
    favicon: `${baseUrl}/logo-512x512-maskable.png`,
    copyright: `Creative Commons BY-NC-SA`,
    updated: new Date(),
    generator: 'Feed for Node.js',
    feedLinks: {
      rss2: `${baseUrl}/feed/rss.xml`,
      atom: `${baseUrl}/feed/feed.xml`,
      json: `${baseUrl}/feed/feed.json`,
    },
    author: {
      name: 'Sebastien Castiel',
      link: `${baseUrl}/blog`,
    },
  })

  for (const post of blogIndex.blogPosts.items) {
    const url = `${baseUrl}/blog/${post._slug}`
    feed.addItem({
      title: post._title,
      id: url,
      link: url,
      description: post.subtitle ?? '',
      content: post.subtitle ?? '',
      date: new Date(post.date?.split('T')[0] + 'T12:00:00.000Z'),
    })
  }

  return feed
}

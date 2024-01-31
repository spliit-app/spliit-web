import { formatDate } from '@/app/blog/[slug]/helpers'
import { Button } from '@/components/ui/button'
import { basehub, enumBlogPostsItemOrderByEnum } from 'basehub'
import { RichText } from 'basehub/react'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 60
export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const { blogIndex } = await basehub().query({
    blogIndex: { title: true, subtitle: { plainText: true } },
  })

  return {
    title: {
      absolute: `${blogIndex.title} · ${blogIndex.subtitle?.plainText}`,
    },
    description: blogIndex.subtitle?.plainText,
    openGraph: {
      title: blogIndex.title ?? '',
      description: blogIndex.subtitle?.plainText,
      images: `/banner.png`,
      type: 'website',
      url: `/blog`,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@scastiel',
      site: '@scastiel',
      images: `/banner.png`,
      title: blogIndex.title ?? '',
      description: blogIndex.subtitle?.plainText,
    },
  }
}

export default async function BlogPage() {
  const { blogIndex } = await basehub({ next: { revalidate: 60 } }).query({
    blogIndex: {
      title: true,
      subtitle: { json: { content: true } },
      blogPosts: {
        __args: { orderBy: enumBlogPostsItemOrderByEnum.date__DESC },
        items: {
          _id: true,
          _title: true,
          _slug: true,
          subtitle: true,
          date: true,
        },
      },
    },
  })

  return (
    <div>
      <h1 className="text-4xl font-extrabold mt-4 mb-4">{blogIndex.title}</h1>
      <div className="mb-8">
        <RichText>{blogIndex.subtitle?.json.content}</RichText>
      </div>
      <ul className="grid gap-4">
        {blogIndex.blogPosts.items.map((post) => (
          <li key={post._id} className="border-t py-6">
            <div className="text-muted-foreground text-sm mb-2">
              {formatDate(post.date as any)}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
              <Link href={`/blog/${post._slug}`}>{post._title}</Link>
            </h2>
            <div className="prose dark:prose-invert sm:prose-lg">
              {post.subtitle}
            </div>
            <div className="mt-1 sm:mt-2">
              <Button asChild variant="link" className="-ml-4">
                <Link href={`/blog/${post._slug}`}>
                  Read more <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

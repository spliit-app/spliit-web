import { formatDate, getPostBySlug } from '@/app/blog/[slug]/helpers'
import { TrackPage } from '@/components/track-page'
import { Button } from '@/components/ui/button'
import { basehub } from 'basehub'
import { RichText } from 'basehub/react'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 60
export const dynamic = 'force-static'

export async function generateStaticParams() {
  const {
    blogIndex: { blogPosts },
  } = await basehub({ cache: 'no-store' }).query({
    blogIndex: { blogPosts: { items: { _slug: true } } },
  })

  return blogPosts.items.map((blogPost) => ({ slug: blogPost._slug }))
}

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return {
    title: post._title,
    description: post.subtitle,
    openGraph: {
      title: post._title,
      description: post.subtitle ?? '',
      type: 'website',
      url: `/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@scastiel',
      site: '@scastiel',
      title: post._title,
      description: post.subtitle ?? '',
    },
  }
}

const BlogPage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <>
      <TrackPage path={`/blog/${slug}`} />
      <div>
        <Button variant="link" asChild className="-ml-4">
          <Link href="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" /> All posts
          </Link>
        </Button>
      </div>
      <h1
        className="mt-4 mb-2 text-3xl sm:text-6xl font-bold"
        style={{ textWrap: 'balance' } as any}
      >
        <Link href={`/blog/${slug}`}>{post._title}</Link>
      </h1>
      <div className="text-muted-foreground flex gap-2 items-center mb-4 text-sm sm:text-base">
        <span>{formatDate(post.date as any)}</span>
        <span>·</span>
        {post.author && (
          <AuthorNameAvatar
            name={post.author.name}
            avatar={post.author.avatar}
          />
        )}
      </div>
      {post.coverImage && (
        <Image
          src={post.coverImage.url}
          width={post.coverImage.width}
          height={post.coverImage.height}
          alt=""
          className="w-full aspect-video rounded-lg object-cover shadow mb-8"
        />
      )}
      <div className="prose dark:prose-invert sm:prose-lg">
        <RichText>{(post.body as any).json.content}</RichText>
      </div>
    </>
  )
}

function AuthorNameAvatar({
  name,
  avatar,
}: {
  name: string | null
  avatar: { url: string; width: number; height: number } | null
}) {
  return (
    <span className="flex gap-1.5 items-center">
      {avatar && <AuthorAvatar avatar={avatar} />}
      <span>{name}</span>
    </span>
  )
}

function AuthorAvatar({
  avatar,
}: {
  avatar: { url: string; width: number; height: number }
}) {
  return (
    <Image
      className="inline w-4 h-4 object-fill rounded-full"
      alt=""
      src={avatar.url}
      width={avatar.width}
      height={avatar.height}
    />
  )
}

export default BlogPage

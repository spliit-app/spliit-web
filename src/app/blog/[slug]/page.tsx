import { Button } from '@/components/ui/button'
import { basehub } from 'basehub'
import { RichText } from 'basehub/react'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const {
    blogIndex: { blogPosts },
  } = await basehub({ cache: 'no-store' }).query({
    blogIndex: { blogPosts: { items: { _slug: true } } },
  })

  return blogPosts.items.map((blogPost) => ({ slug: blogPost._slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  return {
    title: post._title,
    description: post.subtitle,
    // etc...
  }
}

const BlogPage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const post = await getPostBySlug(slug)

  return (
    <>
      <div>
        <Button variant="link" asChild className="-ml-4">
          <Link href="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" /> All posts
          </Link>
        </Button>
      </div>
      <h1 className="mt-4 mb-2 text-3xl font-bold">
        <Link href={`/blog/${slug}`}>{post._title}</Link>
      </h1>
      <div className="text-muted-foreground flex gap-2 items-center mb-4 text-sm">
        <span>
          {new Date(post.date as any).toLocaleString('en-US', {
            dateStyle: 'long',
          })}
        </span>
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

async function getPostBySlug(slug: string) {
  const { blogIndex } = await basehub({ next: { revalidate: 60 } }).query({
    blogIndex: {
      blogPosts: {
        __args: { first: 1, filter: { _sys_slug: { eq: slug } } },
        items: {
          _id: true,
          _title: true,
          subtitle: true,
          date: true,
          body: { json: { content: true } },
          coverImage: { url: true, width: true, height: true },
          author: {
            name: true,
            avatar: { url: true, width: true, height: true },
          },
        },
      },
    },
  })

  const post = blogIndex.blogPosts.items.at(0)
  if (!post) notFound()

  return post
}

export default BlogPage

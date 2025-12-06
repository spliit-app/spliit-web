/* eslint-disable @next/next/no-img-element */
import { formatDate, getPostBySlug } from '@/app/blog/[slug]/helpers'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const logoImageData = await fetch(
    new URL('../../../../public/logo-with-text.png', import.meta.url),
  ).then((res) => res.arrayBuffer())

  const geistBlackData = await fetch(
    new URL('../../../../public/Geist-Black.otf', import.meta.url),
  ).then((res) => res.arrayBuffer())
  const geistRegularData = await fetch(
    new URL('../../../../public/Geist-Regular.otf', import.meta.url),
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 48,
        }}
      >
        <div
          style={{
            fontSize: 32,
            color: '#00000080',
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'GeistRegular',
            gap: 12,
          }}
        >
          {post.date && <span>{formatDate(post.date)}</span>}
          <span>·</span>
          {post.author && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {post.author.avatar && (
                <img
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                  src={post.author.avatar.url}
                  // width={post.author.avatar.width}
                  // height={post.author.avatar.height}
                  alt=""
                />
              )}
              <span>{post.author.name}</span>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: 24,
            display: 'flex',
            fontSize: 72,
            fontFamily: 'GeistBlack',
            lineHeight: 1.1,
            marginBottom: 32,
          }}
        >
          <div style={{ textWrap: 'balance' } as any}>{post._title}</div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          {post.coverImage && (
            <img
              alt=""
              src={post.coverImage.url}
              width={500}
              height={281}
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: 30,
              }}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <img src={logoImageData as any} width={300} alt="" />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'GeistBlack',
          data: geistBlackData,
          style: 'normal',
        },
        {
          name: 'GeistRegular',
          data: geistRegularData,
          style: 'normal',
        },
      ],
    },
  )
}

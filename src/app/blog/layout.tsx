import { basehub } from 'basehub'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const { blogIndex } = await basehub().query({
    blogIndex: { title: true, subtitle: { plainText: true } },
  })

  return {
    title: {
      default: blogIndex.title ?? '',
      template: `%s · ${blogIndex.title}`,
    },
    description: blogIndex.subtitle?.plainText,
  }
}

export default function BlogLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex-1 w-full max-w-screen-md mx-auto my-8 px-4">
      {children}
    </main>
  )
}

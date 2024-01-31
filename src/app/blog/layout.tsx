import { PropsWithChildren } from 'react'

export default function BlogLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex-1 w-full max-w-screen-md mx-auto my-8 px-4">
      {children}
    </main>
  )
}

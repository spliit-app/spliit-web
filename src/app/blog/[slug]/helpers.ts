import { basehub } from 'basehub'

export async function getPostBySlug(slug: string) {
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

  return blogIndex.blogPosts.items.at(0)
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  })
}

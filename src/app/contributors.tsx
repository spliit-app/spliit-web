import Image from 'next/image'
import { Octokit } from 'octokit'

export async function Contributors() {
  const octokit = new Octokit()
  const { data: contributors } = await octokit.rest.repos.listContributors({
    owner: 'spliit-app',
    repo: 'spliit',
  })

  return (
    <ul style={{ textWrap: 'balance' } as any}>
      {contributors.map((contributor) =>
        contributor.avatar_url !== undefined &&
        contributor.login !== undefined ? (
          <li key={contributor.login} className="inline-block px-1">
            <a href={contributor.html_url} target="_blank" rel="nofollow">
              <Image
                src={contributor.avatar_url}
                width={60}
                height={60}
                alt={contributor.login ?? ''}
                className="rounded-full border hover:scale-110 transition-transform"
              />
            </a>
          </li>
        ) : null,
      )}
    </ul>
  )
}

# Base release sync

`.github/workflows/sync-base-release.yml` keeps this fork in step with
`spliit-app/spliit`. Once a day it checks upstream's latest GitHub release; if
that tag is not already an ancestor of `main` **and upstream CI is green for
it**, it creates `sync-base-<tag>`, merges the tag with `--no-ff`, has Claude
Code resolve any conflicts, runs the CI checks, and opens a PR.

The PR branch contains a real merge commit (`Merge base <tag>`, two parents:
fork `main` and the upstream tag), so once it lands the tag is part of this
fork's history and the next run correctly skips it. **Merge the PR with
"Create a merge commit"** — squashing would flatten the merge and the
already-merged check would never fire again for that tag.

## Setup

### 1. Secrets

| Secret | Required | What it is |
| --- | --- | --- |
| `CLAUDE_CODE_OAUTH_TOKEN` | one of the two | Run `claude setup-token` locally and paste the result. Bills to your Claude subscription. |
| `ANTHROPIC_API_KEY` | one of the two | Alternative to the OAuth token. Bills to the API account. |
| `SYNC_PAT` | recommended | Fine-grained PAT with **Contents: read & write**, **Pull requests: read & write**, and **Workflows: read & write** on `spliit-app/spliit-web`. |
| `BASEHUB_TOKEN` | already set | Reused from `ci.yml` for the post-merge checks. |

```sh
gh secret set CLAUDE_CODE_OAUTH_TOKEN -R spliit-app/spliit-web
gh secret set SYNC_PAT               -R spliit-app/spliit-web
```

Set exactly one of `CLAUDE_CODE_OAUTH_TOKEN` / `ANTHROPIC_API_KEY`; the
workflow passes both inputs and whichever is empty is ignored.

### Why `SYNC_PAT` matters

Two reasons, both of which bite without it:

1. **CI would not run on the sync PR.** GitHub deliberately does not trigger
   workflows for events raised by `GITHUB_TOKEN`, so a PR opened with the
   default token gets no `ci.yml` run — you would be reviewing a merge with no
   signal beyond the workflow's own checks.
2. **Pushes touching `.github/workflows/` are rejected.** If upstream changes a
   workflow file, `GITHUB_TOKEN` cannot push that change. The PAT needs the
   `workflow` permission for those merges to go through.

The workflow falls back to `GITHUB_TOKEN` when `SYNC_PAT` is unset, so it still
works — just with those two caveats.

### 2. Allow Actions to open pull requests

Settings → Actions → General → Workflow permissions → tick **Allow GitHub
Actions to create and approve pull requests**. Needed only for the
`GITHUB_TOKEN` fallback path; a PAT bypasses it.

## Running it

- **Scheduled:** daily at 06:00 UTC.
- **Manually:** `gh workflow run sync-base-release.yml -R spliit-app/spliit-web`
- **A specific tag** (backfill, or re-run after deleting a branch):
  `gh workflow run sync-base-release.yml -R spliit-app/spliit-web -f tag=1.22.0`

The job is a no-op when the tag is already merged or `sync-base-<tag>` already
exists on the remote, so re-running is safe.

## The green-checks gate

A release only produces a PR if upstream CI passed on the tagged commit.
[`require-green-checks.sh`](require-green-checks.sh) enforces it and can be run
by hand:

```sh
.github/sync-base/require-green-checks.sh spliit-app/spliit <commit-sha>
# exit 0 green · 2 red · 3 still pending
```

The rules:

- Every check run listed for `REQUIRED_CHECKS` (default `checks,e2e`) must
  exist, be completed, and have concluded `success`. `skipped` does not count
  for a check we explicitly demanded.
- No other check run may have failed. `success`, `skipped` and `neutral` are
  all fine; anything else is red.
- If checks are still running — or a required one has not been reported yet —
  the script waits (`CHECKS_TIMEOUT_SECONDS`, default 2700s, polled every 60s)
  and then gives up. A pending release is not an error: the job stays green and
  the next daily run picks it up.

A red release logs a `::warning::` and opens no PR. Either way the check-run
table is written to the workflow run's summary.

### Why the tagged commit has the checks you want

Upstream's `e2e.yml` triggers on `push: tags: ['*']`, the same trigger as
`cd.yml` — so `e2e` is a genuine per-release gate and its check run attaches to
the tag's commit. Release tags also sit on `main`, so `ci.yml`'s `checks` run
is on the same commit. That is why a single commit SHA is enough to judge a
release.

> **Use the check-runs API, not `/status`.** These are GitHub Actions check
> runs; the legacy combined-status endpoint reports `state: "pending"` with
> zero statuses for the very same commit. A gate written against `/status`
> would block every release forever.

### Tuning and bypassing

`REQUIRED_CHECKS` and `CHECKS_TIMEOUT_SECONDS` are set in the workflow's
`Require green checks on the base release` step. `REQUIRED_CHECKS` is
comma-separated, so a check whose name contains a comma — such as
`build (linux/amd64, ubuntu-latest)` — cannot be listed. Those still count
under the "nothing else may fail" rule.

To merge a tag without the gate:

```sh
gh workflow run sync-base-release.yml -R spliit-app/spliit-web \
  -f tag=1.15.0 -f skip_checks=true
```

Needed for backfilling old releases: tags from before the workflows existed
have no check runs at all, so the gate correctly reports them as pending
forever. The resulting PR is labelled as unverified in its body.

## What Claude Code is asked to do

Only when `git merge` reports conflicts. It gets the conflicted file list and
is pointed at [`CONFLICT_RESOLUTION.md`](CONFLICT_RESOLUTION.md), which
describes how this fork diverges from the base and which side wins where. It
resolves and `git add`s files, regenerates the lockfile if needed, and runs
`check-types` / `lint` / `check-formatting`. It is explicitly forbidden from
committing, pushing, aborting the merge, or opening the PR — the workflow does
all of that, so a bad resolution shows up as a reviewable diff rather than
something already on a branch you did not see.

After Claude runs, the workflow independently verifies that no unmerged paths
and no conflict markers remain, and that the merge is still in progress. It
fails loudly rather than committing a half-resolved tree.

Model: `claude-opus-5`. Drop to `claude-sonnet-5` in the workflow's
`claude_args` if you want cheaper runs; these merges are small in volume but
the resolutions are subtle, so Opus is the default.

## Reducing the delay (optional)

Polling means up to a day between an upstream release and the PR. Both repos
are under the same org, so if you want it immediate, add a workflow to
`spliit-app/spliit` that pings this one:

```yaml
name: Notify fork of release
on:
  release:
    types: [published]
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - env:
          GH_TOKEN: ${{ secrets.SPLIIT_WEB_DISPATCH_PAT }}
        run: |
          gh workflow run sync-base-release.yml \
            -R spliit-app/spliit-web \
            -f tag='${{ github.event.release.tag_name }}'
```

That needs a PAT with **Actions: read & write** on `spliit-web` stored in the
*base* repo, and it puts fork-specific automation in the public upstream repo.
The daily poll avoids both, which is why it is the default.

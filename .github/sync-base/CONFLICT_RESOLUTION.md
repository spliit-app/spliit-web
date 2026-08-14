# Resolving base-merge conflicts

Context for whoever (human or Claude Code) resolves conflicts when merging a
`spliit-app/spliit` release tag into `spliit-app/spliit-web`.

`spliit-web` is the hosted build of Spliit. It is a **superset** of the base
repo: everything upstream does, plus a marketing site, a blog, an email
feedback flow, and privacy-conscious analytics. The base repo is not a
dependency — it is the same tree, merged in periodically.

## The one rule

**Both sides survive.** A conflict here means upstream changed a line the fork
also changed. Almost never is the right answer "take theirs" or "take ours"
wholesale — it is "apply the upstream change to the fork's version of the
code". If you genuinely cannot reconcile the two, say so in your summary
rather than silently dropping one side.

`README.md` is the single documented exception — see below.

## `README.md` — always keep ours, entirely

Upstream's README is the full project readme: features, stack, self-hosting,
Docker, opt-in features, license. This fork replaced it with a five-line stub
pointing contributors at `spliit-app/spliit`. Upstream edits its README almost
every release, so **this file conflicts on nearly every sync**.

Resolution is always the same:

```sh
git checkout --ours README.md && git add README.md
```

Do not merge upstream's sections in, and do not spend time reading the diff.
The stub is deliberate: contributor-facing documentation lives in the base
repo, and duplicating it here would only rot.

## Invariant that must not regress

**No group ID or expense ID may ever reach Plausible.** This was fixed
deliberately in `Strip group and expense IDs from everything sent to Plausible`
(#22). If an upstream change reintroduces an ID into an analytics event name,
prop, or pageview URL, strip it during the merge and note it in your summary.
High-cardinality identifiers also cost money on the Plausible plan.

## Files the fork owns outright

These do not exist upstream, so they should never conflict. If they do
(upstream added a file with the same path), keep the fork's version and
mention the collision.

- `src/app/page.tsx` — the landing page. Fully rewritten by the fork; upstream's
  version is a much smaller page.
- `src/app/blog/**` — blog index, post pages, RSS/Atom feeds, OG images.
- `src/app/privacy-policy/page.tsx`
- `src/app/contributors.tsx`, `src/app/stats-display*.ts(x)`
- `src/components/feedback-button/**`, `src/components/news-button.tsx`
- `src/components/ui/accordion.tsx`
- `src/lib/resend.ts`
- `basehub.config.ts`, `basehub-types.d.ts` (the latter is generated — never
  hand-edit it, and `git checkout --` it if a build regenerates it outside the
  merge)

## Files that diverge and will conflict

### `src/lib/analytics/events.ts` — designed seam, respect it

Upstream deliberately left a fork extension point here. It maintains the
`BaseAnalyticsEvent` union; the fork fills in `CustomAnalyticsEvent`, which is
`never` upstream:

```ts
type CustomAnalyticsEvent =
  | { event: 'news: open menu'; props: NoProps }
  | { event: 'news: click news'; props: { news: string } }
```

**Resolution:** take upstream's `BaseAnalyticsEvent` verbatim (they may have
added events), keep the fork's `CustomAnalyticsEvent` verbatim. Keep the fork's
doc comment. Do not merge the two unions into one.

### `src/lib/hooks.ts`

The fork adds `useLocalStorageState` and the `useCallback` import. Everything
else is upstream's. Take upstream's changes, re-add the fork's hook and import.

### `src/lib/env.ts`

The fork adds four optional keys to `envSchema`: `FEEDBACK_EMAIL_FROM`,
`FEEDBACK_EMAIL_TO`, `RESEND_API_KEY`, `STRIPE_DONATION_LINK`. Union of both
side's keys. They are all optional or defaulted, so upstream deployments are
unaffected.

### `src/app/layout.tsx`

Heavily reworked by the fork (extra nav, footer, analytics wiring, metadata).
Start from the fork's version and port upstream's functional changes into it —
new providers, i18n plumbing, script tags, `<head>` additions. Do not start
from upstream's version and re-add the fork's UI; that loses too much.

### `src/app/groups/layout.tsx`, `src/app/groups/[groupId]/group-header.tsx`, `src/app/globals.css`, `src/app/sitemap.ts`

Small fork deltas over upstream code. Take upstream's change and re-apply the
fork's delta on top. `sitemap.ts` in particular must keep the fork's blog and
marketing routes.

### `tsconfig.json`

The fork appends `"basehub-types.d.ts"` and `"basehub.config.ts"` to `include`.
Keep those entries alongside whatever upstream changed.

### `package.json`

Union of dependencies. Fork-only packages that must stay: `basehub`, `resend`,
`@radix-ui/react-accordion`, and anything else the fork-owned files import.
For a package both sides have, take the **higher** version. Keep upstream's
script changes unless they conflict with a fork-only script.

### `package-lock.json`

**Never hand-merge this file.** Resolve `package.json` first, then:

```sh
npm install --package-lock-only
npm install --ignore-scripts
```

Always pass `--ignore-scripts` to npm in CI: this repo's `postinstall` runs
`prisma migrate deploy`, which needs a live database and will fail.

A corrupted lockfile has broken `main` before (`fix: repair corrupted
package-lock.json breaking CI on main`, #556), so verify `npm ci
--ignore-scripts` succeeds afterwards. That verification is not optional
ceremony — it is the only step that catches a lockfile out of sync with
`package.json`, and it is exactly what CI runs.

**Regenerate on the same npm major that CI uses.** npm 10 prunes
`optionalDependencies` for every platform except the one it is running on;
npm 11 keeps them all and rejects a pruned lockfile with
`EUSAGE ... can only install packages when your package.json and
package-lock.json are in sync`, listing `@img/sharp-*` and `@parcel/watcher-*`
as missing. A lockfile regenerated under the wrong major passes `npm ci`
locally and fails it in CI. The sync workflow now takes its Node version from
`.github/workflows/ci.yml` for exactly this reason; if you regenerate by hand,
match that version too.

### `messages/*.json`

Union of keys. Only `en-US.json` and `fi.json` currently carry fork-added
strings; the other locales are untouched from upstream, so they should merge
cleanly. Never drop an upstream-added key — a missing key breaks that locale at
runtime. Keep the JSON valid and alphabetically consistent with its neighbours.

### `.github/workflows/**`

`ci.yml` and `cd.yml` are shared with upstream — take upstream's changes.
`sync-base-release.yml` and everything under `.github/sync-base/` are fork-only
and do not exist upstream. Note that merging a change to any workflow file
requires the pushing token to hold the `workflow` permission; if the push step
fails with a workflow-scope error, that is why (see `README.md` in this folder).

### `prisma/**`

Migrations are append-only. Keep **both** sides' migration directories; never
renumber, rename, or delete an existing migration. For `schema.prisma`, union
the model/field changes.

## Verifying

```sh
npm run check-types
npm run lint
npm run check-formatting   # `npm run prettier` rewrites files in place
```

These are the same checks `ci.yml` runs, minus the build. `npx prisma generate`
and `npx basehub` (needs `BASEHUB_TOKEN`) must have run first or type checking
will fail on missing generated types.

## Things never to do during a sync merge

- Do not create or push git tags. `cd.yml` triggers on any tag push and would
  publish a Docker image.
- Do not `git merge --abort` or `git reset` — the automation needs the merge
  left in progress.
- Do not commit `basehub-types.d.ts` changes that came from regenerating it
  rather than from the merge.
- Do not "fix" unrelated pre-existing lint or type errors in the same commit.

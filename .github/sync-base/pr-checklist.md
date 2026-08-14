### Review checklist

- [ ] Fork-only pages still intact (landing page, blog, privacy policy)
- [ ] Analytics still strips group and expense IDs (`src/lib/analytics/events.ts`, `src/lib/hooks.ts`)
- [ ] Feedback button and news button unaffected
- [ ] `package-lock.json` was regenerated, not hand-merged
- [ ] `prisma/migrations` kept both sides, nothing renumbered
- [ ] Merge with **Create a merge commit** so the base tag stays in this fork's history

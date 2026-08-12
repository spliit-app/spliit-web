/**
 * No properties at all. `{}` would not do: it accepts any object, so it would
 * silently let a `groupId` through.
 */
export type NoProps = Record<string, never>

// Group and expense IDs are deliberately absent from every event: they identify
// a specific user's data, and they are unique per document, so they would only
// ever produce single-visitor rows. Properties here must stay low-cardinality.
type BaseAnalyticsEvent =
  | { event: 'pageview'; props: NoProps }
  | { event: 'group: create'; props: NoProps }
  | { event: 'group: update'; props: NoProps }
  | { event: 'group: export expenses'; props: { format: 'csv' | 'json' } }
  | { event: 'expense: create'; props: NoProps }
  | { event: 'expense: update'; props: NoProps }
  | { event: 'expense: delete'; props: NoProps }
  | { event: 'expense: attach document'; props: NoProps }
  | { event: 'expense: scan receipt'; props: NoProps }
  | { event: 'expense: create from receipt'; props: NoProps }

/**
 * Events specific to this deployment. Upstream only ever edits the union above,
 * so keeping ours to this one declaration keeps rebases conflict-free.
 */
type CustomAnalyticsEvent =
  | { event: 'news: open menu'; props: NoProps }
  // The news ID identifies a piece of content, not a user, and there are only
  // ever a handful of them — so it stays low-cardinality.
  | { event: 'news: click news'; props: { news: string } }

export type AnalyticsEvent = BaseAnalyticsEvent | CustomAnalyticsEvent

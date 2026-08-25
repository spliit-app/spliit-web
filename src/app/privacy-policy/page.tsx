import { getAnalyticsConfig } from '@/lib/analytics/config'
import { TrackPage } from '@/lib/analytics/track-page'
import { getRuntimeFeatureFlags } from '@/lib/featureFlags'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ReactNode } from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('PrivacyPolicy')
  return {
    title: t('title'),
    description: t('metaDescription'),
  }
}

/**
 * What this page may truthfully say depends on how the instance serving it is
 * configured: receipt scanning is only a disclosure worth making where an
 * OpenAI key exists, and a self-hosted instance with no analytics provider must
 * not claim to send anything anywhere. Both are read per request, as the layout
 * already does for the analytics script itself.
 */
export default async function PrivacyPolicy() {
  const t = await getTranslations('PrivacyPolicy')
  const {
    enableExpenseDocuments,
    enableReceiptExtract,
    enableCategoryExtract,
  } = await getRuntimeFeatureFlags()
  const { provider } = await getAnalyticsConfig()

  // The `console` provider only prints events to the browser console, so
  // nothing leaves the device and there is nothing to disclose.
  const sendsAnalytics = provider === 'plausible'
  const usesAI = enableReceiptExtract || enableCategoryExtract

  const contact = (chunks: ReactNode) => (
    <a href="mailto:hello@spliit.app">{chunks}</a>
  )

  return (
    <article className="prose prose-sm sm:prose-base dark:prose-invert mx-auto pt-8 pb-16 px-4 [&_a]:text-primary">
      <TrackPage path="/privacy-policy" />
      <h1>{t('title')}</h1>
      <p className="text-muted-foreground !mt-0">{t('lastUpdated')}</p>
      <p>
        {t.rich('intro', {
          link: (chunks) => (
            <a href="https://spliit.app" target="_blank" rel="noopener">
              {chunks}
            </a>
          ),
        })}
      </p>

      <h2>{t('noAccount.title')}</h2>
      <p>{t('noAccount.body')}</p>

      <h2>{t('whatIsStored.title')}</h2>
      <p>{t('whatIsStored.body')}</p>
      {enableExpenseDocuments && <p>{t('whatIsStored.documents')}</p>}

      <h2>{t('groupLinks.title')}</h2>
      <p>{t('groupLinks.body')}</p>

      <h2>{t('onYourDevice.title')}</h2>
      <p>{t('onYourDevice.body')}</p>

      <h2>{t('analytics.title')}</h2>
      {sendsAnalytics ? (
        <>
          <p>{t('analytics.provider')}</p>
          <p>
            {t.rich('analytics.noIds', {
              code: (chunks) => <code>{chunks}</code>,
            })}
          </p>
        </>
      ) : (
        <p>{t('analytics.disabled')}</p>
      )}
      <p>{t('analytics.noTracking')}</p>

      {usesAI && (
        <>
          <h2>{t('ai.title')}</h2>
          {enableReceiptExtract && <p>{t('ai.receipt')}</p>}
          {enableCategoryExtract && <p>{t('ai.category')}</p>}
          <p>{t('ai.training')}</p>
        </>
      )}

      <h2>{t('logs.title')}</h2>
      <p>{t('logs.body')}</p>

      <h2>{t('cookies.title')}</h2>
      <p>{t('cookies.body')}</p>

      <h2>{t('deleting.title')}</h2>
      <p>{t.rich('deleting.body', { contact })}</p>

      <h2>{t('children.title')}</h2>
      <p>{t.rich('children.body', { contact })}</p>

      <h2>{t('security.title')}</h2>
      <p>{t('security.body')}</p>

      <h2>{t('selfHosting.title')}</h2>
      <p>{t('selfHosting.body')}</p>

      <h2>{t('changes.title')}</h2>
      <p>
        {t.rich('changes.body', {
          repository: (chunks) => (
            <a
              href="https://github.com/spliit-app/spliit-web"
              target="_blank"
              rel="noopener"
            >
              {chunks}
            </a>
          ),
        })}
      </p>

      <h2>{t('contact.title')}</h2>
      <p>{t.rich('contact.body', { contact })}</p>
    </article>
  )
}

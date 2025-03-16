import { getRequestConfig } from 'next-intl/server'
import { getUserLocale } from './lib/locale'
import deepmerge from 'deepmerge'

export const localeLabels = {
  'en-US': 'English',
  fi: 'Suomi',
  'fr-FR': 'Français',
  es: 'Español',
  'de-DE': 'Deutsch',
  'zh-CN': '简体中文',
  'zh-TW': '正體中文',
  'pl-PL': 'Polski',
  'ru-RU': 'Русский',
  'it-IT': 'Italiano',
  'ua-UA': 'Українська',
  ro: 'Română',
} as const

export const locales: (keyof typeof localeLabels)[] = Object.keys(
  localeLabels,
) as any
export type Locale = keyof typeof localeLabels
export type Locales = ReadonlyArray<Locale>
export const defaultLocale: Locale = 'en-US'

export default getRequestConfig(async () => {
  const locale = await getUserLocale()

  const userMessages = (await import(`../messages/${locale}.json`)).default
  const defaultMessages = (await import(`../messages/en-US.json`)).default
  const messages = deepmerge(defaultMessages, userMessages)

  return {
    locale,
    messages,
  }
})

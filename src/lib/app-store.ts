const APP_STORE_ID = '6737742507'

/**
 * Spliit’s iOS app on the App Store. Hardcoded rather than configurable: it
 * points at the official app, not at whoever runs a given instance.
 */
export const appStore = {
  id: APP_STORE_ID,
  url: `https://apps.apple.com/us/app/spliit-shares-expenses/id${APP_STORE_ID}`,
} as const

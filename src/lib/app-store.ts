/**
 * Spliit's iOS app on the App Store. Hardcoded rather than configurable, for
 * the same reason as `github` and `openCollective`: this points at the project's
 * own app, not at whoever runs a given instance.
 */
const APP_ID = '6737742507'

export const appStore = {
  /**
   * No `/us/` and no localized slug: this form redirects the visitor to their
   * own storefront, which the localized URL the news popover uses does not.
   */
  url: `https://apps.apple.com/app/id${APP_ID}`,
  /**
   * Everyone below it keeps the last compatible version through the App Store's
   * own fallback, so an older iPhone still gets an app rather than an error.
   */
  minimumOsVersion: 'iOS 26',
} as const

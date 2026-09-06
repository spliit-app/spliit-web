const COLLECTIVE_URL = 'https://opencollective.com/spliit'

/**
 * Spliit's Open Collective page, where both financial contributions and
 * community feedback happen. Hardcoded rather than configurable: these point at
 * the project itself, not at whoever runs a given instance.
 */
export const openCollective = {
  url: COLLECTIVE_URL,
  contribute: `${COLLECTIVE_URL}/contribute`,
  donate: `${COLLECTIVE_URL}/donate`,
  /**
   * The $200/month “sponsor++” tier — the only one whose reward includes a logo
   * on this site, which is why the home page links here rather than to the
   * generic contribute page. Open Collective addresses a tier by slug *and*
   * numeric ID, so the suffix is part of the URL, not noise.
   */
  sponsor: `${COLLECTIVE_URL}/contribute/sponsor-104857`,
  conversations: `${COLLECTIVE_URL}/conversations`,
  newConversation: `${COLLECTIVE_URL}/conversations/new`,
} as const

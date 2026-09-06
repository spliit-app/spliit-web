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
   * Where the home page sends a would-be sponsor: the collective page scrolled
   * to its list of tiers, so the reader sees Sponsor++ — the one whose reward
   * includes a logo on this site — next to the cheaper options rather than
   * landing straight in a checkout for it.
   */
  sponsor: `${COLLECTIVE_URL}#category-CONTRIBUTE`,
  conversations: `${COLLECTIVE_URL}/conversations`,
  newConversation: `${COLLECTIVE_URL}/conversations/new`,
} as const

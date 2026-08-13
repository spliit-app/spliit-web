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
  conversations: `${COLLECTIVE_URL}/conversations`,
  newConversation: `${COLLECTIVE_URL}/conversations/new`,
} as const

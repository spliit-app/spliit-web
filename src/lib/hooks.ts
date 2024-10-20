import { useCallback, useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  }

  const [matches, setMatches] = useState<boolean>(getMatches(query))

  function handleChange() {
    setMatches(getMatches(query))
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(query)

    // Triggered at the first client-side load and if query changes
    handleChange()

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange)
    } else {
      matchMedia.addEventListener('change', handleChange)
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange)
      } else {
        matchMedia.removeEventListener('change', handleChange)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return matches
}

export function useBaseUrl() {
  const [baseUrl, setBaseUrl] = useState<string | null>(null)
  useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])
  return baseUrl
}

export function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
): [T, (v: T) => void, boolean] {
  const [value, _setValue] = useState(defaultValue)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const storedValue = localStorage.getItem(key)
    try {
      _setValue(storedValue ? (JSON.parse(storedValue) as T) : defaultValue)
    } catch (err) {
      _setValue(defaultValue)
    }
    setLoaded(true)
  }, [defaultValue, key])

  const setValue = useCallback(
    (value: T) => {
      localStorage.setItem(key, JSON.stringify(value))
      _setValue(value)
    },
    [key],
  )

  return [value, setValue, loaded]
}

/**
 * @returns The active user, or `null` until it is fetched from local storage
 */
export function useActiveUser(groupId?: string) {
  const [activeUser, setActiveUser] = useState<string | null>(null)

  useEffect(() => {
    if (groupId) {
      const activeUser = localStorage.getItem(`${groupId}-activeUser`)
      if (activeUser) setActiveUser(activeUser)
    }
  }, [groupId])

  return activeUser
}

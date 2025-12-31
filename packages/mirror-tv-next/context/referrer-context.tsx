'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  const previous = ref.current
  ref.current = value
  return previous
}

interface ReferrerContextType {
  previousUrl: string
  currentUrl: string
}

const ReferrerContext = createContext<ReferrerContextType>({
  previousUrl: '',
  currentUrl: '',
})

export const ReferrerProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname() ?? ''
  const searchParams = useSearchParams()

  const search = searchParams?.toString() ?? ''
  const currentUrl = search ? `${pathname}?${search}` : pathname

  const previousUrlRef = useRef('')
  const previousUrl = usePrevious(currentUrl)

  if (previousUrl && previousUrl !== currentUrl) {
    previousUrlRef.current = previousUrl
  }

  const value = {
    previousUrl: previousUrlRef.current,
    currentUrl: currentUrl,
  }

  return (
    <ReferrerContext.Provider value={value}>
      {children}
    </ReferrerContext.Provider>
  )
}

export const useReferrer = () => {
  return useContext(ReferrerContext)
}

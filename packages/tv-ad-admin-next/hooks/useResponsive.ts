'use client'

import { useEffect, useState } from 'react'

export function useResponsive() {
  const [screen, setScreen] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  })

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)')
    const tabletQuery = window.matchMedia(
      '(min-width: 768px) and (max-width: 1199px)'
    )
    const desktopQuery = window.matchMedia('(min-width: 1200px)')

    const update = () => {
      setScreen({
        isMobile: mobileQuery.matches,
        isTablet: tabletQuery.matches,
        isDesktop: desktopQuery.matches,
      })
    }

    update()
    mobileQuery.addEventListener('change', update)
    tabletQuery.addEventListener('change', update)
    desktopQuery.addEventListener('change', update)

    return () => {
      mobileQuery.removeEventListener('change', update)
      tabletQuery.removeEventListener('change', update)
      desktopQuery.removeEventListener('change', update)
    }
  }, [])

  return screen
}

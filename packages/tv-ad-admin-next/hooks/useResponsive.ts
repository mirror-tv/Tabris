'use client'

import { useEffect } from 'react'

import { useResponsiveStore } from '@/store'

export function useResponsive() {
  const { isMobile, isTablet, isDesktop, updateResponsive } =
    useResponsiveStore()

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)')
    const tabletQuery = window.matchMedia(
      '(min-width: 768px) and (max-width: 1199px)'
    )
    const desktopQuery = window.matchMedia('(min-width: 1200px)')

    updateResponsive() // initialize state once

    mobileQuery.addEventListener('change', updateResponsive)
    tabletQuery.addEventListener('change', updateResponsive)
    desktopQuery.addEventListener('change', updateResponsive)

    return () => {
      mobileQuery.removeEventListener('change', updateResponsive)
      tabletQuery.removeEventListener('change', updateResponsive)
      desktopQuery.removeEventListener('change', updateResponsive)
    }
  }, [updateResponsive])

  return { isMobile, isTablet, isDesktop }
}

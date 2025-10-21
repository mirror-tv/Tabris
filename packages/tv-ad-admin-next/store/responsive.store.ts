'use client'

import { create } from 'zustand'

type ResponsiveState = {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  updateResponsive: () => void
}

export const useResponsiveStore = create<ResponsiveState>((set) => ({
  isMobile: false,
  isTablet: false,
  isDesktop: false,
  updateResponsive: () => {
    const mobileQuery = window.matchMedia('(max-width: 767px)')
    const tabletQuery = window.matchMedia(
      '(min-width: 768px) and (max-width: 1199px)'
    )
    const desktopQuery = window.matchMedia('(min-width: 1200px)')
    set({
      isMobile: mobileQuery.matches,
      isTablet: tabletQuery.matches,
      isDesktop: desktopQuery.matches,
    })
  },
}))

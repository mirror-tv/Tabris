/// <reference types="google-publisher-tag" />

declare module 'swiper/css'
declare module 'swiper/css/*'

declare global {
  interface Window {
    googletag: googletag.Googletag
    popin?: {
      init?: () => void
      loadRecommend?: (elementId: string) => void
      (): void // 函數調用
    }
    popinRecommend?: {
      init?: () => void
    }
    Popin?: any
    PopinWidget?: any
    PopinRecommend?: any
  }
}

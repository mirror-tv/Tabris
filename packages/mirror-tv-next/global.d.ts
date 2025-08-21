/// <reference types="google-publisher-tag" />

declare global {
  interface Window {
    googletag: googletag.Googletag
    popin?: {
      init?: () => void
      loadRecommend?: (elementId: string) => void
    }
    popinRecommend?: {
      init?: () => void
    }
  }
}

/// <reference types="google-publisher-tag" />

declare global {
  interface Window {
    googletag: googletag.Googletag
    sampleUpdate: string
  }
}

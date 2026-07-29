/// <reference types="google-publisher-tag" />

declare module 'swiper/css'
declare module 'swiper/css/*'

declare global {
  interface Window {
    googletag: googletag.Googletag
  }
}

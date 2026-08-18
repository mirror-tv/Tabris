/// <reference types="google-publisher-tag" />

declare module 'swiper/css'
declare module 'swiper/css/*'

// Allow side-effect imports of CSS files (e.g. import '~/styles/global.css').
// TypeScript 6 with moduleResolution:"Bundler" requires explicit declarations
// for non-module CSS imports (TS2882).
declare module '*.css'

declare global {
  interface Window {
    googletag: googletag.Googletag
  }
}

// Keep this file in CommonJS so next.config.js can load the preview basePath
// directly in Node before Next.js compiles the TypeScript application code.
const SITE_BASE_PATH =
  process.env.NEXT_PUBLIC_IS_PREVIEW_MODE === 'true' ? '/preview-server' : ''

module.exports = {
  SITE_BASE_PATH,
}

import { SITE_BASE_PATH } from './site-base-path.cjs'

/**
 * Prepend preview-server basePath to root-relative public asset paths.
 *
 * In production basePath = '', so this is effectively a no-op.
 *
 * Scope (intentional, not a partial rollout):
 *   Preview mode only renders the `story/[slug]` and `external/[slug]` pages,
 *   so this helper is applied only to public asset paths that those two pages
 *   (and the shared layout/components they pull in) actually reach — e.g.
 *   visible header logo/banner, `ResponsiveImage` fallbacks, share icons,
 *   blockquote icons, and attachment download icons. Pages outside the preview
 *   surface (category, topic, show, errors, etc.) are intentionally NOT wrapped.
 *
 *   If preview mode is later extended to cover more pages, expand the helper's
 *   usage to those pages' callsites at that time — do not pre-wrap everything.
 *
 * Use for visible `/images/...`, `/icons/...`, or `/fonts/...` paths that are
 * reached by `story/[slug]` or `external/[slug]` in preview mode.
 *
 * Do NOT use for:
 *   - Callsites only reached by non-preview pages — out of scope
 *   - SEO metadata, JSON-LD, Open Graph, or Twitter card image paths — those
 *     are not part of the visible preview image fix and may need absolute URLs
 *   - External absolute URLs (`https://...`) — basePath does not apply
 *   - Bundler-handled imports (`import Foo from '~/public/icons/foo.svg'`)
 *     — webpack/svgr resolves the final URL at build time
 *   - `<Link href>` / `useRouter().push()` — Next.js auto-applies basePath
 *
 * Why this exists: Next.js basePath is build-time and is NOT auto-applied to
 * `<Image src>`, third-party image components (e.g. @readr-media/react-image),
 * native `<img src>`, or CSS `url()` paths. Bug surface is preview-only —
 * production has basePath = '' so missing helper calls are invisible there.
 */
function withBasePath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  if (SITE_BASE_PATH && path.startsWith(`${SITE_BASE_PATH}/`)) return path
  return `${SITE_BASE_PATH}${path}`
}

export { SITE_BASE_PATH, withBasePath }

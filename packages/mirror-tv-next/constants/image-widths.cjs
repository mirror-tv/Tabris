// Keep this file in CommonJS so next.config.js can share the same widths with
// the `Image` component (components/shared/image.tsx).

/**
 * Widths the Next.js image optimizer (`/_next/image`) accepts.
 * next.config.js feeds these into `images.deviceSizes` / `images.imageSizes`;
 * any other `w` is rejected with 400, so the `nextjs` transformer snaps to them.
 *
 * Only local / non-CMS rasters go through the optimizer:
 * - 128 / 256: fixed 128px icons at 1x / 2x (schedule empty state)
 * - 384 / 640: exclusive mark (≤ 216px) and 1x–2x small boxes
 * - 828 / 1080: 384–480px boxes at 2x (ombuds portrait, story slideshow)
 * - 1290: full-width mobile at 3x (430px viewport)
 */
const OPTIMIZER_WIDTHS = [128, 256, 384, 640, 828, 1080, 1290]

/**
 * Resized variants the CMS stores for every upload (`foo-w480.jpg`, ...).
 * The `width-suffix` transformer can only point at these. Note the GraphQL
 * `resized` type also lists `w1200`, but that file is never generated (404).
 */
const SUFFIX_WIDTHS = [480, 800, 1600, 2400]

module.exports = {
  OPTIMIZER_WIDTHS,
  SUFFIX_WIDTHS,
}

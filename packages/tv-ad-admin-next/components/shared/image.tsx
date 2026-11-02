import { Image as UnpicImage } from '@unpic/react/base'
import {
  type ComponentProps,
  type CSSProperties,
  type ImgHTMLAttributes,
} from 'react'

/**
 * Same props as mirror-tv-next's `components/shared/image.tsx`.
 *
 * - `nextjs`: resize through the Next.js optimizer (`/_next/image`)
 * - `none`: serve `src` as-is (SVG, GIF, already-sized assets)
 */
export type ImageLoader = 'nextjs' | 'none'

/**
 * Next's default `images.deviceSizes` up to 1920; /_next/image rejects any
 * other width. Images here are at most ~900px wide, so 1920 covers 2x.
 */
const OPTIMIZER_WIDTHS = [640, 828, 1080, 1200, 1920]

type SizeProps =
  /** Absolutely positioned over the positioned parent (next/image). */
  | { fill: true; width?: never; height?: never }
  | { fill?: false; width: number; height: number }

export type ImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt' | 'width' | 'height' | 'srcSet'
> &
  SizeProps & {
    src: string
    alt: string
    /** Defaults to `nextjs`, or `none` for SVG / GIF / data URLs. */
    loader?: ImageLoader
    /** Eager-load with high fetch priority. */
    priority?: boolean
  }

const snapTo = (width?: number) =>
  OPTIMIZER_WIDTHS.find((w) => width !== undefined && w >= width) ??
  OPTIMIZER_WIDTHS.at(-1)!

const nextjsTransformer = (src: string | URL, { width }: { width?: number }) =>
  `/_next/image?url=${encodeURIComponent(src.toString())}&w=${snapTo(width)}&q=75`

const getDefaultLoader = (src: string): ImageLoader =>
  /\.(svg|gif)(\?|#|$)/i.test(src) || src.startsWith('data:')
    ? 'none'
    : 'nextjs'

/** Same box as next/image: `fill` covers the positioned parent. */
const fillStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
}

export default function Image({
  src,
  loader = getDefaultLoader(src),
  fill,
  width,
  height,
  priority,
  sizes,
  style,
  ...rest
}: ImageProps) {
  const optimized = loader === 'nextjs'

  const breakpoints = optimized
    ? fill
      ? OPTIMIZER_WIDTHS
      : [...new Set([snapTo(width), snapTo(width * 2)])]
    : undefined

  const layoutProps = fill
    ? ({ layout: 'fullWidth' } as const)
    : ({ layout: 'fixed', width, height } as const)

  // unpic's types drop `style` because it normally generates the style
  // itself; with `unstyled` it is passed straight through to <img>.
  const unpicProps = {
    ...rest,
    ...layoutProps,
    src,
    transformer: optimized ? nextjsTransformer : undefined,
    breakpoints,
    priority,
    sizes: sizes ?? (fill ? '100vw' : undefined),
    unstyled: true,
    style: { color: 'transparent', ...(fill && fillStyle), ...style },
  } as unknown as ComponentProps<typeof UnpicImage>

  return <UnpicImage {...unpicProps} />
}

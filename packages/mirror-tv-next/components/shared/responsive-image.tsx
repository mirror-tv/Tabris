'use client'

import { Source } from '@unpic/react/base'
import { type CSSProperties, useState } from 'react'
import Image, {
  type ImageLoader,
  type ImageProps,
  type ImageVariants,
  toVariantsTransformer,
} from '~/components/shared/image'
import { SUFFIX_WIDTHS } from '~/constants/image-widths'
import { withBasePath } from '~/constants/with-base-path'
import type { PostImage } from '~/utils'

const DEFAULT_IMAGE = withBasePath('/images/image-default.jpg')
const LOADING_IMAGE = withBasePath('/images/loading.svg')

/** `PostImage` key -> width of the file it holds (`w400` is the CMS `w480`). */
const POST_IMAGE_WIDTHS = {
  w400: 480,
  w800: 800,
  w1600: 1600,
  w2400: 2400,
} as const

/** `foo.jpg` / `foo-w480.jpg` -> base `foo`, CMS suffix, extension. */
const CMS_FILENAME = /^(.+?)(-w\d+)?\.(jpe?g|png|webp)$/i

type ImageSources = {
  src: string
  variants?: ImageVariants
  webpVariants?: ImageVariants
}

const toPostImageVariants = (images: PostImage): ImageVariants =>
  Object.fromEntries(
    Object.entries(POST_IMAGE_WIDTHS).map(([key, width]) => [
      width,
      images[key as keyof typeof POST_IMAGE_WIDTHS],
    ])
  )

const toSuffixVariants = (base: string, ext: string): ImageVariants =>
  Object.fromEntries(SUFFIX_WIDTHS.map((w) => [w, `${base}-w${w}.${ext}`]))

const isLocal = (src: string) => src.startsWith('/') && !src.startsWith('//')

/**
 * The CMS stores every upload as `foo.jpg` plus `foo-w{width}.jpg` and
 * `foo-w{width}.webP` siblings, so a single URL is enough to list them.
 * The original (no suffix) is kept as the non-webp fallback.
 */
const fromUrl = (url: string): ImageSources => {
  const match = isLocal(url) ? null : url.match(CMS_FILENAME)
  if (!match) return { src: url }

  const [, base, suffix, ext] = match
  return {
    src: url,
    variants: suffix ? toSuffixVariants(base, ext) : undefined,
    webpVariants: toSuffixVariants(base, 'webP'),
  }
}

const fromPostImage = (
  images: PostImage,
  imagesWebP?: PostImage
): ImageSources => ({
  src: images.original,
  variants: toPostImageVariants(images),
  webpVariants: imagesWebP && toPostImageVariants(imagesWebP),
})

const hasVariants = (variants?: ImageVariants) =>
  !!variants && !!toVariantsTransformer(variants)

/** Box of the `fill` mode, as next/image expects of a `fill` parent. */
const boxStyle: CSSProperties = { position: 'relative', display: 'block' }

/** Leaves the `<img>` laid out as if `<picture>` were not there. */
const contentsStyle: CSSProperties = { display: 'contents' }

type ResponsiveImageProps = Omit<
  ImageProps,
  'src' | 'loader' | 'variants' | 'fill' | 'width' | 'height' | 'placeholder'
> & {
  /**
   * Formatted CMS image, or a CMS image URL (`foo.jpg` / `foo-w480.jpg`).
   * A local path is served as is; pass its resized files as a `PostImage`.
   */
  images: PostImage | string | null | undefined
  /** WebP variants of a formatted `images`. */
  imagesWebP?: PostImage | null
  /**
   * - `true`: `<picture>` is a positioned block taking `className` / `style`
   *   (give it a size, e.g. `aspectRatio`), and the image covers it
   * - default: the image sits in flow at 100% × 100% of its parent and takes
   *   `className` / `style` itself
   */
  fill?: boolean
  /** Shown until the image loads. Defaults to a spinner unless `priority`. */
  placeholder?: string | null
}

/**
 * CMS images: picks the pre-resized file (webp first) that fits `sizes`, and
 * falls back to the default image when nothing loads.
 */
export default function ResponsiveImage({
  images,
  imagesWebP,
  fill = false,
  priority,
  placeholder = priority ? null : LOADING_IMAGE,
  sizes,
  className,
  style,
  onError,
  ...rest
}: ResponsiveImageProps) {
  // 'webp': a webp variant failed, retry with the other format
  // 'all': nothing loaded, show the default image
  const [failed, setFailed] = useState<'webp' | 'all' | null>(null)

  const sources: ImageSources =
    failed === 'all' || !images
      ? { src: DEFAULT_IMAGE }
      : typeof images === 'string'
      ? fromUrl(images)
      : fromPostImage(images, imagesWebP ?? undefined)

  const variants = hasVariants(sources.variants) ? sources.variants : undefined
  const webpTransformer =
    failed === null && sources.webpVariants
      ? toVariantsTransformer(sources.webpVariants)
      : undefined
  // Without pre-resized files, serve `src` as is (never through `/_next/image`).
  const loader: ImageLoader | undefined = variants ? undefined : 'none'

  const handleError: ImageProps['onError'] = (e) => {
    if (failed === null && webpTransformer) {
      setFailed('webp')
    } else if (failed !== 'all' && sources.src !== DEFAULT_IMAGE) {
      setFailed('all')
    }
    onError?.(e)
  }

  return (
    <picture
      className={fill ? className : undefined}
      style={fill ? { ...boxStyle, ...style } : contentsStyle}
    >
      {webpTransformer && (
        <Source
          type="image/webp"
          src={sources.src}
          layout="fullWidth"
          breakpoints={webpTransformer.widths}
          transformer={webpTransformer.transform}
          sizes={sizes}
        />
      )}
      <Image
        {...rest}
        src={sources.src}
        loader={loader}
        variants={variants}
        fill={fill || 'flow'}
        priority={priority}
        placeholder={placeholder ?? undefined}
        sizes={sizes}
        className={fill ? undefined : className}
        style={{ objectFit: 'cover', ...(fill ? undefined : style) }}
        onError={handleError}
      />
    </picture>
  )
}

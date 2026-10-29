'use client'

import { Image as UnpicImage } from '@unpic/react/base'
import {
  type ComponentProps,
  type CSSProperties,
  type ImgHTMLAttributes,
  type SyntheticEvent,
  useRef,
  useState,
} from 'react'
import { SUFFIX_WIDTHS } from '~/constants/image-widths'

/**
 * - `width-suffix`: swap the CMS `-w{width}` filename suffix
 * - `none`: serve `src` as-is (SVG, GIF, already-sized assets)
 */
export type ImageLoader = 'width-suffix' | 'none'

type Transformer = (src: string | URL, operations: { width?: number }) => string

type TransformerConfig = { widths: number[]; transform: Transformer }

/** Pre-resized files keyed by their pixel width, e.g. CMS `w480` / `w800`. */
export type ImageVariants = Partial<Record<number, string>>

type SizeProps =
  /**
   * - `true`: absolutely positioned over the positioned parent (next/image)
   * - `'flow'`: stays in flow at 100% × 100% of the parent box
   */
  | { fill: true | 'flow'; width?: never; height?: never }
  | { fill?: false; width: number; height: number }

export type ImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt' | 'width' | 'height' | 'srcSet' | 'placeholder'
> &
  SizeProps & {
    src: string
    alt: string
    /** Defaults to `none`. */
    loader?: ImageLoader
    /** Pick from these files instead of resizing `src` (overrides `loader`). */
    variants?: ImageVariants
    /** Eager-load with high fetch priority (React 19 also preloads it). */
    priority?: boolean
    /** Background image shown until the image has loaded. */
    placeholder?: string
  }

const snapTo = (widths: number[], width?: number) =>
  widths.find((w) => width !== undefined && w >= width) ?? widths.at(-1)!

/** `undefined` when no variant has a URL. */
export const toVariantsTransformer = (
  variants: ImageVariants
): TransformerConfig | undefined => {
  const widths = Object.keys(variants)
    .map(Number)
    .filter((w) => variants[w])
    .sort((a, b) => a - b)
  if (!widths.length) return undefined
  return {
    widths,
    transform: (_src, { width }) => variants[snapTo(widths, width)]!,
  }
}

const transformers: Record<Exclude<ImageLoader, 'none'>, TransformerConfig> = {
  'width-suffix': {
    widths: SUFFIX_WIDTHS,
    transform: (src, { width }) =>
      src.toString().replace(/(-w\d+)/, `-w${snapTo(SUFFIX_WIDTHS, width)}`),
  },
}

/** Same box as next/image: `fill` covers the positioned parent. */
const fillStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
}

const flowFillStyle: CSSProperties = {
  width: '100%',
  height: '100%',
}

export default function Image({
  src,
  loader = 'none',
  variants,
  fill,
  width,
  height,
  priority,
  placeholder,
  sizes,
  style,
  onLoad,
  onError,
  ...rest
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const isHydrationChecked = useRef(false)
  const transformer = variants
    ? toVariantsTransformer(variants)
    : loader === 'none'
    ? undefined
    : transformers[loader]

  const breakpoints = transformer
    ? fill
      ? transformer.widths
      : [
          ...new Set([
            snapTo(transformer.widths, width),
            snapTo(transformer.widths, width * 2),
          ]),
        ]
    : undefined

  const showPlaceholder = !!placeholder && !isLoaded
  const handleLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true)
    onLoad?.(e)
  }

  // Like next/image: an image that finished before hydration never fires
  // load/error to React, so replay them once the <img> is attached.
  const handleRef = (img: HTMLImageElement | null) => {
    if (!img || isHydrationChecked.current) return
    isHydrationChecked.current = true
    if (!img.complete) return
    if (img.naturalWidth > 0) {
      img.dispatchEvent(new Event('load'))
    } else if (onError) {
      // eslint-disable-next-line no-self-assign
      img.src = img.src
    }
  }

  const layoutProps = fill
    ? ({ layout: 'fullWidth' } as const)
    : ({ layout: 'fixed', width, height } as const)

  // unpic's types drop `style` (and `ref`) because it normally generates the
  // style itself; with `unstyled` both are passed straight through to <img>.
  const unpicProps = {
    ...rest,
    ...layoutProps,
    src,
    transformer: transformer?.transform,
    breakpoints,
    priority,
    sizes: sizes ?? (fill ? '100vw' : undefined),
    unstyled: true,
    style: {
      color: 'transparent',
      ...(fill === true && fillStyle),
      ...(fill === 'flow' && flowFillStyle),
      ...(showPlaceholder && {
        backgroundImage: `url(${placeholder})`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        backgroundRepeat: 'no-repeat',
      }),
      ...style,
    },
    ref: handleRef,
    onLoad: handleLoad,
    onError,
  } as unknown as ComponentProps<typeof UnpicImage>

  return <UnpicImage {...unpicProps} />
}

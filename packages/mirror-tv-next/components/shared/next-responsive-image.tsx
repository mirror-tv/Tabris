'use client'

import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image, { type ImageProps, type ImageLoader } from 'next/image'
import { useEffect, useState } from 'react'

interface NextResponsiveImageProps extends Omit<ImageProps, 'src'> {
  src: string
  fallback: string | StaticImport
  srcSet?: number[]
}

export const imageLoader: ImageLoader = ({ src, width }) => {
  return src.replace(/(-w\d+)/, `-w${width}`)
}

export default function NextResponsiveImage(props: NextResponsiveImageProps) {
  const { src, fallback, style, alt, srcSet, className, ...restProps } = props

  const [error, setError] =
    useState<React.SyntheticEvent<HTMLImageElement> | null>(null)

  const sourceImageLoader = ({
    src,
    width,
  }: {
    src: string
    width: number[]
  }) => {
    if (src.includes('-w')) {
      return width
        .map(
          (w) => src.replace(/(-w\d+)(\.\w+)$/, '-w' + w + '$2') + ' ' + w + 'w'
        )
        .join(', ')
    }

    return width
      .map((w) => `${src.replace(/(\.\w+)$/, `-w${w}$1`)} ${w}w`)
      .join(', ')
  }

  useEffect(() => {
    setError(null)
  }, [])

  if (restProps?.width || restProps?.height) {
    return <Image loader={imageLoader} {...props} alt={alt} />
  }

  return (
    <picture
      style={{
        position: 'relative',
        display: 'block',
        ...style,
      }}
      className={className}
    >
      {!error && (
        <source
          type="image/webp"
          src={src}
          srcSet={
            srcSet &&
            sourceImageLoader({
              src,
              width: srcSet,
            })
          }
        />
      )}
      <Image
        alt={alt}
        src={fallback}
        loader={imageLoader}
        onError={setError}
        style={{ objectFit: 'cover' }}
        {...restProps}
      />
    </picture>
  )
}

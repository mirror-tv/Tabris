import styles from './_styles/image-block.module.scss'
import {
  ApiDataBlockType,
  type ApiDataBlockBase,
  type ImageDataFormatNew,
  type ImageDataFormatOld,
} from './type'
import ResponsiveImage from '~/components/shared/responsive-image'
import type { PostImage } from '~/utils'

// 聯合類型
type ImageData = ImageDataFormatNew | ImageDataFormatOld

export interface ApiImageBlock extends ApiDataBlockBase {
  type: ApiDataBlockType.Image
  content: ImageData[]
  alignment: 'center'
}

const isFormatNew = (data: ImageData): data is ImageDataFormatNew => {
  return 'resized' in data
}

const isFormatOld = (data: ImageData): data is ImageDataFormatOld => {
  return 'desktop' in data
}

type ImageSources = {
  original?: string
  w480?: string
  w800?: string
  w1200?: string
  w1600?: string
  w2400?: string
}

function toPostImage(images: ImageSources): PostImage {
  const original =
    images.original ??
    images.w1600 ??
    images.w1200 ??
    images.w800 ??
    images.w480 ??
    ''

  return {
    original,
    w400: images.w480,
    w800: images.w800 ?? images.w480,
    w1600: images.w1600 ?? images.w1200,
    w2400: images.w2400,
    w3200: images.w2400 ?? images.original,
  }
}

const normalizeImageData = (imageData: ImageData) => {
  if (isFormatNew(imageData)) {
    const isGif =
      imageData.file?.url?.toLowerCase().endsWith('.gif') ??
      imageData.name?.toLowerCase().endsWith('.gif') ??
      false

    return {
      images: toPostImage(imageData.resized),
      imagesWebP:
        isGif || !imageData.resizedWebp
          ? undefined
          : toPostImage(imageData.resizedWebp),
      alt: imageData.name || (imageData.desc ?? ''),
      description: imageData.desc ?? '',
      width: imageData.file?.width ?? 16,
      height: imageData.file?.height ?? 9,
      isFormat1: true,
    }
  }

  if (isFormatOld(imageData)) {
    const images = {
      w480: imageData.tiny.url,
      w800: imageData.mobile.url,
      w1200: imageData.tablet.url,
      w1600: imageData.desktop.url,
      w2400: imageData.desktop.url,
      original: imageData.original.url,
    }

    return {
      images: toPostImage(images),
      imagesWebP: undefined,
      alt: imageData.title || imageData.name,
      description: imageData.title,
      width: imageData.original.width || 16,
      height: imageData.original.height || 9,
      isFormat1: false,
    }
  }

  return {
    images: { original: '' },
    imagesWebP: undefined,
    alt: 'Image',
    description: '',
    width: 16,
    height: 9,
    isFormat1: false,
  }
}

const ImageBlock = ({ data }: { data: ApiImageBlock }) => {
  const imageData = data.content[0]

  if (!imageData) {
    console.warn('ImageBlock: No image data found')
    return null
  }

  const normalizedData = normalizeImageData(imageData)

  return (
    <caption>
      <div className={styles.imageCaption}>
        <ResponsiveImage
          images={normalizedData.images}
          imagesWebP={normalizedData.imagesWebP}
          alt={normalizedData.alt}
          rwd={{ mobile: '800px', tablet: '1200px', desktop: '1200px' }}
          priority={false}
          imgClassName={styles.image}
        />
      </div>
      {normalizedData.description && (
        <figcaption className={styles.imageDescription}>
          {normalizedData.description}
        </figcaption>
      )}
    </caption>
  )
}

export default ImageBlock

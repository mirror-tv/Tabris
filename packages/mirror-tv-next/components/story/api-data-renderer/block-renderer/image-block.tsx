import styles from './_styles/image-block.module.scss'
import {
  ApiDataBlockType,
  type ApiDataBlockBase,
  type ImageDataFormatNew,
  type ImageDataFormatOld,
} from './type'
import ResponsiveImage from '~/components/shared/responsive-image'

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

const normalizeImageData = (imageData: ImageData) => {
  if (isFormatNew(imageData)) {
    const isGif =
      imageData.file?.url?.toLowerCase().endsWith('.gif') ??
      imageData.name?.toLowerCase().endsWith('.gif') ??
      false
    const src = isGif
      ? imageData.resized
      : imageData.resizedWebp ?? imageData.resized
    const images = {
      original: src.original ?? src.w1600 ?? src.w800 ?? src.w480 ?? '',
      w800: src.w800,
      w1600: src.w1600,
      w2400: src.w2400,
      w3200: src.w2400 ?? src.original,
      w400: src.w480,
    }
    return {
      images,
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
      images,
      alt: imageData.title || imageData.name,
      description: imageData.title,
      width: imageData.original.width || 16,
      height: imageData.original.height || 9,
      isFormat1: false,
    }
  }

  return {
    images: { original: '' },
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

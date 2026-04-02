import styles from './_styles/image-block.module.scss'
import {
  ApiDataBlockType,
  type ApiDataBlockBase,
  type ImageDataFormatNew,
  type ImageDataFormatOld,
} from './type'
import ResponsiveImage from '~/components/shared/responsive-image'
import { formateHeroImage } from '~/utils'

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
    const { images, imagesWebP } = formateHeroImage({
      resized: imageData.resized,
      resizedWebp: isGif ? undefined : imageData.resizedWebp,
    })

    return {
      images,
      imagesWebP,
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
      images: formateHeroImage(images).images,
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

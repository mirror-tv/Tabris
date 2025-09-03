import styles from './_styles/image-block.module.scss'
import { ApiDataBlockType, type ApiDataBlockBase } from './type'
import ResponsiveImage from '~/components/shared/responsive-image'

type ImageDataFormatNew = {
  id: string
  desc: string
  name: string
  resized: {
    w480: string
    w800: string
    w1200: string
    w1600: string
    w2400: string
    original: string
    __typename: string
  }
  imageFile: {
    url: string
    width: number
    height: number
    __typename: string
  }
  __typename: string
  resizedWebp: {
    w480: string
    w800: string
    w1200: string
    w1600: string
    w2400: string
    original: string
    __typename: string
  }
  title: string
  description: string
  url: string
  original: {
    height: number
    width: number
    url: string
  }
  desktop: {
    height: number
    width: number
    url: string
  }
  tablet: {
    height: number
    width: number
    url: string
  }
  mobile: {
    height: number
    width: number
    url: string
  }
  tiny: {
    height: number
    width: number
    url: string
  }
}

// 第二種格式：使用 desktop, tablet, mobile, tiny
type ImageDataFormatOld = {
  url: string
  original: {
    url: string
    width: number
    height: number
  }
  desktop: {
    url: string
    width: number
    height: number
  }
  tablet: {
    url: string
    width: number
    height: number
  }
  mobile: {
    url: string
    width: number
    height: number
  }
  tiny: {
    url: string
    width: number
    height: number
  }
  id: string
  name: string
  title: string
}

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
    return {
      images: imageData.resizedWebp ?? imageData.resized,
      alt: imageData.title || imageData.name,
      description: imageData.description,
      width: imageData.imageFile?.width || 16,
      height: imageData.imageFile?.height || 9,
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

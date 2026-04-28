import {
  ApiDataBlockType,
  type ApiDataBlockBase,
  type ImageDataFormatNew,
  type ImageDataFormatOld,
} from '../../api-data-renderer/block-renderer/type'
// import styled from 'styled-components'

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

    return {
      images: imageData.resized,
      alt: imageData.name || (imageData.desc ?? ''),
      description: imageData.desc ?? '',
      width: imageData.file?.width ?? 16,
      height: imageData.file?.height ?? 9,
      isFormat1: !isGif,
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

const AmpImageBlock = ({ data }: { data: ApiImageBlock }) => {
  const imageData = data.content[0]

  if (!imageData) {
    console.warn('ImageBlock: No image data found')
    return null
  }

  const normalizedData = normalizeImageData(imageData)
  const imageSrc =
    ('w2400' in normalizedData.images ? normalizedData.images.w2400 : null) ||
    ('w1600' in normalizedData.images ? normalizedData.images.w1600 : null) ||
    ('w1200' in normalizedData.images ? normalizedData.images.w1200 : null) ||
    ('w800' in normalizedData.images ? normalizedData.images.w800 : null) ||
    ('w480' in normalizedData.images ? normalizedData.images.w480 : null) ||
    normalizedData.images?.original ||
    '/images/image-default.jpg'

  return (
    <caption>
      <div className="amp-image-container">
        <amp-img
          src={imageSrc}
          alt={normalizedData.alt}
          layout="responsive"
          width={normalizedData.width.toString()}
          height={normalizedData.height.toString()}
          className="amp-image-contain"
        />
      </div>
      {normalizedData.description && (
        <figcaption className="amp-image-description">
          {normalizedData.description}
        </figcaption>
      )}
    </caption>
  )
}

export default AmpImageBlock

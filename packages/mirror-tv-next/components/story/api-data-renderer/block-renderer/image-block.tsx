import styles from './_styles/image-block.module.scss'
import { ApiDataBlockType, type ApiDataBlockBase } from './type'
import ResponsiveImage from '~/components/shared/responsive-image'

export interface ApiImageBlock extends ApiDataBlockBase {
  type: ApiDataBlockType.Image
  content: Array<{
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
  }>
  alignment: 'center'
}
const ImageBlock = ({ data }: { data: ApiImageBlock }) => {
  const imageData = data.content[0]
  console.log('imageData', imageData)

  return (
    <caption>
      <div
        className={styles.imageCaption}
        style={{
          aspectRatio: `${imageData?.imageFile?.width || 16}/${
            imageData?.imageFile?.height || 9
          }`,
        }}
      >
        <ResponsiveImage
          images={imageData.resizedWebp ?? imageData.resized}
          alt={imageData.title}
          rwd={{ mobile: '800px', tablet: '1200px', desktop: '1200px' }}
          priority={false}
          imgClassName={styles.image}
        />
      </div>
      <figcaption className={styles.imageDescription}>
        {imageData.description}
      </figcaption>
    </caption>
  )
}

export default ImageBlock

import { type ApiDataBlockBase, ApiDataBlockType } from './type'
import styles from './_styles/youtube-block.module.scss'
type ContentYoutube = {
  id: string
  description: string
}

export interface ApiDataYoutube extends ApiDataBlockBase {
  type: ApiDataBlockType.Youtube
  id: string
  content: [ContentYoutube]
  alignment: 'center'
  styles: Record<string, string>
}

const YoutubeBlock = ({
  data,
  isAmp,
}: {
  data: ApiDataYoutube
  isAmp?: boolean
}) => {
  const youtubeData = data.content[0]
  const youtubeId = youtubeData.id
  const youtubeDescription = youtubeData.description
  return (
    <div className={styles.youtubeContainer}>
      {isAmp ? (
        <amp-youtube
          data-videoid={youtubeId}
          width="480"
          height="270"
          layout="responsive"
          className={styles.youtubeIframe}
        ></amp-youtube>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?si=${youtubeDescription}`}
          title={youtubeDescription}
          className={styles.youtubeIframe}
        />
      )}
    </div>
  )
}

export default YoutubeBlock

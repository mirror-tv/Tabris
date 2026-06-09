import { type ApiDataBlockBase, ApiDataBlockType } from './type'
import styles from './_styles/youtube-block.module.scss'
import { extractYoutubeId } from '~/utils'

/** YouTube block content: youtubeId + description */
type ContentYoutube = {
  youtubeId: string
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
  const rawYoutubeId = youtubeData.youtubeId
  const youtubeDescription = youtubeData.description

  let youtubeId = rawYoutubeId?.trim() || ''

  if (youtubeId.includes('youtube.com') || youtubeId.includes('youtu.be')) {
    youtubeId = extractYoutubeId(youtubeId) ?? ''
  } else {
    youtubeId = youtubeId.replace(/^\/+|\/+$/g, '')
  }

  if (!youtubeId) return null

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

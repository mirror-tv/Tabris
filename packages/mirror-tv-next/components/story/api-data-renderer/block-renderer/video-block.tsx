import { type ApiDataBlockBase, ApiDataBlockType } from './type'
import styles from './_styles/video-block.module.scss'
import YoutubeBlock, { type ApiDataYoutube } from './youtube-block'
import { extractYoutubeId } from '../../../../utils'

type VideoContent = {
  id: string
  name: string
  url: string
  youtubeUrl: string | null
  coverPhoto: string | null
}

export interface ApiDataVideo extends ApiDataBlockBase {
  type: ApiDataBlockType.Video
  content: VideoContent[]
  alignment: 'center'
  style: Record<string, string>
}

const VideoBlock = ({
  data,
  isAmp,
}: {
  data: ApiDataVideo
  isAmp?: boolean
}) => {
  const videoContent = data.content[0]

  if (!videoContent || !videoContent.url) {
    console.warn('Video block missing content or URL:', data)
    return null
  }

  const videoUrl = videoContent.url || ''
  const youtubeId = videoContent.youtubeUrl
    ? extractYoutubeId(videoContent.youtubeUrl)
    : null

  const youtubeData = {
    type: ApiDataBlockType.Youtube,
    id: youtubeId || '',
    content: [
      {
        id: youtubeId || '',
        description: videoContent.name || '',
      },
    ],
    alignment: data.alignment,
    styles: data.style,
  } as ApiDataYoutube
  return (
    <div className={styles.videoContainer}>
      {videoContent.youtubeUrl ? (
        <YoutubeBlock isAmp={isAmp} data={youtubeData} />
      ) : isAmp ? (
        <div
          style={{ width: '100%', aspectRatio: '16/9', position: 'relative' }}
        >
          <amp-video src={videoUrl} layout="fill" {...({} as any)}>
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/ogg" />
          </amp-video>
        </div>
      ) : (
        <video
          preload="metadata"
          controls
          playsInline
          muted
          style={{
            textAlign: data.alignment === 'center' ? 'center' : 'left',
            ...data.style,
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      )}

      {videoContent.name && (
        <p
          style={{
            marginTop: '8px',
            fontSize: '14px',
            color: '#666',
            textAlign: data.alignment === 'center' ? 'center' : 'left',
          }}
        >
          {videoContent.name}
        </p>
      )}
    </div>
  )
}

export default VideoBlock

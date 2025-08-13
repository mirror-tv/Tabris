import { type ApiDataBlockBase, ApiDataBlockType } from './type'
import styles from './_styles/video-block.module.scss'

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

const VideoBlock = ({ data }: { data: ApiDataVideo }) => {
  const videoContent = data.content[0]

  // 如果沒有 video 內容，不渲染
  if (!videoContent || !videoContent.url) {
    console.warn('Video block missing content or URL:', data)
    return null
  }

  return (
    <div className={styles.videoContainer}>
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
        <source src={videoContent.url} type="video/mp4" />
        <source src={videoContent.url} type="video/webm" />
        <source src={videoContent.url} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
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

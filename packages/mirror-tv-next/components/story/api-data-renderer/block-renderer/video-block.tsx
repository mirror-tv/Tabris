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

  return (
    <div className={styles.videoContainer}>
      <video src={videoContent.url} controls />
    </div>
  )
}

export default VideoBlock

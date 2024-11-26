import styles from './_styles/live-cam-list.module.scss'
import UiHeadingBordered from '~/components/shared/ui-heading-bordered'
import type { Video } from '~/graphql/query/videos'
import { getVideo } from '~/app/_actions/share/video'
import YoutubeEmbed from '../shared/youtube-embed'
import { extractYoutubeId } from '~/utils'

type LiveCamListProps = {
  title: string
}

export default async function LiveCamList({ title }: LiveCamListProps) {
  let allLiveVideo: Video[] | undefined = []

  try {
    const response = await getVideo({ name: 'live-cam', take: 2 })
    allLiveVideo = response?.data?.allVideos
  } catch (error) {
    return null
  }

  if (!allLiveVideo?.[0]) {
    return null
  }

  return (
    <section className={styles.container}>
      <UiHeadingBordered title={title} className={styles.listTitle} />
      <div>
        <div className={styles.list}>
          {allLiveVideo.map((video) => {
            const youtubeId = extractYoutubeId(video.youtubeUrl || video.url)
            return (
              <YoutubeEmbed
                className={styles.item}
                key={video.id}
                youtubeId={youtubeId}
                autoplay={false}
                muted={false}
                loop={true}
                controls={true}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

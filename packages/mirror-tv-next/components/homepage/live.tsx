import styles from './_styles/live.module.scss'
import { getVideo } from '~/app/_actions/share/video'
import { extractYoutubeId } from '~/utils'
import dynamic from 'next/dynamic'
const YoutubeEmbed = dynamic(() => import('../shared/youtube-embed'))

export default async function Live() {
  let liveUrl: string = ''
  let liveDesc: string = ''

  const response = await getVideo({
    name: 'mnews-live',
    take: 1,
    withDescription: true,
  })
  liveUrl =
    response?.data?.allVideos?.[0]?.youtubeUrl ??
    response?.data?.allVideos?.[0]?.url ??
    ''
  liveDesc = response?.data?.allVideos?.[0]?.description ?? ''

  if (!liveUrl) {
    return null
  }

  return (
    <section className={styles.container}>
      <div className={styles.videoWrapper}>
        <div className={styles.placeholder}>
          <span className={styles.placeholderTitle}>鏡新聞 24 小時直播</span>
          <p className={styles.placeholderDesc}>載入中</p>
        </div>
        <YoutubeEmbed
          className={styles.video}
          youtubeId={extractYoutubeId(liveUrl)}
          autoplay={true}
          muted={true}
          loop={false}
          controls={true}
        />
      </div>
      <div className={styles.info}>
        <p className={styles.desc}>{liveDesc}</p>
        <span className={styles.title}>鏡新聞 LIVE</span>
      </div>
    </section>
  )
}

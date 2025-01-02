import styles from './_styles/live.module.scss'
import { extractYoutubeId } from '~/utils'
import dynamic from 'next/dynamic'
const YoutubeEmbed = dynamic(() => import('../shared/youtube-embed'))

export default async function Live({
  liveData,
}: {
  liveData: {
    id: string
    youtubeUrl: string
    url: string
    description: string
  }
}) {
  if (!liveData?.url && !liveData?.youtubeUrl) {
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
          youtubeId={extractYoutubeId(liveData.url || liveData.youtubeUrl)}
          autoplay={true}
          muted={true}
          loop={false}
          controls={true}
        />
      </div>
      <div className={styles.info}>
        <p className={styles.desc}>{liveData.description}</p>
        <span className={styles.title}>鏡新聞 LIVE</span>
      </div>
    </section>
  )
}

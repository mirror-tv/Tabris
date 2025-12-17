import styles from './_styles/mnews-lives.module.scss'
import { extractYoutubeId } from '~/utils'
import dynamic from 'next/dynamic'
const YoutubeEmbed = dynamic(() => import('../shared/youtube-embed'))
import UiHeadingBordered from '../shared/ui-heading-bordered'

export default async function MNewsLives({
  mnewsLives,
}: {
  mnewsLives: {
    id: string
    youtubeUrl: string
    url: string
    description: string
  }[]
}) {
  if (!mnewsLives?.[0]?.url && !mnewsLives?.[0]?.youtubeUrl) {
    return null
  }

  return (
    <section className={styles.container}>
      <div className={styles.titleWrapper}>
        <UiHeadingBordered title="鏡新聞LIVE" className={styles.title} />
      </div>
      {mnewsLives.map((mnewsLive) => (
        <div className={styles.videoWrapper} key={mnewsLive.id}>
          <div className={styles.placeholder}>
            <span className={styles.placeholderTitle}>鏡新聞 24 小時直播</span>
            <p className={styles.placeholderDesc}>載入中</p>
          </div>
          <YoutubeEmbed
            key={mnewsLive.id}
            className={styles.video}
            youtubeId={extractYoutubeId(mnewsLive.url || mnewsLive.youtubeUrl)}
            autoplay={true}
            muted={true}
            loop={true}
            controls={true}
          />
        </div>
      ))}
    </section>
  )
}

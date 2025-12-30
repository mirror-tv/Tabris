'use client'
import styles from './_styles/mnews-lives.module.scss'
import { extractYoutubeId } from '~/utils'
import dynamic from 'next/dynamic'
const YoutubeEmbed = dynamic(() => import('../shared/youtube-embed'))
import UiHeadingBordered from '../shared/ui-heading-bordered'
import { useRef } from 'react'
import useViewportIntersection from '~/hooks/use-viewport-intersection'

export default function MNewsLives({
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
      {mnewsLives.map((mnewsLive, index) => (
        <VideoWrapperWithTracking
          key={mnewsLive.id}
          mnewsLive={mnewsLive}
          index={index}
        />
      ))}
    </section>
  )
}

function VideoWrapperWithTracking({
  mnewsLive,
  index,
}: {
  mnewsLive: {
    id: string
    youtubeUrl: string
    url: string
    description: string
  }
  index: number
}) {
  const videoWrapperRef = useRef<HTMLDivElement>(null)

  useViewportIntersection(videoWrapperRef, {
    threshold: 0.85, // 85% 進入視口
    duration: 5000, // 連續停留 5 秒
    onTrigger: () => {
      // 觸發事件（只會觸發一次）
      if (typeof window !== 'undefined' && window.dataLayer) {
        // 點擊 index 元素
        const indexElement = document.getElementById(`mnews-live-${index}`)
        if (indexElement) {
          indexElement.click()
        }
      }
    },
  })

  return (
    <div className={styles.videoWrapper} ref={videoWrapperRef}>
      <div
        className={`${styles.index} GTM-view-mnews-live`}
        id={`mnews-live-${index}`}
        data-gtm={`第${index + 1}個鏡新聞LIVE閱讀 5 秒`}
      />
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
  )
}

'use client'
import { useCallback, useRef, useState } from 'react'
import styles from './_styles/ui-aside-video-list.module.scss'
import UiHeadingBordered from './ui-heading-bordered'
import YoutubeEmbed from './youtube-embed'
import { extractYoutubeId } from '~/utils'
import type { YouTubeEvent } from 'react-youtube'

type UiAsideVideosListProps = {
  title: string
  videosList: { id: string; src: string }[]
  isAutoPlay: boolean
  firstPlayTriggerClassName?: string
}

export default function UiAsideVideosList({
  title,
  videosList = [],
  isAutoPlay = false,
  firstPlayTriggerClassName,
}: UiAsideVideosListProps) {
  const triggeredDiv = useRef<HTMLDivElement>(null)
  const [playedIds, setPlayIds] = useState<(number | never)[]>([])
  const handlePlaying = useCallback(
    (e: YouTubeEvent<number>) => {
      if (!firstPlayTriggerClassName || !e) return
      const targetId = e.target?.id
      if (targetId && !playedIds.includes(targetId)) {
        if (triggeredDiv.current) {
          triggeredDiv.current.click()
        }
        setPlayIds((prev) => [...prev, e.target.id])
      }
    },
    [playedIds]
  )
  return (
    <>
      <div
        className={`${firstPlayTriggerClassName} ${styles.hide}`}
        ref={triggeredDiv}
      />
      <div className={styles.titleWrapper}>
        <UiHeadingBordered title={title} />
        {isAutoPlay && <div className={styles.live} />}
      </div>
      <div className={`${styles.list}`}>
        {videosList.map((video) => {
          const youtubeId = extractYoutubeId(video.src)
          return (
            <YoutubeEmbed
              key={video.id}
              youtubeId={youtubeId}
              autoplay={isAutoPlay}
              muted={isAutoPlay}
              loop={true}
              controls={true}
              handlePlaying={handlePlaying}
            />
          )
        })}
      </div>
    </>
  )
}

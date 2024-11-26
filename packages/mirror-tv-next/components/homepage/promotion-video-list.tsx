'use client'
import styles from './_styles/promotion-video-list.module.scss'
import UiHeadingBordered from '~/components/shared/ui-heading-bordered'
import YoutubeEmbed from '../shared/youtube-embed'
import { extractYoutubeId } from '~/utils'
import { PromotionVideo } from '~/graphql/query/promotion-video'
import { fetchPromotionVideosServerAction } from '~/app/_actions/share/promotion-videos'
import { useEffect, useRef, useState } from 'react'
import useWindowDimensions from '~/hooks/use-window-dimensions'

type PromotionVideoListProps = {
  title: string
}

export default function PromotionVideoList({ title }: PromotionVideoListProps) {
  const promotionListRef = useRef<HTMLDivElement>(null)
  const [shouldShowBtn, setShouldShowBtn] = useState(false)
  const { width } = useWindowDimensions()
  const [allPromotionVideos, setAllPromotionVideos] = useState<
    PromotionVideo[]
  >([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPromotionVideosServerAction({
          take: 5,
          pageName: 'homepage',
        })
        setAllPromotionVideos(response?.data?.allPromotionVideos || [])
      } catch (error) {
        setAllPromotionVideos([])
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const checkScrollable = () => {
      const container = promotionListRef.current
      if (container && width) {
        const itemCount = allPromotionVideos?.length || 0
        setShouldShowBtn(width < 358 * itemCount + 20 * (itemCount - 1) + 72)
      }
    }
    checkScrollable()
  }, [allPromotionVideos, width])

  const handleClickPrev = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const container = promotionListRef.current
    if (!container) return
    container.scrollTo({
      left: 0,
      behavior: 'smooth',
    })
  }

  const handleClickNext = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const container = promotionListRef.current
    if (!container) return
    container.scrollTo({
      left: container.scrollWidth - container.clientWidth,
      behavior: 'smooth',
    })
  }

  return (
    !!allPromotionVideos?.length && (
      <section className={styles.container}>
        <UiHeadingBordered title={title} className={styles.listTitle} />
        <div className={styles.listWrapper}>
          <div className={styles.list} ref={promotionListRef}>
            {allPromotionVideos.map((video) => {
              const youtubeId = extractYoutubeId(video.ytUrl)
              return (
                <YoutubeEmbed
                  className={`${styles.item} promotion aside__item`}
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
          {shouldShowBtn && (
            <>
              <div
                className={`${styles.scrollBtn} ${styles.prev}`}
                onClick={handleClickPrev}
              >
                <div className={`${styles.arrow} `} />
              </div>
              <div
                className={`${styles.scrollBtn} ${styles.next}`}
                onClick={handleClickNext}
              >
                <div className={`${styles.arrow} `} />
              </div>
            </>
          )}
        </div>
      </section>
    )
  )
}

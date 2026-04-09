'use client'
import styles from './_styles/editor-choice-video-list.module.scss'
import type { VideoEditorChoice } from '~/graphql/query/video-editor-choice'
import { extractYoutubeId } from '~/utils'
import YoutubeEmbed from '~/components/shared/youtube-embed'
import UiHeadingBordered from '~/components/shared/ui-heading-bordered'
import { useCallback, useEffect, useState } from 'react'
import ResponsiveImage from '~/components/shared/responsive-image'
import { formateHeroImage, type FormattedResponsiveImage } from '~/utils'

type EditorChoiceVideoListProps = {
  title: string
  videoLists: VideoEditorChoice[]
}

export default function EditorChoiceVideoList({
  title,
  videoLists = [],
}: EditorChoiceVideoListProps) {
  const [highlightIndex, setHighLightIndex] = useState(0)
  const [status, setStatus] = useState<null | 'playing'>(null)
  const selectItemToHighlight = (index: number) => {
    setHighLightIndex(index)
  }
  const getImageUrls = (
    item: VideoEditorChoice['videoEditor']
  ): FormattedResponsiveImage => {
    return formateHeroImage(
      item?.heroVideo?.coverPhoto ?? item?.heroImage ?? {}
    )
  }

  const nextVideoCarousel = useCallback(() => {
    setHighLightIndex((prev) => (prev + 1) % videoLists.length)
  }, [videoLists.length])

  const handleEnded = useCallback(() => {
    setStatus(null)
  }, [])

  const handlePlaying = useCallback(() => {
    setStatus('playing')
  }, [])

  useEffect(() => {
    const timer = setInterval(nextVideoCarousel, 5000)
    if (status === 'playing') {
      clearInterval(timer)
    }
    return () => clearInterval(timer)
  }, [status, nextVideoCarousel])

  return (
    <div className={styles.wrapper}>
      <UiHeadingBordered title={title} className={styles.title} />
      <div className={styles.container}>
        <div className={styles.ytContainer}>
          <YoutubeEmbed
            youtubeId={extractYoutubeId(
              videoLists[highlightIndex]?.videoEditor?.heroVideo?.url ?? ''
            )}
            className={styles.feature}
            handleEnded={handleEnded}
            handlePlaying={handlePlaying}
          />
        </div>
        <div className={styles.list}>
          <div className={styles.scroll}>
            {videoLists.map(({ videoEditor }, index) => {
              const { images, imagesWebP } = getImageUrls(videoEditor)
              return (
                <div
                  key={videoEditor?.slug}
                  className={`${styles.item} ${
                    index === highlightIndex ? styles.highlight : ''
                  }`}
                  onClick={() => selectItemToHighlight(index)}
                >
                  <picture>
                    <ResponsiveImage
                      images={images}
                      imagesWebP={imagesWebP}
                      alt={videoEditor?.name ?? 'hero image'}
                      rwd={{
                        mobile: '500px',
                        tablet: '500px',
                        desktop: '500px',
                      }}
                      priority={false}
                    />
                    <span className={styles.videoIcon}></span>
                  </picture>
                  <span>{videoEditor?.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

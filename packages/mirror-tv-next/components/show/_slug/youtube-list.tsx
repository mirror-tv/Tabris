'use client'
import YoutubeEmbed from '~/components/shared/youtube-embed'
import styles from './_styles/youtube-list.module.scss'
import { useEffect, useMemo, useState } from 'react'
import useWindowDimensions from '~/hooks/use-window-dimensions'
import UiLoadMoreButton from '~/components/shared/ui-load-more-button'

export type FormatPlayListItems = {
  name?: string
  id?: string
  items: { id: string; title: string }[] | undefined
  nextPageToken: string | undefined
  totalItems: number
}

type YoutubeListProps = {
  playListObj: FormatPlayListItems
  fetchMoreItems: () => Promise<void>
  isShown: boolean
}

export default function YoutubeList({
  playListObj,
  fetchMoreItems,
  isShown,
}: YoutubeListProps) {
  const [page, setPage] = useState(1)
  const [isFetching, setIsFetching] = useState(false)
  const { width } = useWindowDimensions()
  const isMobile = useMemo(() => {
    return width && width < 768
  }, [width])
  const videoPerPage = useMemo(() => {
    if (!width || width < 768) return 2
    if (width < 1200) return 9
    return 8
  }, [width])
  const renderedVideo = useMemo(() => {
    return playListObj?.items?.slice(0, page * videoPerPage)
  }, [videoPerPage, page])

  const handleClickMore = () => {
    if (
      playListObj?.nextPageToken &&
      playListObj?.items?.length &&
      playListObj?.items?.length <= videoPerPage * (page + 2) &&
      !isFetching
    ) {
      setIsFetching(true)
      fetchMoreItems()
    }
    setPage((prev) => prev + 1)
  }

  useEffect(() => {
    setIsFetching(false)
  }, [playListObj?.items?.length])

  return (
    <section
      key={playListObj.name}
      className={`${styles.list} ${isShown ? styles.active : ''}`}
    >
      {!isMobile && (
        <span className={styles.sectionName}>{playListObj.name}</span>
      )}
      <ol className={styles.listContainer}>
        {renderedVideo?.map((ytItem, index) => {
          return (
            <li key={index + ytItem.id} className={styles.item}>
              <YoutubeEmbed
                youtubeId={ytItem.id}
                autoplay={false}
                muted={false}
                loop={true}
                controls={true}
              />
              <span className={styles.itemName}>{ytItem.title}</span>
            </li>
          )
        })}
      </ol>
      {playListObj?.items?.length &&
        playListObj?.items?.length > videoPerPage * page && (
          <UiLoadMoreButton title="看更多" onClick={handleClickMore} />
        )}
    </section>
  )
}

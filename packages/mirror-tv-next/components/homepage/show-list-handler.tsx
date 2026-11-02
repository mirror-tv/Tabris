'use client'
import styles from './_styles/show-list-handler.module.scss'
import InfiniteScrollList from '@readr-media/react-infinite-scroll-list'
import useWindowDimensions from '~/hooks/use-window-dimensions'
import { useMemo } from 'react'
import Link from '~/components/shared/link'
import type { Show } from '~/types/header'
import ResponsiveImage from '~/components/shared/responsive-image'

type ShowListHandlerProps = {
  initShows: Show[]
  showsCount: number
}

const SHOW_PER_PAGE_MD = 10
const SHOW_PER_PAGE_XL = 12

export default function ShowListHandler({
  initShows,
  showsCount,
}: ShowListHandlerProps) {
  const { width } = useWindowDimensions()
  const pageSize = useMemo(() => {
    return width && width > 1200 ? SHOW_PER_PAGE_XL : SHOW_PER_PAGE_MD
  }, [width])

  const fetchMoreShows = async (page: number) => {
    const startIdx = pageSize * (page - 1)
    const endIdx = pageSize * page
    return initShows.slice(startIdx, Math.min(endIdx, initShows.length))
  }

  return (
    <InfiniteScrollList<Show>
      initialList={initShows.slice(0, pageSize)}
      pageSize={pageSize}
      amountOfElements={showsCount}
      fetchListInPage={fetchMoreShows}
      isAutoFetch={(width && width < 768) || false}
      loader={<button className={styles.load}>看更多</button>}
      key={pageSize}
    >
      {(renderList) => (
        <ol className={`${styles.showList} show-list `}>
          {renderList.map((item) => {
            return (
              <Link
                id={item.id}
                key={item.id}
                className={`${styles.item} GTM-homepage-show-card`}
                href={`/show/${item.slug}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <ResponsiveImage
                  images={item.bannerImage}
                  fill
                  sizes="320px"
                  alt={item.name}
                  style={{ aspectRatio: '32 / 12' }}
                />
              </Link>
            )
          })}
        </ol>
      )}
    </InfiniteScrollList>
  )
}

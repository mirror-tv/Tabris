'use client'
import styles from './_styles/show-list-handler.module.scss'
import InfiniteScrollList from '@readr-media/react-infinite-scroll-list'
import useWindowDimensions from '~/hooks/use-window-dimensions'
import { useMemo } from 'react'
import Link from '~/components/shared/link'
import type { Show } from '~/types/header'
import NextResponsiveImage from '../shared/next-responsive-image'

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
                <NextResponsiveImage
                  fill
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="/images/loading.svg"
                  src={
                    item.bannerImage?.replace(/\.(jpg|png)$/i, '.webP') ??
                    '/images/image-default.jpg'
                  }
                  sizes="(max-width: 768px) 50vw, 30vw"
                  srcSet={[480, 800]}
                  alt={item.name}
                  priority={false}
                  style={{ aspectRatio: '32 / 12' }}
                  fallback={item.bannerImage}
                />
              </Link>
            )
          })}
        </ol>
      )}
    </InfiniteScrollList>
  )
}

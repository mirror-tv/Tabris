'use client'
import styles from './_styles/show-list-handler.module.scss'
import { getShows } from '~/app/_actions/homepage/shows'
import { Show } from '~/graphql/query/shows'
import InfiniteScrollList from '@readr-media/react-infinite-scroll-list'
import useWindowDimensions from '~/hooks/use-window-dimensions'
import { useMemo, useState } from 'react'
import Image from '@readr-media/react-image'
import { formateHeroImage } from '~/utils'

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
  const [showsHasFetched, setShowsHasFetched] = useState(initShows)
  const { width } = useWindowDimensions()
  const pageSize = useMemo(() => {
    return width && width > 1200 ? SHOW_PER_PAGE_XL : SHOW_PER_PAGE_MD
  }, [width])

  const fetchMoreShows = async (page: number) => {
    const startIdx = pageSize * (page - 1)
    const endIdx = pageSize * page
    const renderedShowsCount = startIdx
    const showNotRendered = showsHasFetched.length - renderedShowsCount

    // 如果目前資料已經足夠顯示當前頁數的內容
    if (showNotRendered > pageSize) {
      return showsHasFetched.slice(
        startIdx,
        Math.min(endIdx, showsHasFetched.length)
      )
    }

    // 當 data 不足以滿足頁面需求時，進行新的數據請求
    const takeCount = pageSize - showNotRendered
    const res = await getShows({
      take: takeCount,
      skip: showsHasFetched.length,
      isGetCount: false,
    })
    const newShows = res?.data?.allShows ?? []

    // 合併新舊數據
    const newCombinedShows = [...showsHasFetched, ...newShows]
    setShowsHasFetched(newCombinedShows)

    // 返回需要渲染的內容，確保最後一頁能包含所有剩餘的內容
    return newCombinedShows.slice(
      startIdx,
      Math.min(endIdx, newCombinedShows.length)
    )
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
        <ol className={styles.showList}>
          {renderList.map((item) => (
            <li key={item.id} className={styles.item}>
              <Image
                key={item.id}
                loadingImage="/images/loading.svg"
                defaultImage="/images/image-default.jpg"
                images={formateHeroImage(item.bannerImg || {})}
                alt="loading banner image"
                objectFit="cover"
                rwd={{
                  mobile: '500px',
                  tablet: '500px',
                  laptop: '500px',
                  desktop: '500px',
                  default: '500px',
                }}
              />
            </li>
          ))}
        </ol>
      )}
    </InfiniteScrollList>
  )
}

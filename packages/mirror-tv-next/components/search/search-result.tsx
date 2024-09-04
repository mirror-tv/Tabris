'use client'
import styles from './_styles/search-result.module.scss'
import UiPostCard from '~/components/shared/ui-post-card'
import { formateHeroImage } from '~/utils'
import UiLoadMoreButton from '../shared/ui-load-more-button'
import type { SearchItem, SearchResponse } from '~/types/search'
import InfiniteScrollList from '@readr-media/react-infinite-scroll-list'
import { searchAPI } from '~/app/search/[keyword]/action'
import errors from '@twreporter/errors'
import { GPTPlaceholderDesktop } from '../ads/gpt/gpt-placeholder'
import GptAd from '../ads/gpt/gpt-ad'

type SearchResultProps = {
  keyword: string
  searchResultList: SearchItem[]
  startIndex: number
  searchResultNumber: number
}
const CARD_PER_PAGE = 12
const SearchResult = ({
  keyword,
  searchResultList,
  startIndex,
  searchResultNumber,
}: SearchResultProps) => {
  const formatResultCard = (item: SearchItem) => {
    const date = new Date(
      item.pagemap.metatags?.[0]?.['article:published_time'] ?? ''
    )
    return {
      title: item.title,
      date,
      href: item.link,
      images: formateHeroImage(
        item?.pagemap?.cse_image?.[0]?.src
          ? {
              urlOriginal: item?.pagemap?.cse_image?.[0]?.src,
            }
          : {}
      ),
      postStyle: 'article',
      mobileLayoutDirection: 'column' as const,
      postTitleHighlightText: keyword,
    }
  }
  const handleClickLoadMore = async (page: number) => {
    try {
      const res: SearchResponse | null = await searchAPI(
        keyword,
        (page - 1) * 20 + startIndex,
        20
      )
      return res?.items || []
    } catch (err) {
      console.error(
        JSON.stringify({
          severity: 'ERROR',
          message: errors.helpers.printAll(
            err,
            {
              withStack: true,
              withPayload: true,
            },
            0,
            0
          ),
        })
      )
      return []
    }
  }

  return (
    <main className={styles.main}>
      <GPTPlaceholderDesktop>
        <p>廣告</p>
        <GptAd pageKey="all" adKey="PC_HD" />
      </GPTPlaceholderDesktop>
      <p className={styles.searchKeyword}>{keyword}</p>
      <ol className={`${styles.searchResultList} search-result__list`}>
        <InfiniteScrollList
          initialList={searchResultList}
          pageSize={CARD_PER_PAGE}
          amountOfElements={searchResultNumber}
          fetchListInPage={handleClickLoadMore}
          isAutoFetch={false}
          loader={
            <UiLoadMoreButton
              title="看更多"
              className={`${styles.more} g-button-load-more`}
            />
          }
        >
          {(list) => {
            return list.map((item) => {
              const props = formatResultCard(item)
              return (
                <li key={item.htmlTitle}>
                  <UiPostCard {...props} />
                </li>
              )
            })
          }}
        </InfiniteScrollList>
      </ol>
    </main>
  )
}

export default SearchResult

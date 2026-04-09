'use client'
import { useState } from 'react'
import UiPostCard from '~/components/shared/ui-post-card'
import {
  fetchPostsItems,
  fetchExternalsByTagName,
} from '~/app/_actions/tag/posts-by-tag'
import { type PostCardItem } from '~/graphql/query/posts'
import styles from './_styles/posts-list-manager.module.scss'
import { type FormattedPostCard } from '~/utils'
import UiLoadMoreButton from '../shared/ui-load-more-button'
import { type External } from '~/graphql/query/externals'
import InfiniteScrollList from '@readr-media/react-infinite-scroll-list'
import { combineAndSortedByPublishedTime } from '~/utils/post-handler'

type TagPostsListManagerProps = {
  tagName: string
  pageSize: number
  postsCount: number
  initPostsList: PostCardItem[]
  initExternalsList: External[]
  externalsCount: number
}

export default function TagPostsListManager({
  tagName,
  pageSize,
  postsCount,
  initPostsList,
  initExternalsList,
  externalsCount,
}: TagPostsListManagerProps) {
  const initFetchList = combineAndSortedByPublishedTime([
    ...initPostsList,
    ...initExternalsList,
  ])
  const isExternal = (post: FormattedPostCard) => post.__typename === 'External'

  /* 
  關於改使用 useState，Gemini 的解釋：
  如果一個值只在組件內部被讀取和修改，且它的變化不應該觸發重新渲染（例如，計時器 ID、DOM 元素引用），那麼 useRef 是合適的。
  如果一個值雖然不直接渲染，但它的變化會影響到組件的行為或邏輯，而這些行為或邏輯的變化最終會導致 UI 的更新（即使是間接的），那麼 useState 通常是更安全的選擇，因為它能保證所有依賴這個值的邏輯都能在最新狀態下執行。
  在您的情境中，differentPostsCount 顯然屬於後者。它決定了何時以及如何發送網絡請求，這些請求的結果最終會更新 postsList，而 postsList 的更新是會觸發 UI 渲染的。因此，確保 differentPostsCount 的即時性至關重要。
  所以，雖然從「不直接渲染」的角度看 useRef 似乎合理，但從「狀態變化影響副作用邏輯」的角度看，useState 才是解決陳舊閉包問題並確保邏輯正確性的更佳選擇。我之前建議的方案（將 useRef 改為 useState，並使用 function 更新）就是為了解決這個核心問題
  **/
  const [differentPostsCount, setDifferentPostsCount] = useState(() => {
    const renderedPosts = initFetchList
      .slice(0, pageSize)
      .filter((post) => !isExternal(post)).length
    const renderedExternals = initFetchList
      .slice(0, pageSize)
      .filter((post) => isExternal(post)).length

    return {
      rendered: {
        posts: renderedPosts,
        externals: renderedExternals,
      },
      fetched: {
        posts: initPostsList.length,
        externals: initExternalsList.length,
      },
    }
  })

  const handleClickLoadMore = async () => {
    // 直接從 state 取得最新的 differentPostsCount
    const { rendered, fetched } = differentPostsCount
    const isNeedFetchPost: boolean = fetched.posts - rendered.posts <= pageSize
    const isNeedFetchExternal: boolean =
      fetched.externals - rendered.externals <= pageSize

    let newPosts: PostCardItem[] = []
    let newExternals: External[] = []
    if (isNeedFetchPost) {
      const postRes = await fetchPostsItems({
        page: fetched.posts / pageSize,
        tagName,
        pageSize,
        isWithCount: false,
      })
      newPosts = postRes.allPosts ?? []
    }
    if (isNeedFetchExternal) {
      const externalRes = await fetchExternalsByTagName({
        page: fetched.externals / pageSize,
        tagName,
        pageSize,
        isWithCount: false,
      })
      newExternals = externalRes.allExternals ?? []
    }

    const newlyFetchedAndCombined = combineAndSortedByPublishedTime([
      ...newExternals,
      ...newPosts,
    ])

    setDifferentPostsCount((prevCounts) => ({
      rendered: {
        posts:
          prevCounts.rendered.posts +
          newlyFetchedAndCombined.filter((post) => !isExternal(post)).length,
        externals:
          prevCounts.rendered.externals +
          newlyFetchedAndCombined.filter(isExternal).length,
      },
      fetched: {
        posts: prevCounts.fetched.posts + newPosts.length,
        externals: prevCounts.fetched.externals + newExternals.length,
      },
    }))

    return newlyFetchedAndCombined
  }

  return (
    <>
      <section className={styles.list}>
        <InfiniteScrollList<FormattedPostCard>
          initialList={initFetchList.slice(0, pageSize)}
          pageSize={pageSize}
          isAutoFetch={false}
          amountOfElements={postsCount + externalsCount}
          fetchListInPage={handleClickLoadMore}
          loader={
            <div className={styles.btnWrapper}>
              <UiLoadMoreButton title="看更多" />
            </div>
          }
        >
          {(renderList) => (
            <ol className={styles.posts}>
              {renderList.map((postItem, index) => (
                <li
                  key={`${index}-${postItem.slug}`}
                  className="list-handler__item"
                >
                  <UiPostCard
                    href={postItem.href}
                    images={postItem.images}
                    imagesWebP={postItem.imagesWebP}
                    title={postItem.name}
                    date={postItem.publishTime}
                    postStyle={postItem.style}
                    mobileLayoutDirection="column"
                    exclusive={postItem.exclusive ?? false}
                  />
                </li>
              ))}
            </ol>
          )}
        </InfiniteScrollList>
      </section>
    </>
  )
}

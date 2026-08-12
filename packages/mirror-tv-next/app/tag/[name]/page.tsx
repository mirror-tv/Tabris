import { type PostCardItem } from '~/graphql/query/posts'
import styles from '~/styles/pages/tag-page.module.scss'
import {
  GLOBAL_CACHE_SETTING,
  SITE_URL,
} from '~/constants/environment-variables'
import TagPostsListManager from '~/components/tag/posts-list-manager'
import {
  fetchPostsItems,
  fetchExternalsByTagName,
} from '~/app/_actions/tag/posts-by-tag'
import type { Metadata } from 'next'
import GPTAd from '~/components/ads/gpt/gpt-ad'
import { GPTPlaceholderDesktop } from '~/components/ads/gpt/gpt-placeholder'
import { type External } from '~/graphql/query/externals'
import { handleResponse } from '~/utils'
import { combineAndSortedByPublishedTime } from '~/utils/post-handler'

export const revalidate = GLOBAL_CACHE_SETTING

export async function generateMetadata(props: {
  params: Promise<{ name: string }>
}): Promise<Metadata> {
  const params = await props.params
  const { name } = params
  const tagName: string = decodeURIComponent(name)

  const canonicalUrl = `${SITE_URL}/tag/${encodeURIComponent(tagName)}`

  let description: string | undefined
  let totalCount = 0
  try {
    const [postsResult, externalsResult] = await Promise.allSettled([
      fetchPostsItems({
        page: 0,
        tagName,
        pageSize: 3,
        isWithCount: true,
      }),
      fetchExternalsByTagName({
        page: 0,
        tagName,
        pageSize: 3,
        isWithCount: true,
      }),
    ])
    const postsCount =
      postsResult.status === 'fulfilled'
        ? postsResult.value?._allPostsMeta?.count ?? 0
        : 0
    const externalsCount =
      externalsResult.status === 'fulfilled'
        ? externalsResult.value?._allExternalsMeta?.count ?? 0
        : 0
    totalCount = postsCount + externalsCount

    const posts =
      postsResult.status === 'fulfilled'
        ? postsResult.value?.allPosts ?? []
        : []
    const externals =
      externalsResult.status === 'fulfilled'
        ? externalsResult.value?.allExternals ?? []
        : []
    const merged = combineAndSortedByPublishedTime([...posts, ...externals])
    const titles = merged
      .slice(0, 3)
      .map((item: { name: string }) => item.name)
      .filter(Boolean)
    if (titles.length > 0) {
      description = titles.join('、')
    }
  } catch {
    description = undefined
  }

  const isIndex = totalCount >= 5

  return {
    metadataBase: new URL(SITE_URL),
    title: `${tagName} - 鏡新聞`,
    description,
    robots: { index: isIndex, follow: true },
    alternates: {
      canonical: isIndex ? canonicalUrl : undefined,
    },
    openGraph: {
      title: `${tagName} - 鏡新聞`,
      description,
      images: {
        url: '/images/default-og-img.jpg',
      },
    },
  }
}

export default async function TagPage(props: {
  params: Promise<{ name: string }>
}) {
  const params = await props.params
  const PAGE_SIZE = 12
  const tagName: string = decodeURIComponent(params.name)
  let initPostsList: PostCardItem[] = []
  let postsCount: number = 0
  let initExternalsList: External[] = []
  let externalsCount: number = 0

  const [postsResult, externalsResult] = await Promise.allSettled([
    fetchPostsItems({
      page: 0,
      tagName,
      pageSize: PAGE_SIZE,
      isWithCount: true,
    }),
    fetchExternalsByTagName({
      page: 0,
      tagName,
      pageSize: PAGE_SIZE,
      isWithCount: true,
    }),
  ])

  initPostsList = handleResponse(
    postsResult,
    (postResponse: Awaited<ReturnType<typeof fetchPostsItems>> | undefined) => {
      postsCount = postResponse?._allPostsMeta?.count ?? 0
      return postResponse?.allPosts ?? []
    },
    'Error occurs while fetching post data in tag page'
  )

  initExternalsList = handleResponse(
    externalsResult,
    (
      externalResponse:
        | Awaited<ReturnType<typeof fetchExternalsByTagName>>
        | undefined
    ) => {
      externalsCount = externalResponse?._allExternalsMeta?.count ?? 0
      return externalResponse?.allExternals ?? []
    },
    'Error occurs while fetching externals data in tag page'
  )

  return (
    <section className={styles.tag}>
      <GPTPlaceholderDesktop>
        <p>廣告</p>
        <GPTAd pageKey="all" adKey="PC_HD" />
      </GPTPlaceholderDesktop>
      <div className={styles.tagWrapper}>
        <h1 className={styles.tagName}>{tagName}</h1>
        {postsCount + externalsCount === 0 ? (
          <p>目前沒有相關的文章</p>
        ) : (
          <TagPostsListManager
            tagName={tagName}
            pageSize={PAGE_SIZE}
            postsCount={postsCount}
            initPostsList={initPostsList}
            externalsCount={externalsCount}
            initExternalsList={initExternalsList}
          />
        )}
      </div>
    </section>
  )
}

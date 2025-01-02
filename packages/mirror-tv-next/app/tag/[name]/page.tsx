import { type PostCardItem } from '~/graphql/query/posts'
import styles from '~/styles/pages/tag-page.module.scss'
import {
  GLOBAL_CACHE_SETTING,
  SITE_URL,
} from '~/constants/environment-variables'
import PostsListManager from '~/components/tag/posts-list-manager'
import {
  fetchPostsItems,
  fetchExternalsByTagName,
} from '~/app/_actions/tag/posts-by-tag'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { GPTPlaceholderDesktop } from '~/components/ads/gpt/gpt-placeholder'
import { type External } from '~/graphql/query/externals'
import { handleResponse } from '~/utils'
const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))

export const revalidate = GLOBAL_CACHE_SETTING

export async function generateMetadata({
  params,
}: {
  params: { name: string }
}): Promise<Metadata> {
  const { name } = params
  const tagName: string = decodeURIComponent(name)

  return {
    metadataBase: new URL(SITE_URL),
    title: `${tagName} - 鏡新聞`,
    openGraph: {
      title: `${tagName} - 鏡新聞`,
      images: {
        url: '/images/default-og-img.jpg',
      },
    },
  }
}

export default async function TagPage({
  params,
}: {
  params: { name: string }
}) {
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
          <PostsListManager
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

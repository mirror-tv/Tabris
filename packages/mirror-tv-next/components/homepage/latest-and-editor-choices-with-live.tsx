import styles from './_styles/latest-and-editor-choices-with-live.module.scss'
import UiHeadingBordered from '~/components/shared/ui-heading-bordered'
import { EditorChoices } from '~/graphql/query/editor-choices'
import { getEditorChoices } from '~/app/_actions/homepage/editor-choice'
import { fetchSales } from '~/app/_actions/share/sales'
import { formatArticleCard, handleResponse } from '~/utils'
import { Sale } from '~/graphql/query/sales'
import { getLatestPostsServerAction } from '~/app/_actions/homepage/latest-posts'
import {
  FILTERED_SLUG,
  HOMEPAGE_POSTS_PAGE_SIZE,
  SALES_LABEL_NAME,
} from '~/constants/constant'
import { PostWithCategory } from '~/graphql/query/posts'
import LatestPostListHandler from './latest-post-list-handler'
import EditorChoicesSwiper from './editor-choices-swiper'
import Live from './live'
import dynamic from 'next/dynamic'
const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))

type LatestAndEditorchoicesWithLiveProps = {
  latestListTitle: string
  liveData: {
    id: string
    youtubeUrl: string
    url: string
    description: string
  }
}

export default async function LatestAndEditorchoicesWithLive({
  latestListTitle,
  liveData,
}: LatestAndEditorchoicesWithLiveProps) {
  let editorChoices: EditorChoices[] = []
  let salesPosts: Sale[] = []
  let latestPosts: PostWithCategory[] = []
  let latestPostsCount = 0
  let initRenderedPosts = []

  const fetchEditorChoiceData = () => getEditorChoices()
  const getSalesData = () => fetchSales({ take: 4, pageName: 'homepage' })
  const responses = await Promise.allSettled([
    fetchEditorChoiceData(),
    getSalesData(),
  ])
  editorChoices = handleResponse(
    responses[0],
    (res: Awaited<ReturnType<typeof fetchEditorChoiceData> | undefined>) => {
      return res?.data?.allEditorChoices ?? []
    },
    'Error occurred while fetching editor-choices data in homepage'
  )
  salesPosts = handleResponse(
    responses[1],
    (res: Awaited<ReturnType<typeof fetchSales> | undefined>) => {
      res?.data?.allSales.forEach((item) => {
        if (item.adPost.categories.length) {
          item.adPost.categories[0].name = SALES_LABEL_NAME
        } else {
          item.adPost.categories.push({ name: SALES_LABEL_NAME })
        }
      })
      return res?.data?.allSales ?? []
    },
    'Error occurred while fetching sales-post data in homepage'
  )

  const filteredSlug = editorChoices
    ?.map((item) => item.choice.slug)
    .concat(FILTERED_SLUG)
  const renderedSalesLength = Math.min(salesPosts?.length || 0, 4)

  const take = HOMEPAGE_POSTS_PAGE_SIZE - renderedSalesLength
  const postsResponse = await getLatestPostsServerAction({
    first: take,
    skip: 0,
    withCount: true,
    filteredSlug: filteredSlug,
  })
  latestPosts = postsResponse?.data?.allPosts
  latestPostsCount = postsResponse?.data?._allPostsMeta?.count ?? 0

  const formattedLatestPosts = latestPosts?.map((post) =>
    formatArticleCard(post)
  )

  if (!salesPosts?.length) {
    initRenderedPosts = formattedLatestPosts
  } else {
    const salesPostsInsertIndex = [3, 5, 8, 10].slice(0, renderedSalesLength)
    const formattedSales = salesPosts.map((post) =>
      formatArticleCard(post.adPost)
    )
    salesPostsInsertIndex.forEach((position, index) => {
      formattedLatestPosts.splice(position, 0, formattedSales[index])
    })
    initRenderedPosts = formattedLatestPosts
  }

  return (
    <>
      <section className={styles.liveAndEditor}>
        <Live liveData={liveData} />
        <EditorChoicesSwiper editorChoices={editorChoices} />
      </section>
      <GPTAd pageKey="home" adKey="MB_M2" />
      <section className={styles.latest}>
        <UiHeadingBordered
          title={latestListTitle}
          className={styles.listTitle}
        />
        <LatestPostListHandler
          initPosts={initRenderedPosts}
          postsCount={latestPostsCount}
          renderedSalesLength={renderedSalesLength}
          filteredSlug={filteredSlug}
        />
      </section>
    </>
  )
}

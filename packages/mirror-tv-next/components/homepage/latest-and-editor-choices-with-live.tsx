import styles from './_styles/latest-and-editor-choices-with-live.module.scss'
import UiHeadingBordered from '~/components/shared/ui-heading-bordered'
import { getLatestPostsAndEditorChoices } from '~/app/_actions/homepage/latest-posts-and-editor-choices'
import { fetchSales } from '~/app/_actions/share/sales'
import { formatArticleCard } from '~/utils'
import { Sale } from '~/graphql/query/sales'
import {
  FILTERED_SLUG,
  HOMEPAGE_POSTS_PAGE_SIZE,
  SALES_LABEL_NAME,
} from '~/constants/constant'
import LatestPostListHandler from './latest-post-list-handler'
import EditorChoicesSwiper from './editor-choices-swiper'
import Live from './live'
import dynamic from 'next/dynamic'
const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))

type LatestAndEditorChoicesWithLiveProps = {
  latestListTitle: string
  liveData: {
    id: string
    youtubeUrl: string
    url: string
    description: string
  }
}

export default async function LatestAndEditorChoicesWithLive({
  latestListTitle,
  liveData,
}: LatestAndEditorChoicesWithLiveProps) {
  let salesPosts: Sale[] = []
  let initRenderedPosts = []

  const salesResponse = await fetchSales({ take: 4, pageName: 'homepage' })
  salesPosts = salesResponse?.data?.allSales || []

  salesPosts.forEach((item) => {
    if (item.adPost.categories.length) {
      item.adPost.categories[0].name = SALES_LABEL_NAME
    } else {
      item.adPost.categories.push({ name: SALES_LABEL_NAME })
    }
  })

  const renderedSalesLength = Math.min(salesPosts?.length || 0, 4)
  const take = HOMEPAGE_POSTS_PAGE_SIZE - renderedSalesLength

  let filteredSlug = salesPosts
    ?.map((item) => item.adPost.slug)
    .concat(FILTERED_SLUG)

  const {
    data: {
      choices: editorChoices,
      latest: latestPosts,
      _allPostsMeta: latestPostsCount,
      source,
    },
  } = await getLatestPostsAndEditorChoices({
    first: take,
    skip: 0,
    withCount: true,
    filteredSlug: [],
    jsonPage: 1,
  })

  filteredSlug = filteredSlug.concat(
    editorChoices?.map((item) => item.choice.slug)
  )

  let formattedLatestPosts = latestPosts?.map((post) => formatArticleCard(post))

  if (!salesPosts?.length) {
    initRenderedPosts = formattedLatestPosts
  } else {
    const salesPostsSlug = salesPosts.map((item) => item.adPost.slug)
    formattedLatestPosts = formattedLatestPosts.filter(
      (item) => !salesPostsSlug.includes(item.slug)
    )
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
          postsCount={latestPostsCount?.count || 0}
          renderedSalesLength={renderedSalesLength || 0}
          filteredSlug={filteredSlug}
          source={source}
        />
      </section>
    </>
  )
}

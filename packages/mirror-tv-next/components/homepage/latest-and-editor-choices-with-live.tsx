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
import EditorChoicesSwiper2025 from './editor-choices-swiper2025'
import EditorChoicesSwiper from './editor-choices-swiper'
import Live from './live'
import dynamic from 'next/dynamic'
import AdTvAdminMobileBanner from '../shared/ad-tv-admin-mobile-banner'
const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))
import { FEATURE_2025_HOMEPAGE_STYLE } from '~/constants/environment-variables'
import PostListWithFirstPage from './post-list-with-first-page'
import PopularPostsAndWeather from './popular-posts-and-weather'
import MNewsLives from './mnews-lives'

type LatestAndEditorChoicesWithLiveProps = {
  latestListTitle: string
  liveData: {
    id: string
    youtubeUrl: string
    url: string
    description: string
  }
  mnewsLives: {
    id: string
    youtubeUrl: string
    url: string
    description: string
  }[]
}

export default async function LatestAndEditorChoicesWithLive({
  latestListTitle,
  liveData,
  mnewsLives,
}: LatestAndEditorChoicesWithLiveProps) {
  const isFeature2025HomepageStyleOn = FEATURE_2025_HOMEPAGE_STYLE === 'on'
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
    first: HOMEPAGE_POSTS_PAGE_SIZE * 2 - renderedSalesLength,
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
      <section
        className={`${styles.liveAndEditor} ${
          !isFeature2025HomepageStyleOn ? styles.reverse : ''
        }`}
      >
        {!isFeature2025HomepageStyleOn && <Live liveData={liveData} />}
        {isFeature2025HomepageStyleOn && <MNewsLives mnewsLives={mnewsLives} />}
        {!isFeature2025HomepageStyleOn && (
          <EditorChoicesSwiper2025 editorChoices={editorChoices} />
        )}
        {isFeature2025HomepageStyleOn && (
          <EditorChoicesSwiper editorChoices={editorChoices} />
        )}
      </section>
      <GPTAd pageKey="home" adKey="MB_M2" />
      <AdTvAdminMobileBanner location="home" />
      <section className={styles.latest}>
        <UiHeadingBordered
          title={latestListTitle}
          className={styles.listTitle}
        />
        {!isFeature2025HomepageStyleOn && (
          <LatestPostListHandler
            initPosts={initRenderedPosts}
            postsCount={latestPostsCount?.count || 0}
            renderedSalesLength={renderedSalesLength || 0}
            filteredSlug={filteredSlug}
            source={source}
          />
        )}
        {isFeature2025HomepageStyleOn && (
          <>
            <PostListWithFirstPage
              initPosts={initRenderedPosts}
              postsCount={latestPostsCount?.count || 0}
              renderedSalesLength={renderedSalesLength || 0}
              filteredSlug={filteredSlug}
              source={source}
            />
            <PopularPostsAndWeather title="熱門新聞" />
          </>
        )}
      </section>
    </>
  )
}

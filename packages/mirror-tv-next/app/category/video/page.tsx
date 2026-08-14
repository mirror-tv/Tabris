import type { Metadata } from 'next'
import { POPULAR_VIDEOS_FILENAME } from '~/constants/json-filenames'
import { SITE_URL } from '~/constants/environment-variables'
import { handleResponse, formatArticleCard, FormattedPostCard } from '~/utils'
import { query } from '~/apollo-client'
import {
  fetchCategoryVideoJson,
  sortCategoriesForVideoPage,
  postJsonToPostCardItem,
} from '~/app/_actions/category-video'
import styles from '~/styles/pages/category-video-page.module.scss'
import VideoPostsList from '~/components/category/video/video-posts-list'
import UiShowsList from '~/components/category/video/ui-shows-list'
import UiLinksList from '~/components/category/video/ui-links-list'
import type { PromotionVideo } from '~/graphql/query/promotion-video'
import type { Video } from '~/graphql/query/videos'
import AsideVideoListHandler from '~/components/category/video/aside-video-list-handler'
import type { VideoEditorChoice } from '~/graphql/query/video-editor-choice'
import { getVideoEditorChoice } from '~/graphql/query/video-editor-choice'
import EditorChoiceVideoList from '~/components/category/video/editor-choice-video-list'
import GPTAd from '~/components/ads/gpt/gpt-ad'
import GptPopup from '~/components/ads/gpt/gpt-popup'
import {
  GPTPlaceholderMobile,
  GPTPlaceholderDesktop,
} from '~/components/ads/gpt/gpt-placeholder'
import UiAsideVideosList from '~/components/shared/ui-aside-videos-list'
import { getVideo } from '~/app/_actions/share/video'
import { fetchPromotionVideosServerAction } from '~/app/_actions/share/promotion-videos'
import type { FormattableHeroImage } from '~/types/hero-image'
import { fetchStaticJson } from '~/utils/fetch-static-json'

export const revalidate = 0

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '影音 - 鏡新聞',
  description: '最新最熱門，深入淺出的影音新聞。',
  alternates: {
    canonical: `${SITE_URL}/category/video`,
  },
  openGraph: {
    title: '影音 - 鏡新聞',
    description: '最新最熱門，深入淺出的影音新聞。',
    images: {
      url: '/images/default-og-img.jpg',
    },
  },
}

type ReportItem = {
  id: string
  name: string
  publishTime: string
  slug: string
  source?: string
  heroImage: FormattableHeroImage
}

type RowPopularVideoData = {
  report: ReportItem[]
}

export default async function VideoCategoryPage() {
  const PAGE_SIZE = 12
  let popularVideos: FormattedPostCard[] = []
  let categoryPosts: {
    posts: FormattedPostCard[]
    count: number
    categorySlug: string
    categoryName: string
  }[] = []
  let allPromotionVideos: PromotionVideo[] = []
  let otherStreamings: Video[] = []
  let liveVideo: Video[] = []
  let allVideoEditorChoices: VideoEditorChoice[] = []

  const fetchCategoryVideoData = () => fetchCategoryVideoJson()

  const fetchPopularPosts = () =>
    fetchStaticJson<RowPopularVideoData>(POPULAR_VIDEOS_FILENAME)

  const fetchPromotionVideos = () =>
    fetchPromotionVideosServerAction({
      take: 5,
      pageName: 'category video page',
    })

  const fetchOtherStreaming = () => getVideo({ name: 'live-cam', take: 2 })

  const fetchLiveVideo = () => getVideo({ name: 'mnews-live', take: 1 })

  const fetchVideoEditorChoice = () =>
    query({
      query: getVideoEditorChoice,
    })

  const responses = await Promise.allSettled([
    fetchCategoryVideoData(),
    fetchPopularPosts(),
    fetchPromotionVideos(),
    fetchOtherStreaming(),
    fetchLiveVideo(),
    fetchVideoEditorChoice(),
  ])

  const categoryVideoJson = handleResponse(
    responses[0],
    (data: Awaited<ReturnType<typeof fetchCategoryVideoJson>> | undefined) =>
      data ?? { categories: [] },
    'Error occurs while fetching category video JSON in video category page'
  )

  popularVideos = handleResponse(
    responses[1],
    (
      popularPostsData:
        | Awaited<ReturnType<typeof fetchPopularPosts>>
        | undefined
    ) => {
      // post in json doesn't have 'style' attribute
      return (
        popularPostsData?.report?.map((post) =>
          formatArticleCard({ ...post, style: 'videoNews' })
        ) ?? []
      )
    },
    'Error occurs while fetching popular videos in video category page'
  )

  allPromotionVideos = handleResponse(
    responses[2],
    (data: Awaited<ReturnType<typeof fetchPromotionVideos>> | undefined) => {
      return data?.data?.allPromotionVideos ?? []
    },
    'Error occurs while fetching all promotion videos in video category page'
  )

  otherStreamings = handleResponse(
    responses[3],
    (data: Awaited<ReturnType<typeof fetchOtherStreaming>> | undefined) => {
      return data?.data?.allVideos ?? []
    },
    'Error occurs while fetching other streaming videos in video category page'
  )

  liveVideo = handleResponse(
    responses[4],
    (data: Awaited<ReturnType<typeof fetchLiveVideo>> | undefined) => {
      return data?.data?.allVideos ?? []
    },
    'Error occurs while fetching live videos in video category page'
  )

  allVideoEditorChoices = handleResponse(
    responses[5] as PromiseSettledResult<Record<string, unknown>>,
    (response: Record<string, unknown> | undefined) => {
      const data = response as
        | Awaited<ReturnType<typeof fetchVideoEditorChoice>>
        | undefined
      return data?.data?.allVideoEditorChoices ?? []
    },
    'Error occurs while fetching video editor choices in video category page'
  )

  const sortedCategories = sortCategoriesForVideoPage(
    categoryVideoJson.categories ?? []
  )
  categoryPosts = sortedCategories
    .map((cat) => ({
      categorySlug: cat.slug,
      categoryName: cat.name,
      posts: cat.posts
        .slice(0, PAGE_SIZE)
        .map((p) => formatArticleCard(postJsonToPostCardItem(p))),
      count: cat.posts.length,
    }))
    .filter((item) => item.count > 0)

  return (
    <>
      <GptPopup adKey="MB_VIDEO" />
      <GPTPlaceholderDesktop>
        <p>廣告</p>
        <GPTAd pageKey="all" adKey="PC_HD" />
      </GPTPlaceholderDesktop>
      <GPTPlaceholderMobile>
        <p>廣告</p>
        <GPTAd pageKey="video" adKey="MB_M1" />
      </GPTPlaceholderMobile>
      <main className={styles.main}>
        {!!allVideoEditorChoices.length && (
          <EditorChoiceVideoList
            title="編輯精選"
            videoLists={allVideoEditorChoices}
          />
        )}
        <section className={styles.wrapper}>
          <aside className={styles.aside}>
            <AsideVideoListHandler
              otherStreamings={otherStreamings}
              liveVideo={liveVideo}
            />
            <GPTAd pageKey="video" adKey="MB_M2" />
            <GPTAd pageKey="video" adKey="PC_R1" />
            <section className={styles.desktopOnly}>
              {!!allPromotionVideos.length && (
                <UiAsideVideosList
                  title="發燒單元"
                  videosList={allPromotionVideos.map((video) => {
                    return { ...video, src: video.ytUrl }
                  })}
                  isAutoPlay={false}
                  firstPlayTriggerClassName="promotion aside__item"
                />
              )}
              <GPTAd pageKey="video" adKey="PC_R2" />
              <GPTAd pageKey="video" adKey="PC_R3" />
              <UiShowsList title="節目" />
              <UiLinksList fbHref="https://www.facebook.com/mnewstw/" />
            </section>
          </aside>

          <div className={`${styles.left} category-posts`}>
            {!!popularVideos.length && (
              <VideoPostsList
                initPostsList={popularVideos}
                categorySlug=""
                categoryName="熱門影音"
                pageSize={PAGE_SIZE}
                postsCount={popularVideos.length}
              />
            )}
            <div className={styles.gptContainer}>
              <div className={styles.gptWrapper}>
                <GPTAd pageKey="video" adKey="PC_BT" />
              </div>
            </div>
            {categoryPosts.map((list) => {
              return (
                <VideoPostsList
                  initPostsList={list.posts}
                  categorySlug={list.categorySlug}
                  categoryName={list.categoryName}
                  pageSize={PAGE_SIZE}
                  postsCount={list.count}
                  key={list.categorySlug}
                />
              )
            })}
          </div>
        </section>
        <section className={`${styles.mobileOnly} ${styles.mobileAside}`}>
          {!!allPromotionVideos.length && (
            <div className="promotion aside__item">
              <UiAsideVideosList
                title="發燒單元"
                videosList={allPromotionVideos.map((video) => {
                  return { ...video, src: video.ytUrl }
                })}
                isAutoPlay={false}
                firstPlayTriggerClassName="promotion aside__item"
              />
            </div>
          )}
          <GPTAd pageKey="video" adKey="PC_R2" />
          <GPTAd pageKey="video" adKey="PC_R3" />
          <GPTAd pageKey="video" adKey="MB_M3" />
          <UiShowsList title="節目" />
          <GPTAd pageKey="video" adKey="MB_M4" />
          <UiLinksList fbHref="https://www.facebook.com/mnewstw/" />
        </section>
      </main>
    </>
  )
}

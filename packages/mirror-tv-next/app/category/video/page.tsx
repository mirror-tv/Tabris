import type { Metadata } from 'next'
import {
  GLOBAL_CACHE_SETTING,
  SITE_URL,
  POPULAR_VIDEOS_JSON_URL,
} from '~/constants/environment-variables'
import { handleResponse, formatArticleCard, FormattedPostCard } from '~/utils'
import type { Category } from '~/graphql/query/category'
import { fetchFeatureCategories } from '~/graphql/query/categories'
import { getClient } from '~/apollo-client'
import { fetchVideoPostsItems } from '~/components/category/video/action'
import styles from '~/styles/pages/category-video-page.module.scss'
import VideoPostsList from '~/components/category/video/video-posts-list'
import type { HeroImage } from '~/types/common'
import type { Show } from '~/graphql/query/shows'
import UiShowsList from '~/components/category/video/ui-shows-list'
import UiLinksList from '~/components/category/video/ui-links-list'
import { HEADER_JSON_URL } from '~/constants/environment-variables'
import type { HeaderData } from '~/types/header'
import type { PromotionVideo } from '~/graphql/query/promotion-video'
import { getPromotionVideos } from '~/graphql/query/promotion-video'
import { getVideoByName } from '~/graphql/query/videos'
import type { Video } from '~/graphql/query/videos'
import AsideVideoListHandler from '~/components/category/video/aside-video-list-handler'
import type { VideoEditorChoice } from '~/graphql/query/video-editor-choice'
import { getVideoEditorChoice } from '~/graphql/query/video-editor-choice'
import EditorChoiceVideoList from '~/components/category/video/editor-choice-video-list'
import dynamic from 'next/dynamic'
const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))
import GptPopup from '~/components/ads/gpt/gpt-popup'
import {
  GPTPlaceholderMobile,
  GPTPlaceholderDesktop,
} from '~/components/ads/gpt/gpt-placeholder'
import UiAsideVideosList from '~/components/shared/ui-aside-videos-list'

export const revalidate = GLOBAL_CACHE_SETTING

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '影音 - 鏡新聞',
  description: '最新最熱門，深入淺出的影音新聞。',
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
  heroImage: HeroImage
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
  let allCategories: Category[] = []
  let allShows: Show[] = []
  let allPromotionVideos: PromotionVideo[] = []
  let otherStreamings: Video[] = []
  let liveVideo: Video[] = []
  let allVideoEditorChoices: VideoEditorChoice[] = []

  const client = getClient()

  const fetchAllCategory = () =>
    client.query<{
      allCategories: Category[]
    }>({
      query: fetchFeatureCategories,
    })

  const fetchPopularPosts = () =>
    fetch(POPULAR_VIDEOS_JSON_URL, {
      next: { revalidate: GLOBAL_CACHE_SETTING },
    }).then((res) => {
      // use type assertion to eliminate any
      return res.json() as unknown as RowPopularVideoData
    })

  const fetchHeaderJson = () =>
    fetch(HEADER_JSON_URL, {
      next: { revalidate: GLOBAL_CACHE_SETTING },
    }).then((res) => {
      // use type assertion to eliminate any
      return res.json() as unknown as HeaderData
    })

  const fetchPromotionVideos = () =>
    client.query<{
      allPromotionVideos: PromotionVideo[]
    }>({
      query: getPromotionVideos,
    })

  const fetchOtherStreaming = () =>
    client.query<{
      allVideos: Video[]
    }>({
      query: getVideoByName,
      variables: {
        name: 'live-cam',
        take: 2,
      },
    })

  const fetchLiveVideo = () =>
    client.query<{
      allVideos: Video[]
    }>({
      query: getVideoByName,
      variables: {
        name: 'mnews-live',
        take: 1,
      },
    })

  const fetchVideoEditorChoice = () =>
    client.query<{ allVideoEditorChoices: VideoEditorChoice[] }>({
      query: getVideoEditorChoice,
    })

  const responses = await Promise.allSettled([
    fetchAllCategory(),
    fetchPopularPosts(),
    fetchHeaderJson(),
    fetchPromotionVideos(),
    fetchOtherStreaming(),
    fetchLiveVideo(),
    fetchVideoEditorChoice(),
  ])

  allCategories = handleResponse(
    responses[0],
    (
      latestPostsData: Awaited<ReturnType<typeof fetchAllCategory>> | undefined
    ) => {
      return latestPostsData?.data?.allCategories ?? []
    },
    'Error occurs while fetching category data in video category page'
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

  allShows = handleResponse(
    responses[2],
    (data: Awaited<ReturnType<typeof fetchHeaderJson>> | undefined) => {
      return (
        data?.allShows?.sort((a, b) => {
          if (a.sortOrder === null) return 1
          if (b.sortOrder === null) return -1
          return parseInt(a.sortOrder) - parseInt(b.sortOrder)
        }) ?? []
      )
    },
    'Error occurs while fetching all shows in video category page'
  )

  allPromotionVideos = handleResponse(
    responses[3],
    (data: Awaited<ReturnType<typeof fetchPromotionVideos>> | undefined) => {
      return data?.data?.allPromotionVideos ?? []
    },
    'Error occurs while fetching all promotion videos in video category page'
  )

  otherStreamings = handleResponse(
    responses[4],
    (data: Awaited<ReturnType<typeof fetchOtherStreaming>> | undefined) => {
      return data?.data?.allVideos ?? []
    },
    'Error occurs while fetching other streaming videos in video category page'
  )

  liveVideo = handleResponse(
    responses[5],
    (data: Awaited<ReturnType<typeof fetchLiveVideo>> | undefined) => {
      return data?.data?.allVideos ?? []
    },
    'Error occurs while fetching live videos in video category page'
  )
  allVideoEditorChoices = handleResponse(
    responses[6],
    (data: Awaited<ReturnType<typeof fetchVideoEditorChoice>> | undefined) => {
      return data?.data?.allVideoEditorChoices ?? []
    },
    'Error occurs while fetching video editor choices in video category page'
  )

  const fetchVideoPostsByCategory = (slug: string) =>
    fetchVideoPostsItems({
      page: 0,
      categorySlug: slug,
      isWithCount: true,
      pageSize: PAGE_SIZE,
    })

  const videoPostsResponses = await Promise.allSettled(
    allCategories.map((category) => fetchVideoPostsByCategory(category.slug))
  )

  const getCategoryNameBySlug = (slug: string) => {
    const category = allCategories.find((category) => category.slug === slug)
    return category ? category.name : ''
  }

  categoryPosts = videoPostsResponses.map((res) => {
    return handleResponse(
      res,
      (
        videoPostsData:
          | Awaited<ReturnType<typeof fetchVideoPostsByCategory>>
          | undefined
      ) => {
        return {
          categorySlug: videoPostsData?.categorySlug ?? '',
          categoryName: getCategoryNameBySlug(
            videoPostsData?.categorySlug ?? ''
          ),
          posts:
            videoPostsData?.data?.allPosts?.map((post) =>
              formatArticleCard(post)
            ) ?? [],
          count: videoPostsData?.data?._allPostsMeta?.count ?? 0,
        }
      },
      'Error occurs while fetching video posts in video category page'
    )
  })
  categoryPosts = categoryPosts.filter((item) => item.count)

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
              {!!allShows.length && (
                <UiShowsList title="節目" showsList={allShows} />
              )}
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
          {!!allShows.length && (
            <UiShowsList title="節目" showsList={allShows} />
          )}
          <GPTAd pageKey="video" adKey="MB_M4" />
          <UiLinksList fbHref="https://www.facebook.com/mnewstw/" />
        </section>
      </main>
    </>
  )
}

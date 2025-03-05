import AMPLayout from '~/components/story/amp/layout'
import {
  ENV,
  GLOBAL_CACHE_SETTING,
  POPULAR_POSTS_URL,
} from '~/constants/environment-variables'
import { fetchStoryBySlug } from '~/app/_actions/story/fetch-story-post-by-slug'
import { type SinglePost } from '~/graphql/query/story'
import type {
  InferGetServerSidePropsType,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next'
import { styled } from 'styled-components'
import PostList from '~/components/story/amp/post-list'
import { formateHeroImage, getHeroImageOfAmp } from '~/utils/image-handler'
import {
  type FormattedPostCard,
  formatArticleCard,
  handleResponse,
} from '~/utils'
import { type RawPopularPost } from '~/types/popular-post'
import { PostCardItem } from '~/graphql/query/posts'
import { getLatestPostsForAmp } from '~/app/_actions/story/amp/get-latest-posts'
import RelatedPostList from '~/components/story/amp/related-post-list'

export const config = { amp: true }

const ImageWrapper = styled.figure`
  width: 100vw;
  position: relative;
  margin: 0;
  height: calc(100vw * 0.66);
  overflow: hidden;
  img {
    object-fit: cover;
    object-position: center;
  }
`

const HeroImhCaption = styled.figcaption`
  font-size: 14px;
  line-height: 1.5;
  color: #000;
  padding: 0 16px;
  margin: 8px 0 0;
`

export default function AmpPage({
  storyData,
  popularPostsList = [],
  latestPostsList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!storyData) return null
  const { heroImage = {}, heroCaption = '', relatedPosts = [] } = storyData
  const heroSrc = getHeroImageOfAmp(formateHeroImage(heroImage))

  return (
    <AMPLayout>
      <ImageWrapper>
        <amp-img src={heroSrc} layout="fill" />
      </ImageWrapper>
      {heroCaption && <HeroImhCaption>{heroCaption}</HeroImhCaption>}
      // 正文
      {relatedPosts && <RelatedPostList title="相關新聞" list={relatedPosts} />}
      {!!popularPostsList.length && (
        <PostList title="熱門新聞" list={popularPostsList} />
      )}
      {!!latestPostsList.length && (
        <PostList title="即時新聞" list={latestPostsList} />
      )}
    </AMPLayout>
  )
}

export const getServerSideProps: GetServerSideProps<{
  storyData: SinglePost | undefined
  popularPostsList: FormattedPostCard[]
  latestPostsList: FormattedPostCard[]
}> = async (context: GetServerSidePropsContext) => {
  const { params, res } = context
  if (ENV === 'prod') {
    res.setHeader('Cache-Control', 'public, max-age=300')
  } else {
    res.setHeader('Cache-Control', 'no-store')
  }

  const { slug = '' } = params as { slug: string }

  const fetchStoryDataFunction = () => fetchStoryBySlug(slug)

  const fetchPopularList = () =>
    fetch(POPULAR_POSTS_URL, {
      next: { revalidate: GLOBAL_CACHE_SETTING },
    }).then((res) => {
      return res.json() as unknown as { report: RawPopularPost[] }
    })

  const responses = await Promise.allSettled([
    fetchStoryDataFunction(),
    fetchPopularList(),
    getLatestPostsForAmp(),
  ])

  const storyData: SinglePost | undefined = handleResponse(
    responses[0],
    (
      response: Awaited<ReturnType<typeof fetchStoryDataFunction>> | undefined
    ) => {
      return response?.allPosts?.[0]
    },
    'Error occurs while fetching story data in story amp page'
  )

  if (!storyData || !Object.keys(storyData).length) {
    return { notFound: true }
  }

  const popularPostsList = handleResponse(
    responses[1],
    (response: Awaited<ReturnType<typeof fetchPopularList>> | undefined) => {
      return (
        response?.report
          ?.slice(0, 5)
          ?.map((post: RawPopularPost) => formatArticleCard(post))
          ?.map((post) => {
            return {
              ...post,
              publishTime:
                post.publishTime instanceof Date
                  ? post.publishTime.toISOString()
                  : post.publishTime,
              label: post.label ?? null,
            }
          }) ?? []
      )
    },
    'Error occurs while fetching popular data in story amp page'
  )

  const latestPostsList = handleResponse(
    responses[2],
    (
      response: Awaited<ReturnType<typeof getLatestPostsForAmp>> | undefined
    ) => {
      return (
        response?.data?.allPosts
          ?.map((post: PostCardItem) => formatArticleCard(post))
          ?.map((post) => {
            return {
              ...post,
              publishTime:
                post.publishTime instanceof Date
                  ? post.publishTime.toISOString()
                  : post.publishTime,
              label: post.label ?? null,
            }
          }) ?? []
      )
    },
    'Error occurs while fetching latest data in story amp page'
  )

  return {
    props: {
      storyData,
      popularPostsList,
      latestPostsList,
    },
  }
}

import AMPLayout from '~/components/story/amp/layout'
import {
  ENV,
  GLOBAL_CACHE_SETTING,
  POPULAR_POSTS_URL,
} from '~/constants/environment-variables'
import { getClient } from '~/apollo-client'
import {
  fetchStoryBySlug as fetchStoryBySlugDocument,
  SinglePost,
} from '~/graphql/query/story'
import type {
  InferGetServerSidePropsType,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next'
import { styled } from 'styled-components'
import PostList from '~/components/story/amp/post-list'
import { formateHeroImage, getHeroImageOfAmp } from '~/utils/image-handler'
import {
  type FormattedPostCardJson,
  formatArticleCard,
  handleResponse,
  extractYoutubeId,
} from '~/utils'
import { type RawPopularPost } from '~/types/popular-post'
import { PostCardItem } from '~/graphql/query/posts'
import RelatedPostList from '~/components/story/amp/related-post-list'
// import { getLatestPostsFunction } from '~/app/_actions/homepage/latest-posts-and-editor-choices'
import HeroInfo from '~/components/story/amp/hero-info'
import AmpApiDataRenderer from '~/components/story/amp/amp-renderer'

export const config = { amp: true }

const ImageWrapper = styled.figure`
  width: 100vw;
  position: relative;
  margin: 0;
  height: calc(100vw * 0.66);
  overflow: hidden;
  margin-left: -16px;
  img {
    object-fit: cover;
    object-position: center;
  }
`

const HeroImhCaption = styled.figcaption`
  font-size: 14px;
  line-height: 1.5;
  color: #000;
  margin: 8px 0 0;
`

const Main = styled.main`
  padding: 0 16px;
  margin: 0 0 48px;
`

const HeroImageAndVideo = styled.section`
  margin-bottom: 24px;

  .hero-video {
    width: 100vw;
    margin-left: -16px;
  }
`

const BriefWrapper = styled.section`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.8;
  color: #014db8;
  text-align: justify;
  a {
    color: #014db8;
    text-decoration: none;
  }
`

export default function AmpPage({
  storyData,
  popularPostsList = [],
  latestPostsList,
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!storyData) return null
  const {
    heroImage = {},
    heroCaption = '',
    relatedPosts = [],
    title = '',
    publishTime = '',
    categories = [],
    writers,
    photographers,
    cameraOperators,
    designers,
    engineers,
    vocals,
    otherbyline,
    style = 'article',
    heroVideo = { youtubeUrl: '' },
    contentApiData,
    briefApiData,
  } = storyData
  const heroImgSrc =
    getHeroImageOfAmp(formateHeroImage(heroImage)) ||
    '/images/image-default.jpg'
  const heroVideoId = extractYoutubeId(heroVideo?.youtubeUrl) ?? ''

  return (
    <AMPLayout>
      <Main>
        <HeroImageAndVideo>
          {style === 'videoNews' && heroVideoId ? (
            <amp-youtube
              data-videoid={heroVideoId}
              width="480"
              height="270"
              layout="responsive"
              className="hero-video"
            ></amp-youtube>
          ) : (
            <ImageWrapper>
              <amp-img src={heroImgSrc} layout="fill" alt={heroCaption} />
            </ImageWrapper>
          )}
          {heroCaption && <HeroImhCaption>{heroCaption}</HeroImhCaption>}
        </HeroImageAndVideo>
        <HeroInfo
          title={title}
          publishTime={publishTime}
          categories={categories}
          writers={writers}
          photographers={photographers}
          cameraOperators={cameraOperators}
          designers={designers}
          engineers={engineers}
          vocals={vocals}
          otherbyline={otherbyline}
        />
        <BriefWrapper>
          <AmpApiDataRenderer
            contentData={briefApiData}
            isStoryBrief={true}
            currentUrl={`/story/amp/${slug}`}
          />
        </BriefWrapper>
        <AmpApiDataRenderer
          contentData={contentApiData}
          isStoryBrief={false}
          currentUrl={`/story/amp/${slug}`}
        />
      </Main>
      {!!relatedPosts?.length && (
        <RelatedPostList title="相關新聞" list={relatedPosts} />
      )}
      {!!popularPostsList?.length && (
        <PostList title="熱門新聞" list={popularPostsList} />
      )}
      {!!latestPostsList?.length && (
        <PostList title="即時新聞" list={latestPostsList} />
      )}
    </AMPLayout>
  )
}

export const getServerSideProps: GetServerSideProps<{
  storyData: SinglePost | undefined
  popularPostsList: FormattedPostCardJson[]
  latestPostsList: FormattedPostCardJson[]
  slug: string
}> = async (context: GetServerSidePropsContext) => {
  const { params, res } = context
  if (ENV === 'prod') {
    res.setHeader('Cache-Control', 'public, max-age=300')
  } else {
    res.setHeader('Cache-Control', 'no-store')
  }

  const { slug = '' } = params as { slug: string }

  const fetchStoryDataFunction = async () => {
    const client = getClient()
    try {
      const { data } = await client.query<{
        allPosts: SinglePost[]
      }>({
        query: fetchStoryBySlugDocument,
        variables: {
          slug,
        },
      })
      return data ?? { allPosts: [] }
    } catch (err) {
      console.error(`Error fetching story data for slug: ${slug}`, err)
      return { allPosts: [] }
    }
  }

  const fetchPopularList = () =>
    fetch(POPULAR_POSTS_URL, {
      next: { revalidate: GLOBAL_CACHE_SETTING },
    }).then((res) => {
      return res.json() as unknown as { report: RawPopularPost[] }
    })

  const responses = await Promise.allSettled([
    fetchStoryDataFunction(),
    fetchPopularList(),
    // getLatestPostsFunction(),
  ])

  const storyData: SinglePost | undefined = handleResponse(
    responses[0],
    (
      response: Awaited<ReturnType<typeof fetchStoryDataFunction>> | undefined
    ) => {
      return response?.allPosts?.[0]
    },
    `Error occurs while fetching story data in story amp page (${slug}: slug)`
  )

  if (!storyData || !Object.keys(storyData)?.length) {
    return { notFound: true }
  }

  const formatPostAsJson = (
    post: RawPopularPost | PostCardItem
  ): FormattedPostCardJson => {
    const formattedPost = formatArticleCard(post)
    return {
      ...formattedPost,
      publishTime:
        formattedPost.publishTime instanceof Date
          ? formattedPost.publishTime.toISOString()
          : formattedPost.publishTime,
      label: formattedPost.label ?? null,
    }
  }

  const popularPostsList = handleResponse(
    responses[1],
    (response: Awaited<ReturnType<typeof fetchPopularList>> | undefined) => {
      return response?.report?.slice(0, 5)?.map(formatPostAsJson) ?? []
    },
    `Error occurs while fetching popular data in story amp page (slug: ${slug})`
  )

  const latestPostsList: FormattedPostCardJson[] = []
  // const latestPostsList = handleResponse(
  //   responses[2],
  //   (
  //     response: Awaited<ReturnType<typeof getLatestPostsFunction>> | undefined
  //   ) => {
  //     return response?.data?.allPosts?.map(formatPostAsJson) ?? []
  //   },
  //   `Error occurs while fetching latest data in story amp page (slug: ${slug})`
  // )

  return {
    props: {
      storyData,
      popularPostsList,
      latestPostsList,
      slug,
    },
  }
}

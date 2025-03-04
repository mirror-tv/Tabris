import AMPLayout from '~/components/story/amp/layout'
import {
  ENV,
  GLOBAL_CACHE_SETTING,
  POPULAR_POSTS_URL,
} from '~/constants/environment-variables'
import { fetchStoryBySlug } from '~/app/_actions/story/fetch-story-post-by-slug'
import {
  type SinglePost,
  type FetchStoryBySlugResponse,
} from '~/graphql/query/story'
import type {
  InferGetServerSidePropsType,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next'
import { styled } from 'styled-components'
import PostList from '~/components/story/amp/post-list'
import { formateHeroImage, getHeroImageOfAmp } from '~/utils/image-handler'
import { type FormattedPostCard, formatArticleCard } from '~/utils'
import { type RawPopularPost } from '~/types/popular-post'
import errors from '@twreporter/errors'

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
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!storyData) return null
  const { heroImage = {}, heroCaption = '' } = storyData
  const heroSrc = getHeroImageOfAmp(formateHeroImage(heroImage))

  return (
    <AMPLayout>
      <ImageWrapper>
        <amp-img src={heroSrc} layout="fill" />
      </ImageWrapper>
      {heroCaption && <HeroImhCaption>{heroCaption}</HeroImhCaption>}
      // 正文
      <PostList title="熱門新聞" list={popularPostsList} />
    </AMPLayout>
  )
}

export const getServerSideProps: GetServerSideProps<{
  storyData: SinglePost | undefined
  popularPostsList: FormattedPostCard[]
}> = async (context: GetServerSidePropsContext) => {
  const { params, res } = context
  if (ENV === 'prod') {
    res.setHeader('Cache-Control', 'public, max-age=300')
  } else {
    res.setHeader('Cache-Control', 'no-store')
  }

  const { slug = '' } = params as { slug: string }

  const [storyData]: FetchStoryBySlugResponse['allPosts'] =
    await fetchStoryBySlug(slug)

  if (!storyData) {
    return { notFound: true }
  }

  let popularPostsList: FormattedPostCard[] = []
  try {
    const popularListRes = await fetch(POPULAR_POSTS_URL, {
      next: { revalidate: GLOBAL_CACHE_SETTING },
    }).then((res) => {
      return res.json() as unknown as { report: RawPopularPost[] }
    })
    popularPostsList =
      popularListRes?.report
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
  } catch (error) {
    const annotatingError = errors.helpers.wrap(
      error,
      'UnhandledError',
      `Error occurs while fetching poplar data for amp page`
    )

    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(annotatingError, {
          withStack: false,
          withPayload: true,
        }),
      })
    )
    console.error(error)
  }

  const props = {
    storyData,
    popularPostsList,
  }

  return { props }
}

import AMPLayout from '~/components/story/amp/layout'
import { ENV } from '~/constants/environment-variables'
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
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    heroImage: {
      urlOriginal,
      urlDesktopSized,
      urlTabletSized,
      urlMobileSized,
      urlTinySized,
    },
    heroCaption,
  } = storyData

  // TODO: 整理成 function 重復使用
  const heroImage =
    urlMobileSized ??
    urlTabletSized ??
    urlDesktopSized ??
    urlOriginal ??
    urlTinySized ??
    '/images/default-og-img.jpg'

  return (
    <AMPLayout>
      <ImageWrapper>
        <amp-img src={heroImage} layout="fill" />
      </ImageWrapper>
      {heroCaption && <HeroImhCaption>{heroCaption}</HeroImhCaption>}
    </AMPLayout>
  )
}

export const getServerSideProps: GetServerSideProps<{
  storyData: SinglePost
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

  const props = {
    storyData,
  }

  return { props }
}

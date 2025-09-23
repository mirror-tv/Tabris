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
import Head from 'next/head'
import PostList from '~/components/story/amp/post-list'
import { formateHeroImage, getHeroImageOfAmp } from '~/utils/image-handler'
import {
  type FormattedPostCardJson,
  formatArticleCard,
  handleResponse,
  extractYoutubeId,
} from '~/utils'
import { type RawPopularPost } from '~/types/popular-post'
import { getLatestPosts, PostCardItem } from '~/graphql/query/posts'
import RelatedPostList from '~/components/story/amp/related-post-list'
import HeroInfo from '~/components/story/amp/hero-info'
import AmpApiDataRenderer from '~/components/story/amp/amp-renderer'
import { SITE_TITLE, META_SITE_URL } from '~/constants/constant'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

export const config = { amp: true }

// 初始化 dayjs
dayjs.extend(utc)

function generateStoryJsonLds(storyData: SinglePost, pageUrl: string) {
  const category = storyData.categories?.[0]
  const logoUrl = '/images/logo.png'
  const title = storyData.title
  const brief = storyData.briefApiData
    ? JSON.parse(storyData.briefApiData).join('')
    : ''
  const image = storyData.heroImage?.urlDesktopSized
  const writer = storyData.writers?.[0]
  const authorName = writer?.name || SITE_TITLE
  const publishTime = storyData.publishTime
  const updateTime = storyData.updatedAt || storyData.publishTime
  const publishedDateIso = dayjs(publishTime).utcOffset(8).toISOString()
  const updateDateIso = dayjs(updateTime).utcOffset(8).toISOString()

  const jsonLdBreadcrumbList = {
    '@context': 'http://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: generateBreadcrumbList(storyData, pageUrl),
  }

  const jsonLdNewsArticle = {
    '@context': 'https://schema.org/',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    headline: title,
    image,
    datePublished: publishedDateIso,
    dateModified: updateDateIso,
    author: {
      '@type': writer ? 'Person' : 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_TITLE,
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
      },
    },
    description: brief,
    url: pageUrl,
    thumbnailUrl: image,
    articleSection: category ? category.title : undefined,
  }

  let jsonLdPerson
  if (writer) {
    jsonLdPerson = {
      '@context': 'http://schema.org/',
      '@type': 'Person',
      name: authorName,
      brand: {
        '@type': 'Brand',
        name: SITE_TITLE,
        url: META_SITE_URL,
        image: logoUrl,
        logo: logoUrl,
        description:
          '鏡電視股份有限公司創立「鏡新聞」，以多元、專業、深度、國際、藝文、弱勢為特色，期待提供給大家耳目一新的優質新聞內容，也歡迎閱聽人隨時給我們建議。',
      },
    }
  }

  return [
    jsonLdNewsArticle,
    jsonLdBreadcrumbList,
    ...(jsonLdPerson ? [jsonLdPerson] : []),
  ].filter(Boolean)
}

function generateBreadcrumbList(storyData: SinglePost, pageUrl: string) {
  const category = storyData.categories?.[0]
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: SITE_TITLE,
      item: META_SITE_URL,
    },
  ]

  if (category && category.title && category.slug) {
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: category.title,
      item: `${META_SITE_URL}/category/${category.slug}`,
    })
  }

  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: storyData.title,
    item: pageUrl,
  })

  return items
}

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

const AdContainer = styled.div`
  margin: 0 16px;
  width: 100%;
  height: calc((100vw - 32px) * 0.641);
  position: relative;
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

  const brief = briefApiData ? JSON.parse(briefApiData).join('') : ''
  const tags = storyData.tags?.map((tag) => tag.name).join(', ')
  const image = storyData.heroImage?.urlDesktopSized
  const pageUrl = `${META_SITE_URL}/story/${slug}`
  const writer = storyData.writers?.[0]
  const category = storyData.categories?.[0]
  const publishedDateIso = dayjs(publishTime).utcOffset(8).toISOString()
  const updateTime = storyData.updatedAt || storyData.publishTime
  const updateDateIso = dayjs(updateTime).utcOffset(8).toISOString()

  const jsonLds = generateStoryJsonLds(storyData, pageUrl)

  return (
    <AMPLayout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={brief} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={brief} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={brief} />
        <meta name="twitter:card" content="summary_large_image" />
        {image && (
          <>
            <meta property="og:image" content={image} />
            <meta name="twitter:image" content={image} />
          </>
        )}
        {tags && <meta name="news_keywords" content={tags} />}
        <meta property="article:section" content={category?.title} />
        <meta property="article:published_time" content={publishedDateIso} />
        <meta property="article:modified_time" content={updateDateIso} />
        <link rel="canonical" href={pageUrl} />
        {jsonLds.map((jsonLd, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        ))}
      </Head>
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
      <AdContainer>
        <amp-ad
          type="logly"
          layout="fill"
          data-adspotid="4304723"
          width="343"
          height="641"
        />
      </AdContainer>

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

  const client = getClient()

  const getLatestPostsFn = () => {
    return client.query<{
      allPosts: PostCardItem[]
    }>({
      query: getLatestPosts,
      variables: {
        first: 5,
      },
    })
  }

  const responses = await Promise.allSettled([
    fetchStoryDataFunction(),
    fetchPopularList(),
    getLatestPostsFn(),
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

  const latestPostsList = handleResponse(
    responses[2],
    (response: Awaited<ReturnType<typeof getLatestPostsFn>> | undefined) => {
      return response?.data?.allPosts?.map(formatPostAsJson) ?? []
    },
    `Error occurs while fetching latest data in story amp page (slug: ${slug})`
  )

  return {
    props: {
      storyData,
      popularPostsList,
      latestPostsList,
      slug,
    },
  }
}

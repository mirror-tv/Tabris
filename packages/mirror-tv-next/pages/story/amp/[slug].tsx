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
import PostList from '~/components/story/amp/post-list'
import { formateHeroImage, getHeroImageOfAmp } from '~/utils/image-handler'
import {
  type FormattedPostCardJson,
  formatArticleCard,
  handleResponse,
  extractYoutubeId,
  handleApiData,
} from '~/utils'
import { type RawPopularPost } from '~/types/popular-post'
import { getLatestPosts, PostCardItem } from '~/graphql/query/posts'
import RelatedPostList from '~/components/story/amp/related-post-list'
import HeroInfo from '~/components/story/amp/hero-info'
import AmpApiDataRenderer from '~/components/story/amp/amp-renderer'
import { SITE_TITLE, META_SITE_URL } from '~/constants/constant'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { GTM_ID } from '~/constants/environment-variables'

export const config = { amp: true }

// 初始化 dayjs
dayjs.extend(utc)

function getStoryOgImage(
  heroImage: SinglePost['heroImage'] | null | undefined
) {
  const formattedHeroImage = formateHeroImage(heroImage ?? undefined)
  return (
    formattedHeroImage.w1600 ||
    formattedHeroImage.w2400 ||
    formattedHeroImage.w800 ||
    formattedHeroImage.w3200 ||
    formattedHeroImage.original
  )
}

function generateStoryJsonLds(storyData: SinglePost, pageUrl: string) {
  const category = storyData.categories?.[0]
  const logoUrl = '/images/logo.png'
  const title = storyData.title
  const brief = handleApiData(storyData.briefApiData)
    .map((item: { content?: string[] }) => item.content?.join('') || '')
    .join('')
  const image = getStoryOgImage(storyData.heroImage)
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
    getHeroImageOfAmp(formateHeroImage(heroImage ?? undefined)) ||
    '/images/image-default.jpg'
  const heroVideoId = extractYoutubeId(heroVideo?.youtubeUrl ?? '') ?? ''

  const brief = handleApiData(briefApiData)
    .map((item: { content?: string[] }) => item.content?.join('') || '')
    .join('')
  const tags = storyData.tags?.map((tag) => tag.name).join(', ')
  const image = getStoryOgImage(storyData.heroImage)
  const pageUrl = `${META_SITE_URL}/story/${slug}`
  const category = storyData.categories?.[0]
  const publishedDateIso = dayjs(publishTime).utcOffset(8).toISOString()
  const updateTime = storyData.updatedAt || storyData.publishTime
  const updateDateIso = dayjs(updateTime).utcOffset(8).toISOString()

  const jsonLds = generateStoryJsonLds(storyData, pageUrl)

  const headContent = (
    <>
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
      {jsonLds.map((jsonLd, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}
    </>
  )

  return (
    <html lang="zh-Hant" amp="">
      <head>
        <meta charSet="utf-8" />
        <style
          amp-custom=""
          dangerouslySetInnerHTML={{
            __html: `
          body {
            margin: 0;
            padding: 0;
            font-family: 'Noto Sans', sans-serif;
          }
          header {
            background-color: #036;
            padding: 12px;
            display: flex;
            justify-content: center;
          }
          main {
            margin: 0;
            padding: 0;
          }
          .main-content {
            padding: 0 16px;
            margin: 0 0 48px;
          }
          .hero-image-and-video {
            margin-bottom: 24px;
          }
          .image-wrapper {
            width: 100vw;
            position: relative;
            margin: 0;
            height: calc(100vw * 0.66);
            overflow: hidden;
            margin-left: -16px;
          }
          .image-wrapper img {
            object-fit: cover;
            object-position: center;
          }
          .amp-image-contain {
            position: relative;
          }
          .hero-img-caption {
            font-size: 14px;
            line-height: 1.5;
            color: #000;
            margin: 8px 0 0;
          }
          .brief-wrapper {
            font-size: 16px;
            font-weight: 500;
            line-height: 1.8;
            color: #014db8;
            text-align: justify;
          }
          .brief-wrapper a {
            color: #014db8;
            text-decoration: none;
          }
          .ad-container {
            margin: 0 16px;
            width: 100%;
            height: calc((100vw - 32px) * 0.641);
            position: relative;
          }
          .amp-hero-category-time {
            margin-bottom: 8px;
          }
          .amp-hero-category {
            font-size: 14px;
            color: #014db8;
            margin-right: 8px;
          }
          .amp-hero-publish-time {
            font-size: 14px;
            color: #666;
          }
          .amp-hero-title {
            font-size: 24px;
            font-weight: 600;
            line-height: 1.4;
            margin: 16px 0;
            color: #000;
          }
          .amp-hero-credits {
            list-style: none;
            padding: 0;
            margin: 16px 0;
          }
          .amp-hero-credit-item {
            font-size: 14px;
            color: #666;
            margin-bottom: 4px;
          }
          .amp-post-list-wrapper,
          .amp-related-list-wrapper {
            margin: 24px 0;
            padding: 0 16px;
          }
          .amp-post-list-title,
          .amp-related-list-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #000;
          }
          .amp-card-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .amp-post-list-item,
          .amp-related-list-item {
            margin-bottom: 16px;
          }
          .amp-post-list-link,
          .amp-related-list-link {
            display: flex;
            text-decoration: none;
            color: #000;
          }
          .amp-post-list-image-wrapper {
            width: 130px;
            height: 130px;
            margin-right: 12px;
            flex-shrink: 0;
          }
          .amp-post-list-title-text,
          .amp-related-list-title-text {
            font-size: 16px;
            line-height: 1.5;
            flex: 1;
          }
          .amp-article-wrapper {
            margin: 24px 0;
          }
          .amp-image-container {
            position: relative;
            width: 100%;
            margin: 16px 0;
          }
          .amp-image-container amp-img {
            display: block;
          }
          .amp-image-description {
            font-size: 14px;
            color: #666;
            margin-top: 8px;
            line-height: 1.5;
          }
        `,
          }}
        />
        <meta
          name="viewport"
          content="width=device-width,minimum-scale=1,initial-scale=1"
        />
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <link rel="canonical" href={pageUrl} />
        <script
          async
          custom-element="amp-analytics"
          src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
        ></script>
        <script
          async
          custom-element="amp-ad"
          src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"
        ></script>
        {headContent}
      </head>
      <body>
        {/* Google Tag Manager */}
        <amp-analytics
          config={`https://www.googletagmanager.com/amp.json?id=${GTM_ID}`}
          data-credentials="include"
        ></amp-analytics>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <AMPLayout>
          <main className="main-content">
            <section className="hero-image-and-video">
              {style === 'videoNews' && heroVideoId ? (
                <amp-youtube
                  data-videoid={heroVideoId}
                  width="480"
                  height="270"
                  layout="responsive"
                  className="hero-video"
                ></amp-youtube>
              ) : (
                <figure className="image-wrapper">
                  <amp-img
                    src={heroImgSrc}
                    layout="fill"
                    alt={heroCaption ?? ''}
                  />
                </figure>
              )}
              {!!heroCaption && (
                <figcaption className="hero-img-caption">
                  {heroCaption}
                </figcaption>
              )}
            </section>
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
              otherbyline={otherbyline ?? ''}
            />
            <section className="brief-wrapper">
              <AmpApiDataRenderer
                contentData={briefApiData ?? ''}
                isStoryBrief={true}
                currentUrl={`/story/amp/${slug}`}
              />
            </section>
            <AmpApiDataRenderer
              contentData={contentApiData ?? ''}
              isStoryBrief={false}
              currentUrl={`/story/amp/${slug}`}
            />
          </main>
          {!!relatedPosts?.length && (
            <RelatedPostList
              title="相關新聞"
              list={relatedPosts}
              className="list-wrapper post__related"
            />
          )}
          {!!popularPostsList?.length && (
            <PostList
              title="熱門新聞"
              list={popularPostsList}
              className="aside__list-popular"
            />
          )}
          <div className="ad-container">
            <amp-ad
              type="logly"
              layout="fill"
              data-adspotid="4304723"
              width="343"
              height="641"
            />
          </div>

          {!!latestPostsList?.length && (
            <PostList
              title="即時新聞"
              list={latestPostsList}
              className="list-wrapper aside__list-latest"
            />
          )}
        </AMPLayout>
      </body>
    </html>
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
    responses[2] as PromiseSettledResult<Record<string, unknown>>,
    (response: Record<string, unknown> | undefined) => {
      const data = response as
        | Awaited<ReturnType<typeof getLatestPostsFn>>
        | undefined
      return data?.data?.allPosts?.map(formatPostAsJson) ?? []
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

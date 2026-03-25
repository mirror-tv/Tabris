import PageLogger from '~/components/page-logger'
import ArticleRelatedPosts from '~/components/story/article-related-posts'
import ArticleSocialList from '~/components/story/article-social-list'
import { Metadata } from 'next'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import styles from './_styles/story.module.scss'
import { fetchStoryBySlug } from '~/app/_actions/story/story-by-slug'
import ArticleHeroImageAndVideo from '~/components/story/article-hero-image-and-video'
import ApiDataRenderer from '~/components/story/api-data-renderer/renderer'
import { formateDateAtTaipei, formateHeroImage } from '~/utils'
import ArticleInfo from '~/components/story/article-info'
import { notFound } from 'next/navigation'
import ArticleBrief from '~/components/story/article-brief'
import { doesHaveBrief } from '~/utils'
import ArticleUpdateTime from '~/components/story/article-update-time'
import ArticleTagList from '~/components/story/tags-list'
import JsonLd from '~/components/story/json-ld'
import AdAfterStory from '~/components/story/ad-after-story'
import {
  SITE_TITLE,
  META_SITE_URL,
  META_DESCRIPTION,
  FILTERED_SLUG,
} from '~/constants/constant'
import type { SinglePost } from '~/graphql/query/story'
import { SITE_URL } from '~/constants/environment-variables'

import dynamic from 'next/dynamic'
import MisoPageView from '~/components/shared/miso-pageview'
import GA4SourceTracking from '~/components/story/ga4-source-tracking'
import UiDownload from '~/components/shared/ui-download'
import Article18Warning from '~/components/shared/article-18-warning'
import AdTvAdminMobileBanner from '~/components/shared/ad-tv-admin-mobile-banner'
import { handleApiData } from '~/utils'

const ContainerFullScreenAds = dynamic(
  () => import('~/components/ads/gpt/gpt-popup'),
  {
    ssr: false,
  }
)

type StoryPageTypes = {
  params: { slug: string }
}

function getStoryOgImage(heroImage?: SinglePost['heroImage'] | null) {
  const formattedHeroImage = formateHeroImage(heroImage ?? undefined)
  return (
    formattedHeroImage.w1600 ||
    formattedHeroImage.w2400 ||
    formattedHeroImage.w800 ||
    formattedHeroImage.w3200 ||
    formattedHeroImage.original
  )
}

function getStoryDableImage(heroImage?: SinglePost['heroImage'] | null) {
  const formattedHeroImage = formateHeroImage(heroImage ?? undefined)
  return (
    formattedHeroImage.w800 ||
    formattedHeroImage.w1600 ||
    formattedHeroImage.w2400 ||
    formattedHeroImage.original
  )
}

function generateStoryJsonLds(storyData: SinglePost, pageUrl: string) {
  const category =
    storyData.categoriesInInputOrder?.[0] || storyData.categories?.[0]
  const categoryName = category?.title
  const writerRendered = storyData.writersInInputOrder || storyData.writers
  const logoUrl = '/images/logo.png' // 需要確認實際的 logo 路徑

  const publishTime = storyData.publishTime
  const updateTime = storyData.updatedAt || storyData.publishTime
  const publishedDateIso = dayjs(publishTime).utcOffset(8).format()
  const modifiedDateIso = dayjs(updateTime).utcOffset(8).format()

  const briefText = handleApiData(storyData.briefApiData)
    .map((item: { content?: string[] }) => item.content?.join('') || '')
    .join('')

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
    headline: storyData.title,
    image: getStoryOgImage(storyData.heroImage),
    datePublished: publishedDateIso,
    dateModified: modifiedDateIso,
    author: {
      '@type': writerRendered?.length ? 'Person' : 'Organization',
      name: writerRendered?.[0]?.name || SITE_TITLE,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_TITLE,
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
      },
    },
    description: briefText || '',
    url: pageUrl,
    thumbnailUrl: getStoryOgImage(storyData.heroImage),
    articleSection: categoryName,
  }

  let jsonLdPerson
  if (writerRendered?.length) {
    jsonLdPerson = {
      '@context': 'http://schema.org/',
      '@type': 'Person',
      name: writerRendered?.[0]?.name,
      brand: {
        '@type': 'Brand',
        name: SITE_TITLE,
        url: META_SITE_URL,
        image: logoUrl,
        logo: logoUrl,
        description: META_DESCRIPTION,
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
  const category =
    storyData.categoriesInInputOrder?.[0] || storyData.categories?.[0]
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

export async function generateMetadata({
  params,
}: StoryPageTypes): Promise<Metadata> {
  const fetchStoryBySlugResponse = await fetchStoryBySlug(params.slug)
  const [storyData] = fetchStoryBySlugResponse.allPosts

  if (!storyData) {
    return notFound()
  }

  const title = storyData.title
  const brief = handleApiData(storyData.briefApiData)
    .map((item: { content?: string[] }) => item.content?.join('') || '')
    .join('')
  const tagsRendered = storyData.tagsInInputOrder || storyData.tags
  const image = getStoryOgImage(storyData.heroImage)
  const dableImage = getStoryDableImage(storyData.heroImage)
  const pageUrl = `${META_SITE_URL}/story/${params.slug}`
  const writerRendered = storyData.writersInInputOrder || storyData.writers
  const authorName = writerRendered?.[0]?.name || SITE_TITLE
  const category =
    storyData.categoriesInInputOrder?.[0] || storyData.categories?.[0]
  const publishTime = storyData.publishTime
  const updateTime = storyData.updatedAt || storyData.publishTime
  const isExclusive = storyData.exclusive ?? false
  const isVideoNews = storyData.style === 'videoNews'

  dayjs.extend(utc)
  const publishedDateIso = dayjs(publishTime).utcOffset(8).format()
  const modifiedDateIso = dayjs(updateTime).utcOffset(8).format()

  return {
    title,
    description: brief,
    openGraph: {
      title,
      description: brief,
      url: pageUrl,
      images: image ? [{ url: image }] : [],
      type: 'article',
      publishedTime: publishedDateIso,
      modifiedTime: modifiedDateIso,
      authors: writerRendered ? [writerRendered?.[0]?.name] : [],
      section: category?.title,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: brief,
      images: image ? [image] : [],
    },
    keywords: tagsRendered
      ? tagsRendered.map((tag) => tag.name).join(', ')
      : '',
    authors: writerRendered ? [{ name: writerRendered?.[0]?.name }] : [],
    category: category?.title,
    alternates: {
      canonical: pageUrl,
      languages: {
        'x-default': pageUrl,
      },
    },
    other: {
      'dable:item_id': params.slug,
      'dable:author': authorName,
      'dable:image': dableImage,
      'article:section': category?.title,
      'article:published_time': publishedDateIso,
      'article:modified_time': modifiedDateIso,
      isExclusive: isExclusive.toString(),
      isVideoNews: isVideoNews.toString(),
      robots: 'INDEX,max-image-preview:large',
      image: image || '/images/image-default.jpg',
    },
  }
}

const StoryPage = async (props: StoryPageTypes) => {
  const { params } = props
  const fetchStoryBySlugResponse = await fetchStoryBySlug(params.slug)
  const [storyData] = fetchStoryBySlugResponse.allPosts

  if (!storyData) {
    notFound()
  }

  const {
    id,
    contentApiData,
    relatedPosts,
    relatedPostsInInputOrder,
    heroImage,
    heroCaption,
    categories,
    categoriesInInputOrder,
    title,
    publishTime,
    writers,
    writersInInputOrder,
    photographers,
    cameraOperators,
    designers,
    engineers,
    vocals,
    otherbyline,
    briefApiData,
    style,
    heroVideo,
    tags,
    tagsInInputOrder,
    updatedAt,
    source,
    download,
    isAdult,
  } = storyData
  const publishTimeTaipei = formateDateAtTaipei(
    new Date(publishTime),
    'YYYY.MM.DD HH:mm',
    '臺北時間'
  )
  const categoriesRendered = categoriesInInputOrder || categories
  const writersRendered = writersInInputOrder || writers
  const tagsRendered = tagsInInputOrder || tags

  const shouldShowAds =
    !(
      categoriesRendered?.length === 1 &&
      categoriesRendered?.[0]?.slug === 'ombuds'
    ) && !FILTERED_SLUG.includes(params.slug)

  const updatedTime = updatedAt
    ? formateDateAtTaipei(new Date(updatedAt), 'YYYY.MM.DD HH:mm', '臺北時間')
    : ''

  const hasBrief = doesHaveBrief(handleApiData(briefApiData))

  const pageUrl = `${META_SITE_URL}/story/${params.slug}`
  const jsonLdData = generateStoryJsonLds(storyData, pageUrl)

  // 為了通過 BigQuery 的型別規則，故用 toString() 將陣列轉成字串，來統一以下部分屬性有值和無值時的型別，非 view log 相關用途請勿更動
  const extra = {
    storyId: id,
    storyTitle: title,
    authorNames: writersRendered.map((writer) => writer.name).toString() || '',
    photographers:
      photographers.map((photographer) => photographer.name).toString() || '',
    cameraOperators:
      cameraOperators.map((operator) => operator.name).toString() || '',
    designers: designers.map((designer) => designer.name).toString() || '',
    engineers: engineers.map((engineer) => engineer.name).toString() || '',
    vocals: vocals.map((vocal) => vocal.name).toString() || '',
  }

  return (
    <>
      <PageLogger extra={extra} />
      <JsonLd data={jsonLdData} />
      <MisoPageView productIds={`story_${params.slug}`} />
      <GA4SourceTracking source={source} />
      <Article18Warning isAdult={!!isAdult} />
      <link rel="amphtml" href={`${SITE_URL}/story/amp/${params.slug}`} />
      <section className={styles.article}>
        <ContainerFullScreenAds adKey="MB_NEWS" />
        <ArticleHeroImageAndVideo
          heroImage={heroImage}
          title={heroCaption || ''}
          heroCaption={heroCaption}
          style={style}
          heroVideo={heroVideo}
        />
        <ArticleInfo
          title={title}
          publishTime={publishTimeTaipei}
          category={categoriesRendered?.[0]}
          writers={writersRendered || []}
          photographers={photographers}
          cameraOperators={cameraOperators}
          designers={designers}
          engineers={engineers}
          vocals={vocals}
          otherbyline={otherbyline ?? ''}
        />
        {hasBrief && <ArticleBrief brief={handleApiData(briefApiData)} />}
        <section className={styles.contentWrapper}>
          <ApiDataRenderer
            contentData={contentApiData ?? ''}
            isStoryBrief={false}
          />
          {!!download?.length && <UiDownload downloads={download} />}
          {updatedTime && <ArticleUpdateTime updateTime={updatedTime} />}
          {!!tagsRendered?.length && <ArticleTagList tags={tagsRendered} />}
        </section>
        <AdTvAdminMobileBanner />
        <section className={styles.socialAndRelatedWrapper}>
          <ArticleRelatedPosts
            relatedPosts={relatedPostsInInputOrder || relatedPosts}
            shouldShowAds={shouldShowAds}
            page="story"
          />
          <ArticleSocialList />
          {shouldShowAds && <AdAfterStory />}
        </section>
      </section>
    </>
  )
}

export default StoryPage

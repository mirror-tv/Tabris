import ArticleRelatedPosts from '~/components/story/article-related-posts'
import ArticleSocialList from '~/components/story/article-social-list'
import { Metadata } from 'next'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import styles from './_styles/story.module.scss'
import { fetchStoryBySlug } from '~/app/_actions/story/story-by-slug'
import ArticleHeroImageAndVideo from '~/components/story/article-hero-image-and-video'
import ApiDataRenderer from '~/components/story/api-data-renderer/renderer'
import { formateDateAtTaipei } from '~/utils'
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

import dynamic from 'next/dynamic'
import MisoPageView from '~/components/shared/miso-pageview'
import GA4SourceTracking from '~/components/story/ga4-source-tracking'
import UiDownload from '~/components/shared/ui-download'
import Article18Warning from '~/components/shared/article-18-warning'

const ContainerFullScreenAds = dynamic(
  () => import('~/components/ads/gpt/gpt-popup'),
  {
    ssr: false,
  }
)

type StoryPageTypes = {
  params: { slug: string }
}

function generateStoryJsonLds(storyData: SinglePost, pageUrl: string) {
  const category = storyData.categories?.[0]
  const logoUrl = '/images/logo.png' // 需要確認實際的 logo 路徑

  const publishTime = storyData.publishTime
  const updateTime = storyData.updatedAt || storyData.publishTime
  const publishedDateIso = dayjs(publishTime).utcOffset(8).format()
  const modifiedDateIso = dayjs(updateTime).utcOffset(8).format()

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
    image: storyData.heroImage?.urlDesktopSized,
    datePublished: publishedDateIso,
    dateModified: modifiedDateIso,
    author: {
      '@type': storyData.writers?.length ? 'Person' : 'Organization',
      name: storyData.writers?.[0]?.name || SITE_TITLE,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_TITLE,
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
      },
    },
    description: storyData.briefApiData
      ? JSON.parse(storyData.briefApiData)
          .map((item: { content?: string[] }) => item.content?.join('') || '')
          .join('')
      : undefined,
    url: pageUrl,
    thumbnailUrl: storyData.heroImage?.urlDesktopSized,
    articleSection: category?.title || '',
  }

  let jsonLdPerson
  if (storyData.writers?.length) {
    jsonLdPerson = {
      '@context': 'http://schema.org/',
      '@type': 'Person',
      name: storyData.writers[0].name,
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

export async function generateMetadata({
  params,
}: StoryPageTypes): Promise<Metadata> {
  const fetchStoryBySlugResponse = await fetchStoryBySlug(params.slug)
  const [storyData] = fetchStoryBySlugResponse.allPosts

  if (!storyData) {
    return notFound()
  }

  const title = storyData.title
  const brief = storyData.briefApiData
    ? JSON.parse(storyData.briefApiData)
        .map((item: { content?: string[] }) => item.content?.join('') || '')
        .join('')
    : ''
  const tags = storyData.tags?.map((tag) => tag.name).join(', ')
  const image = storyData.heroImage?.urlDesktopSized
  const dableImage = storyData.heroImage?.urlMobileSized
  const pageUrl = `${META_SITE_URL}/story/${params.slug}`
  const writer = storyData.writers?.[0]
  const authorName = writer?.name || SITE_TITLE
  const category = storyData.categories?.[0]
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
      authors: writer ? [writer.name] : [],
      section: category?.title,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: brief,
      images: image ? [image] : [],
    },
    keywords: tags,
    authors: writer ? [{ name: writer.name }] : [],
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
    contentApiData,
    relatedPosts,
    heroImage,
    heroCaption,
    categories,
    title,
    publishTime,
    writers,
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

  const shouldShowAds =
    !(categories?.length === 1 && categories?.[0]?.slug === 'ombuds') &&
    !FILTERED_SLUG.includes(params.slug)

  const updatedTime = updatedAt
    ? formateDateAtTaipei(new Date(updatedAt), 'YYYY.MM.DD HH:mm', '臺北時間')
    : ''

  const hasBrief = doesHaveBrief(briefApiData)

  const pageUrl = `${META_SITE_URL}/story/${params.slug}`
  const jsonLdData = generateStoryJsonLds(storyData, pageUrl)

  return (
    <>
      <JsonLd data={jsonLdData} />
      <MisoPageView productIds={`story_${params.slug}`} />
      <GA4SourceTracking source={source} />
      <Article18Warning isAdult={isAdult} />
      <section className={styles.article}>
        <ContainerFullScreenAds adKey="MB_NEWS" />
        <ArticleHeroImageAndVideo
          heroImage={heroImage}
          title={heroCaption}
          heroCaption={heroCaption}
          style={style}
          heroVideo={heroVideo}
        />
        <ArticleInfo
          title={title}
          publishTime={publishTimeTaipei}
          category={categories?.[0]}
          writers={writers}
          photographers={photographers}
          cameraOperators={cameraOperators}
          designers={designers}
          engineers={engineers}
          vocals={vocals}
          otherbyline={otherbyline}
        />
        {hasBrief && <ArticleBrief brief={JSON.parse(briefApiData || '[]')} />}
        <section className={styles.contentWrapper}>
          <ApiDataRenderer contentData={contentApiData} isStoryBrief={false} />
          {!!download?.length && <UiDownload downloads={download} />}
          {updatedTime && <ArticleUpdateTime updateTime={updatedTime} />}
          {!!tags.length && <ArticleTagList tags={tags} />}
        </section>
        <section className={styles.socialAndRelatedWrapper}>
          <ArticleRelatedPosts
            relatedPosts={relatedPosts}
            shouldShowAds={shouldShowAds}
            page="story"
          />
          <ArticleSocialList />
          {shouldShowAds && <AdAfterStory page="story" />}
        </section>
      </section>
    </>
  )
}

export default StoryPage

import ArticleRelatedPosts from '~/components/story/article-related-posts'
import ArticleSocialList from '~/components/story/article-social-list'
import { Metadata } from 'next'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import styles from './_styles/external.module.scss'
import { fetchExternalBySlug } from '~/app/_actions/external/external-by-slug'
import { cache } from 'react'
import ArticleHeroImageAndVideo from '~/components/story/article-hero-image-and-video'
import {
  formateDateAtTaipei,
  addMaxWidthToFigureWithStyle,
  removeDuplicateFirstParagraph,
} from '~/utils'
import ArticleInfo from '~/components/story/article-info'
import { notFound } from 'next/navigation'
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
import type { SingleExternalPost } from '~/graphql/query/external'

import dynamic from 'next/dynamic'
import MisoPageView from '~/components/shared/miso-pageview'
import GA4SourceTracking from '~/components/story/ga4-source-tracking'

const ContainerFullScreenAds = dynamic(
  () => import('~/components/ads/gpt/gpt-popup'),
  {
    ssr: false,
  }
)

type ExternalPageTypes = {
  params: { slug: string }
}

function generateExternalJsonLds(
  externalData: SingleExternalPost,
  pageUrl: string
) {
  const category = externalData.categories?.[0]
  const logoUrl = '/images/logo.png' // 需要確認實際的 logo 路徑

  // 將時間轉換為台北時區
  const publishTime = externalData.publishTime
  const updateTime = externalData.updatedAt || externalData.publishTime
  const publishedDateIso = dayjs(publishTime).utcOffset(8).format()
  const modifiedDateIso = dayjs(updateTime).utcOffset(8).format()

  const jsonLdBreadcrumbList = {
    '@context': 'http://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: generateBreadcrumbList(externalData, pageUrl),
  }

  const jsonLdNewsArticle = {
    '@context': 'https://schema.org/',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    headline: externalData.name,
    image: externalData.thumbnail || '',
    datePublished: publishedDateIso,
    dateModified: modifiedDateIso,
    author: {
      '@type': externalData.byline ? 'Person' : 'Organization',
      name: externalData.byline || SITE_TITLE,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_TITLE,
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
      },
    },
    description: externalData.brief || externalData.brief_original || '',
    url: pageUrl,
    thumbnailUrl: externalData.thumbnail || null,
    articleSection: category?.name || '',
  }

  let jsonLdPerson
  if (externalData.byline) {
    jsonLdPerson = {
      '@context': 'http://schema.org/',
      '@type': 'Person',
      name: externalData.byline,
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

function generateBreadcrumbList(
  externalData: SingleExternalPost,
  pageUrl: string
) {
  const category = externalData.categories?.[0]
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: SITE_TITLE,
      item: META_SITE_URL,
    },
  ]

  if (category && category.name && category.slug) {
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: category.name,
      item: `${META_SITE_URL}/category/${category.slug}`,
    })
  }

  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: externalData.name,
    item: pageUrl,
  })

  return items
}

const getExternalData = cache(async (slug: string) => {
  const response = await fetchExternalBySlug(slug)
  return response.allExternals[0]
})

export async function generateMetadata({
  params,
}: ExternalPageTypes): Promise<Metadata> {
  const externalData = await getExternalData(params.slug)

  if (!externalData) {
    return notFound()
  }

  const title = externalData.name
  const brief = externalData.brief || externalData.brief_original || ''
  const tags = externalData.tags
    ?.map((tag: { name: string }) => tag.name)
    .join(', ')
  const image = externalData.thumbnail
  const dableImage = externalData.thumbnail
  const pageUrl = `${META_SITE_URL}/external/${params.slug}`
  const writer = externalData.byline
  const authorName = writer || SITE_TITLE
  const category = externalData.categories?.[0]
  const publishTime = externalData.publishTime
  const updateTime = externalData.updatedAt || externalData.publishTime

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
      authors: writer ? [writer] : [],
      section: category?.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: brief,
      images: image ? [image] : [],
    },
    keywords: tags,
    authors: writer ? [{ name: writer }] : [],
    category: category?.name,
    alternates: {
      canonical: pageUrl,
      languages: {
        'x-default': pageUrl,
      },
    },
    other: {
      'dable:item_id': params.slug,
      'dable:author': authorName,
      'dable:image': dableImage || '',
      'article:section': category?.name || '',
      'article:published_time': publishedDateIso,
      'article:modified_time': modifiedDateIso,
      robots: 'INDEX,max-image-preview:large',
      image: image || '/images/image-default.jpg',
    },
  }
}

const ExternalPage = async (props: ExternalPageTypes) => {
  const { params } = props
  const externalData = await getExternalData(params.slug)

  if (!externalData) {
    notFound()
  }

  const {
    content_original,
    heroCaption,
    categories,
    name: title,
    publishTime,
    thumbnail,
    partner,
    tags,
    updatedAt,
    source,
  } = externalData
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

  // 處理 content_original
  // 1. 先移除與 heroCaption 重複的第一段
  const contentWithoutDuplicate = removeDuplicateFirstParagraph(
    content_original,
    heroCaption
  )
  // 2. 再為有 style 屬性的 figure 添加 max-width: 100%
  const processedContent = addMaxWidthToFigureWithStyle(contentWithoutDuplicate)

  const pageUrl = `${META_SITE_URL}/external/${params.slug}`
  const jsonLdData = generateExternalJsonLds(externalData, pageUrl)

  return (
    <>
      <JsonLd data={jsonLdData} />
      <MisoPageView productIds={`external_${params.slug}`} />
      <GA4SourceTracking source={source} />
      <section className={styles.article}>
        <ContainerFullScreenAds adKey="MB_NEWS" />
        {thumbnail && (
          <ArticleHeroImageAndVideo
            heroImage={{
              id: '',
              name: '',
              urlOriginal: thumbnail,
              urlDesktopSized: thumbnail,
              urlTabletSized: thumbnail,
              urlMobileSized: thumbnail,
              urlTinySized: thumbnail,
            }}
            title={title}
            heroCaption={heroCaption}
            style=""
            heroVideo={undefined}
          />
        )}
        <ArticleInfo
          title={title}
          publishTime={publishTimeTaipei}
          category={
            categories?.[0]
              ? { slug: categories[0].slug, title: categories[0].name }
              : { slug: '', title: '' }
          }
          writers={
            partner?.name ? [{ name: partner?.name || '', slug: '' }] : []
          }
          photographers={[]}
          cameraOperators={[]}
          designers={[]}
          engineers={[]}
          vocals={[]}
          otherbyline={''}
        />
        <section className={styles.contentWrapper}>
          <div
            className={styles.externalContent}
            dangerouslySetInnerHTML={{ __html: processedContent ?? '' }}
          />
          {updatedTime && <ArticleUpdateTime updateTime={updatedTime} />}
          {!!tags.length && <ArticleTagList tags={tags} />}
        </section>
        <section className={styles.socialAndRelatedWrapper}>
          <ArticleRelatedPosts
            relatedPosts={[]}
            shouldShowAds={shouldShowAds}
            page="external"
          />
          <ArticleSocialList />
          {shouldShowAds && <AdAfterStory />}
        </section>
      </section>
    </>
  )
}

export default ExternalPage

import errors from '@twreporter/errors'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getClient } from '~/apollo-client'
import HeroImage from '~/components/topic/single-topic/hero-image'
import HeroMultiVideo from '~/components/topic/single-topic/hero-multivideo'
import HeroSlideshow from '~/components/topic/single-topic/hero-slideshow'
import HeroVideo from '~/components/topic/single-topic/hero-video'
import TopicPostItems from '~/components/topic/single-topic/topic-post-items'
import { META_DESCRIPTION, SITE_TITLE } from '~/constants/constant'
import {
  GLOBAL_CACHE_SETTING,
  SITE_URL,
} from '~/constants/environment-variables'
import type { SingleTopic } from '~/graphql/query/topic'
import { fetchSingleTopicByTopicSlug } from '~/graphql/query/topic'
import styles from '~/styles/pages/single-topic-page.module.scss'
import { handleMetaDesc } from '~/utils'
import dynamic from 'next/dynamic'
import { GPTPlaceholderDesktop } from '~/components/ads/gpt/gpt-placeholder'
const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))

export const revalidate = GLOBAL_CACHE_SETTING

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const client = getClient()
  let singleTopic: SingleTopic | null = null

  try {
    const response = await client.query({
      query: fetchSingleTopicByTopicSlug,
      variables: {
        topicSlug: params.slug,
      },
    })
    const { topic }: { topic: SingleTopic[] } = response.data
    singleTopic = topic[0] ?? undefined

    if (!singleTopic) {
      notFound()
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      new Error('Single Topic not found'),
      'UnhandledError',
      'Error occurs while fetching posts data for single topic page'
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
    console.error(err)
  }

  const description = handleMetaDesc(singleTopic?.briefHtml ?? '')

  return {
    metadataBase: new URL(SITE_URL),
    title: `${singleTopic?.title} - 鏡新聞`,
    description: description !== '' ? description : META_DESCRIPTION,
    openGraph: {
      title: `${singleTopic?.title} - 鏡新聞`,
      description: description !== '' ? description : META_DESCRIPTION,
      siteName: SITE_TITLE,
      images:
        singleTopic?.heroImage?.urlMobileSized ?? '/images/default-og-img.jpg',
    },
  }
}

export default async function SingleTopicPage({
  params,
}: {
  params: { slug: string }
}) {
  const client = getClient()
  let singleTopic: SingleTopic | undefined

  try {
    const response = await client.query({
      query: fetchSingleTopicByTopicSlug,
      variables: {
        topicSlug: params.slug,
      },
    })
    const { topic }: { topic: SingleTopic[] } = response.data
    singleTopic = topic[0] ?? undefined

    // Throw an error if singleTopic is undefined
    if (!singleTopic) {
      throw new Error('Topic not found')
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching posts data for single topic page'
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
    notFound()
  }

  const socialMediaLinks = [
    {
      platform: 'facebook',
      icon: '/icons/icon-fb-grey.svg',
      alt: 'facebook icon',
      url: singleTopic.facebook,
    },
    {
      platform: 'instagram',
      icon: '/icons/icon-ig-grey.svg',
      alt: 'instagram icon',
      url: singleTopic.instagram,
    },
    {
      platform: 'line',
      icon: '/icons/icon-line-grey.svg',
      alt: 'line icon',
      url: singleTopic.line,
    },
  ]

  return (
    <main className={styles.mainWrapper}>
      <GPTPlaceholderDesktop>
        <p>廣告</p>
        <GPTAd pageKey="all" adKey="PC_HD" />
      </GPTPlaceholderDesktop>
      {(() => {
        switch (singleTopic.leading) {
          case 'video':
            return (
              <HeroVideo
                videoSrc={singleTopic.heroVideo.url}
                controls={false}
              />
            )
          case 'image':
            return (
              <HeroImage
                heroImage={singleTopic.heroImage}
                title={singleTopic.title}
              />
            )
          case 'slideshow':
            return (
              <HeroSlideshow
                heroImage={singleTopic.heroImage}
                title={singleTopic.title}
                slideshow={singleTopic.slideshow}
              />
            )
          case 'multivideo':
            return (
              <HeroMultiVideo
                heroImage={singleTopic.heroImage}
                title={singleTopic.title}
                multivideo={singleTopic.multivideo}
              />
            )
          default:
            return null
        }
      })()}

      <section className={styles.sectionWrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>{singleTopic.title}</div>
          <div className={styles.socialIcons}>
            {socialMediaLinks.map(
              ({ platform, icon, alt, url }) =>
                url && (
                  <Link
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <Image
                      src={icon}
                      alt={alt}
                      priority
                      width={20}
                      height={20}
                    />
                  </Link>
                )
            )}
          </div>
        </div>
        <TopicPostItems
          slug={params.slug}
          itemsCount={singleTopic.meta.count}
        />
      </section>
    </main>
  )
}

import errors from '@twreporter/errors'
import styles from './_styles/show.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import {
  GLOBAL_CACHE_SETTING,
  SITE_URL,
} from '~/constants/environment-variables'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import {
  GPTPlaceholderDesktop,
  GPTPlaceholderMobile,
} from '~/components/ads/gpt/gpt-placeholder'
import { getClient } from '~/apollo-client'
const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))
import { fetchShowBySlug } from '~/graphql/query/shows'
import type { ShowWithDetail } from '~/graphql/query/shows'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import ResponsiveImage from '~/components/shared/responsive-image'
import { formateHeroImage } from '~/utils'
import UiHostList from '~/components/show/_slug/ui-host-list'
import GptPopup from '~/components/ads/gpt/gpt-popup'
import PodcastsListHandler from '~/components/show/_slug/podcast/podcasts-list-handler'
import YoutubeListWrapper from '~/components/show/_slug/youtube-list-wrapper'
import AsideAd from '~/components/show/_slug/aside-ad'

export const revalidate = GLOBAL_CACHE_SETTING

const getShowBySlug = cache(async (slug: string) => {
  const client = getClient()
  const {
    data: { allShows },
  } = await client.query<{
    allShows: ShowWithDetail[]
  }>({
    query: fetchShowBySlug,
    variables: {
      slug,
      shouldFetchHost: true,
      squareHostImg: true,
    },
  })
  return allShows?.[0]
})

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { slug } = params
  let showData
  try {
    showData = await getShowBySlug(slug)
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching data for show page'
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
    throw new Error('Error occurs while fetching data.')
  }

  if (!showData || !showData.name) {
    return {}
  }

  // 確保 SITE_URL 是有效的 URL
  let metadataBase: URL | undefined
  try {
    if (SITE_URL) {
      metadataBase = new URL(SITE_URL)
    }
  } catch (err) {
    console.error('Invalid SITE_URL:', SITE_URL, err)
  }

  // 處理圖片 URL，確保是絕對 URL
  const getImageUrl = (url: string | null | undefined): string => {
    if (!url) {
      return '/images/default-og-img.jpg'
    }
    // 如果已經是絕對 URL，直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    // 如果是相對路徑，轉換為絕對 URL
    if (metadataBase) {
      try {
        return new URL(url, metadataBase).toString()
      } catch (err) {
        console.error('Failed to convert image URL to absolute:', url, err)
        // 如果轉換失敗，嘗試使用 SITE_URL 字符串
        try {
          return new URL(url, SITE_URL).toString()
        } catch (err2) {
          console.error('Failed to convert image URL with SITE_URL:', url, err2)
          return url
        }
      }
    }
    // 如果沒有 metadataBase，嘗試使用 SITE_URL 字符串
    if (SITE_URL) {
      try {
        return new URL(url, SITE_URL).toString()
      } catch (err) {
        console.error('Failed to convert image URL:', url, err)
      }
    }
    // 最後返回相對路徑
    return url
  }

  const data: Metadata = {
    ...(metadataBase && { metadataBase }),
    title: `${showData.name} - 鏡新聞`,
    description: showData.introduction ?? undefined,
    openGraph: {
      title: `${showData.name} - 鏡新聞`,
      description: showData.introduction ?? undefined,
      images: {
        url: (() => {
          const formattedShowImage = formateHeroImage(
            showData.picture ?? showData.bannerImg ?? undefined
          )
          const bestImage =
            formattedShowImage.w800 ||
            formattedShowImage.w1600 ||
            formattedShowImage.w2400 ||
            formattedShowImage.w3200 ||
            formattedShowImage.original

          // formateHeroImage 在沒有圖時會回傳 '/images/image-default.jpg'，
          // 但 OG 預設圖想用 '/images/default-og-img.jpg'
          const ogImage =
            !bestImage || bestImage === '/images/image-default.jpg'
              ? '/images/default-og-img.jpg'
              : bestImage

          return getImageUrl(ogImage)
        })(),
      },
    },
  }

  // 過濾 null 值，但保留 metadataBase（URL 對象）和 openGraph 結構
  const images = data.openGraph?.images
  const hasImages = images && (Array.isArray(images) ? images.length > 0 : true)

  const filteredData: Metadata = {
    ...(data.metadataBase && { metadataBase: data.metadataBase }),
    ...(data.title && { title: data.title }),
    ...(data.description && { description: data.description }),
    openGraph: {
      ...(data.openGraph?.title && { title: data.openGraph.title }),
      ...(data.openGraph?.description && {
        description: data.openGraph.description,
      }),
      ...(hasImages && { images }),
    },
  }

  return filteredData
}

export default async function ShowPage({
  params,
}: {
  params: { slug: string }
}) {
  // const MAX_RESULT_NUM = 30

  let show: ShowWithDetail | undefined
  const { slug } = params

  try {
    show = await getShowBySlug(slug)
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching data for show page'
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
    throw new Error('Error occurs while fetching data.')
  }

  if (!show || !show.slug) {
    notFound()
  }

  const socialMediaIcons: {
    href: string | null
    src: string
    name: string
  }[] = [
    {
      href: show.facebookUrl,
      src: '/icons/fb-logo-blue.svg',
      name: 'facebook',
    },
    {
      href: show.igUrl,
      src: '/icons/ig-logo-blue.svg',
      name: 'instagram',
    },
  ]

  return (
    <>
      <GPTPlaceholderDesktop>
        <p>廣告</p>
        <GPTAd pageKey="all" adKey="PC_HD" />
      </GPTPlaceholderDesktop>
      <GptPopup adKey="MB_PROGRAM" />
      <GPTPlaceholderMobile>
        <p>廣告</p>
        <GPTAd pageKey="show" adKey="MB_M1" />
      </GPTPlaceholderMobile>
      <main className={styles.container}>
        <h1 className={styles.title}>{show.name || '節目'}</h1>
        <figure className={styles.banner}>
          <ResponsiveImage
            images={formateHeroImage(
              show.picture ?? show.bannerImg ?? undefined
            )}
            alt={show.name || 'show-banner'}
            rwd={{ desktop: '1200px' }}
            priority={true}
          />
        </figure>
        <section className={styles.show}>
          <section className={styles.infoWrapper}>
            <section className={styles.left}>
              <div className={styles.iconWrapper}>
                {socialMediaIcons.map((item) => {
                  return (
                    item.href && (
                      <Link
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <Image
                          src={item.src}
                          alt={item.name}
                          width="20"
                          height="20"
                        />
                      </Link>
                    )
                  )
                })}
              </div>
              {show.introduction && (
                <div
                  className={styles.introduction}
                  dangerouslySetInnerHTML={{
                    __html: (show.introduction || '').replace(/\n/g, '<br>'),
                  }}
                ></div>
              )}
              {!!show.hostName && <UiHostList hostList={show.hostName} />}
              <AsideAd shownOnMobile={true} />
              <YoutubeListWrapper
                urls={[show.playList01, show.playList02]}
                isDesktop={true}
              />
            </section>
            <AsideAd shownOnMobile={false} />
          </section>
          <YoutubeListWrapper
            urls={[show.playList01, show.playList02]}
            isDesktop={false}
          />
          {slug === 'election24' && <PodcastsListHandler />}
          <GPTAd pageKey="show" adKey="PC_BT" />
          <GPTAd pageKey="show" adKey="MB_M3" />
        </section>
      </main>
    </>
  )
}

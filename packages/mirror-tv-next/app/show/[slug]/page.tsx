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

  if (!showData) {
    return {}
  }

  const data = {
    metadataBase: new URL(SITE_URL),
    title: `${showData.name} - 鏡新聞`,
    description: showData.introduction,
    openGraph: {
      title: `${showData.name} - 鏡新聞`,
      description: showData.introduction ?? undefined,
      images: {
        url: showData.picture?.urlOriginal ?? '/images/default-og-img.jpg',
      },
    },
  }

  return Object.fromEntries(
    Object.entries(data)
      .map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return [
            key,
            Object.fromEntries(
              Object.entries(value).filter(([, v]) => v != null)
            ),
          ]
        }
        return [key, value]
      })
      .filter(([, value]) => value != null)
  )
}

export default async function ShowPage({
  params,
}: {
  params: { slug: string }
}) {
  // const MAX_RESULT_NUM = 30

  let show: ShowWithDetail
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

  if (!show?.slug) {
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
        <h1 className={styles.title}>{show.name}</h1>
        <figure className={styles.banner}>
          <ResponsiveImage
            images={formateHeroImage(show.bannerImg ?? {})}
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
                    __html: show.introduction.replace(/\n/g, '<br>'),
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

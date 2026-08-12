import errors from '@twreporter/errors'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getClient } from '~/apollo-client'
import AnchorImg from '~/components/anchorperson/anchor-img'
import SocialIcon from '~/components/anchorperson/social-icon'
import { META_DESCRIPTION, SITE_TITLE } from '~/constants/constant'
import {
  GLOBAL_CACHE_SETTING,
  SITE_URL,
} from '~/constants/environment-variables'
import type { SingleAnchor } from '~/graphql/query/contact'
import { fetchContactBySlug } from '~/graphql/query/contact'
import styles from '~/styles/pages/single-anchorperson-page.module.scss'
import {
  formateHeroImage,
  formateYoutubeListRes,
  handleApiData,
  handleResponse,
} from '~/utils'
import GPTAd from '~/components/ads/gpt/gpt-ad'
import { GPTPlaceholderDesktop } from '~/components/ads/gpt/gpt-placeholder'
import AnchorShowList from '~/components/anchorperson/anchor-show-list'
import { YoutubeListInfoFormatted, YoutubeResponse } from '~/types/youtube'
import { fetchYoutubeList } from '~/app/_actions/show-yt'
import { FormatPlayListItems } from '~/types/api-data'
export const revalidate = GLOBAL_CACHE_SETTING

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const client = getClient()
  let singleAnchor: SingleAnchor | null = null

  try {
    const response = await client.query<{ allContacts: SingleAnchor[] }>({
      query: fetchContactBySlug,
      variables: {
        slug: params.slug,
      },
    })
    const data = response.data
    singleAnchor = data?.allContacts[0] ?? null

    if (!singleAnchor) {
      const annotatingError = errors.helpers.wrap(
        new Error('Anchor not found'),
        'UnhandledError',
        'Error occurs while fetching data for single anchor page'
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
      throw annotatingError
    }
  } catch (err) {
    console.error(err)
    notFound()
  }

  const bio = handleApiData(singleAnchor.bioApiData)
  const description = bio[0]?.content[0]?.slice(0, 20)

  const formattedHeroImage = formateHeroImage(singleAnchor?.showhostImg).images
  const ogImage =
    formattedHeroImage.w800 ||
    formattedHeroImage.w1600 ||
    formattedHeroImage.w2400 ||
    formattedHeroImage.w3200 ||
    formattedHeroImage.original

  return {
    metadataBase: new URL(SITE_URL),
    title: `${singleAnchor?.name} - 鏡新聞`,
    description: description !== '' ? description : META_DESCRIPTION,
    alternates: {
      canonical: `${SITE_URL}/anchorperson/${params.slug}`,
    },
    openGraph: {
      title: `${singleAnchor?.name} - 鏡新聞`,
      description: description !== '' ? description : META_DESCRIPTION,
      siteName: SITE_TITLE,
      images: ogImage,
    },
  }
}

const getVideoListByListUrls = async (urls: string[]) => {
  const getListIdAndName = (inputString: string | null) => {
    if (!inputString) return null
    const idWithName = inputString.includes('playlist?list=')
      ? inputString.split('list=')[1]
      : inputString.split('https://youtu.be/')[1]
    const [url, sectionName = inputString?.split('：')[1]] =
      idWithName.split('：')
    return { url, sectionName }
  }
  const youtubeListIds = urls
    .filter((url): url is string => url !== null)
    .map((url) => getListIdAndName(url))
    .filter((item): item is YoutubeListInfoFormatted => item?.url !== null)

  const listResponse = await Promise.allSettled(
    youtubeListIds.map((item) =>
      fetchYoutubeList({
        list: { id: item.url, nextPageToken: '' },
        take: 3,
      })
    )
  )
  const playListRendered: FormatPlayListItems[] = []

  listResponse.forEach((res, i) => {
    handleResponse(
      res,
      (res: Awaited<ReturnType<typeof fetchYoutubeList>> | undefined) => {
        if (!res) return
        playListRendered.push({
          ...formateYoutubeListRes(res, youtubeListIds[i].url),
          name: youtubeListIds[i].sectionName,
        })
      },
      'Error occurs while fetching youtube list in show page'
    )
  })
  const renderedList: {
    value: YoutubeResponse
    name: YoutubeListInfoFormatted
  }[] = []
  listResponse.forEach((res, i) => {
    if (res.status === 'fulfilled' && res.value?.items?.length) {
      renderedList.push({
        value: res.value,
        name: youtubeListIds[i],
      })
    }
  })
  return renderedList
}

export default async function singleAnchor(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const client = getClient()
  let singleAnchor: SingleAnchor

  try {
    const response = await client.query<{ allContacts: SingleAnchor[] }>({
      query: fetchContactBySlug,
      variables: {
        slug: params.slug,
        shouldFetchRelatedShows: true,
      },
    })
    const data = response.data
    const foundAnchor = data?.allContacts[0]
    if (!foundAnchor) {
      const annotatingError = errors.helpers.wrap(
        new Error('Anchor not found'),
        'UnhandledError',
        'Error occurs while fetching data for single anchor page'
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
      throw annotatingError
    }
    singleAnchor = foundAnchor
  } catch (err) {
    console.error(err)
    notFound()
  }

  const socialMediaIcons = [
    {
      href: singleAnchor.facebook,
      src: '/icons/icon-fb.svg',
      alt: 'facebook icon',
      name: 'facebook',
    },
    {
      href: singleAnchor.twitter,
      src: '/icons/icon-x.svg',
      alt: 'x icon',
      name: 'twitter',
    },
    {
      href: singleAnchor.instagram,
      src: '/icons/icon-ig.svg',
      alt: 'instagram icon',
      name: 'instagram',
    },
  ]

  const bio = handleApiData(singleAnchor.bioApiData)

  const allShowsList: string[] = []

  singleAnchor.relatedShows?.forEach((show) => {
    allShowsList.push(
      ...([show.playList01, show.playList02].filter(Boolean) as string[])
    )
  })

  let renderedList = await getVideoListByListUrls(allShowsList)
  renderedList = renderedList?.sort((a, b) => {
    const dateA = new Date(a.value?.items?.[0]?.snippet?.publishedAt || 0)
    const dateB = new Date(b.value?.items?.[0]?.snippet?.publishedAt || 0)
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <>
      <GPTPlaceholderDesktop>
        <p>廣告</p>
        <GPTAd pageKey="all" adKey="PC_HD" />
      </GPTPlaceholderDesktop>
      <main className={styles.main}>
        <section className={styles.section}>
          <AnchorImg heroImage={singleAnchor.showhostImg} />
          <div className={styles.contentWrapper}>
            <div className={styles.titleIconWrapper}>
              <div className={styles.title}>{singleAnchor.name}</div>
              <div className={styles.socialIcons}>
                {socialMediaIcons.map(
                  (icon, index) =>
                    icon.href && (
                      <SocialIcon
                        key={index}
                        href={icon.href}
                        src={icon.src}
                        alt={icon.alt}
                        name={icon.name}
                      />
                    )
                )}
              </div>
            </div>
            <div className={styles.bio}>
              {bio.map((item) => (
                <div key={item.id}>{item.content && <p>{item.content}</p>}</div>
              ))}
            </div>
          </div>
        </section>
        <section>
          {renderedList.map((list, index) => (
            <AnchorShowList key={index} list={list} />
          ))}
        </section>
      </main>
    </>
  )
}

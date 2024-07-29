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
import { handleApiData } from '~/utils'
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
  let singleAnchor: SingleAnchor | null = null

  try {
    const response = await client.query({
      query: fetchContactBySlug,
      variables: {
        slug: params.slug,
      },
    })
    const data = response.data
    singleAnchor = data.allContacts[0]

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

  return {
    metadataBase: new URL(SITE_URL),
    title: `${singleAnchor?.name} - 鏡新聞`,
    description: description !== '' ? description : META_DESCRIPTION,
    openGraph: {
      title: `${singleAnchor?.name} - 鏡新聞`,
      description: description !== '' ? description : META_DESCRIPTION,
      siteName: SITE_TITLE,
      images:
        singleAnchor?.showhostImg?.urlMobileSized ??
        '/images/default-og-img.jpg',
    },
  }
}

export default async function singleAnchor({
  params,
}: {
  params: { slug: string }
}) {
  const client = getClient()
  let singleAnchor: SingleAnchor

  try {
    const response = await client.query({
      query: fetchContactBySlug,
      variables: {
        slug: params.slug,
      },
    })
    const data = response.data
    singleAnchor = data.allContacts[0]

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
      </main>
    </>
  )
}

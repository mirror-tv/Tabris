import errors from '@twreporter/errors'
import type { Metadata } from 'next'
import { getClient } from '~/apollo-client'
import UiContactCard from '~/components/anchorperson/ui-contact-card'
import {
  GLOBAL_CACHE_SETTING,
  SITE_URL,
} from '~/constants/environment-variables'
import type { Contact } from '~/graphql/query/contact'
import {
  fetchContactsByAnchorPerson,
  fetchContactsByHost,
} from '~/graphql/query/contact'
import styles from '~/styles/pages/anchorperson-page.module.scss'
import dynamic from 'next/dynamic'
import { GPTPlaceholderDesktop } from '~/components/ads/gpt/gpt-placeholder'
const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))

export const revalidate = GLOBAL_CACHE_SETTING

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '鏡主播 - 鏡新聞',
  openGraph: {
    title: '鏡主播 - 鏡新聞',
    images: {
      url: '/images/default-og-img.jpg',
    },
  },
}

export default async function Anchorperson() {
  const client = getClient()
  let anchorData: Contact[] = []
  let hostData: Contact[] = []

  try {
    const [anchorResponse, hostResponse] = await Promise.allSettled([
      client.query({ query: fetchContactsByAnchorPerson }),
      client.query({ query: fetchContactsByHost }),
    ])

    if (anchorResponse.status === 'fulfilled') {
      anchorData = anchorResponse.value.data.allContacts
    } else {
      const annotatingError = errors.helpers.wrap(
        anchorResponse.reason,
        'UnhandledError',
        'Error occurs while fetching anchorData'
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

    if (hostResponse.status === 'fulfilled') {
      hostData = hostResponse.value.data.allContacts
    } else {
      const annotatingError = errors.helpers.wrap(
        hostResponse.reason,
        'UnhandledError',
        'Error occurs while fetching hostData'
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
  }

  type SectionProps = {
    title: string
    data: Contact[]
  }

  const Section = ({ title, data }: SectionProps) => (
    <section className={styles.section}>
      <div className={styles.titleWrapper}>
        <span className={styles.title}>{title}</span>
        <span className={styles.line} />
      </div>
      <ol className={[styles.cardsList, 'anchor__list'].join(' ')}>
        {data.map((item) => (
          <UiContactCard item={item} key={item.name} />
        ))}
      </ol>
    </section>
  )

  return (
    <>
      <GPTPlaceholderDesktop>
        <p>廣告</p>
        <GPTAd pageKey="all" adKey="PC_HD" />
      </GPTPlaceholderDesktop>
      <main className={styles.main}>
        <Section title="鏡主播" data={anchorData} />
        <Section title="鏡主持" data={hostData} />
      </main>
    </>
  )
}

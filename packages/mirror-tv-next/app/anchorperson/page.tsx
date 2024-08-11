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
import { handleResponse } from '~/utils'
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

  const fetchAnchorPerson = () =>
    client.query({ query: fetchContactsByAnchorPerson })
  const fetchHost = () => client.query({ query: fetchContactsByHost })
  const responses = await Promise.allSettled([fetchAnchorPerson(), fetchHost()])

  anchorData = handleResponse(
    responses[0],
    (response: Awaited<ReturnType<typeof fetchAnchorPerson>> | undefined) => {
      return response?.data?.allContacts ?? []
    },
    'Error occurs while fetching anchorData'
  )

  hostData = handleResponse(
    responses[1],
    (response: Awaited<ReturnType<typeof fetchHost>> | undefined) => {
      return response?.data?.allContacts ?? []
    },
    'Error occurs while fetching hostData'
  )

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

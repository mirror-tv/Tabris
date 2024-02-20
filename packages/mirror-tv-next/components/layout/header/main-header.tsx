import errors from '@twreporter/errors'
import MobileNav from '~/components/layout/header/mobile-header/mobile-nav'
import type { Category } from '~/graphql/query/category'
import type { Show } from '~/graphql/query/shows'
import type { Sponsor } from '~/graphql/query/sponsors'

import {
  GLOBAL_CACHE_SETTING,
  HEADER_JSON_URL,
} from '~/constants/environment-variables'
import styles from '~/styles/components/layout/header/main-header.module.scss'
import HeaderBottom from './header-bottom'
import HeaderNav from './header-nav'
import HeaderTop from './header-top'

async function getData() {
  try {
    const res = await fetch(HEADER_JSON_URL, {
      next: { revalidate: GLOBAL_CACHE_SETTING },
    })

    if (!res.ok) {
      console.error('Failed to fetch header data')
      return { allSponsors: [], allCategories: [], allShows: [] }
    }

    return res.json()
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching header data'
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
    throw new Error('Error occurs while fetching header data.')
  }
}

export default async function MainHeader() {
  let sponsorsData: Sponsor[] = []
  let categoriesData: Category[] = []
  let showsData: Show[] = []

  const { allCategories, allSponsors, allShows } = await getData()

  categoriesData = allCategories
  sponsorsData = allSponsors
  showsData = allShows

  return (
    <header className={styles.header}>
      <div className={styles.pcHeaderWrapper}>
        <HeaderTop sponsors={sponsorsData} />
        <HeaderNav categories={categoriesData} shows={showsData} />
        <HeaderBottom />
      </div>
      <div className={styles.mobHeaderWrapper}>
        <MobileNav
          categories={categoriesData}
          shows={showsData}
          sponsors={sponsorsData}
        />
      </div>
    </header>
  )
}

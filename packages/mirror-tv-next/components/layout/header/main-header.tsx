import errors from '@twreporter/errors'
import MobileNav from '~/components/layout/header/mobile-header/mobile-nav'
import type { Category } from '~/graphql/query/category'
import type { Sponsor } from '~/graphql/query/sponsors'

import { HEADER_JSON_FILE_NAME } from '~/constants/environment-variables'
import { fetchStaticJson } from '~/utils/fetch-static-json'
import styles from './_styles/main-header.module.scss'
import HeaderBottom from './header-bottom'
import HeaderNav from './header-nav'
import HeaderTop from './header-top'
import type { HeaderData } from '~/types/header'

async function getData() {
  try {
    return await fetchStaticJson<HeaderData>(HEADER_JSON_FILE_NAME)
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
    return { allSponsors: [], allCategories: [], allShows: [] }
  }
}

export default async function MainHeader() {
  let sponsorsData: Sponsor[] = []
  let categoriesData: Category[] = []

  const { allCategories = [], allSponsors = [] } = await getData()

  categoriesData = allCategories
  sponsorsData = allSponsors

  return (
    <header className={styles.header}>
      <div className={styles.pcHeaderWrapper}>
        <HeaderTop sponsors={sponsorsData} />
        <HeaderNav categories={categoriesData} />
        <HeaderBottom />
      </div>
      <div className={styles.mobHeaderWrapper}>
        <div className={styles.placeholder} />
        <MobileNav categories={categoriesData} sponsors={sponsorsData} />
      </div>
    </header>
  )
}

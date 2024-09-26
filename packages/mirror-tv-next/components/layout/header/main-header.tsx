'use client'
import MobileNav from '~/components/layout/header/mobile-header/mobile-nav'
import {
  GLOBAL_CACHE_SETTING,
  HEADER_JSON_URL,
} from '~/constants/environment-variables'
import styles from './_styles/main-header.module.scss'
import HeaderBottom from './header-bottom'
import HeaderNav from './header-nav'
import HeaderTop from './header-top'

import { useAppContext } from '~/context/header-json-provider'

export default async function MainHeader() {
  const { data } = useAppContext()
  let sponsorsData: Sponsor[] = []
  let categoriesData: Category[] = []
  let showsData: Show[] = []

  const {
    allCategories = [],
    allSponsors = [],
    allShows = [],
  } = await getData()

  const {
    allSponsors: sponsorsData = [],
    allCategories: categoriesData = [],
    allShows: showsData = [],
  } = data

  return (
    <header className={styles.header}>
      <div className={styles.pcHeaderWrapper}>
        <HeaderTop sponsors={sponsorsData} />
        <HeaderNav categories={categoriesData} shows={showsData} />
        <HeaderBottom />
      </div>
      <div className={styles.mobHeaderWrapper}>
        <div className={styles.placeholder} />
        <MobileNav
          categories={categoriesData}
          shows={showsData}
          sponsors={sponsorsData}
        />
      </div>
    </header>
  )
}

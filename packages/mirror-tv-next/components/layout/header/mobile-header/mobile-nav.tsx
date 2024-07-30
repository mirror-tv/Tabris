import Image from 'next/image'
import Link from 'next/link'
import type { Category } from '~/graphql/query/category'
import type { Show } from '~/graphql/query/shows'
import type { Sponsor } from '~/graphql/query/sponsors'

import styles from './_styles/mobile-nav.module.scss'
import SideMenu from './side-menu'
import MobileSearchBar from './mobile-search-bar'

type MobileNavProps = {
  categories: Category[]
  shows: Show[]
  sponsors: Sponsor[]
}

export default function MobileNav({
  categories,
  shows,
  sponsors,
}: MobileNavProps) {
  return (
    <div className={styles.navWrapper}>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src="/icons/mnews-logo-white.svg"
            alt="mnews logo"
            width={162}
            height={30}
            priority
          />
        </Link>
      </div>
      <section className={styles.sideBtnWrapper}>
        <SideMenu categories={categories} shows={shows} sponsors={sponsors} />
        <MobileSearchBar />
      </section>
    </div>
  )
}

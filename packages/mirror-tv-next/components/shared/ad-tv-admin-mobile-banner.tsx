'use client'

import Image from 'next/image'
import Link from 'next/link'
import { TV_AD_ADMIN_OEN_URL } from '~/constants/constant'

import styles from './_styles/ad-tv-admin-mobile-banner.module.scss'

export default function AdTvAdminMobileBanner() {
  return (
    <div className={styles.banner}>
      <Link
        href={TV_AD_ADMIN_OEN_URL}
        target="_blank"
        rel="noreferrer noopener"
      >
        <Image
          src="/images/tv-ad-admin-banner.gif"
          alt="Mnews TV Ad Admin Banner"
          width={1266}
          height={712}
        />
      </Link>
    </div>
  )
}

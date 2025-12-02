'use client'

import Image from 'next/image'
import Link from 'next/link'
import { TV_AD_ADMIN_OEN_URL } from '~/constants/constant'
import { SHOW_TV_AD_ADMIN_BANNER } from '~/constants/environment-variables'

import styles from './_styles/ad-tv-admin-mobile-banner.module.scss'

export default function AdTvAdminMobileBanner({
  location = 'article',
}: {
  location?: 'article' | 'home'
}) {
  if (!SHOW_TV_AD_ADMIN_BANNER) {
    return null
  }

  return (
    <div className={styles.banner}>
      <Link
        href={TV_AD_ADMIN_OEN_URL}
        target="_blank"
        className="GTM-banner-click-personal-ads"
        data-gtm={`mobile-${location}-personal-ads`}
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

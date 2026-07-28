'use client'

import Image from 'next/image'
import Link from '~/components/shared/link'
import { TV_AD_ADMIN_OEN_URL } from '~/constants/constant'
import { withBasePath } from '~/constants/with-base-path'

import styles from './_styles/ad-tv-admin-mobile-banner.module.scss'

export default function AdTvAdminMobileBanner({
  location = 'article',
}: {
  location?: 'article' | 'home'
}) {
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
          src={withBasePath('/images/tv-ad-admin-banner.gif')}
          alt="Mnews TV Ad Admin Banner"
          width={1266}
          height={712}
        />
      </Link>
    </div>
  )
}

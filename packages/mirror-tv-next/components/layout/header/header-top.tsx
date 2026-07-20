import Image from 'next/image'
import Link from 'next/link'
import styles from './_styles/header-top.module.scss'
import type { Sponsor } from '~/graphql/query/sponsors'
import { TV_AD_ADMIN_OEN_URL } from '~/constants/constant'
import { withBasePath } from '~/constants/with-base-path'
import { imageLoader } from '~/components/shared/next-responsive-image'

type HeaderTopProps = {
  sponsors: Sponsor[]
}

export default function HeaderTop({ sponsors }: HeaderTopProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.logoWrapper}>
        <div className={[styles.logo, 'top-wrapper__left'].join(' ')}>
          <Link href="/" className="logo">
            <Image
              src={withBasePath('/icons/mnews-logo.svg')}
              alt="mnews logo"
              priority
              width={192}
              height={36}
            />
          </Link>
        </div>
        <div className={styles.adBanner}>
          <Link
            href={TV_AD_ADMIN_OEN_URL}
            className="GTM-banner-click-personal-ads"
            data-gtm="header-personal-ads"
            target="_blank"
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
      </div>
      <div className={styles.sponsorsWrapper}>
        {sponsors.slice(0, 3).map((sponsor) => {
          return (
            <div key={sponsor.id}>
              <Link
                href={
                  sponsor.url ? sponsor.url : `/topic/${sponsor.topic?.slug}`
                }
                className={styles.sponsorItem}
              >
                <Image
                  width={100}
                  height={52}
                  src={sponsor.logo ?? '/images/image-default.jpg'}
                  alt="Sponsor Logo"
                  placeholder="blur"
                  blurDataURL="/images/loading.svg"
                  loader={imageLoader}
                  priority
                />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

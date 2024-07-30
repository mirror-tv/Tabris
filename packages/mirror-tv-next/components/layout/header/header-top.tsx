import Image from 'next/image'
import Link from 'next/link'
import styles from './_styles/header-top.module.scss'
import type { Sponsor } from '~/graphql/query/sponsors'
import { formateHeroImage } from '~/utils'
import ResponsiveImage from '~/components/shared/responsive-image'

type HeaderTopProps = {
  sponsors: Sponsor[]
}

export default function HeaderTop({ sponsors }: HeaderTopProps) {
  return (
    <div className={styles.wrapper}>
      <div className={[styles.logo, 'top-wrapper__left'].join(' ')}>
        <Link href="/" className="logo">
          <Image
            src="/icons/mnews-logo.svg"
            alt="mnews logo"
            priority
            width={192}
            height={36}
          />
        </Link>
      </div>
      <div className={styles.sponsorsWrapper}>
        {sponsors.slice(0, 3).map((sponsor) => {
          const formattedLogo = formateHeroImage(sponsor.logo ?? {})
          return (
            <div key={sponsor.id}>
              <Link
                href={
                  sponsor.url ? sponsor.url : `/topic/${sponsor.topic?.slug}`
                }
                className={styles.sponsorItem}
              >
                <ResponsiveImage
                  alt="Sponsor Logo"
                  images={formattedLogo}
                  rwd={{ default: '100px' }}
                  priority={true}
                />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

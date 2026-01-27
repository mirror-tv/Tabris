import styles from './_styles/ui-show-card.module.scss'
import ResponsiveImage from '~/components/shared/responsive-image'
import { formateHeroImage } from '~/utils'
import type { HeroImage } from '~/types/common'
import Link from 'next/link'

type UiShowCardProps = {
  slug: string
  bannerImg: HeroImage
  name: string
  id: string
}

export default function UiShowCard({
  slug,
  bannerImg,
  name,
  id,
}: UiShowCardProps) {
  return (
    <Link
      className={`${styles.image} show-card__img`}
      href={`/show/${slug}/`}
      target="_blank"
      rel="noopener noreferrer"
      id={id}
    >
      <ResponsiveImage
        images={formateHeroImage(bannerImg)}
        alt={name}
        rwd={{ mobile: '500px', tablet: '500px', desktop: '500px' }}
        priority={false}
        imgClassName="show-card__img"
        imgId={id}
      />
    </Link>
  )
}

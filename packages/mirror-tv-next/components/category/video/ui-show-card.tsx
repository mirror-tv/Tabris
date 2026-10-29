import styles from './_styles/ui-show-card.module.scss'
import Link from '~/components/shared/link'
import ResponsiveImage from '~/components/shared/responsive-image'

type UiShowCardProps = {
  slug: string
  bannerImage: string | null
  name: string
  id: string
}

export default function UiShowCard({
  slug,
  bannerImage,
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
        images={bannerImage}
        fill
        sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1199px) 336px, 360px"
        alt={name}
        style={{ aspectRatio: '32 / 12' }}
      />
    </Link>
  )
}

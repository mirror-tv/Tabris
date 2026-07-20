import styles from './_styles/ui-show-card.module.scss'
import Link from 'next/link'
import NextResponsiveImage from '~/components/shared/next-responsive-image'

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
      <NextResponsiveImage
        fill
        loading="lazy"
        placeholder="blur"
        blurDataURL="/images/loading.svg"
        src={
          typeof bannerImage === 'string'
            ? bannerImage?.replace(/\.(jpg|png)$/i, '.webP')
            : '/images/image-default.jpg'
        }
        sizes="(max-width: 768px) 50vw, 30vw"
        srcSet={[480, 800]}
        alt={name}
        priority={false}
        style={{ aspectRatio: '32 / 12' }}
        fallback={bannerImage}
      />
    </Link>
  )
}

'use client'
import ResponsiveImage from '~/components/shared/responsive-image'
import Link from '~/components/shared/link'
import type { Contact } from '~/graphql/query/contact'
import styles from './_styles/ui-contact-card.module.scss'
import { formateHeroImage } from '~/utils'
type Props = {
  item: Contact
}

export default function UiContactCard({ item }: Props) {
  const { images, imagesWebP } = formateHeroImage(item.anchorImg)
  return (
    <Link
      href={`/anchorperson/${item.slug}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <li className={styles.card}>
        <figure>
          <div className={styles.imageWrapper}>
            <ResponsiveImage
              images={images}
              imagesWebP={imagesWebP}
              alt={item.name}
              sizes="(max-width: 767px) 37vw, (max-width: 1199px) 208px, (max-width: 1399px) 256px, 270px"
            />
          </div>
          <figcaption>{item.name}</figcaption>
        </figure>
      </li>
    </Link>
  )
}

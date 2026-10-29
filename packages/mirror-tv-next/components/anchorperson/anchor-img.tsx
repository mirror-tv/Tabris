'use client'
import ResponsiveImage from '~/components/shared/responsive-image'
import styles from './_styles/anchor-img.module.scss'
import type { HeroImage } from '~/types/common'
import { formateHeroImage } from '~/utils'

type Props = {
  heroImage: HeroImage | null
}

export default function AnchorImg({ heroImage }: Props) {
  const { images, imagesWebP } = formateHeroImage(heroImage)
  return (
    <figure className={styles.imageWrapper}>
      <ResponsiveImage
        images={images}
        imagesWebP={imagesWebP}
        alt="主持人圖片"
        sizes="(max-width: 1199px) 288px, 480px"
      />
    </figure>
  )
}

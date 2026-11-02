'use client'
import ResponsiveImage from '~/components/shared/responsive-image'
import type { HeroImage } from '~/types/common'
import styles from './_styles/hero-image.module.scss'
import { formateHeroImage } from '~/utils'

type HeroImageProps = {
  heroImage: HeroImage
  title: string
}

export default function HeroImage({ heroImage, title }: HeroImageProps) {
  const { images, imagesWebP } = formateHeroImage(heroImage)

  return (
    <section className={styles.sectionWrapper}>
      <ResponsiveImage
        images={images}
        imagesWebP={imagesWebP}
        alt={title}
        priority
        sizes="100vw"
      />
    </section>
  )
}

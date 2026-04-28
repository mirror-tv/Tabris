'use client'
import Image from '@readr-media/react-image'
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
      <Image
        images={images}
        imagesWebP={imagesWebP}
        alt={title}
        defaultImage="/images/image-default.jpg"
        rwd={{
          mobile: '100vw',
          tablet: '100vw',
          laptop: '100vw',
          desktop: '100vw',
          default: '100vw',
        }}
        priority
      />
    </section>
  )
}

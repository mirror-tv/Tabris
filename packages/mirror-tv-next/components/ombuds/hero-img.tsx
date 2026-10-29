'use client'
import Image from '~/components/shared/image'
import ResponsiveImage from '~/components/shared/responsive-image'
import { useState } from 'react'
import styles from './_styles/hero-img.module.scss'

export default function HeroImg() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadComplete = () => {
    setIsLoading(false)
  }

  return (
    <section className={styles.imageWrapper}>
      {isLoading && (
        <Image
          src={'/images/loading.svg'}
          style={{ objectFit: 'contain' }}
          alt="loading-image"
          fill
        />
      )}
      {/* Falls back to the default image by itself when the banner fails. */}
      <ResponsiveImage
        images="/images/om-banner.jpg"
        priority
        style={{ objectFit: 'contain' }}
        alt="鏡新聞外部公評人莊豐嘉"
        onLoad={handleLoadComplete}
        onError={handleLoadComplete}
      />
    </section>
  )
}

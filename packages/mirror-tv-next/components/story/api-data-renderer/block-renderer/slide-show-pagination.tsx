'use client'
import { useSwiper } from 'swiper/react'
import styles from './_styles/slide-show-pagination.module.scss'
import { useEffect, useState } from 'react'

const SlideShowPagination = () => {
  const swiper = useSwiper()
  const [activeIndex, setActiveIndex] = useState(1) // Start from 1

  useEffect(() => {
    const handleSlideChange = () => {
      setActiveIndex(swiper.realIndex + 1)
    }
    // Subscribe to slideChange event
    swiper.on('activeIndexChange', handleSlideChange)

    // Cleanup event listener
    return () => {
      swiper.off('slideChange', handleSlideChange)
    }
  }, [swiper])

  if (!swiper) return null

  return (
    <div className={styles.paginationContainer}>
      <span className={styles.activeIndex}>{activeIndex}</span>/
      {swiper.slides.length}
    </div>
  )
}

export default SlideShowPagination

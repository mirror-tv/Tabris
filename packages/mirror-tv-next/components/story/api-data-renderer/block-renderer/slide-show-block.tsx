'use client'
// Import Swiper React components
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import styles from './_styles/slide-show-block.module.scss'
import useWindowDimensions from '~/hooks/use-window-dimensions'
import { ApiDataBlockType, type ApiDataBlockBase } from './type'
import Image from 'next/image'
import { useRef } from 'react'
import SlideShowPagination from './slide-show-pagination'

type SlideshowContentPart = {
  url: string
  width: number
  height: number
}
type ApiDataSlideshowContent = {
  url: string
  original: SlideshowContentPart
  desktop: SlideshowContentPart
  tablet: SlideshowContentPart
  mobile: SlideshowContentPart
  tiny: SlideshowContentPart
  id: string
  name: string
}
export interface ApiDataSlideshow extends ApiDataBlockBase {
  type: ApiDataBlockType.Slideshow
  content: ApiDataSlideshowContent[]
}

export default function SlideShowBlock({ data }: { data: ApiDataSlideshow }) {
  const { width } = useWindowDimensions()
  const swiperRef = useRef<SwiperRef>(null)
  if (!width) return null
  const decideDevice = (
    width?: number
  ): 'original' | 'desktop' | 'tablet' | 'mobile' | 'tiny' => {
    if (!width) return 'original'
    const devices = [
      { max: 768, device: 'mobile' as const },
      { max: 1024, device: 'tablet' as const },
      { max: 1280, device: 'desktop' as const },
    ]
    return devices.find((device) => width < device.max)?.device || 'original'
  }
  const slideImages: SlideshowContentPart[] = data.content.map(
    (item) => item[decideDevice(width)]
  )

  const swiperClass = styles.swiper
  const swiperSpaceBetween = 40
  const swiperSlidesPerView = 1
  const styleClassMapper = (classes: string[]) => {
    return classes.join(' ')
  }

  return (
    <div className={styles.swiperContainer}>
      <Swiper
        ref={swiperRef}
        className={swiperClass}
        spaceBetween={swiperSpaceBetween}
        slidesPerView={swiperSlidesPerView}
        navigation
        loop
      >
        {slideImages.map((img) => (
          <SwiperSlide key={img.url} className={styles.swiperSlide}>
            <div className={styles.slideShowImageContainer}>
              <Image
                className={styles.slideShowImage}
                src={img.url}
                alt="swiper slides"
                fill
                priority
              />
            </div>
          </SwiperSlide>
        ))}
        <SlideShowPagination />
      </Swiper>
      <button
        className={styleClassMapper([
          styles.swiperButton,
          styles.swiperButtonNext,
        ])}
        onClick={() => swiperRef.current?.swiper.slideNext()}
      />
      <button
        className={styleClassMapper([
          styles.swiperButton,
          styles.swiperButtonPrev,
        ])}
        onClick={() => swiperRef.current?.swiper.slidePrev()}
      />
    </div>
  )
}

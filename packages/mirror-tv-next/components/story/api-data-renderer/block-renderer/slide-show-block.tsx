'use client'
// Import Swiper React components
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import styles from './_styles/slide-show-block.module.scss'
import useWindowDimensions from '~/hooks/use-window-dimensions'
import { ApiDataBlockType, type ApiDataBlockBase } from './type'
import Image from 'next/image'
import { useRef } from 'react'
import { Navigation, Pagination } from 'swiper/modules'

type DeviceType = 'original' | 'desktop' | 'tablet' | 'mobile' | 'tiny'

type SlideshowContentPart = {
  url: string
  width: number
  height: number
}

type ApiDataSlideshowContent = {
  id: string
  name: string
  url: string
} & Record<DeviceType, SlideshowContentPart>

export interface ApiDataSlideshow extends ApiDataBlockBase {
  type: ApiDataBlockType.Slideshow
  content: ApiDataSlideshowContent[]
}

export default function SlideShowBlock({ data }: { data: ApiDataSlideshow }) {
  const { width } = useWindowDimensions()
  const swiperRef = useRef<SwiperRef>(null)
  if (!width) return null
  const decideDevice = (width?: number): DeviceType => {
    if (!width) return 'original'
    const devices = [
      { max: 768, device: 'mobile' },
      { max: 1024, device: 'tablet' },
      { max: 1280, device: 'desktop' },
    ] as const
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
        pagination={{
          clickable: true,
          type: 'fraction',
        }}
        loop
        modules={[Navigation, Pagination]}
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
      </Swiper>
    </div>
  )
}

'use client'
// Import Swiper React components
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import styles from './_styles/slide-show-block.module.scss'
import useWindowDimensions from '~/hooks/use-window-dimensions'
import { type ApiDataBlockType, type ApiDataBlockBase } from './type'
import Image from 'next/image'
import { useRef } from 'react'
import { Navigation, Pagination } from 'swiper/modules'
import { type PaginationOptions } from 'swiper/types'

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
  title: string
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
  const slideData: { image: SlideshowContentPart; title: string }[] =
    data.content.map((item) => {
      return { image: item[decideDevice(width)], title: item.title }
    })

  const swiperClass = styles.swiper
  const swiperSpaceBetween = 40
  const swiperSlidesPerView = 1

  const pagination: PaginationOptions = {
    el: '.swiper-pagination',
    type: 'custom',
    renderCustom(swiper, current: number, total: number) {
      return `
        <span class="swiper-pagination-current">${current}</span>
        |
        <span class="swiper-pagination-total">${total}</span>
      `
    },
  }

  return (
    <div className={styles.swiperContainer}>
      <Swiper
        ref={swiperRef}
        className={swiperClass}
        spaceBetween={swiperSpaceBetween}
        slidesPerView={swiperSlidesPerView}
        pagination={pagination}
        loop
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: '.nextNav',
          prevEl: '.prevNav',
        }}
      >
        {slideData.map((item, index) => (
          <SwiperSlide key={item.image.url} className={styles.swiperSlide}>
            <div className={styles.slideShowImageContainer}>
              <Image
                className={styles.slideShowImage}
                src={item.image.url}
                alt="swiper slides"
                fill
                priority
              />
            </div>
            {/* <div className={styles.mobNavWrapper}>
              <span className={styles.mobNavPrev} />
              <div className={styles.pagination}>
                <span className={styles.currentPag}>{index + 1}</span> |{' '}
                {slideData.length}
              </div>
              <span className={styles.mobNavNext} />
            </div> */}
            <figcaption className={styles.imageDescription}>
              {item.title}
            </figcaption>
          </SwiperSlide>
        ))}
        <button className={`${styles.prevArrow} prevNav`}>
          <span className={styles.navPrev} />
        </button>
        <button className={`${styles.nextArrow} nextNav`}>
          <span className={styles.navNext} />
        </button>
        <div className={`swiper-pagination ${styles.pagination}`} />
      </Swiper>
    </div>
  )
}

'use client'
import Image from '@readr-media/react-image'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Multivideo } from '~/graphql/query/topic'
import styles from './_styles/hero-multivideo.module.scss'
import './_styles/swiper-custom-styles.scss'
import type { HeroImage } from '~/types/common'
import { formateHeroImage } from '~/utils'
import HeroVideo from './hero-video'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// import required modules
import {
  Autoplay,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
} from 'swiper/modules'

type HeroMultiVideoProps = {
  heroImage: HeroImage
  title: string
  multivideo: Multivideo[]
}

export default function HeroMultiVideo({
  heroImage,
  title,
  multivideo,
}: HeroMultiVideoProps) {
  const formattedHeroImage = formateHeroImage(heroImage)

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.imageContainer}>
        <div className={styles.swiperContainer}>
          <Swiper
            cssMode={true}
            slidesPerView={1}
            spaceBetween={30}
            navigation={true}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            mousewheel={true}
            keyboard={true}
            modules={[Autoplay, Navigation, Pagination, Mousewheel, Keyboard]}
            className={styles.swiper}
          >
            {multivideo.map((video, index) => {
              const videoUrl = video.youtubeUrl ? video.youtubeUrl : video.url
              return (
                <SwiperSlide key={index} className={styles.swiperSlide}>
                  <div className={styles.slideVideoContainer}>
                    <HeroVideo videoSrc={videoUrl} controls={true} />
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
        <Image
          images={formattedHeroImage}
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
      </div>
    </section>
  )
}

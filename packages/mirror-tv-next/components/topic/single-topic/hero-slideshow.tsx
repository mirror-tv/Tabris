'use client'
import ResponsiveImage from '~/components/shared/responsive-image'
import Link from '~/components/shared/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Slideshow } from '~/graphql/query/topic'
import styles from './_styles/hero-slideshow.module.scss'
import customSwiperStyles from './_styles/swiper-custom-styles.module.scss'
import type { HeroImage } from '~/types/common'
import { formateHeroImage } from '~/utils'

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

type HeroSlideshowProps = {
  heroImage: HeroImage
  title: string
  slideshow: Slideshow[]
}

export default function HeroSlideshow({
  heroImage,
  title,
  slideshow,
}: HeroSlideshowProps) {
  const { images, imagesWebP } = formateHeroImage(heroImage)

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.imageContainer}>
        <div className={styles.swiperContainer}>
          <Swiper
            cssMode={true}
            slidesPerView={1}
            spaceBetween={30}
            navigation={{ addIcons: false }}
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
            className={`${styles.swiper} ${customSwiperStyles.heroSwiper}`}
          >
            {slideshow.map((slide, index) => {
              const { images: slideImages, imagesWebP: slideImagesWebP } =
                formateHeroImage(slide.heroImage)

              return (
                <SwiperSlide key={index} className={styles.swiperSlide}>
                  <div className={styles.slideImageContainer}>
                    <Link
                      href={`/story/${slide.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ResponsiveImage
                        images={slideImages}
                        imagesWebP={slideImagesWebP}
                        alt={slide.name}
                        priority
                        sizes="100vw"
                      />
                      <div className={styles.articleTitle}>{slide.name}</div>
                    </Link>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
        <ResponsiveImage
          images={images}
          imagesWebP={imagesWebP}
          alt={title}
          priority
          sizes="100vw"
        />
      </div>
    </section>
  )
}

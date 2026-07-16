'use client'
import styles from './_styles/editor-choices-swiper.module.scss'
import { EditorChoices } from '~/graphql/query/editor-choices'
import { Swiper, SwiperSlide } from 'swiper/react'

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
import { useRef } from 'react'
import { PaginationOptions } from 'swiper/types'
import UiExclusiveMark from '../shared/ui-exclusive-mark'
import NextResponsiveImage from '../shared/next-responsive-image'

type EditorChoicesSwiperProps = {
  editorChoices: EditorChoices[]
}

export default function EditorChoicesSwiper({
  editorChoices = [],
}: EditorChoicesSwiperProps) {
  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  const prevButtonRef = useRef<HTMLButtonElement | null>(null)
  if (!editorChoices?.[0]) {
    return null
  }

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
    <section className={styles.container}>
      <div>
        <div className={`${styles.swiperContainer}`}>
          <Swiper
            cssMode={true}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={pagination}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            mousewheel={true}
            keyboard={true}
            modules={[Autoplay, Pagination, Navigation, Mousewheel, Keyboard]}
            className={`${styles.swiper} editor-choices-swiper`}
          >
            {editorChoices.map((item, index) => {
              const { choice } = item

              return (
                <SwiperSlide
                  key={choice.slug}
                  className={`${styles.swiperSlide}`}
                >
                  <a
                    className={`${styles.imageContainer} GTM-editor-choices-link`}
                    href={
                      choice.source === 'externalChoice'
                        ? `/external/${choice.slug}`
                        : `/story/${choice.slug}`
                    }
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {choice.exclusive && <UiExclusiveMark />}
                    {choice.heroImage && (
                      <NextResponsiveImage
                        fill
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="/images/loading.svg"
                        src={choice.heroImage.replace(/\.jpg$/i, '.webP')}
                        sizes="(max-width: 768px) 50vw, 30vw"
                        srcSet={[480, 800]}
                        alt={choice.name}
                        priority={false}
                        fallback={choice.heroImage}
                        style={{ aspectRatio: '3 / 2' }}
                        fetchPriority={index === 0 ? 'high' : 'low'}
                      />
                    )}
                    <div
                      className={`${styles.nameWrapper} GTM-editor-choices-link`}
                    >
                      <span className={styles.name}>{choice.name}</span>
                    </div>
                  </a>
                </SwiperSlide>
              )
            })}
          </Swiper>
          {editorChoices?.[1] && (
            <>
              <button
                className={`${styles.navWrapper} ${styles.prevButton} editor-choices-btn`}
                ref={prevButtonRef}
              >
                <div
                  className={`${styles.nav} ${styles.prev} swiper-button-prev`}
                />
              </button>
              <button
                className={`${styles.navWrapper} ${styles.nextButton} editor-choices-btn`}
                ref={nextButtonRef}
              >
                <div
                  className={`${styles.nav} ${styles.next} swiper-button-next`}
                />
              </button>
            </>
          )}
          <div className={`swiper-pagination ${styles.pagination}`} />
        </div>
      </div>
    </section>
  )
}

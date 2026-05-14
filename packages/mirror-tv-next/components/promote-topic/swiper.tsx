'use client'

import { useState } from 'react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { PromoteTopicData } from '~/types/promote-topic'
import CloseIcon from '~/public/icons/close.svg'
import PromoteTopicItem from './item'
import styles from './_styles/swiper.module.scss'
import 'swiper/css'
import 'swiper/css/pagination'

type PromoteTopicSwiperProps = {
  list: PromoteTopicData[]
}

export default function PromoteTopicSwiper({ list }: PromoteTopicSwiperProps) {
  const [shouldShow, setShouldShow] = useState(true)

  if (!shouldShow || !list.length) return null

  const hasMultipleItems = list.length > 1

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.closeButton}
        type="button"
        aria-label="關閉推薦專題"
        onClick={() => setShouldShow(false)}
      >
        <CloseIcon />
      </button>
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={hasMultipleItems ? { clickable: true } : false}
        slidesPerView={1}
        resistanceRatio={0}
        autoplay={
          hasMultipleItems
            ? {
                delay: 10000,
                disableOnInteraction: false,
              }
            : false
        }
        rewind={hasMultipleItems}
      >
        {list.map((topic) => (
          <SwiperSlide key={topic.id}>
            <PromoteTopicItem topic={topic} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

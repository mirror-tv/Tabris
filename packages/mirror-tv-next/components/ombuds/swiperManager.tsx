'use client'
import { useMemo, useRef, useState } from 'react'
import { fetchOmbudsPosts } from '../../app/_actions/ombud'
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { Post } from '~/graphql/query/ombuds'
import useWindowDimensions from '~/hooks/use-window-dimensions'
import styles from './_styles/swiperManager.module.scss'
import UiPostCard from './ui-post-card'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

type Props = {
  slug: string[]
  initialPostItems: Post[]
  countNumber: number
  pageSize: number
}

export default function SwiperManager({
  initialPostItems,
  slug,
  countNumber,
  pageSize,
}: Props) {
  const [page, setPage] = useState(2)
  const [postsList, setPostsList] = useState<Post[]>([...initialPostItems])

  // 根據視窗大小顯示不同數量的 slides
  const { width: viewportWidth = 0 } = useWindowDimensions()
  const slidesPerView = useMemo(() => {
    return viewportWidth >= 1200 ? 4 : 3
  }, [viewportWidth])

  // 總貼文數無法被一頁的篇數整除時，要加入空白貼文
  const placeholders = useMemo(() => {
    const ifNeedPlaceholders = countNumber % slidesPerView
    const placeholdersCount = ifNeedPlaceholders
      ? slidesPerView - ifNeedPlaceholders
      : 0
    return Array(placeholdersCount).fill('_')
  }, [slidesPerView, countNumber])

  const sliderRef = useRef<SwiperRef>(null)
  const nextButtonRef = useRef<HTMLDivElement>(null)
  const prevButtonRef = useRef<HTMLDivElement>(null)

  // handle load more
  const fetchMorePosts = async () => {
    const nextPageData = await fetchOmbudsPosts({
      slug,
      isWithCount: false,
      pageSize,
      page,
    })
    const nextPagePosts = nextPageData.allPosts

    if (!nextPagePosts) return
    setPage((page) => page + 1)
    setPostsList((prevPosts) => [...prevPosts, ...nextPagePosts])
  }

  return (
    <Swiper
      ref={sliderRef}
      cssMode={true}
      keyboard={true}
      loop={false}
      spaceBetween={20}
      speed={700}
      slidesPerView={slidesPerView}
      slidesPerGroup={slidesPerView}
      className={`${styles.swiper} article-list__wrapper`}
      modules={[Navigation]}
      onSlideChange={(swiper) => {
        if (swiper.activeIndex + slidesPerView * 2 >= swiper.slides.length)
          fetchMorePosts()
      }}
      navigation={{
        nextEl: nextButtonRef.current,
        prevEl: prevButtonRef.current,
      }}
    >
      {postsList.map((item, index) => (
        <SwiperSlide key={index}>
          <UiPostCard item={item} />
        </SwiperSlide>
      ))}
      {placeholders.map((_, index) => (
        <SwiperSlide key={`placeholder-${index}`}></SwiperSlide>
      ))}
      <div className={styles.prevArrow} ref={prevButtonRef}></div>
      <div className={styles.nextArrow} ref={nextButtonRef}></div>
    </Swiper>
  )
}

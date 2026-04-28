'use client'
import { useData } from '~/context/data-context'
import styles from './_styles/popular-posts-and-weather.module.scss'
import Link from 'next/link'
import UiHeadingBordered from '../shared/ui-heading-bordered'
import { formateHeroImage } from '~/utils'
import Image from '@readr-media/react-image'
import WeatherMain from './weather-main'

type PopularPostsListType = {
  title: string
}

export default function PopularPostsList({ title }: PopularPostsListType) {
  const { popularPosts } = useData()

  // if (!popularPosts.length) return null

  return (
    <section className={styles.container}>
      <div className={styles.titleWrapper}>
        <UiHeadingBordered title={title} className={styles.title} />
      </div>
      <WeatherMain />
      <ul className={styles.list}>
        {popularPosts?.slice(0, 10).map((post, index) => {
          const { images, imagesWebP } = formateHeroImage(post.heroImage ?? {})
          return (
            <div
              className={`${styles.item} popular-list__item item`}
              key={post.slug}
            >
              <Link
                href={`/story/${post.slug}`}
                target="_blank"
                rel="noreferrer noopener"
                className={styles.link}
              >
                <p className={styles.index}>{index + 1}.</p>
                <div className={styles.imageWrapper}>
                  {post.slug.includes('sot') ? (
                    <Image
                      loadingImage="/images/loading.svg"
                      defaultImage="/images/image-default.jpg"
                      images={images}
                      imagesWebP={imagesWebP}
                      alt={post.name}
                      rwd={{
                        tablet: '100px',
                        desktop: '1000px',
                      }}
                      priority={false}
                      objectFit="contain"
                    />
                  ) : (
                    <Image
                      loadingImage="/images/loading.svg"
                      defaultImage="/images/image-default.jpg"
                      images={images}
                      imagesWebP={imagesWebP}
                      alt={post.name}
                      rwd={{
                        tablet: '100px',
                        desktop: '1000px',
                      }}
                      priority={false}
                    />
                  )}
                </div>
                <p className={styles.name}>{post.name}</p>
              </Link>
              <div className="promotion aside__item"></div>
            </div>
          )
        })}
      </ul>
    </section>
  )
}

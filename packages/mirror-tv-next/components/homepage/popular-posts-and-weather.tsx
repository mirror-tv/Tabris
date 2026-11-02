'use client'
import { useData } from '~/context/data-context'
import styles from './_styles/popular-posts-and-weather.module.scss'
import Link from '~/components/shared/link'
import UiHeadingBordered from '../shared/ui-heading-bordered'
import WeatherMain from './weather-main'
import ResponsiveImage from '~/components/shared/responsive-image'

type PopularPostsListType = {
  title: string
}

export default function PopularPostsList({ title }: PopularPostsListType) {
  const { popularPosts } = useData()

  return (
    <section className={styles.container}>
      <div className={styles.titleWrapper}>
        <UiHeadingBordered title={title} className={styles.title} />
      </div>
      <WeatherMain />
      <ul className={styles.list}>
        {popularPosts?.slice(0, 10).map((post, index) => {
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
                  <ResponsiveImage
                    images={post.heroImage}
                    fill
                    sizes="96px"
                    alt={post.name}
                    style={{ aspectRatio: '96 / 64' }}
                  />
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

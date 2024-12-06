'use client'
import { useData } from '~/context/data-context'
import styles from './_styles/popular-posts-list.module.scss'
import Link from 'next/link'
import UiHeadingBordered from '../shared/ui-heading-bordered'
import { formateDateAtTaipei } from '~/utils'

type PopularPostsListType = {
  title: string
}

export default function PopularPostsList({ title }: PopularPostsListType) {
  const { popularPosts } = useData()

  if (!popularPosts) return null

  return (
    <section className={styles.container}>
      <div className={styles.titleWrapper}>
        <UiHeadingBordered title={title} className={styles.title} />
      </div>
      <ul className={styles.list}>
        {popularPosts?.slice(0, 10).map((post) => {
          const formattedDate = formateDateAtTaipei(
            new Date(post.publishTime),
            'YYYY/MM/DD HH:mm',
            ''
          )
          return (
            <div className={`${styles.item} popular-list`} key={post.slug}>
              <p className={styles.date}>{formattedDate}</p>
              <Link
                href={`/story/${post.slug}`}
                target="_blank"
                rel="noreferrer noopener"
                className={styles.name}
              >
                {post.name}
              </Link>
              <div className="promotion aside__item"></div>
            </div>
          )
        })}
      </ul>
    </section>
  )
}

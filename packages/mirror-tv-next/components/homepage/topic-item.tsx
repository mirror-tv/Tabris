'use client'
import { type FeatureTopic } from '~/graphql/query/topic'
// import styles from './_styles/topic-item.module.scss'
import Image from '@readr-media/react-image'
import { formateHeroImage } from '~/utils'
import Link from 'next/link'
import styles from './_styles/topic-item.module.scss'

type TopicListProps = {
  isFirst: boolean
  topic: FeatureTopic
}

export default function TopicItem({ topic, isFirst }: TopicListProps) {
  const postsList = topic.sortDir === 'asc' ? topic.postASC : topic.postDESC
  return (
    <li className={styles.item}>
      {isFirst && (
        <div className={styles.imgWrapper}>
          <Image
            images={formateHeroImage(topic.heroImage ?? {})}
            alt={topic.name}
            loadingImage="/images/loading.svg"
            defaultImage="/images/image-default.jpg"
            rwd={{
              tablet: '676px',
              laptop: '676px',
              desktop: '581px',
            }}
            key={topic.slug}
          />
        </div>
      )}
      <div className={`${styles.postsList} ${isFirst ? '' : styles.border}`}>
        <Link
          href={`/topic/${topic.slug}`}
          target="_blank"
          rel="noreferrer noopener"
          className={`${styles.title} `}
        >
          {topic.name}
        </Link>
        <ul>
          {postsList.map((post) => {
            return (
              <li key={post.slug} className={styles.postItem}>
                <Link
                  href={`/story/${post.slug}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={styles.post}
                >
                  {post.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </li>
  )
}

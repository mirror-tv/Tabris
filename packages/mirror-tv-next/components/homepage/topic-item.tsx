'use client'
import { type FeatureTopic } from '~/graphql/query/topic'
import Image from '@readr-media/react-image'
import { formateHeroImage } from '~/utils'
import Link from 'next/link'
import styles from './_styles/topic-item.module.scss'
import UiMoreTopicBtn from './ui-more-topic-btn'

type TopicListProps = {
  isFirst: boolean
  topic: FeatureTopic
}

export default function TopicItem({ topic, isFirst }: TopicListProps) {
  const postsList = topic.sortDir === 'asc' ? topic.postASC : topic.postDESC
  return (
    <li className={`${styles.item} ${isFirst ? styles.isFirst : ''}`}>
      {isFirst && (
        <Link
          href={`/topic/${topic.slug}`}
          target="_blank"
          rel="noreferrer noopener"
          className={styles.imgWrapper}
        >
          <div className="topic__list__item feature">
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
        </Link>
      )}
      <div
        className={`${styles.postsList} ${
          isFirst ? '' : styles.border
        } topic__list__item`}
      >
        <div>
          <Link
            href={`/topic/${topic.slug}`}
            target="_blank"
            rel="noreferrer noopener"
            className={`${styles.title} topic__list__item__header`}
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
                    <span className="title">{post.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        <div className={styles.btnGroup}>
          <UiMoreTopicBtn
            title="更多報導"
            link={`/topic/${topic.slug}`}
            className="topic__list__item__btn"
          />
          <UiMoreTopicBtn
            title="更多專題"
            link="/topic"
            className={`${styles.secondMoreBtn} ${
              isFirst ? styles.btnOfFirst : ''
            } topic__list__item__btn topic__list__item__btn__blue`}
          />
        </div>
      </div>
    </li>
  )
}

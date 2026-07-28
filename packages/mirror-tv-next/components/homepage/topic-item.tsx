'use client'
import { type FeatureTopic } from '~/graphql/query/topic'
import Link from '~/components/shared/link'
import styles from './_styles/topic-item.module.scss'
import UiMoreTopicBtn from './ui-more-topic-btn'
import NextResponsiveImage from '../shared/next-responsive-image'

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
          <div className={`${styles.imgWrapper} topic__list__item feature`}>
            <NextResponsiveImage
              fill
              loading="lazy"
              placeholder="blur"
              blurDataURL="/images/loading.svg"
              src={
                topic.heroImage?.replace(/\.(jpg|png)$/i, '.webP') ??
                '/images/image-default.jpg'
              }
              sizes="(max-width: 768px) 50vw, 30vw"
              srcSet={[480, 800]}
              alt={topic.name}
              priority={false}
              fallback={topic.heroImage}
              style={{ aspectRatio: '581 / 324' }}
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
                    className={`${styles.post} GTM-homage-topic-news`}
                  >
                    <span>{post.name}</span>
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
